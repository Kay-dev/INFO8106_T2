const logger = require('./logger')
const jwt = require('jsonwebtoken');
const redisManager = require('../utils/redisUtils');

const requestLogger = (request, response, next) => {
    logger.info('Time:  ', new Date().toISOString())
    logger.info('Method:', request.method)
    logger.info('Path:  ', request.path)
    logger.info('Body:  ', request.body)
    logger.info('---')
    next()
}


const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
}

const authenticateToken = async (req, res, next) =>  {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const isTokenBlacklisted = await redisManager.isTokenBlacklisted(token)
    if (token == null || isTokenBlacklisted) return res.sendStatus(401);

    jwt.verify(token, process.env.SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      req.token = token;
      next();
    });
  };


const errorHandler = (error, request, response, next) => {
    logger.error(error.message)
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    } else if (error.name === 'MongoServerError' && error.message.includes('duplicate key error')) {
        return response.status(409).json({ error: 'The email is already registered' })
    } else if(error.name === 'JsonWebTokenError') { 
        return response.status(401).json({ error: 'Invalid token' })
    } else if (error.name === 'TokenExpiredError') {
        return response.status(401).json({ error: 'Token expired' })
    }
    next(error)
}

module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler,
    authenticateToken
}