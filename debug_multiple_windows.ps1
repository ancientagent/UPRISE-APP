# Debug script to identify multiple window opening issue
Write-Host "=== Debugging Multiple Window Opening Issue ===" -ForegroundColor Yellow
Write-Host ""

# Check for multiple Node.js processes
Write-Host "1. Checking Node.js processes..." -ForegroundColor Cyan
$nodeProcesses = Get-Process | Where-Object {$_.ProcessName -eq "node"} | Select-Object Id, ProcessName, CPU, WorkingSet, StartTime
if ($nodeProcesses) {
    Write-Host "Found $($nodeProcesses.Count) Node.js processes:" -ForegroundColor Green
    $nodeProcesses | Format-Table -AutoSize
} else {
    Write-Host "No Node.js processes found" -ForegroundColor Red
}

Write-Host ""

# Check for multiple Chrome processes
Write-Host "2. Checking Chrome processes..." -ForegroundColor Cyan
$chromeProcesses = Get-Process | Where-Object {$_.ProcessName -eq "chrome"} | Select-Object Id, ProcessName, CPU, WorkingSet, StartTime
if ($chromeProcesses) {
    Write-Host "Found $($chromeProcesses.Count) Chrome processes:" -ForegroundColor Green
    $chromeProcesses | Select-Object -First 5 | Format-Table -AutoSize
    if ($chromeProcesses.Count -gt 5) {
        Write-Host "... and $($chromeProcesses.Count - 5) more Chrome processes" -ForegroundColor Yellow
    }
} else {
    Write-Host "No Chrome processes found" -ForegroundColor Red
}

Write-Host ""

# Check what's listening on ports 3000 and 4321
Write-Host "3. Checking ports 3000 and 4321..." -ForegroundColor Cyan
$port3000 = netstat -ano | findstr :3000
$port4321 = netstat -ano | findstr :4321

if ($port3000) {
    Write-Host "Port 3000 is in use:" -ForegroundColor Green
    Write-Host $port3000
} else {
    Write-Host "Port 3000 is not in use" -ForegroundColor Red
}

if ($port4321) {
    Write-Host "Port 4321 is in use:" -ForegroundColor Green
    Write-Host $port4321
} else {
    Write-Host "Port 4321 is not in use" -ForegroundColor Red
}

Write-Host ""

# Check for any processes that might be opening multiple windows
Write-Host "4. Checking for processes that might open multiple windows..." -ForegroundColor Cyan
$suspiciousProcesses = Get-Process | Where-Object {
    $_.ProcessName -match "(chrome|firefox|edge|iexplore|node|npm|yarn)" -and $_.WorkingSet -gt 50000000
} | Select-Object Id, ProcessName, CPU, WorkingSet, StartTime

if ($suspiciousProcesses) {
    Write-Host "Found processes that might be causing multiple windows:" -ForegroundColor Yellow
    $suspiciousProcesses | Format-Table -AutoSize
} else {
    Write-Host "No suspicious processes found" -ForegroundColor Green
}

Write-Host ""

# Check if there are any hidden windows
Write-Host "5. Checking for hidden windows..." -ForegroundColor Cyan
$hiddenWindows = Get-Process | Where-Object {$_.MainWindowTitle -ne ""} | Where-Object {$_.MainWindowTitle -match "(chrome|firefox|edge|iexplore)"} | Select-Object Id, ProcessName, MainWindowTitle

if ($hiddenWindows) {
    Write-Host "Found browser windows:" -ForegroundColor Green
    $hiddenWindows | Format-Table -AutoSize
} else {
    Write-Host "No browser windows found" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== Recommendations ===" -ForegroundColor Yellow
Write-Host "1. If you see multiple Node.js processes, some might be hanging. Try killing them:" -ForegroundColor White
Write-Host "   taskkill /F /IM node.exe" -ForegroundColor Gray
Write-Host ""
Write-Host "2. If you see multiple Chrome processes, check your taskbar for minimized windows" -ForegroundColor White
Write-Host ""
Write-Host "3. Open the test_server.html file in your browser to get more detailed information" -ForegroundColor White
Write-Host ""
Write-Host "4. Check Windows Task Manager (Ctrl+Shift+Esc) for any processes using high CPU/memory" -ForegroundColor White 