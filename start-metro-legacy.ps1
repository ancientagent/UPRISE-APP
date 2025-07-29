# Start Metro Bundler in Legacy Mode
# This script starts the React Native Metro bundler with legacy mode enabled

Write-Host "Starting Metro Bundler in Legacy Mode..." -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

# Set Node options for legacy OpenSSL provider
$env:NODE_OPTIONS = "--openssl-legacy-provider"
Write-Host "Set NODE_OPTIONS to: $env:NODE_OPTIONS" -ForegroundColor Green

# Start Metro bundler in legacy mode
Write-Host "Starting Metro bundler with legacy options..." -ForegroundColor Yellow
try {
    npx react-native start --reset-cache
} catch {
    Write-Host "Error starting Metro bundler: $_" -ForegroundColor Red
    Write-Host "Press any key to exit..." -ForegroundColor Gray
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
} 