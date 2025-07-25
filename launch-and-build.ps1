# Launch and Build Script for Uprise Mobile App
# This script handles the complete development workflow

param(
    [switch]$SkipServices = $false,
    [switch]$SkipBuild = $false
)

# --- Configuration ---
$BackendPort = 3000
$MetroPort = 8081
$BackendDir = "Webapp_API-Develop"
$AppName = "Uprise"

# --- Color Functions ---
function Write-Status {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host "[$(Get-Date -Format 'HH:mm:ss')] $Message" -ForegroundColor $Color
}

function Write-Success {
    param([string]$Message)
    Write-Status $Message "Green"
}

function Write-Warning {
    param([string]$Message)
    Write-Status $Message "Yellow"
}

function Write-Error {
    param([string]$Message)
    Write-Status $Message "Red"
}

# --- Utility Functions ---
function Stop-ProcessByPort {
    param([int]$Port)
    Write-Status "Checking for process on port $Port..." "Cyan"
    $processInfo = netstat -ano | Select-String -Pattern "LISTENING" | Select-String -Pattern ":$Port"
    if ($processInfo) {
        $processId = ($processInfo.ToString() -split '\s+')[-1]
        if ($processId -match '^\d+$' -and $processId -ne 0) {
            Write-Warning "Found process with PID $processId on port $Port. Stopping it..."
            try {
                Stop-Process -Id $processId -Force -ErrorAction Stop
                Write-Success "Process with PID $processId stopped successfully."
            } catch {
                Write-Warning "Failed to stop process with PID $processId. It might be already stopped."
            }
        }
    } else {
        Write-Status "No process found listening on port $Port." "Cyan"
    }
}

function Wait-ForService {
    param(
        [string]$ServiceName,
        [int]$Port,
        [int]$MaxAttempts = 30,
        [int]$DelaySeconds = 2
    )
    Write-Status "Waiting for $ServiceName to be ready on port $Port..." "Cyan"
    
    for ($i = 1; $i -le $MaxAttempts; $i++) {
        $processInfo = netstat -ano | Select-String -Pattern "LISTENING" | Select-String -Pattern ":$Port"
        if ($processInfo) {
            Write-Success "$ServiceName is ready on port $Port!"
            return $true
        }
        Write-Status "Attempt $i/$MaxAttempts - $ServiceName not ready yet..." "Yellow"
        Start-Sleep -Seconds $DelaySeconds
    }
    
    Write-Error "$ServiceName failed to start within the expected time."
    return $false
}

function Test-Emulator {
    Write-Status "Checking Android emulator status..." "Cyan"
    $emulators = adb devices
    if ($emulators -match "emulator") {
        Write-Success "Android emulator is running."
        return $true
    } else {
        Write-Warning "No Android emulator detected. Please start your emulator first."
        return $false
    }
}

# --- Main Script ---
Write-Host "`n=== UPRISE MOBILE APP - LAUNCH AND BUILD SCRIPT ===" -ForegroundColor Magenta
Write-Host "This script will:" -ForegroundColor White
Write-Host "1. Stop any existing services" -ForegroundColor White
Write-Host "2. Start backend server" -ForegroundColor White
Write-Host "3. Start Metro bundler in LEGACY MODE" -ForegroundColor White
Write-Host "4. Verify services are running" -ForegroundColor White
Write-Host "5. Clean and build Android app" -ForegroundColor White
Write-Host "6. Install and launch app on emulator" -ForegroundColor White

if (-not $SkipServices) {
    Write-Host "`n--- STEP 1: Stopping existing services ---" -ForegroundColor Yellow
    Stop-ProcessByPort -Port $BackendPort
    Stop-ProcessByPort -Port $MetroPort
    Start-Sleep -Seconds 3
    
    Write-Host "`n--- STEP 2: Starting Backend Server ---" -ForegroundColor Yellow
    Write-Status "Starting backend server in new window..." "Cyan"
    Start-Process cmd.exe -ArgumentList "/k", "powershell.exe -ExecutionPolicy Bypass -File .\start-backend.ps1"
    
    if (-not (Wait-ForService -ServiceName "Backend" -Port $BackendPort)) {
        Write-Error "Backend failed to start. Exiting."
        exit 1
    }
    
    Write-Host "`n--- STEP 3: Starting Metro Bundler in LEGACY MODE ---" -ForegroundColor Yellow
    Write-Status "Starting Metro bundler in legacy mode..." "Cyan"
    Start-Process cmd.exe -ArgumentList "/k", "powershell.exe -ExecutionPolicy Bypass -File .\start-metro-legacy.ps1"
    
    if (-not (Wait-ForService -ServiceName "Metro" -Port $MetroPort)) {
        Write-Error "Metro bundler failed to start. Exiting."
        exit 1
    }
    
    Write-Host "`n--- STEP 4: Verifying Services ---" -ForegroundColor Yellow
    Write-Success "✅ Backend server is running on port $BackendPort"
    Write-Success "✅ Metro bundler is running on port $MetroPort (LEGACY MODE)"
} else {
    Write-Warning "Skipping service startup (SkipServices flag used)"
}

if (-not $SkipBuild) {
    Write-Host "`n--- STEP 5: Checking Emulator ---" -ForegroundColor Yellow
    if (-not (Test-Emulator)) {
        Write-Error "Please start your Android emulator and run this script again."
        exit 1
    }
    
    Write-Host "`n--- STEP 6: Cleaning Android Build ---" -ForegroundColor Yellow
    Write-Status "Cleaning Android build..." "Cyan"
    try {
        cd android
        ./gradlew clean
        cd ..
        Write-Success "Android build cleaned successfully."
    } catch {
        Write-Error "Failed to clean Android build: $_"
        exit 1
    }
    
    Write-Host "`n--- STEP 7: Building and Installing App ---" -ForegroundColor Yellow
    Write-Status "Building and installing app on emulator..." "Cyan"
    try {
        $env:NODE_OPTIONS="--openssl-legacy-provider"
        Write-Status "Set NODE_OPTIONS to: $env:NODE_OPTIONS" "Green"
        Write-Status "Metro is already running in legacy mode, proceeding with build..." "Green"
        npx react-native run-android --no-packager
        Write-Success "App built and installed successfully!"
    } catch {
        Write-Error "Failed to build and install app: $_"
        exit 1
    }
} else {
    Write-Warning "Skipping app build (SkipBuild flag used)"
}

Write-Host "`n=== LAUNCH COMPLETE ===" -ForegroundColor Green
Write-Success "🎉 Uprise mobile app is ready!"
Write-Status "Backend: http://localhost:$BackendPort" "Cyan"
Write-Status "Metro: http://localhost:$MetroPort (LEGACY MODE)" "Cyan"
Write-Status "App should be running on your emulator" "Cyan"
Write-Host "`nPress any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") 