const {createClient} = require('redis')
const config = require('../utils/config');
const jwt = require('jsonwebtoken');
const dayjs = require('dayjs');

class RedisManager {
    constructor() {
        this.client = createClient({
            password: config.REDIS_PASSWORD,
            socket: {
                host: config.REDIS_HOST,
                port: config.REDIS_PORT
            }
        });

        this.client.on('error', (err) => console.error('Redis Client Error', err));
        this.connect();
    }

    async connect() {
        if (!this.client.isOpen) {
            await this.client.connect();
            console.log('Connected to Redis');
        }
    }

    async invalidateToken(token) {
        try {
            const decoded = jwt.verify(token, process.env.SECRET);
            const expirationTime = dayjs.unix(decoded.exp);
            const currentTime = dayjs();
            const timeToExpire = expirationTime.diff(currentTime, 'second');
            if (timeToExpire > 0) {
                console.log('Invalidating token:', token, 'for', timeToExpire, 'seconds');
                await this.client.setEx(`blacklist:${token}`, timeToExpire, 'true');
            }
        } catch (error) {
            console.error('Error invalidating token:', error);
            throw error;
        }
    }

    async isTokenBlacklisted(token) {
        try {
            const result = await this.client.get(`blacklist:${token}`);
            return result === 'true';
        } catch (error) {
            console.error('Error checking blacklisted token:', error);
            throw error;
        }
    }
}

const redisManager = new RedisManager();

module.exports = redisManager;