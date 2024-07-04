const { Queue } = require("bullmq");

const CONNECTOR = {
  host: "localhost",
  port: 6379,
};

const sendQueue = new Queue("sendMessageQueue", {
  connection: CONNECTOR,
});

module.exports = sendQueue;
