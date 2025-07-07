# Stop All Services Script
# This script stops all services and frees up ports 3000 and 8081

Write-Host "Stopping all services..." -ForegroundColor Red

# Stop processes on port 3000 (Backend)
$port3000 = netstat -ano | findstr ":3000" | findstr "LISTENING"
if ($port3000) {
    $processId = ($port3000 -split '\s+')[-1]
    Write-Host "Stopping backend process (PID: $processId) on port 3000..." -ForegroundColor Yellow
    taskkill /PID $processId /F
} else {
    Write-Host "No process found on port 3000" -ForegroundColor Gray
}

# Stop processes on port 8081 (Metro)
$port8081 = netstat -ano | findstr ":8081" | findstr "LISTENING"
if ($port8081) {
    $processId = ($port8081 -split '\s+')[-1]
    Write-Host "Stopping Metro process (PID: $processId) on port 8081..." -ForegroundColor Yellow
    taskkill /PID $processId /F
} else {
    Write-Host "No process found on port 8081" -ForegroundColor Gray
}

Write-Host "All services stopped!" -ForegroundColor Green 