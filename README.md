

panduan instalasi di windows
1. buka windows power sell run administrator
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
2. npm install pdf-to-printer express node-fetch puppeteer
3. npm install cors
4. npm install -g pm2
5. pm2 start server.js --name auto_print_morbis
6. pm2 startup
7. pm2 save
8. pm2 status
setelah selesai install restart dan cek di pm2  list apakah sudah jalan