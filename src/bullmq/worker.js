const { Worker } = require("bullmq");
const path = require("path");

const configModule = require("./config");
let worker;
const directoryPath = __dirname;
//fs.readFile;
//const imagePath = path.join(directoryPath, nip + ".jpg");

//const processorPath = path.join(__dirname, "processor.js");
//const emailProcessorPath = path.join(__dirname, "emailProcessor.js");
const processorPath = new URL("file://" + path.join(__dirname, "processor.js"));
const emailProcessorPath = new URL(
  "file://" + path.join(__dirname, "emailProcessor.js")
);

const waProcessorPath = new URL(
  "file://" + path.join(__dirname, "waProcessor.js")
);

const setUpWorker = () => {
  worker = new Worker("JOBS", processorPath, {
    connection: configModule.CONNECTOR,
    autorun: true,
  });

  worker.on("active", (job) => {
    console.debug(`Processing job with id ${job.id}`);
  });

  worker.on("completed", (job, returnValue) => {
    console.debug(`Completed job with id ${job.id}`, returnValue);
  });

  worker.on("error", (failedReason) => {
    console.error(`Job encountered an error`, failedReason);
  });

  // Create workers for email and backup jobs
  const emailWorker = new Worker("emailQueue", emailProcessorPath, {
    connection: configModule.CONNECTOR,
    autorun: true,
  });

  emailWorker.on("active", (job) => {
    console.debug(`Processing email job with id ${job.id}`);
  });

  emailWorker.on("completed", (job, returnValue) => {
    console.debug(`Completed email job with id ${job.id}`, returnValue);
  });

  emailWorker.on("error", (failedReason) => {
    console.error(`Email job encountered an error`, failedReason);
  });

  //const backupWorker = new Worker('backupQueue', async job => {
  // console.log('Processing backup job:', job.data);
  // Your backup logic here
  //});

  // Create workers for wa jobs
  const waWorker = new Worker("waQueue", waProcessorPath, {
    connection: configModule.CONNECTOR,
    autorun: true,
  });

  waWorker.on("active", (job) => {
    console.debug(`Processing wa job with id ${job.id}`);
  });

  waWorker.on("completed", (job, returnValue) => {
    console.debug(`Completed wa job with id ${job.id}`, returnValue);
  });

  waWorker.on("error", (failedReason) => {
    console.error(`Wa job encountered an error`, failedReason);
  });
};

module.exports = setUpWorker;
