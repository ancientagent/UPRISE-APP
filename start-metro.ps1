# Start Metro Bundler Script
# This script starts the React Native Metro bundler with legacy OpenSSL provider

Write-Host "Starting Metro Bundler..." -ForegroundColor Blue

# Set Node options for legacy OpenSSL provider and start Metro
Write-Host "Setting NODE_OPTIONS for legacy OpenSSL provider..." -ForegroundColor Yellow
$env:NODE_OPTIONS="--openssl-legacy-provider"
Write-Host "NODE_OPTIONS set to: $env:NODE_OPTIONS" -ForegroundColor Green
Write-Host "Starting Metro bundler..." -ForegroundColor Blue
npx react-native start --reset-cache
