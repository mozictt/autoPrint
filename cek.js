const printer = require("pdf-to-printer");

(async () => {
  try {
    const printers = await printer.getPrinters();
    console.log("Daftar printer terdeteksi:");
    console.log(printers);
  } catch (err) {
    console.error("Gagal ambil daftar printer:", err);
  }
})();