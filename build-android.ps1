# Build Android App Script
# This script builds and runs the Android app with proper NODE_OPTIONS

Write-Host "Building Android App with legacy OpenSSL provider..." -ForegroundColor Blue

# Set Node options for legacy OpenSSL provider
Write-Host "Setting NODE_OPTIONS for legacy OpenSSL provider..." -ForegroundColor Yellow
$env:NODE_OPTIONS="--openssl-legacy-provider"
Write-Host "NODE_OPTIONS set to: $env:NODE_OPTIONS" -ForegroundColor Green

# Clean Android build
Write-Host "Cleaning Android build..." -ForegroundColor Yellow
cd android
./gradlew clean
cd ..

# Build and run Android app
Write-Host "Building and running Android app..." -ForegroundColor Yellow
npx react-native run-android

Write-Host "Build process completed!" -ForegroundColor Green
pause 