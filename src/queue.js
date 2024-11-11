const { Queue } = require("bullmq");

const CONNECTOR = {
  host: "redis",
  port: 6379,
  password: "red!sPassw0rd"
};

const sendQueue = new Queue("sendMessageQueue", {
  connection: CONNECTOR,
});

module.exports = sendQueue;
