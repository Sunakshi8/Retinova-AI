@echo off
title Retinova AI - FastAPI Backend Server
echo ========================================================
echo   Retinova AI - Neural Inference Engine (Port 8000)
echo   "See Beyond the Retina"
echo ========================================================
echo.

cd /d "%~dp0backend"

set PYTHON_EXEC=python
where py >nul 2>nul
if %ERRORLEVEL% equ 0 (
    py -3.12 -c "import sys; exit(0)" >nul 2>nul
    if %ERRORLEVEL% equ 0 (
        set PYTHON_EXEC=py -3.12
    )
)

echo [1/2] Checking backend requirements with %PYTHON_EXEC%...
%PYTHON_EXEC% -m pip install -r ..\requirements.txt --quiet

echo [2/2] Starting FastAPI backend on http://127.0.0.1:8000 ...
%PYTHON_EXEC% main.py
pause
