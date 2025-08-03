# Stop All Services Script
# Run this script as Administrator

Write-Host "=== STOPPING ALL UPRISE SERVICES ===" -ForegroundColor Red

# Kill all Node processes
Write-Host "Stopping all Node processes..." -ForegroundColor Cyan
try {
    $nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
    if ($nodeProcesses) {
        Stop-Process -Name "node" -Force -ErrorAction SilentlyContinue
        Write-Host "Killed $($nodeProcesses.Count) Node processes" -ForegroundColor Green
    } else {
        Write-Host "No Node processes found" -ForegroundColor Yellow
    }
} catch {
    Write-Host "Error stopping Node processes: $($_.Exception.Message)" -ForegroundColor Red
}

# Kill any remaining Metro processes
Write-Host "Stopping Metro processes..." -ForegroundColor Cyan
try {
    $metroProcesses = Get-Process | Where-Object { $_.ProcessName -like "*node*" -and $_.CommandLine -like "*metro*" }
    if ($metroProcesses) {
        $metroProcesses | Stop-Process -Force -ErrorAction SilentlyContinue
        Write-Host "Killed Metro processes" -ForegroundColor Green
    }
} catch {
    Write-Host "Error stopping Metro processes: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== ALL SERVICES STOPPED ===" -ForegroundColor Green
Write-Host "You can now run launch-all-admin.ps1 to restart everything" -ForegroundColor Yellow 