@echo off
title Retinova AI - FastAPI Backend Server
echo ========================================================
echo   Retinova AI - Neural Inference Engine (Port 8000)
echo   "See Beyond the Retina"
echo ========================================================
echo.

cd /d "%~dp0backend"
echo [1/2] Installing backend requirements (if needed)...
pip install -r ..\requirements.txt --quiet

echo [2/2] Starting FastAPI backend on http://127.0.0.1:8000 ...
python main.py
pause
