const request = require('supertest');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authenticateToken } = require('../utils/middleware');
const redisManager = require('../utils/redisUtils');
const loginRouter = require('../controllers/login'); 

jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('../models/User');
jest.mock('../utils/middleware');
jest.mock('../utils/redisUtils');

const app = express();
app.use(express.json());
app.use('/api/login', loginRouter);

describe('POST /api/login', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should login successfully', async () => {
        const mockUser = {
            _id: 'userId',
            username: 'testuser',
            email: 'test@example.com',
            passwordHash: 'hashedpassword',
            role: 'user',
            permissions: ['my events'],
        };

        User.findOne.mockResolvedValue(mockUser);
        bcrypt.compare.mockResolvedValue(true);
        jwt.sign.mockReturnValue('mockToken');

        const response = await request(app)
            .post('/api/login')
            .send({ email: 'test@example.com', password: 'testpassword' });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            token: 'mockToken',
            userid: 'userId',
            role: 'user',
            permissions: ['my events'],
        });
    });

    test('should fail login with invalid credentials', async () => {
        User.findOne.mockResolvedValue(null);

        const response = await request(app)
            .post('/api/login')
            .send({ email: 'invalid@example.com', password: 'invalidpassword' });

        expect(response.status).toBe(401);
        expect(response.body).toEqual({ error: 'Invalid username or password' });
    });
});

describe('POST /api/login/logout', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should logout successfully', async () => {
        authenticateToken.mockImplementation((req, res, next) => {
            req.token = 'mockToken';
            next();
        });
        redisManager.invalidateToken.mockResolvedValue(true);

        const response = await request(app)
            .post('/api/login/logout')
            .set('Authorization', 'Bearer mockToken');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: 'Logout successful' });
        expect(redisManager.invalidateToken).toHaveBeenCalledWith('mockToken');
    });
});

