const express = require("express");
const printer = require("pdf-to-printer");
const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
// const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(express.json());

app.post("/cetak", async (req, res) => {
    const { id, printerName, id_unit, jenis_obat,ip } = req.body;

    if (!id || !printerName) {
        return res.status(400).json({
            success: false,
            message: "Parameter Tidak Ditemukan",
            message_detail: "Pastikan ID dan nama printer dikirim di body request."
        });
    }

    const uniqueName = `temp-${Date.now()}.pdf`;
    const filePath = path.join(__dirname, uniqueName);

    try {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.goto(
            `http://${ip}/cb/rskm/public/cetak/etiket?id=${id}&jenis_obat=${jenis_obat}&id_unit=${id_unit}`,
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

        // fs.unlink(filePath, (err) => {
        //     if (err) console.error("Gagal hapus file:", err);
        // });

        res.json({
            success: true,
            message: "Cetak Berhasil",
            message_detail: `Label berhasil dicetak ke printer "${printerName}".`
        });
    } catch (err) {
        console.error("Gagal mencetak:", err);

        // if (fs.existsSync(filePath)) {
        //     fs.unlinkSync(filePath);
        // }

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
