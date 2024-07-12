const eventsRouter = require('express').Router();
const Event = require('../models/Event')
const User = require('../models/User')
const EventMessage = require('../models/EventMessage')
const {checkSchema} = require('express-validator')
const jwt = require('jsonwebtoken');
const {authenticateToken} = require('../utils/middleware')
const {sendSubMessage, sendUnsubMessage} = require('../utils/message')


const checkRole = (role) => {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
  
      if (req.user.role !== role) {
        return res.status(403).json({ message: "Forbidden" });
      }
  
      next();
    };
  };

// get all events
eventsRouter.get('/', async (req, res) => {
    const events = await Event.find({}).populate('host', { username: 1, email: 1, phone: 1, description: 1 }).sort({'_id': -1})
    let limit = req.query.limit
    
    if (limit){
        res.json(events.slice(0, limit))
    } else{
        res.json(events)

    }
})

// get events by user
eventsRouter.get('/user', authenticateToken, async (req, res) => {
    // get user info
    const user = await User.findById(req.user.id).populate('events')
    if (!user) {
        return res.status(404).json({ error: 'User not found' })
    }
    res.json(user.events)
})

// get event by event_id
eventsRouter.get('/:id', async (req, res) => {
    const event = await Event.findById(req.params.id).populate('host', { username: 1, email: 1, phone: 1, description: 1 })
    if (event) {
        res.json(event)
    } else {
        res.status(404).end()
    }
})


// add new event
eventsRouter.post('/', authenticateToken, checkRole('admin'), async (req, res) => {
    const {host} = req.body
    const user = await User.findOne({_id: host})
    if (!user) {
        return res.status(404).send({error: 'host not found'})
    }
    const event = new Event({
        title: req.body.title,
        type: req.body.type,
        description: req.body.description,
        location: req.body.location,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        host: user._id,
        maxParticipants: req.body.maxParticipants,
       
    })
    const savedEvent = await event.save()
    res.status(201).json(savedEvent)
})

// update event
eventsRouter.put('/:id',authenticateToken, checkRole('admin'), async (req, res) => {
    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (updatedEvent) {
        res.json(updatedEvent)
    } else {
        res.status(404).end()
    }
})

// delete event
eventsRouter.delete('/:id',authenticateToken, checkRole('admin'), async (req, res) => {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id)
    await EventMessage.deleteMany({event: req.params.id})
    if (deletedEvent) {
        res.status(204).end()
    } else {
        res.status(404).end()
    }
})

// subscribe event
eventsRouter.post('/subscribe/:id',authenticateToken, checkRole('user'), async (req, res) => {
    const event = await Event.findById(req.params.id)
    if (!event) {
        return res.status(404).json({ error: 'Event not found' })
    }
    if (event.subscribers.length == event.maxParticipants){
        return res.status(400).json({ error: 'Event is full' })
    }
    // get user info
    const user = await User.findById(req.user.id)
    // update event subscribers
    event.subscribers.push(user._id)
    await event.save()
    // update user events
    user.events.push(event._id)
    await user.save()
    await EventMessage.create({event: event._id, user: user._id})
    // send message to user
    await sendSubMessage(user._id, event.title)
    res.status(200).json(event)
}
)

// unsubscribe event
eventsRouter.post('/unsubscribe/:id',authenticateToken, checkRole('user'), async (req, res) => {
    const event = await Event.findById(req.params.id)
    if (!event) {
        return res.status(404).json({ error: 'Event not found' })
    }
    const user = await User.findById(req.user.id)
    event.subscribers.splice(event.subscribers.indexOf(user._id), 1)
    await event.save()
    user.events.splice(user.events.indexOf(event._id), 1)
    await user.save()
    await EventMessage.deleteOne({event: event._id, user: user._id})
    // send message to user
    await sendUnsubMessage(user._id, event.title)
    res.status(200).json(event)
}
)

module.exports = eventsRouter