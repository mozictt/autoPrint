const express = require("express");
const cors = require("cors");
const printer = require("pdf-to-printer");
const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
// const { v4: uuidv4 } = require("uuid");

const app = express();

// Izinkan semua origin (untuk testing)
app.use(cors());

// Kalau mau lebih aman, tentukan origin yang diizinkan
// app.use(cors({
//     origin: "http://localhost:8081" // hanya izinkan dari domain ini
// }));
app.get("/", async (req, res) => {
    try {
        // Ambil daftar printer
        const printers = await printer.getPrinters();

        // Buat list HTML
        const printerList = printers.map(p => `<li>${p.name}</li>`).join("");

        res.send(`
            <h1>Welcome to API Cetak</h1>
            <p>Gunakan endpoint <code>/cetak</code> untuk mencetak label.</p>
            <p>Contoh: <code>/cetak?id=123&printerName=NamaPrinter&id_unit=1&jenis_obat=A</code></p>
            <h2>Printer yang terhubung:</h2>
            <ul>${printerList || "<li>Tidak ada printer terdeteksi</li>"}</ul>
        `);
    } catch (error) {
        res.send(`
            <h1>Welcome to API Cetak</h1>
            <p>Gagal mengambil daftar printer: ${error.message}</p>
        `);
    }
});

app.get("/cetak", async (req, res) => {
    const { id, printerName, id_unit, jenis_obat,ip } = req.query;

    if (!id || !printerName) {
        return res.status(400).json({
            success: false,
            message: "Parameter Tidak Ditemukan",
            message_detail: "Pastikan ID dan nama printer dikirim di query string."
        });
    }

    const uniqueName = `temp-${Date.now()}.pdf`;
    const filePath = path.join(__dirname, uniqueName);

    try {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.goto(
            `http://${ip}/ujicoba/public/cetak/etiket?id=${id}&jenis_obat=${jenis_obat}&id_unit=${id_unit}`,
            // `http://localhost:8081/cb/rskm/public/cetak/etiket?id=${id}&jenis_obat=${jenis_obat}&id_unit=${id_unit}`,
            { waitUntil: "networkidle0" }
        );

        await page.pdf({
            path: filePath,
            width: "5cm",
            height: "6cm",
            printBackground: true,
            margin: { top: 0, right: 0, bottom: 0, left: 0 }
        });
        await browser.close();

        await printer.print(filePath, { printer: printerName });

        fs.unlink(filePath, (err) => {
            if (err) console.error("Gagal hapus file:", err);
        });

        res.json({
            success: true,
            message: "Cetak Berhasil",
            message_detail: `Label berhasil dicetak ke printer "${printerName}".`
        });
    } catch (err) {
        console.error("Gagal mencetak:", err);
         if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

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








// panduan instalasi di windows
// 1. buka windows power sell run administrator
// Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
// 2. npm install pdf-to-printer express node-fetch puppeteer
// 3. npm install cors
// 4. npm install pm2-windows-startup -g
// 5. pm2-startup install
// 6. pm2 save
// 7. pm2 status
// setelah selesai install restart dan cek di pm2  list apakah sudah jalan