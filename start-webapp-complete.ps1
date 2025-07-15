Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "   Uprise Webapp Complete Startup Script" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""

# Function to check if port is in use
function Test-Port {
    param($Port)
    $connection = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
    return $connection -ne $null
}

# 1. Check if .env file exists
if (!(Test-Path ".env")) {
    Write-Host "ERROR: .env file not found in root directory!" -ForegroundColor Red
    Write-Host "The .env file must contain all 85 environment variables." -ForegroundColor Yellow
    Write-Host "Please ensure the .env file exists with all required variables." -ForegroundColor Yellow
    Write-Host "See PROJECT-STRUCTURE.md for the complete list." -ForegroundColor Yellow
    exit 1
}

# Count lines in .env file
$envLineCount = (Get-Content .env).Count
Write-Host "Found .env file with $envLineCount lines" -ForegroundColor Green
if ($envLineCount -lt 85) {
    Write-Host "WARNING: .env file has less than 85 lines. Some features may not work!" -ForegroundColor Yellow
}

# 2. Stop existing services
Write-Host ""
Write-Host "Checking for existing services..." -ForegroundColor Yellow

if (Test-Port 3000) {
    Write-Host "Backend is already running on port 3000. Stopping it..." -ForegroundColor Yellow
    .\stop-services.ps1
    Start-Sleep -Seconds 2
}

if (Test-Port 4321) {
    Write-Host "Webapp is already running on port 4321. Stopping it..." -ForegroundColor Yellow
    Get-Process -Name node -ErrorAction SilentlyContinue | Where-Object {
        $_.CommandLine -like "*ng serve*"
    } | Stop-Process -Force
    Start-Sleep -Seconds 2
}

# 3. Start Backend Server
Write-Host ""
Write-Host "Starting Backend Server..." -ForegroundColor Green
$backendProcess = Start-Process powershell -ArgumentList "-NoExit", "-Command", "& { cd Webapp_API-Develop; `$env:CLIENT_ID='437920819fa89d19abe380073d28839c'; `$env:CLIENT_SECRET='28649120bdf32812f433f428b15ab1a1'; `$env:PORT=3000; npm start }" -PassThru

# Wait for backend to start
Write-Host "Waiting for backend to start..." -ForegroundColor Gray
$maxAttempts = 30
$attempt = 0
while ($attempt -lt $maxAttempts) {
    if (Test-Port 3000) {
        Write-Host "Backend is running on http://localhost:3000" -ForegroundColor Green
        break
    }
    Start-Sleep -Seconds 1
    $attempt++
    if ($attempt % 5 -eq 0) {
        Write-Host "Still waiting for backend... ($attempt/$maxAttempts)" -ForegroundColor Gray
    }
}

if ($attempt -eq $maxAttempts) {
    Write-Host "Backend failed to start!" -ForegroundColor Red
    exit 1
}

# 4. Prepare webapp environment
Write-Host ""
Write-Host "Preparing webapp environment..." -ForegroundColor Green

# Create a temporary .env file for webapp with localhost URL
$webappEnvPath = "Webapp_UI-Develop\.env"
$envContent = Get-Content .env
$webappEnvContent = $envContent -replace 'BASE_URL=http://10\.0\.2\.2:3000', 'BASE_URL=http://localhost:3000'
$webappEnvContent | Out-File -FilePath $webappEnvPath -Encoding utf8

# 5. Install webapp dependencies if needed
if (!(Test-Path "Webapp_UI-Develop\node_modules")) {
    Write-Host "Installing webapp dependencies..." -ForegroundColor Yellow
    Set-Location "Webapp_UI-Develop"
    npm install
    Set-Location ..
} else {
    Write-Host "Webapp dependencies already installed." -ForegroundColor Gray
}

# 6. Start Webapp
Write-Host ""
Write-Host "Starting Webapp..." -ForegroundColor Green
$webappProcess = Start-Process powershell -ArgumentList "-NoExit", "-Command", "& { cd Webapp_UI-Develop; npm run config; npm start }" -PassThru

# Wait for webapp to start
Write-Host "Waiting for webapp to start..." -ForegroundColor Gray
$maxAttempts = 60
$attempt = 0
while ($attempt -lt $maxAttempts) {
    if (Test-Port 4321) {
        Write-Host "Webapp is running!" -ForegroundColor Green
        break
    }
    Start-Sleep -Seconds 1
    $attempt++
    if ($attempt % 10 -eq 0) {
        Write-Host "Still waiting for webapp... ($attempt/$maxAttempts)" -ForegroundColor Gray
    }
}

if ($attempt -eq $maxAttempts) {
    Write-Host "Webapp failed to start!" -ForegroundColor Red
    exit 1
}

# 7. Summary
Write-Host ""
Write-Host "===============================================" -ForegroundColor Green
Write-Host "   All Services Started Successfully!" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Green
Write-Host ""
Write-Host "Backend API: " -NoNewline -ForegroundColor Cyan
Write-Host "http://localhost:3000" -ForegroundColor White
Write-Host "Webapp UI:   " -NoNewline -ForegroundColor Cyan
Write-Host "http://localhost:4321" -ForegroundColor White
Write-Host ""
Write-Host "You can now access the webapp to add artists and music!" -ForegroundColor Yellow
Write-Host ""
Write-Host "To stop all services, run: " -NoNewline -ForegroundColor Gray
Write-Host ".\stop-services.ps1" -ForegroundColor White
Write-Host ""

# Open webapp in browser
Start-Process "http://localhost:4321" 