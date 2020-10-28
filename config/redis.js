const redis = require('redis');

// execFile('redis/64bit/redis-server.exe', (err, stdout) => {
//     if(err) throw err;
//     console.log(stdout);
// })

const redisClient = redis.createClient();

redisClient.on('connect', () => {
    console.log('Redis Client Connected!');
})

redisClient.on('error', (error) => {
    console.log('Redis Not Connected!', error);
})

module.exports = redisClient;
