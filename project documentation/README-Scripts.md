# Development Scripts for Uprise Mobile App

> **🎯 Critical Thinking:** Always consider "What could go wrong?" before implementing solutions. See `DEVELOPMENT-MINDSET-GUIDE.md` for comprehensive guidelines.

This directory contains PowerShell scripts to help you start and stop the development services without making common mistakes.

## Project Structure

### **React Native App** (Main Directory)
- Mobile application with full onboarding flow ✅ **WORKING**
- Uses comprehensive `.env` file with 85+ environment variables ✅ **CONFIGURED**
- Analytics dashboard and song management features ✅ **FIXED**
- **Google Places API Integration** - Location autocomplete functionality ✅ **WORKING**
- **Comprehensive Genre System** - 97 genres with sub-genres ✅ **IMPLEMENTED**
- **Statistics Dashboard** - All endpoints working ✅ **FIXED**
- **Artist Unification System** - Unified ArtistProfile model ✅ **COMPLETE**
- **Song Upload System** - Complete file upload with feed integration ✅ **COMPLETE**
- **Architectural Realignment** - Feed = notifications only, Player = music only ✅ **CRITICAL FIX COMPLETE**
- **Android Build System** - Golden configuration implemented, stable builds ✅ **FULLY RESOLVED**

### **Webapp-UI** (React/TypeScript Web App)
- Modern React web application in `webapp-ui/` directory
- Complete environment template with `.env.example`
- Artist dashboard, authentication, and API integration
- **Status**: ✅ Fully initialized and tracked in version control

## Environment Configuration

### **React Native App (`.env` - Main Directory)**
- Contains 120 environment variables for API endpoints
- Includes authentication, user preferences, statistics, and more
- Template available in `.env.example` (main project)

### **Backend API (`Webapp_API-Develop/.env`)**
- Contains 15 basic server configuration variables
- Includes database, JWT, client credentials, and server settings
- Template available in `Webapp_API-Develop/sample.env`

### **Webapp-UI (`.env.example`)**
- Complete environment template in `webapp-ui/.env.example`
- Includes API base URL and all required variables
- **Setup**: Copy `webapp-ui/.env.example` to `webapp-ui/.env` and configure values

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

### 5. `launch-and-build.ps1` ⭐ **UPDATED - LEGACY METRO**
Comprehensive script that handles the complete development workflow with **legacy Metro mode**.
- Stops existing services
- Starts backend server in separate window
- **Starts Metro bundler in LEGACY MODE** in separate window
- Verifies services are running
- Cleans Android build
- Builds and deploys app to emulator
- **Always uses legacy Metro mode** for consistent behavior

**Usage:**
```powershell
.\launch-and-build.ps1
```

**Features:**
- ✅ **Legacy Metro Mode**: Always uses `--legacy` flag for Metro bundler
- ✅ **Service Verification**: Checks that both backend and Metro are running
- ✅ **Clean Build**: Automatically cleans Android build before deployment
- ✅ **Error Handling**: Comprehensive error checking and reporting
- ✅ **Colored Output**: Clear status messages with color coding

### 6. `start-metro-legacy.ps1` ⭐ **NEW**
Starts the React Native Metro bundler specifically in legacy mode.
- Sets NODE_OPTIONS for legacy OpenSSL provider
- Uses `--legacy` flag for Metro bundler
- Includes cache reset for clean builds

**Usage:**
```powershell
.\start-metro-legacy.ps1
```

**Note**: This script is called automatically by `launch-and-build.ps1` to ensure legacy mode is always used.

## Quick Start Guide

1. **Start everything with legacy Metro (recommended):**
   ```powershell
   .\launch-and-build.ps1
   ```
   **This will:**
   - ✅ Start backend server
   - ✅ Start Metro bundler in **LEGACY MODE**
   - ✅ Clean and build Android app
   - ✅ Install on emulator

2. **Stop everything when done:**
   ```powershell
   .\stop-services.ps1
   ```

3. **Start services individually:**
   ```powershell
   .\start-backend.ps1    # In one terminal
   .\start-metro-legacy.ps1  # In another terminal (LEGACY MODE)
   ```

4. **Manual build (if Metro is already running):**
   ```powershell
   cd android; ./gradlew clean; cd ..
   npx react-native run-android --no-packager
   ```

## Benefits

✅ **No more PowerShell syntax errors** - No more `&&` mistakes
✅ **Consistent environment variables** - Always uses the correct credentials
✅ **Automatic port management** - Easy to stop conflicting processes
✅ **Clear feedback** - Colored output shows what's happening
✅ **Separate windows** - Each service runs in its own window for better debugging
✅ **Google Places API integration** - Location autocomplete functionality ready ⭐ **NEW**

## 📚 **Documentation**

- **`ARCHITECTURAL-REALIGNMENT-IMPLEMENTATION.md`** - Complete architectural realignment implementation report
- **`PROJECT-MANAGER-REPORT-SONG-UPLOAD-SUCCESS.md`** - Complete song upload system implementation report
- **`GOOGLE-PLACES-API-DOCUMENTATION.md`** - Complete Google Places API integration guide
- **`QUICK-FIXES.md`** - Common issues and solutions
- **`PROJECT-STRUCTURE.md`** - Detailed project architecture
- **`ARTIST-UNIFICATION-IMPLEMENTATION.md`** - Complete Artist Unification implementation guide

## Troubleshooting

If you get "port already in use" errors:
1. Run `.\stop-services.ps1` to free up ports
2. Then run `.\start-all.ps1` again

If scripts don't run:
1. Make sure PowerShell execution policy allows scripts:
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ``` 