const { Client, LocalAuth } = require("whatsapp-web.js");
const { default: axios } = require("axios");

const qrcode = require("qrcode-terminal");
//https://geoportal.big.go.id/api-dev/pegawai/nip-sdm/198605132009121001
const pegawai = "https://geoportal.big.go.id/api-dev/pegawai/nip-sdm/";
//https://egov.big.go.id/api-presensi-new/presensi/hari_ini/000000000720
const presensi = "https://sdm.big.go.id/api-presensi-new/presensi/hari_ini/";

//const client = new Client();
const client = new Client({
  authStrategy: new LocalAuth({ clientId: "client-megov" }),
  puppeteer: {
    // args: ['--proxy-server=proxy-server-that-requires-authentication.example.com'],
    //headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  },
  webVersionCache: {
    type: "remote",
    remotePath:
      "https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html",
  },
});

client.on("authenticated", (session) => {
  console.log("authenticated");
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

//client.on("message_create", (message) => {
client.on("message", async (message) => {
  console.log(message.from);
  console.log(message.body);
  if (message.body === "!ping") {
    // send back "pong" to the chat the message was sent in
    client.sendMessage(message.from, "pong");
  } else if (message.body === "halo") {
    // reply back "halo" directly to the message
    message.reply("hola");
  } else if (message.body.includes("info/pegawai/")) {
    const myArray = message.body.split("/");
    if (myArray.length == 3 && myArray[2] !== "") {
      axios(pegawai + myArray[2])
        .then(async (res) => {
          if (res.data.length > 0) {
            let konten = "[INFO PEGAWAI] :\n";
            let item = res.data[0];
            konten += "NIP: " + myArray[2] + " \n";
            konten +=
              "NAMA: " + decodeHtmlEntity(item.NAMA).toUpperCase() + " \n";
            konten += "EMAIL: " + item.EMAIL + " \n";
            konten += "STATUS: " + item.STATUSPEGAWAI + " \n";
            konten += "JABATAN: " + item.NamaJabatan.toUpperCase() + " \n";
            //console.log(konten);
            client.sendMessage(message.from, konten);
            /*
            const media = await MessageMedia.fromUrl(item.audio.primary, {
              unsafeMime: true,
            });
            client.sendMessage(message.from, media);
            */
          } else {
            client.sendMessage(message.from, "NIP salah atau tidak ditemukan");
          }
        })
        .catch(function (error) {
          console.log(error.toJSON());
          client.sendMessage(
            message.from,
            "terjadi error ketika query info pegawai"
          );
        });
    } else {
      message.reply("perintah tidak sesuai atau tidak ditemukan");
    }
  } else if (message.body.includes("info/presensi/")) {
    const myArray = message.body.split("/");
    if (myArray.length == 3 && myArray[2] !== "") {
      axios(pegawai + myArray[2])
        .then(async (peg) => {
          if (peg.data.length > 0) {
            let item = peg.data[0];
            console.log(item.PEGAWAIID);
            axios(presensi + item.PEGAWAIID)
              .then(async (res) => {
                if (res.data) {
                  let konten = "[INFO PRESENSI]:\n";
                  let data = res.data;
                  //2024-04-25T06:09:55
                  let arrayMulai = data.mulai.split("T");
                  let tanggal = arrayMulai[0];
                  let datang = arrayMulai[1];
                  let arraySelesai = data.selesai
                    ? data.selesai.split("T")
                    : [];
                  let pulang = arraySelesai.length > 0 ? arraySelesai[1] : "-";

                  konten += "NAMA: " + decodeHtmlEntity(item.NAMA) + " \n";
                  konten += "TANGGAL: " + tanggal + " \n";
                  konten += "DATANG: " + datang + " \n";
                  konten += "PULANG: " + pulang + " \n";
                  //console.log(konten);
                  client.sendMessage(message.from, konten);
                  /*
                const media = await MessageMedia.fromUrl(item.audio.primary, {
                  unsafeMime: true,
                });
                client.sendMessage(message.from, media);
                */
                } else {
                  client.sendMessage(
                    message.from,
                    "PID salah atau tidak ditemukan"
                  );
                }
              })
              .catch(function (error) {
                console.log(error.toJSON());
                client.sendMessage(
                  message.from,
                  "terjadi error ketika query info pegawai"
                );
              });
            /*
            const media = await MessageMedia.fromUrl(item.audio.primary, {
              unsafeMime: true,
            });
            client.sendMessage(message.from, media);
            */
          } else {
            client.sendMessage(message.from, "NIP salah atau tidak ditemukan");
          }
        })
        .catch(function (error) {
          console.log(error.toJSON());
          client.sendMessage(
            message.from,
            "terjadi error ketika query info pegawai"
          );
        });
    } else {
      message.reply("perintah tidak sesuai atau tidak ditemukan");
    }
  } else {
    client.sendMessage(
      message.from,
      "Silahkan kirim perintah berikut: \n!ping  -- tes respon dengan pong\nhalo -- tes reply dengan hola\ninfo/pegawai/[nip] -- melihat info pegawai\ninfo/presensi/[nip] -- melihat info presensi hari ini\n\nexample:\ninfo/pegawai/198605xxxxxxxxxxxx\ninfo/presensi/198605xxxxxxxxxxxx\n\nSilahkan kunjungi https://megov.big.go.id/wa-gateway"
    );
  }
});

module.exports = client;
