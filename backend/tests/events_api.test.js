const request = require('supertest');
const express = require('express');
const Event = require('../models/Event');
const User = require('../models/User');
const EventMessage = require('../models/EventMessage');
const eventsRouter = require('../controllers/events')
const { authenticateToken } = require('../utils/middleware');


jest.mock('../models/Event');
jest.mock('../models/User');
jest.mock('../models/EventMessage');
jest.mock('../utils/middleware', () => ({
  authenticateToken: jest.fn((req, res, next) => {
    req.user = { id: 'userId', role: 'user' };
    next();
  }),
}));
jest.mock('../utils/message', () => ({
  sendSubMessage: jest.fn(),
  sendUnsubMessage: jest.fn(),
}));

const app = express();
app.use(express.json());
app.use('/api/events', eventsRouter);

describe('Events API', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    test('GET /api/events should return all events', async () => {
      const mockEvents = [
        { title: 'Event 1', type: 'Type A', startTime: new Date() },
        { title: 'Event 2', type: 'Type B', startTime: new Date() }
      ];
  
      Event.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockResolvedValue(mockEvents)
        })
      });

      const response = await request(app)
        .get('/api/events')
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toHaveProperty('title', 'Event 1');
      expect(response.body[1]).toHaveProperty('title', 'Event 2');
    });
  
    test('GET /api/events/user should return user events when user is found', async () => {
      const mockUser = {
        _id: 'userId',
        events: [{ title: 'User Event 1' }, { title: 'User Event 2' }]
      };
      User.findById.mockImplementation(() => ({
        populate: jest.fn().mockResolvedValue(mockUser)
      }));

      const response = await request(app)
        .get('/api/events/user')
  
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUser.events);
    });

    test('GET /api/events/user should return 404 if user is not found', async () => {
      User.findById.mockImplementation(() => ({
        populate: jest.fn().mockResolvedValue(null)
      }));

      const response = await request(app)
        .get('/api/events/user')
  
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'User not found' });
    });
  
    test('POST /api/events should create a new event', async () => {
      const mockEvent = {
        title: 'New Event',
        type: 'Type A',
        description: 'Test event',
        location: 'Test location',
        startTime: new Date(),
        endTime: new Date(),
        host: '111',
        maxParticipants: 10
      };   

      authenticateToken.mockImplementation((req, res, next) => {
        req.user = { role: 'admin' };
        next();
      });

      User.findOne.mockResolvedValue({ _id: '111' });
      Event.prototype.save.mockResolvedValue(mockEvent);

      Event.prototype.save = jest.fn().mockResolvedValue(mockEvent);
  
      const response = await request(app)
        .post('/api/events')
        .send(mockEvent)
        .expect(201);

      expect(response.body).toHaveProperty('title', mockEvent.title);
      expect(response.body).toHaveProperty('host', '111');
    });
  
    test('PUT /api/events/:id should update an event', async () => {
      const mockEvent = {
        title: 'New Event',
        type: 'Type A',
        description: 'Test event',
        location: 'Test location',
        startTime: new Date().toISOString(),
        endTime: new Date().toISOString(),
        host: '111',
        maxParticipants: 10
      };        
      Event.findByIdAndUpdate.mockResolvedValue(mockEvent);
      authenticateToken.mockImplementation((req, res, next) => {
        req.user = { role: 'admin' };
        next();
      });
  
      const response = await request(app)
        .put('/api/events/1')
        .send({
          title: 'Update Event',
          type: 'Type A',
          description: 'Test event',
          location: 'Test location',
          startTime: new Date().toISOString(),
          endTime: new Date().toISOString(),
          host: '111',
          maxParticipants: 10
        })
        .set('Authorization', 'Bearer token');
  
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockEvent);
    });
  
    test('DELETE /api/events/:id should delete an event', async () => {
      Event.findByIdAndDelete.mockResolvedValue(true);
      EventMessage.deleteMany.mockResolvedValue(true);
      authenticateToken.mockImplementation((req, res, next) => {
        req.user = { role: 'admin' };
        next();
      });
      const response = await request(app)
        .delete('/api/events/1')
  
      expect(response.status).toBe(204);
    });

    test('POST /api/events/subscribe/:id should subscribe user to event', async () => {
      const mockEvent = {
        _id: '1',
        title: 'Test Event',
        subscribers: [],
        maxParticipants: 10,
        save: jest.fn().mockResolvedValue(true)
      };
      const mockUser = {
        _id: 'userId',
        events: [],
        save: jest.fn().mockResolvedValue(true)
      };
  
      Event.findById.mockResolvedValue(mockEvent);
      User.findById.mockResolvedValue(mockUser);
      EventMessage.create.mockResolvedValue(true);
      authenticateToken.mockImplementation((req, res, next) => {
        req.user = { role: 'user', _id: 'userId' };
        next();
      });
      const response = await request(app)
        .post('/api/events/subscribe/1')
        .set('Authorization', 'Bearer token');
  
      expect(response.status).toBe(200);
      expect(response.body._id).toEqual(mockEvent._id);
      expect(mockEvent.subscribers).toContain(mockUser._id);
      expect(mockUser.events).toContain(mockEvent._id);
    });
  
    test('POST /api/events/subscribe/:id should return 404 if event not found', async () => {
      Event.findById.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/events/subscribe/1')

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Event not found' });
    });
  
    test('POST /api/events/subscribe/:id should return 400 if event is full', async () => {
      const mockEvent = {
        _id: '1',
        title: 'Test Event',
        subscribers: Array(10).fill('userId'),
        maxParticipants: 10
      };
  
      Event.findById.mockResolvedValue(mockEvent);

      const response = await request(app)
        .post('/api/events/subscribe/1')
  
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Event is full' });
    });

    test('POST /api/events/unsubscribe/:id should unsubscribe user from event', async () => {
      const mockEvent = {
        _id: '1',
        title: 'Test Event',
        subscribers: ['userId'],
        save: jest.fn().mockResolvedValue(true)
      };
      const mockUser = {
        _id: 'userId',
        events: ['1'],
        save: jest.fn().mockResolvedValue(true)
      };
  
      Event.findById.mockResolvedValue(mockEvent);
      User.findById.mockResolvedValue(mockUser);
      EventMessage.deleteOne.mockResolvedValue(true);
  
      const response = await request(app)
        .post('/api/events/unsubscribe/1')
  
      expect(response.status).toBe(200);
      expect(response.body._id).toEqual(mockEvent._id);
      expect(mockEvent.subscribers).not.toContain(mockUser._id);
      expect(mockUser.events).not.toContain(mockEvent._id);
    });
  
    test('POST /api/events/unsubscribe/:id should return 404 if event not found', async () => {
      Event.findById.mockResolvedValue(null);
  
      const response = await request(app)
        .post('/api/events/unsubscribe/1')
  
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Event not found' });
    });
  
  
  });