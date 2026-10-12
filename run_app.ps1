Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "       Retinova AI - 'See Beyond the Retina'" -ForegroundColor Cyan
Write-Host "       Full-Stack 3D Clinical Platform Launcher" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

$CurrentDir = $PSScriptRoot
if (-not $CurrentDir) { $CurrentDir = Get-Location }

Write-Host "[1/3] Launching Python FastAPI Backend Server on Port 8000..." -ForegroundColor Yellow
Start-Process cmd -ArgumentList "/k", "cd /d `"$CurrentDir\backend`" && python main.py"

Write-Host "[2/3] Waiting 3 seconds for backend initialization..." -ForegroundColor Gray
Start-Sleep -Seconds 3

Write-Host "[3/3] Launching Vite React Frontend on Port 5173..." -ForegroundColor Yellow
Start-Process cmd -ArgumentList "/k", "cd /d `"$CurrentDir\frontend`" && npm run dev"

Start-Sleep -Seconds 2
Write-Host "Opening Retinova AI in your web browser..." -ForegroundColor Green
Start-Process "http://localhost:5173"

Write-Host ""
Write-Host "========================================================" -ForegroundColor Green
Write-Host " Retinova AI is running!" -ForegroundColor Green
Write-Host " - Frontend:    http://localhost:5173" -ForegroundColor White
Write-Host " - Backend API: http://127.0.0.1:8000/docs (Swagger UI)" -ForegroundColor White
Write-Host "========================================================" -ForegroundColor Green
Write-Host "Keep both terminal windows open while using the app."
