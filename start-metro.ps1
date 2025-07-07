# Start Metro Bundler Script
# This script starts the React Native Metro bundler with legacy OpenSSL provider

Write-Host "Starting Metro Bundler..." -ForegroundColor Blue

# Set Node options for legacy OpenSSL provider and start Metro
$env:NODE_OPTIONS="--openssl-legacy-provider"; npx react-native start --reset-cache
