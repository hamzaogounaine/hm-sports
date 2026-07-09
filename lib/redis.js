import Redis from 'ioredis';

const globalForRedis = global ;

export const redis = globalForRedis.redis || new Redis(process.env.REDIS_URL , {maxRetriesPerRequest: null, // Stops the 20-retry crash
    enableReadyCheck: false,
    connectTimeout: 10000});

if (process.env.NODE_ENV !== 'production') globalForRedis.redis = redis;