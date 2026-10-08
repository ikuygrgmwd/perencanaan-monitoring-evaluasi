@echo off
cd /d "%~dp0"
if not exist node_modules call npm ci
if errorlevel 1 goto selesai
call npm run build
if errorlevel 1 goto selesai
start "" http://localhost:3000/login/
call npm run preview
:selesai
pause
