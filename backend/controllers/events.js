const eventsRouter = require('express').Router();
const Event = require('../models/Event')
const User = require('../models/User')
const {checkSchema} = require('express-validator')
const jwt = require('jsonwebtoken');


const checkSchemas = checkSchema({
    // username: {
    //     in: ['body'],
    //     isString: true,
    //     notEmpty: true,
    //     errorMessage: 'username is required'
    // },
    // password: {
    //     in: ['body'],
    //     isString: true,
    //     notEmpty: true,
    //     errorMessage: 'password is required',
    //     isLength: {
    //         options: {min: 8},
    //         errorMessage: 'password must be at least 8 characters long'
    //     }
    // },
    // email: {
    //     in: ['body'],
    //     notEmpty: true,
    //     isEmail: true,
    //     errorMessage: 'invalid email address'
    // },
    // phone: {
    //     in: ['body'],
    //     isString: true,
    //     notEmpty: true,
    //     isMobilePhone: true,
    //     errorMessage: 'invalid phone number'
    // },
    // description: {
    //     in: ['body'],
    //     isString: true,
    // }
})

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
eventsRouter.get('/user', async (req, res) => {
    // decode token
    const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET)
    if (!decodedToken.id) {
        return res.status(401).json({ error: 'Token missing or invalid' })
    }
    // get user info
    const user = await User.findById(decodedToken.id).populate('events')
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
eventsRouter.post('/', checkSchemas, async (req, res) => {
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
eventsRouter.put('/:id', async (req, res) => {
    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (updatedEvent) {
        res.json(updatedEvent)
    } else {
        res.status(404).end()
    }
})

// delete event
eventsRouter.delete('/:id', async (req, res) => {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id)
    if (deletedEvent) {
        res.status(204).end()
    } else {
        res.status(404).end()
    }
})

// subscribe event
eventsRouter.post('/subscribe/:id', async (req, res) => {
    const event = await Event.findById(req.params.id)
    if (!event) {
        return res.status(404).json({ error: 'Event not found' })
    }
    if (event.subscribers.length == event.maxParticipants){
        return res.status(400).json({ error: 'Event is full' })
    }
    // decode token
    const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET)
    if (!decodedToken.id) {
        return res.status(401).json({ error: 'Token missing or invalid' })
    }
    // get user info
    const user = await User.findById(decodedToken.id)
    // update event subscribers
    event.subscribers.push(user._id)
    await event.save()
    // update user events
    user.events.push(event._id)
    await user.save()
    res.status(200).json(event)
}
)

// unsubscribe event
eventsRouter.post('/unsubscribe/:id', async (req, res) => {
    const event = await Event.findById(req.params.id)
    if (!event) {
        return res.status(404).json({ error: 'Event not found' })
    }
    const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET)
    if (!decodedToken.id) {
        return res.status(401).json({ error: 'Token missing or invalid' })
    }
    const user = await User.findById(decodedToken.id)
    event.subscribers.splice(event.subscribers.indexOf(user._id), 1)
    await event.save()
    user.events.splice(user.events.indexOf(event._id), 1)
    await user.save()
    res.status(200).json(event)
}
)

const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        return authorization.substring(7)
    }
    return null
}

module.exports = eventsRouter