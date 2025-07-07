Write-Host "=== Starting Services and Building App ===" -ForegroundColor Cyan

# Stop any existing services first
Write-Host "Stopping any existing services..." -ForegroundColor Yellow
& ".\stop-services.ps1"

# Start services in separate windows
Write-Host "Starting Backend and Metro services..." -ForegroundColor Green
& ".\start-all.ps1"

# Wait for services to start up
Write-Host "Waiting for services to start up..." -ForegroundColor Yellow
Start-Sleep -Seconds 8

# Verify services are running
Write-Host "Checking if services are running..." -ForegroundColor Yellow
$backendRunning = netstat -ano | findstr ":3000"
$metroRunning = netstat -ano | findstr ":8081"

if ($backendRunning -and $metroRunning) {
    Write-Host "✅ Both services are running!" -ForegroundColor Green
    Write-Host "Backend: $backendRunning" -ForegroundColor Gray
    Write-Host "Metro: $metroRunning" -ForegroundColor Gray
} else {
    Write-Host "❌ Services may not be ready yet. Waiting a bit more..." -ForegroundColor Red
    Start-Sleep -Seconds 5
}

# Now run the React Native build
Write-Host "Starting React Native build..." -ForegroundColor Cyan
npx react-native run-android

Write-Host "=== Build Complete ===" -ForegroundColor Cyan 