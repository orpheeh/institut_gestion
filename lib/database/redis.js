const redis = require('redis');
const redisHost = process.env.REDIS_HOST || '127.0.0.1';

class Redis {

    constructor() {
        this.client = redis.createClient({ host: redisHost });
    }

    async insert(key, value) {
        const promise = new Promise((resolve, reject) => {
            this.client.set(key, value, (err, reply) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(reply);
                }
            })
        });
        return await promise;
    }

    async get(key) {
        const promise = new Promise((resolve, reject) => {
            this.client.get(key, (err, reply) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(reply);
                }
            })
        });
        return await promise;
    }
}

module.exports = new Redis();
