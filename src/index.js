const express = require("express");
const { Worker } = require("bullmq");
//const path = require("path");
const {
  //generateQRCode,
  generateQRCodeBuffer,
  sendMessage,
  logout,
  getClientStatus,
} = require("./whatsapp");

const sendQueue = require("./queue.js");
/*
const {
  addJobToQueue,
  addEmailToQueue,
  addWaToQueue,
} = require("./bullmq/queue");
*/
const app = express();
const PORT = 3001;
//global.__basedir = __dirname;

app.use(express.json());
/*
const csvFilePath = path.join(__dirname, "./employment_indicators.csv");

app.post("/", async (req, res) => {
  const { userName } = req.body;
  const data = { jobName: "csvJob", userName, csvFilePath };
  const job = await addJobToQueue(data);

  return res.status(201).json({ jobId: job.id });
});
*/

app.get("/", (req, res) => {
  //run();
  res.json({ message: "Welcome to API MHY." });
});

app.get("/status", (req, res) => {
  //run();
  res.json({ message: "Status: " + getClientStatus() });
});

app.get("/login", async (req, res) => {
  try {
    /*
    const qrCode = await generateQRCode();
    res.status(200).json({ qrCode });
    */
    const qrCodeBuffer = await generateQRCodeBuffer();
    res.setHeader("Content-Type", "image/png");
    res.send(qrCodeBuffer);
  } catch (error) {
    res.status(500).json({ error: "Failed to generate QR code" });
  }
});

app.post("/send", async (req, res) => {
  const { number, message } = req.body;
  if (!number || !message) {
    return res.status(400).json({ error: "Number and message are required" });
  }
  //await sendQueue.add("sendMessage", { number, message });
  await sendQueue.add("sendMessage", { number, message });
  res.status(200).json({ message: "Message queued successfully" });
  /*
  const data = {
    jobName: "sendWa",
    content: req.body,
  };
  const job = await addWaToQueue(data);
  //console.log(job);
  //return res.status(201).json({ jobId: job.id });
  res
    .status(200)
    .json({ message: "Message queued successfully job.id = " + job.id });
    */
});

app.post("/logout", async (req, res) => {
  try {
    await logout();
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to log out" });
  }
});
/*
app.post("/email", async (req, res) => {
  // Create a transporter object using the default SMTP transport
  // Create a SMTP transporter
  //const { to, subject, html } = req.body;
  console.log(__dirname);
  const data = {
    jobName: "sendEmail",
    content: req.body,
  };
  const job = await addEmailToQueue(data);
  return res.status(201).json({ jobId: job.id });
});
*/
/*
Yth. Muhammad Hasannudin Yusa',
Terimakasih sudah melakukan rekam presensi.
Simpan informasi berikut
id transaksi : 201378ad-aec4-452c-b59e-466dbcfe9441
waktu presensi kedatangan : 25/04/2024 06:09:55
sebagai bukti rekam presensi Anda.
Jaga kesehatan! Selamat bekerja dan beraktivitas!
*/

/*
Yth. Muhammad Hasannudin Yusa',
Terimakasih sudah melakukan rekam presensi.
Simpan informasi berikut
id transaksi : 23e894f2-d1cd-41e0-852e-2c7337de936b
waktu presensi kepulangan: 24/04/2024 16:21:50
sebagai bukti rekam presensi Anda.
Semoga lelah kita menjadi ibadah ya! Terimakasih atas kontribusi dan kerja keras Anda hari ini!
*/

// Start the worker
new Worker("sendMessageQueue", async (job) => {
  const { number, message } = job.data;
  await sendMessage(number, message);
});

app.listen(PORT, async function onListen() {
  console.log(`Server is up and running on port ${PORT}`);
});
