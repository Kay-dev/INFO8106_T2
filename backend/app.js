const config = require('./utils/config')
const express = require('express');
require('express-async-errors')
const cors = require('cors');
const eventsRouter = require('./controllers/events.js')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger');
const mongoose = require('mongoose');
var history = require('connect-history-api-fallback');

const app = express();
app.use(history());

const url = config.MONGODB_URI
mongoose.set('strictQuery', false);

logger.info("connecting to", url);

mongoose.connect(url)
    .then(() => {
        logger.info("connected to MongoDB");
    }).catch(error => {
        logger.error("error connecting to MongoDB:", error.message);
    })

app.use(cors());
app.use(express.json());

app.use(express.static("dist"))
// middlewares
app.use(middleware.requestLogger)

// routes mapping
app.use('/api/events', eventsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app