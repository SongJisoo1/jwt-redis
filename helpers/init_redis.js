const redis = require("redis");

const redis_client = redis.createClient({
    url: `redis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}/0`,
    legacyMode: true,
});

redis_client.on("connect", () => {
    console.log("Client connected to redis");
});

redis_client.on("ready", () => {
    console.log("Client connected to redis and ready to use");
});

redis_client.on("error", (error) => {
    console.log(error.message);
});

redis_client.on("end", () => {
    console.log("Client disconnected from redis");
});

process.on("SIGINT", () => {
    redis_client.quit();
});

redis_client.connect().then();

module.exports = redis_client;
