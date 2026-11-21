@echo off
echo ========================================
echo   AlumniNet - DEMO MODE
echo   Khong can MongoDB
echo ========================================
echo.
echo Dang tat cac Node process cu...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul
echo.
echo Dang khoi dong server demo...
echo.
node server-demo.js
