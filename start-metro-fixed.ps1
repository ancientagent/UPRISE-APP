# Fixed Metro launcher with OpenSSL legacy provider
Write-Host "Starting Metro with OpenSSL legacy provider..." -ForegroundColor Green

# Set environment variable explicitly
$env:NODE_OPTIONS = "--openssl-legacy-provider"

# Verify the environment variable is set
Write-Host "NODE_OPTIONS set to: $env:NODE_OPTIONS" -ForegroundColor Cyan

# Launch Metro with explicit environment variable
Write-Host "Launching Metro..." -ForegroundColor Yellow
& node --openssl-legacy-provider ./node_modules/.bin/react-native start --reset-cache --port 8081 