@echo off
title Retinova AI - Frontend Web App
echo ========================================================
echo   Retinova AI - 3D Animated Client (Port 5173)
echo   "See Beyond the Retina"
echo ========================================================
echo.

cd /d "%~dp0frontend"
if not exist "node_modules" (
    echo [1/2] Installing frontend dependencies...
    call npm install
)

echo [2/2] Launching Vite development server on http://localhost:5173 ...
call npm run dev
pause
