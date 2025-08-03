# Test Metro with OpenSSL legacy provider
Write-Host "Testing Metro with OpenSSL legacy provider..." -ForegroundColor Green

# Set the environment variable
$env:NODE_OPTIONS = "--openssl-legacy-provider"

# Launch Metro
Write-Host "Starting Metro..." -ForegroundColor Yellow
npx react-native start --reset-cache --port 8081 