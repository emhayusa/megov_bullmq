const { Queue } = require("bullmq");
const configModule = require("./config");
const setUpWorker = require("./worker");

const myQueue = new Queue("JOBS", {
  connection: configModule.CONNECTOR,
});

// Create queues for email and backup jobs
const emailQueue = new Queue("emailQueue", {
  connection: configModule.CONNECTOR,
});
//const backupQueue = new Queue("backupQueue");
const waQueue = new Queue("waQueue", {
  connection: configModule.CONNECTOR,
});

myQueue.setMaxListeners(myQueue.getMaxListeners() + 100);
emailQueue.setMaxListeners(emailQueue.getMaxListeners() + 100);
waQueue.setMaxListeners(waQueue.getMaxListeners() + 100);

setUpWorker();

const addJobToQueue = (data) => {
  return myQueue.add(data.jobName, data, configModule.DEFAULT_REMOVE_CONFIG);
};

const addEmailToQueue = (data) => {
  return emailQueue.add(
    data.jobName,
    data.content,
    configModule.DEFAULT_REMOVE_CONFIG
  );
};

const addWaToQueue = (data) => {
  //client.sendMessage(data.content.to + "@c.us", data.content.message);
  return waQueue.add(
    data.jobName,
    data.content,
    configModule.DEFAULT_REMOVE_CONFIG
  );
};

//async function addBackupJob() {
//  await backupQueue.add('performBackup', { data: 'backup job data' });
//}

module.exports = { addJobToQueue, addEmailToQueue, addWaToQueue };
