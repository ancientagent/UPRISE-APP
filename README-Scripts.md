# Development Scripts for Uprise Mobile App

This directory contains PowerShell scripts to help you start and stop the development services without making common mistakes.

## Available Scripts

### 1. `start-backend.ps1`
Starts the backend server with the correct environment variables.
- Sets CLIENT_ID and CLIENT_SECRET
- Runs on port 3000
- Navigates to the correct directory automatically

**Usage:**
```powershell
.\start-backend.ps1
```

### 2. `start-metro.ps1`
Starts the React Native Metro bundler with the correct Node options.
- Sets NODE_OPTIONS for legacy OpenSSL provider
- Runs on port 8081
- Includes cache reset

**Usage:**
```powershell
.\start-metro.ps1
```

### 3. `start-all.ps1`
Starts both services in separate PowerShell windows.
- Opens backend in one window
- Opens Metro bundler in another window
- Provides status messages

**Usage:**
```powershell
.\start-all.ps1
```

### 4. `stop-services.ps1`
Stops all services and frees up ports.
- Automatically finds and kills processes on ports 3000 and 8081
- Provides feedback on what's being stopped

**Usage:**
```powershell
.\stop-services.ps1
```

## Quick Start Guide

1. **Start everything at once:**
   ```powershell
   .\start-all.ps1
   ```

2. **Stop everything when done:**
   ```powershell
   .\stop-services.ps1
   ```

3. **Start services individually:**
   ```powershell
   .\start-backend.ps1    # In one terminal
   .\start-metro.ps1      # In another terminal
   ```

## Benefits

✅ **No more PowerShell syntax errors** - No more `&&` mistakes
✅ **Consistent environment variables** - Always uses the correct credentials
✅ **Automatic port management** - Easy to stop conflicting processes
✅ **Clear feedback** - Colored output shows what's happening
✅ **Separate windows** - Each service runs in its own window for better debugging

## Troubleshooting

If you get "port already in use" errors:
1. Run `.\stop-services.ps1` to free up ports
2. Then run `.\start-all.ps1` again

If scripts don't run:
1. Make sure PowerShell execution policy allows scripts:
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ``` 