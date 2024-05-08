const client = require("../waClient");

var decodeHtmlEntity = function (str) {
  return str.replace(/&#(\d+);/g, function (match, dec) {
    return String.fromCharCode(dec);
  });
};

const waProcessor = async (job) => {
  await job.log(`Started processing wa with id ${job.id}`);
  // TODO: do your CPU intense logic here
  //console.log(job?.data);
  await sendWa(job?.data);

  await job.updateProgress(100);
  return "DONE";
};

module.exports = waProcessor;

const sendWa = async (data) => {
  //console.log(db);
  if (!client.info) {
    await client.initialize();
    console.log(data);
    client.sendMessage(
      data.to + "@c.us",
      data.message
      //"Silahkan kirim perintah berikut: \n!ping  -- tes respon dengan pong\nhalo -- tes reply dengan hola\ninfo/pegawai/[nip] -- melihat info pegawai\ninfo/presensi/[nip] -- melihat info presensi hari ini\n\nexample:\ninfo/pegawai/198605xxxxxxxxxxxx\ninfo/presensi/198605xxxxxxxxxxxx\n\nSilahkan kunjungi https://megov.big.go.id/wa-gateway"
    );
  } else {
    console.log(data);
    client.sendMessage(
      data.to + "@c.us",
      data.message
      //"Silahkan kirim perintah berikut: \n!ping  -- tes respon dengan pong\nhalo -- tes reply dengan hola\ninfo/pegawai/[nip] -- melihat info pegawai\ninfo/presensi/[nip] -- melihat info presensi hari ini\n\nexample:\ninfo/pegawai/198605xxxxxxxxxxxx\ninfo/presensi/198605xxxxxxxxxxxx\n\nSilahkan kunjungi https://megov.big.go.id/wa-gateway"
    );
  }
};
