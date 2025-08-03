# Launch All Services Admin Script
# Run this script as Administrator

Write-Host "=== UPRISE APP LAUNCHER ===" -ForegroundColor Green
Write-Host "This script will stop all services and launch them fresh" -ForegroundColor Yellow

# Function to kill all Node processes and Metro processes
function Stop-AllNodeProcesses {
    Write-Host "Stopping all Node processes..." -ForegroundColor Cyan
    try {
        $nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
        if ($nodeProcesses) { Stop-Process -Name "node" -Force -ErrorAction SilentlyContinue; Write-Host "Killed $($nodeProcesses.Count) Node processes" -ForegroundColor Green }
        $port8081Processes = Get-NetTCPConnection -LocalPort 8081 -ErrorAction SilentlyContinue | ForEach-Object { Get-Process -Id $_.OwningProcess -ErrorAction SilentlyContinue }
        if ($port8081Processes) { $port8081Processes | Stop-Process -Force -ErrorAction SilentlyContinue; Write-Host "Killed processes using port 8081" -ForegroundColor Green }
        $port3000Processes = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | ForEach-Object { Get-Process -Id $_.OwningProcess -ErrorAction SilentlyContinue }
        if ($port3000Processes) { $port3000Processes | Stop-Process -Force -ErrorAction SilentlyContinue; Write-Host "Killed processes using port 3000" -ForegroundColor Green }
        Start-Sleep -Seconds 3
    } catch { Write-Host "Error stopping processes: $($_.Exception.Message)" -ForegroundColor Red }
}

# Function to check if port is in use
function Test-PortInUse {
    param([int]$Port)
    $connection = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
    return $connection -ne $null
}

# Function to wait for port to be free
function Wait-PortFree {
    param([int]$Port, [int]$TimeoutSeconds = 30)
    $startTime = Get-Date
    while ((Get-Date) -lt $startTime.AddSeconds($TimeoutSeconds)) {
        if (-not (Test-PortInUse -Port $Port)) {
            Write-Host "Port $Port is now free" -ForegroundColor Green
            return $true
        }
        Write-Host "Waiting for port $Port to be free..." -ForegroundColor Yellow
        Start-Sleep -Seconds 2
    }
    Write-Host "Timeout waiting for port $Port" -ForegroundColor Red
    return $false
}

# Stop all existing processes
Stop-AllNodeProcesses

Write-Host "`n🚀 Launching all services in separate admin terminals..." -ForegroundColor Green

# Launch Backend Server
Write-Host "Launching Backend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'C:\Users\baris\UPRISE\Mobile_App-Dev\Webapp_API-Develop'; Write-Host '=== BACKEND SERVER ===' -ForegroundColor Green; npm start" -WindowStyle Normal
Start-Sleep -Seconds 5

# Launch Metro Bundler with OpenSSL legacy provider
Write-Host "Launching Metro Bundler..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'C:\Users\baris\UPRISE\Mobile_App-Dev'; Write-Host '=== METRO BUNDLER ===' -ForegroundColor Green; `$env:NODE_OPTIONS='--openssl-legacy-provider'; npx react-native start --reset-cache --port 8081" -WindowStyle Normal
Start-Sleep -Seconds 15

# Launch Android Build
Write-Host "Launching Android Build..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'C:\Users\baris\UPRISE\Mobile_App-Dev'; Write-Host '=== ANDROID BUILD ===' -ForegroundColor Green; npx react-native run-android" -WindowStyle Normal

Write-Host "`n✅ All services launched successfully!" -ForegroundColor Green
Write-Host "`n📋 Service Status:" -ForegroundColor White
Write-Host "• Backend Server: http://localhost:3000" -ForegroundColor Cyan
Write-Host "• Metro Bundler: http://localhost:8081" -ForegroundColor Cyan
Write-Host "• Android Build: Installing on emulator" -ForegroundColor Cyan

Write-Host "`n⏳ Waiting for services to fully initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

Write-Host "`n🔍 Checking service status..." -ForegroundColor White
try {
    $backendStatus = Invoke-WebRequest -Uri "http://localhost:3000/health" -UseBasicParsing -TimeoutSec 5 -ErrorAction SilentlyContinue
    if ($backendStatus.StatusCode -eq 200) {
        Write-Host "✅ Backend Server: RUNNING" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Backend Server: Status $($backendStatus.StatusCode)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Backend Server: Not responding" -ForegroundColor Red
}

try {
    $metroStatus = Invoke-WebRequest -Uri "http://localhost:8081/status" -UseBasicParsing -TimeoutSec 5 -ErrorAction SilentlyContinue
    if ($metroStatus.StatusCode -eq 200) {
        Write-Host "✅ Metro Bundler: RUNNING" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Metro Bundler: Status $($metroStatus.StatusCode)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Metro Bundler: Not responding" -ForegroundColor Red
}

Write-Host "`n🎯 Next Steps:" -ForegroundColor White
Write-Host "1. Check each terminal window for any error messages" -ForegroundColor Cyan
Write-Host "2. Wait for Android build to complete installation" -ForegroundColor Cyan
Write-Host "3. Test the app in the emulator" -ForegroundColor Cyan
Write-Host "4. If Metro fails, check the OpenSSL error and restart Metro manually" -ForegroundColor Cyan

Write-Host "`nCheck each window for any errors!" -ForegroundColor Yellow 