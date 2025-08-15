

panduan instalasi di windows
1. buka windows power sell run administrator
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
2. npm install pdf-to-printer express node-fetch puppeteer
3. npm install cors
4. npm install pm2-windows-startup -g
5. pm2-startup install
6. pm2 start server.js --name myapp
7. pm2 save
8. pm2 status
setelah selesai install restart dan cek di pm2  list apakah sudah jalan




versi lengkap
Tutotial Setting cetak E-tiket printer Farmasi 
1. Download Aplikasi Device Printer dari Link: https://d94r2itylgwnp.cloudfront.net/Drivers/11/11.5/PDC_11.5.exe
2. Buka Link: https://github.com/mozictt/autoPrint.git  
3. Jalankan sesuai intruksi pada file README.md
4. Colokkan atau sambungkan Printers yang akan digunakan
5. Masuk ke Control Panel ==> Devices And Printers
6. Cari nama printer yang sudah tersambung
7. Klik kanan pada printer digunakan kemudian klik Printer Properties ==> Ganti Nama File menjadi PDC Etiket Luar / PDC Etiket Dalam
8. Jika sudah, klik kanan kembali pada devices printer ==> Klik Printer Prefrences dan ganti nama kertas menjadi E-Tiket Luar / E-tiket Dalam
9. Sesuaikan ukuran kertas yang tersedia

Notes Tambahan : 
1. jika versi browser di bawah 139.0.7258.68 jalankan command "npx puppeteer browsers install chrome"