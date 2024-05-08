//const fs = require("fs");
const nodemailer = require("nodemailer");
//const { promisify } = require("util");

//const sleep = promisify(setTimeout);

const sender = "presensi@big.go.id";
const pass = "s5c4dt";

const emailProcessor = async (job) => {
  await job.log(`Started processing email with id ${job.id}`);
  // TODO: do your CPU intense logic here
  console.log(job?.data);
  await sendMail(job?.data);

  await job.updateProgress(100);
  return "DONE";
};

module.exports = emailProcessor;

function removeHtmlTags(input) {
  return input.replace(/<[^>]+>/g, "");
}

const sendMail = async (data) => {
  //{to, subject, html } = data;
  const transporter = nodemailer.createTransport({
    host: "mail.big.go.id",
    port: 465, // or your Zimbra SMTP port
    secure: true, // use SSL if true, not recommended for non-secure connection
    auth: {
      user: sender, // your Zimbra email address
      pass: pass, // your Zimbra email password
    },
  });
  /*let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "your-email@gmail.com", // Replace with your email
      pass: "your-password", // Replace with your email password
    },
  });*/
  //10.10.170.94
  //465
  //s5c4dt
  //Email options
  let mailOptions = {
    from: sender, // Sender address
    to: data.to, // List of recipients
    subject: data.subject, // Subject line
    text: removeHtmlTags(data.html), // Plain text body
    html: data.html, // HTML body
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(`Error: ${error}`);
    }
    console.log(`Message Sent: ${info.response}`);
  });
};
