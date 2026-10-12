@echo off
title Retinova AI - Master Launcher
echo ========================================================
echo        Retinova AI - "See Beyond the Retina"
echo        Full-Stack 3D Clinical Platform Launcher
echo ========================================================
echo.
echo [1/3] Launching Python FastAPI Backend Server...
start "Retinova AI - Backend (Port 8000)" cmd /k "%~dp0run_backend.bat"

echo [2/3] Waiting 3 seconds for backend initialization...
timeout /t 3 /nobreak >nul

echo [3/3] Launching Vite React Frontend & 3D Interactive Hub...
start "Retinova AI - Frontend (Port 5173)" cmd /k "%~dp0run_frontend.bat"

echo.
echo Opening Retinova AI in your default web browser...
timeout /t 2 /nobreak >nul
start http://localhost:5173

echo.
echo ========================================================
echo  Retinova AI is now running!
echo  - Frontend: http://localhost:5173
echo  - Backend API: http://127.0.0.1:8000/docs (Swagger UI)
echo ========================================================
echo Keep the backend and frontend terminal windows open.
pause
