# Start Backend Server Script
# This script starts the backend server with the correct environment variables

Write-Host "Starting Backend Server..." -ForegroundColor Green

# Set environment variables
$env:CLIENT_ID = "437920819fa89d19abe380073d28839c"
$env:CLIENT_SECRET = "28649120bdf32812f433f428b15ab1a1"
$env:PORT = "3000"

# Navigate to backend directory and start server
Set-Location "Webapp_API-Develop"
npm start 