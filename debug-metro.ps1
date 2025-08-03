# Debug Metro Process Script
Write-Host "=== METRO DEBUG MONITOR STARTED ===" -ForegroundColor Green

# Function to monitor Metro process
function Monitor-MetroProcess {
    $metroProcess = Get-Process | Where-Object { $_.ProcessName -like "*node*" -and $_.CommandLine -like "*metro*" }
    
    if ($metroProcess) {
        Write-Host "Found Metro process: PID $($metroProcess.Id)" -ForegroundColor Yellow
        Write-Host "Command: $($metroProcess.CommandLine)" -ForegroundColor Gray
        
        # Monitor for EPERM errors
        $logFile = "metro-debug.log"
        Write-Host "Monitoring Metro logs for EPERM errors..." -ForegroundColor Cyan
        
        # Start monitoring in background
        Start-Job -ScriptBlock {
            param($logFile)
            while ($true) {
                if (Test-Path $logFile) {
                    $content = Get-Content $logFile -Tail 10
                    if ($content -match "EPERM") {
                        Write-Host "=== EPERM ERROR DETECTED ===" -ForegroundColor Red
                        Write-Host $content -ForegroundColor Red
                        break
                    }
                }
                Start-Sleep -Seconds 2
            }
        } -ArgumentList $logFile
    } else {
        Write-Host "No Metro process found" -ForegroundColor Red
    }
}

# Start monitoring
Monitor-MetroProcess

Write-Host "Press Ctrl+C to stop monitoring" -ForegroundColor Yellow
try {
    while ($true) {
        Start-Sleep -Seconds 5
    }
} catch {
    Write-Host "Monitoring stopped" -ForegroundColor Yellow
} 