const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

const client = new Client({
  puppeteer: {
    //headless: true,
    args: ["--no-sandbox"],
  },
  authStrategy: new LocalAuth(),
  authTimeoutMs: 60000, // Optional: timeout for authentication in milliseconds
  qrTimeout: 30000, // Optional: timeout for QR code generation
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.on("authenticated", () => {
  console.log("Client is authenticated!");
});

client.on("auth_failure", (msg) => {
  console.error("Authentication failure", msg);
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
