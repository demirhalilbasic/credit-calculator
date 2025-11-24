# PowerShell start script for Credit Calculator
# Run this with: .\start.ps1

Write-Host "Starting Credit Calculator..." -ForegroundColor Green

# Start backend
Write-Host "`nStarting FastAPI backend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", @"
    cd backend
    if (-not (Test-Path venv)) {
        python -m venv venv
    }
    .\venv\Scripts\Activate.ps1
    pip install -r requirements.txt
    python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
"@

# Wait for backend to start
Start-Sleep -Seconds 5

# Start frontend
Write-Host "`nStarting React frontend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", @"
    cd frontend
    npm install
    npm run dev
"@

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Application is starting..." -ForegroundColor Cyan
Write-Host "Backend will be on: http://localhost:8000" -ForegroundColor Green
Write-Host "Frontend will be on: http://localhost:3000" -ForegroundColor Green
Write-Host "API docs: http://localhost:8000/docs" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Cyan
