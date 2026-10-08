@echo off
cd /d "%~dp0"
echo Ruang Perbatasan - demo lokal
echo Buka alamat Local yang muncul di bawah ini pada browser Anda.
echo Biarkan jendela ini terbuka selama menggunakan aplikasi.
node --import ./scripts/sites-env.mjs scripts/run-framework.mjs dev
pause
