# Android Environment Setup Script for React Native
Write-Host "=== Android Environment Setup for React Native ===" -ForegroundColor Yellow
Write-Host ""

# Check if ANDROID_HOME is set
$androidHome = $env:ANDROID_HOME
if ($androidHome) {
    Write-Host "✓ ANDROID_HOME is set to: $androidHome" -ForegroundColor Green
} else {
    Write-Host "✗ ANDROID_HOME is not set" -ForegroundColor Red
    Write-Host "   You need to set ANDROID_HOME to your Android SDK location" -ForegroundColor Yellow
    Write-Host "   Usually: C:\Users\$env:USERNAME\AppData\Local\Android\Sdk" -ForegroundColor Gray
}

Write-Host ""

# Check if Android SDK tools are available
$sdkPath = if ($androidHome) { $androidHome } else { "C:\Users\$env:USERNAME\AppData\Local\Android\Sdk" }
$adbPath = "$sdkPath\platform-tools\adb.exe"
$emulatorPath = "$sdkPath\emulator\emulator.exe"

if (Test-Path $adbPath) {
    Write-Host "✓ ADB found at: $adbPath" -ForegroundColor Green
} else {
    Write-Host "✗ ADB not found at: $adbPath" -ForegroundColor Red
    Write-Host "   Make sure Android SDK Platform-Tools is installed" -ForegroundColor Yellow
}

if (Test-Path $emulatorPath) {
    Write-Host "✓ Emulator found at: $emulatorPath" -ForegroundColor Green
} else {
    Write-Host "✗ Emulator not found at: $emulatorPath" -ForegroundColor Red
    Write-Host "   Make sure Android SDK Emulator is installed" -ForegroundColor Yellow
}

Write-Host ""

# Check for Android devices/emulators
Write-Host "=== Checking for Android Devices/Emulators ===" -ForegroundColor Cyan
if (Test-Path $adbPath) {
    try {
        $devices = & $adbPath devices
        Write-Host "Connected devices:" -ForegroundColor Green
        $devices | ForEach-Object { Write-Host "  $_" -ForegroundColor Gray }
    } catch {
        Write-Host "Error checking devices: $_" -ForegroundColor Red
    }
} else {
    Write-Host "Cannot check devices - ADB not found" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== Next Steps ===" -ForegroundColor Yellow
Write-Host "1. Install Android Studio if not already installed" -ForegroundColor White
Write-Host "2. Open Android Studio and install:" -ForegroundColor White
Write-Host "   - Android SDK Platform-Tools" -ForegroundColor Gray
Write-Host "   - Android SDK Build-Tools" -ForegroundColor Gray
Write-Host "   - Android SDK Platform (API level 33 or higher)" -ForegroundColor Gray
Write-Host "   - Android Emulator" -ForegroundColor Gray
Write-Host "3. Create an Android Virtual Device (AVD)" -ForegroundColor White
Write-Host "4. Set environment variables:" -ForegroundColor White
Write-Host "   ANDROID_HOME=C:\Users\$env:USERNAME\AppData\Local\Android\Sdk" -ForegroundColor Gray
Write-Host "   Add to PATH: %ANDROID_HOME%\platform-tools" -ForegroundColor Gray
Write-Host "5. Start an emulator before running 'npx react-native run-android'" -ForegroundColor White

$env:NODE_OPTIONS="--openssl-legacy-provider"
npm start 