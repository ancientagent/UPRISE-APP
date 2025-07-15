Write-Host "Starting Uprise Web App..." -ForegroundColor Green

# Check if node_modules exists
if (!(Test-Path "Webapp_UI-Develop\node_modules")) {
    Write-Host "Installing dependencies for webapp..." -ForegroundColor Yellow
    Set-Location "Webapp_UI-Develop"
    npm install
    Set-Location ..
} else {
    Write-Host "Dependencies already installed." -ForegroundColor Gray
}

# Navigate to webapp directory and start
Write-Host "Launching webapp on http://localhost:4321" -ForegroundColor Cyan
Set-Location "Webapp_UI-Develop"

# Run config generation and start server
npm run config
npm start

# Return to root when done
Set-Location .. 