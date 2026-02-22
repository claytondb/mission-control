@echo off
title Mission Control
cd /d "%~dp0"
echo Starting Mission Control...
echo.
echo Opening browser in 5 seconds...
start "" timeout /t 5 /nobreak >nul && start http://localhost:3000
npm run dev
pause
