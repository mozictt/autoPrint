

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