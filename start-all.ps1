# Start All Services Script
# This script stops any running instances and then starts both the backend server and Metro bundler in separate windows.

# --- Cleanup Function ---
function Stop-ProcessByPort {
    param(
        [int]$Port
    )
    Write-Host "Checking for process on port $Port..."
    $processInfo = netstat -ano | Select-String -Pattern "LISTENING" | Select-String -Pattern ":$Port"
    if ($processInfo) {
        $processId = ($processInfo.ToString() -split '\\s+')[-1]
        if ($processId -match '^\\d+$' -and $processId -ne 0) {
            Write-Host "Found process with PID $processId on port $Port. Stopping it..." -ForegroundColor Yellow
            try {
                Stop-Process -Id $processId -Force -ErrorAction Stop
                Write-Host "Process with PID $processId stopped successfully." -ForegroundColor Green
            } catch {
                Write-Host "Failed to stop process with PID $processId. It might be already stopped. Error: $_" -ForegroundColor Red
            }
        }
    } else {
        Write-Host "No process found listening on port $Port."
    }
}

# --- Main Script ---
Write-Host "--- Stopping old services ---" -ForegroundColor Yellow
Stop-ProcessByPort -Port 3000 # Backend
Stop-ProcessByPort -Port 8081 # Metro
Write-Host "--- Cleanup finished ---" -ForegroundColor Yellow

# Add a small delay to ensure ports are fully released
Start-Sleep -Seconds 2

Write-Host "--- Starting new services in separate windows ---" -ForegroundColor Yellow

# Start backend server in a new Command Prompt window
Start-Process cmd.exe -ArgumentList "/k", "powershell.exe -ExecutionPolicy Bypass -File .\\start-backend.ps1"

# Wait a moment for backend to start
Start-Sleep -Seconds 3

# Start Metro bundler in a new Command Prompt window
Start-Process cmd.exe -ArgumentList "/k", "powershell.exe -ExecutionPolicy Bypass -File .\\start-metro.ps1"

Write-Host "Both services are starting in separate windows..." -ForegroundColor Green
Write-Host "Backend should be available at: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Metro bundler will be available at: http://localhost:8081" -ForegroundColor Cyan 