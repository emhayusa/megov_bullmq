const { Queue } = require("bullmq");

const CONNECTOR = {
  host: "172.16.238.1",
  port: 6379,
};

const sendQueue = new Queue("sendMessageQueue", {
  connection: CONNECTOR,
});

module.exports = sendQueue;
