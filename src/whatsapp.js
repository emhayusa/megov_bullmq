const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode");

const client = new Client({
  puppeteer: {
    //headless: true,
    args: ["--no-sandbox"],
  },
  authStrategy: new LocalAuth(),
  authTimeoutMs: 60000, // Optional: timeout for authentication in milliseconds
  qrTimeout: 30000, // Optional: timeout for QR code generation
});

let qrBuffer = null;
let qrCode = "";
let clientStatus = "INITIALIZING";

client.on("qr", (qr) => {
  //qrcode.toDataURL(qr, (err, url) => {
  //  qrCode = url;
  //});

  qrcode.toBuffer(qr, (err, buffer) => {
    if (err) {
      console.error("Failed to generate QR code:", err);
      return;
    }
    qrBuffer = buffer;
    clientStatus = "QR_RECEIVED";
  });
});

client.on("ready", () => {
  console.log("WhatsApp Web client is ready!");
  qrBuffer = null;
  clientStatus = "READY";
});

client.on("disconnected", (reason) => {
  console.log("WhatsApp Web client was logged out:", reason);
  clientStatus = "DISCONNECTED";
});

client.on("authenticated", () => {
  console.log("Client is authenticated!");
  clientStatus = "AUTHENTICATED";
});

client.on("auth_failure", (msg) => {
  console.error("Authentication failure", msg);
  clientStatus = "AUTHENTICATION FAILURE";
});

client.on("message", (msg) => {
  console.log("MESSAGE RECEIVED", msg);
  if (msg.body === "!ping") {
    msg.reply("pong");
  }
});

client
  .initialize()
  .then(() => {
    console.log("Client initialized successfully");
  })
  .catch((err) => {
    console.error("Error initializing client", err);
  });

const generateQRCode = async () => {
  while (!qrCode) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  return qrCode;
};

const generateQRCodeBuffer = async () => {
  while (!qrBuffer) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  return qrBuffer;
};

const sendMessage = async (number, message) => {
  const chatId = `${number}@c.us`;
  await client.sendMessage(chatId, message);
};

const logout = async () => {
  await client.logout();
  //qrCode = ""; // Reset QR code
  qrBuffer = null;
  clientStatus = "LOGOUT";
};

const getClientStatus = () => {
  return clientStatus;
};

module.exports = {
  generateQRCode,
  generateQRCodeBuffer,
  sendMessage,
  logout,
  getClientStatus,
};
