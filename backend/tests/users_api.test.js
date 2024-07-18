const request = require('supertest');
const express = require('express');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const usersRouter = require('../controllers/users'); 

jest.mock('bcrypt');
jest.mock('../models/User');
jest.mock('express-validator', () => ({
  ...jest.requireActual('express-validator'),
  validationResult: jest.fn()
}));

const app = express();
app.use(express.json());
app.use('/api/users', usersRouter);

describe('POST /api/users', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    test('should create a new user', async () => {
      const mockUser = {
        _id: 'userId',
        username: 'testuser',
        email: 'test@example.com',
        phone: '1234567890',
        description: 'Test description',
        role: 'user',
        permissions: ['my events']
      };
      
      validationResult.mockReturnValue({ isEmpty: () => true });
      bcrypt.hash.mockResolvedValue('hashedpassword');
      User.prototype.save.mockResolvedValue(mockUser);
  
      const response = await request(app)
        .post('/api/users')
        .send({
          username: 'testuser',
          password: 'testpassword',
          email: 'test@example.com',
          phone: '1234567890',
          description: 'Test description',
          role: 'user'
        });
  
      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockUser);
      expect(bcrypt.hash).toHaveBeenCalledWith('testpassword', 10);
      expect(User.prototype.save).toHaveBeenCalled();
    });
  
    test('should return validation errors', async () => {
      const errors = {
        isEmpty: () => false,
        array: () => [{ msg: 'username is required' }]
      };
  
      validationResult.mockReturnValue(errors);
  
      const response = await request(app)
        .post('/api/users')
        .send({
          password: 'testpassword',
          email: 'test@example.com',
          phone: '1234567890',
          description: 'Test description',
          role: 'user'
        });
  
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ errors: [{ msg: 'username is required' }] });
    });
  });
  
  describe('GET /api/users/hosts', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    test('should get users with role host', async () => {
      const mockUsers = [
        {
          _id: 'host1',
          username: 'hostuser1',
          email: 'host1@example.com',
          phone: '1234567890',
          description: 'Host user 1',
          role: 'host'
        },
        {
          _id: 'host2',
          username: 'hostuser2',
          email: 'host2@example.com',
          phone: '0987654321',
          description: 'Host user 2',
          role: 'host'
        }
      ];
  
      User.find.mockResolvedValue(mockUsers);
  
      const response = await request(app)
        .get('/api/users/hosts');
  
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUsers);
    });
  });
  