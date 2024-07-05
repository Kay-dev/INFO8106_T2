require('dotenv').config();


const PORT = process.env.PORT
const MONGODB_URI = process.env.NODE_ENV === 'test'
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI

const REDIS_HOST = process.env.REDIS_HOST
const REDIS_PORT = process.env.REDIS_PORT
const REDIS_PASSWORD = process.env.REDIS_PASSWORD



module.exports = {
    PORT, MONGODB_URI, REDIS_HOST, REDIS_PORT, REDIS_PASSWORD
}
