# Manual Metro Start Script
# Use this when you need to start Metro manually (not through run-android)

Write-Host "Starting Metro Bundler Manually..." -ForegroundColor Blue

# Set Node options for legacy OpenSSL provider
Write-Host "Setting NODE_OPTIONS for legacy OpenSSL provider..." -ForegroundColor Yellow
$env:NODE_OPTIONS="--openssl-legacy-provider"
Write-Host "NODE_OPTIONS set to: $env:NODE_OPTIONS" -ForegroundColor Green

# Start Metro bundler
Write-Host "Starting Metro bundler..." -ForegroundColor Blue
npx react-native start --reset-cache

Write-Host "Metro bundler is running. Press Ctrl+C to stop." -ForegroundColor Green
pause 