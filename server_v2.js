const express = require("express");
const cors = require("cors");
const printer = require("pdf-to-printer");
const puppeteer = require("puppeteer");

const app = express();
app.use(cors());

let browser; // browser global agar tidak dibuka-tutup setiap cetak

(async () => {
    browser = await puppeteer.launch({ headless: true });
    console.log("Browser Puppeteer siap digunakan...");
})();

app.get("/", async (req, res) => {
    const printers = await printer.getPrinters();
    const printerList = printers.map(p => `<li>${p.name}</li>`).join("");
    res.send(`
        <h1>Welcome to API Cetak</h1>
        <p>Endpoint cetak: /cetak?id=123&printerName=NamaPrinter&id_unit=1&jenis_obat=A&ip=192.168.1.10</p>
        <h2>Printer terhubung:</h2>
        <ul>${printerList || "<li>Tidak ada printer terdeteksi</li>"}</ul>
    `);
});

app.get("/cetak", async (req, res) => {
    const { id, printerName, id_unit, jenis_obat, ip } = req.query;

    if (!id || !printerName || !ip) {
        return res.status(400).json({
            success: false,
            message: "Parameter tidak lengkap",
            message_detail: "Pastikan ID, printerName, dan ip dikirim di query string."
        });
    }

    try {
        const page = await browser.newPage();
        await page.goto(
            `http://${ip}/ujicoba/public/cetak/etiket?id=${id}&jenis_obat=${jenis_obat}&id_unit=${id_unit}`,
            { waitUntil: "networkidle0" }
        );

        // Buat PDF di memory (buffer) tanpa simpan ke disk
        const pdfBuffer = await page.pdf({
            width: "5cm",
            height: "6cm",
            printBackground: true,
            margin: { top: 0, right: 0, bottom: 0, left: 0 }
        });

        await page.close();

        // Kirim buffer ke printer
        await printer.print(Buffer.from(pdfBuffer), { printer: printerName });

        res.json({
            success: true,
            message: "Cetak Berhasil",
            message_detail: `Label berhasil dicetak ke printer "${printerName}".`
        });
    } catch (err) {
        console.error("Gagal mencetak:", err);
        res.status(500).json({
            success: false,
            message: "Cetak Gagal",
            message_detail: err.message || "Terjadi kesalahan saat proses pencetakan."
        });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`API Cetak berjalan di http://localhost:${PORT}`);
});
