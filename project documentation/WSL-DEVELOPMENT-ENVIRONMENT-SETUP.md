# 🐧 WSL Development Environment Setup Guide

> **🚨 CRITICAL**: The UPRISE project **MUST** be developed using Ubuntu via WSL (Windows Subsystem for Linux). Development directly on the Windows file system is **DEPRECATED** and **UNSUPPORTED** due to fundamental incompatibilities with the React Native build toolchain.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [WSL Installation & Configuration](#wsl-installation--configuration)
3. [Core Software Installation](#core-software-installation)
4. [WSL Shell Configuration](#wsl-shell-configuration)
5. [PostgreSQL Database Configuration](#postgresql-database-configuration)
6. [Project-Specific Configuration](#project-specific-configuration)
7. [The Definitive "Clean Room" Launch Sequence](#the-definitive-clean-room-launch-sequence)
8. [Troubleshooting](#troubleshooting)
9. [Verification Checklist](#verification-checklist)

---

## 🎯 Prerequisites

### Windows Requirements
- Windows 10/11 with WSL2 support
- PowerShell with execution policy allowing scripts
- Android Studio with Android SDK installed
- PostgreSQL server installed on Windows

### WSL Requirements
- Ubuntu 20.04 or later
- At least 8GB RAM allocated to WSL
- At least 20GB free disk space

---

## 🐧 WSL Installation & Configuration

### Step 1: Enable WSL2
```powershell
# Run as Administrator in PowerShell
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
```

### Step 2: Install Ubuntu
```powershell
# Install Ubuntu from Microsoft Store or via command line
wsl --install -d Ubuntu
```

### Step 3: Configure WSL2
```powershell
# Set WSL2 as default
wsl --set-default-version 2

# Set Ubuntu as default distribution
wsl --set-default Ubuntu
```

### Step 4: Allocate Resources
Create `%USERPROFILE%\.wslconfig` with:
```ini
[wsl2]
memory=8GB
processors=4
swap=2GB
```

---

## 🔧 Core Software Installation

### Step 1: Update Ubuntu
```bash
sudo apt update && sudo apt upgrade -y
```

### Step 2: Install NVM (Node Version Manager)
```bash
# Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Reload shell configuration
source ~/.bashrc

# Verify NVM installation
nvm --version
```

### Step 3: Install Node.js
```bash
# Install Node.js v16.20.2 (specific version for stability)
nvm install 16.20.2
nvm use 16.20.2
nvm alias default 16.20.2

# Verify installation
node --version
npm --version
```

### Step 4: Install Java Development Kit
```bash
# Install OpenJDK 11 (required for Android development)
sudo apt install openjdk-11-jdk -y

# Verify installation
java -version
javac -version
```

### Step 5: Install Essential Tools
```bash
# Install essential development tools
sudo apt install -y curl wget git unzip zip

# Install Python (required for some React Native dependencies)
sudo apt install python3 python3-pip -y
```

---

## ⚙️ WSL Shell Configuration

### Step 1: Configure .bashrc
Add the following configuration to `~/.bashrc`:

```bash
# =============================================================================
# UPRISE PROJECT - WSL DEVELOPMENT ENVIRONMENT CONFIGURATION
# =============================================================================

# Java Configuration
export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64
export PATH=$PATH:$JAVA_HOME/bin

# Android SDK Configuration (Windows path)
export ANDROID_SDK_ROOT="/mnt/c/Users/$USER/AppData/Local/Android/Sdk"
export PATH=$PATH:$ANDROID_SDK_ROOT/emulator
export PATH=$PATH:$ANDROID_SDK_ROOT/platform-tools
export PATH=$PATH:$ANDROID_SDK_ROOT/tools
export PATH=$PATH:$ANDROID_SDK_ROOT/tools/bin

# React Native Configuration
export REACT_NATIVE_PACKAGER_HOSTNAME=localhost

# Node.js Configuration
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

# =============================================================================
# IMPORTANT: REMOVE OLD CONFIGURATIONS
# =============================================================================
# ❌ REMOVE these old configurations if they exist:
# export JAVA_HOME="/mnt/c/Program Files/Java/jdk-11.0.12"
# export ADB_SERVER_SOCKET="$WSL_HOST:5037"
# =============================================================================
```

### Step 2: Apply Configuration
```bash
# Reload bash configuration
source ~/.bashrc

# Verify environment variables
echo $JAVA_HOME
echo $ANDROID_SDK_ROOT
```

### Step 3: Verify Android Tools
```bash
# Test ADB connection
adb devices

# Test emulator
emulator -list-avds
```

---

## 🗄️ PostgreSQL Database Configuration

### Step 1: Configure pg_hba.conf
Add this line to `C:\Program Files\PostgreSQL\[version]\data\pg_hba.conf`:
```
# Allow WSL connections
host    all             all             172.16.0.0/12           scram-sha-256
```

### Step 2: Configure postgresql.conf
Ensure this line exists in `C:\Program Files\PostgreSQL\[version]\data\postgresql.conf`:
```
listen_addresses = '*'
```

### Step 3: Restart PostgreSQL Service
```powershell
# Run as Administrator in PowerShell
net stop postgresql-x64-[version]
net start postgresql-x64-[version]
```

### Step 4: Test Database Connection
```bash
# Test connection from WSL
psql -h 172.30.112.1 -U postgres -d postgres
```

---

## ⚙️ Project-Specific Configuration

### Step 1: Clone Project
```bash
# Navigate to your development directory
cd ~/projects

# Clone the UPRISE project
git clone [your-repository-url] UPRISE-APP
cd UPRISE-APP
```

### Step 2: Install Dependencies
```bash
# Install Node.js dependencies
npm install

# Install Android dependencies
cd android
./gradlew clean
cd ..
```

### Step 3: Configure Backend Environment
Create `WebApp-API/.env`:
```env
PORT=3000
NODE_ENV=development

# JWT Configuration
JWT_ACCESS_TOKEN_SECRET=uprise_access_token_secret_key_2024
JWT_REFRESH_TOKEN_SECRET=uprise_refresh_token_secret_key_2024
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Database Configuration (WSL to Windows)
DB_HOST=172.30.112.1
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=postgres
DB_PORT=5432

# Client Authentication
CLIENT_ID=437920819fa89d19abe380073d28839c
CLIENT_SECRET=28649120bdf32812f433f428b15ab1a1

# Web URL
WEB_URL=http://localhost:4321
```

### Step 4: Configure Frontend Environment
Create `.env` in project root:
```env
# Base Configuration
BASE_URL=http://172.30.112.1:3000

# Client Authentication
CLIENT_ID=437920819fa89d19abe380073d28839c
CLIENT_SECRET=28649120bdf32812f433f428b15ab1a1

# Authentication Endpoints
SIGNUP_URL=/auth/signup
LOGIN_URL=/auth/login
GET_USER_DETAILS_URL=/user/me

# Google Places API
GOOGLE_PLACES_API_KEY=AIzaSyDmEqT-zOSEIP_YlvyZQUAVd7SRlQvmH2g
GOOGLE_PLACES_AUTOCOMPLETE_URL=https://places.googleapis.com/v1/places:autocomplete

# Statistics Endpoints
GET_RADIO_STATIONS_STATISTICS=/popular/radio_stations
GET_POPULAR_ARTIST_STATISTICS=/popular/artist
GET_GENRES_PREFRENCE_STATISTICS=/popular/genres
GET_EVENTS_STATISTICS=/popular/events
GET_BANDS_STATISTICS=/popular/bands
GET_POPULAR_ARTIST_GENRES_STATISTICS=/popular/artist_per_genre
GET_USERS_STATISTICS=/popular/users

# Onboarding Endpoints
GET_ALL_GENRES_URL=/onboarding/all-genres

# Location & Cities
NEAREST_LOCATIONS=/locations/nearest

# Home Screen Content
HOME_FEED=/home/feed
HOME_EVENTS=/home/feed/events/{STATENAME}
HOME_PROMOS=/home/promos/{STATENAME}
HOME_NEW_RELEASES=/home/new-releases
HOME_RECOMMENDED_STATIONS=/home/recommended-radio-stations

# Radio & Songs
GET_RADIO_SONG=/radio/song/{LOCATION}
GET_RADIO_STATIONS=/popular/radio_stations
GET_RADIO_STATIONS_SONGS=/radio/stations/songs
GET_RADIO_AVAILABLE_STATES=/radio/avaliable-states

# Social Features
USER_FOLLOW=/user/follow
USER_UNFOLLOW=/user/unfollow
FOLLOWERS_LIST=/user/followers
FOLLOWING_LIST=/user/following

# Events & Calendar
EVENT_CREATE=/eventmanagement/create-event
EVENT_UPDATE=/eventmanagement/update-event
EVENT_LIST=/eventmanagement/events-list
GET_DAY_EVENT=/event/day

# Discovery
DISCOVERY_ALL_GENRES=/discovery/all_genres
DISCOVERY_POPULAR_BANDS=/discovery/most_popular_bands/{COUNT}
DISCOVERY_TRENDING_SONGS=/discovery/trending_songs/{COUNT}

# Popular Content
MOST_PLAYED_SONGS=/popular/most_played_songs/{COUNT}
MOST_RATED_SONGS=/popular/most_rated_songs/{COUNT}
MOST_POPULAR_BANDS=/popular/most_popular_bands/{COUNT}
TRENDING_SONGS=/discovery/trending_songs/{COUNT}

# User Profile & Location
UPDATE_PROFILE_URL=/user/update_profile
UPDATE_ONBOARDING_STATUS_URL=/auth/update-onboarding-status
USER_LOCATION=/auth/user-location

# Band Related Endpoints
BAND_CREATE=/band/create
BAND_EDIT=/band/edit_band
BAND_DETAILS=/band/band_details
BAND_MEMBERS_LIST=/band/bandmembers_list
BAND_MEMBERS=/band/members
BAND_FOLLOW=/user/band-follow
BAND_UNFOLLOW=/user/undo-band-follow
BAND_EVENTS=/band/events
BAND_GALLERY=/band/gallery
BAND_SONGS=/band/songs
BAND_STATISTICS=/band/statistics
BAND_FOLLOWERS=/band/followers
BAND_FOLLOWING=/band/following

# Song Management
SONG_UPLOAD=/song/upload
SONG_EDIT=/song/edit
SONG_LIVE=/song/live
SONG_LIST=/song/songs-list
SONG_DELETE=/song/delete
SONG_FAVORITE=/user/song-favorite
SONG_UNFAVORITE=/user/song-unfavorite
SONG_VOTE=/votes/vote
SONG_UNDO_VOTE=/votes/undo-vote
SONG_BLAST=/votes/song-blast
SONG_REPORT=/song/report
SONG_DOWN_VOTE=/song/down-vote
SONG_LIKE_STATUS=/song-likes/song-like-status
SONG_SKIP=/song-likes/song-skip
SONG_LISTEN=/song-likes/song-listen
SONG_ENGAGEMENT=/song-likes/song-engagement

# Location & Cities
AVAILABLE_CITIES=/cities/available

# Notifications
REGISTER_DEVICE_TOKEN=/user/notification/register-token
UNREGISTER_DEVICE_TOKEN=/user/notification/un-register-token

# Additional Configuration
MAP_API_KEY=your_google_maps_api_key_here
ALBUM_DETAILS=/album/details
ALBUMS_LIST=/album/list
FAVORITE_SONG_LIST=/song/favorites
SONG_LIST_BY_GENRE=/song/list/by-genre
INSTRUMENT_GET=/user/instrument
INSTRUMENT_UPDATE=/user/instrument/update
CITY_UPDATE=/user/city/update
STATION_SWITCHING=/user/station_switching
USER_GENRES=/user/genres
ARTIST_PROFILE=/artist/profile
DELETE_FOLLOWERS=/user/followers/delete

# Onboarding Endpoints
ONBOARDING_SUPER_GENRES=/onboarding/super-genres
ONBOARDING_VALIDATE_COMMUNITY=/onboarding/validate-community
COMMUNITIES_CITIES_AUTOCOMPLETE=/communities/cities-autocomplete

# Analytics & User Statistics
GET_USER_STATISTICS=/user/statistics
GET_USER_GENRES=/user/genres
GET_USER_AVATAR=/user/avatar
POST_SONG_ID=/song/post-id

# Password Management
CHANGE_PASSWORD=/user/change-password
FORGOT_PASSWORD=/auth/forgot-password
RESET_PASSWORD=/auth/reset-password
VERIFY_USER=/auth/verify-user

# User Profile Management
OTHER_USER_PROFILE=/user/profile
USER_FAVORITES=/user/favorites
USER_AVATAR=/user/avatar

# Google Event Integration
GOOGLE_EVENT=/event/google
GET_GOOGLE_EVENT=/event/google/get
EVENT_REMOVE=/event/remove

# Most Popular Content
MOST_POPULAR_ALBUMS=/popular/most_popular_albums/{COUNT}
MOST_POPULAR_GENRES=/popular/most_popular_genres/{COUNT}
GENRES_SONG_LIST=/discovery/songs_by_genre/{GENRESID}
```

### Step 5: Update package.json Scripts
**CRITICAL**: Remove the `--openssl-legacy-provider` flag from scripts:

```json
{
  "scripts": {
    "start": "node node_modules/react-native/local-cli/cli.js start",
    "android": "node node_modules/react-native/local-cli/cli.js run-android",
    "ios": "node node_modules/react-native/local-cli/cli.js run-ios"
  }
}
```

### Step 6: Fix Android Build Configuration
Update `android/settings.gradle`:
```gradle
rootProject.name = 'UpriseRadiyo'

apply from: file("../node_modules/@react-native-community/cli-platform-android/native_modules.gradle"); applyNativeModulesSettings(settings)
include ':app'
```

### Step 7: Create Missing Gradle File
If `node_modules/@react-native-community/cli-platform-android/native_modules.gradle` is missing:

```bash
# Create the directory if it doesn't exist
mkdir -p node_modules/@react-native-community/cli-platform-android/

# Create the file
cat > node_modules/@react-native-community/cli-platform-android/native_modules.gradle << 'EOF'
// Copyright (c) Facebook, Inc. and its affiliates.
//
// This source code is licensed under the MIT license found in the
// LICENSE file in the root directory of this source tree.

import groovy.json.JsonSlurper
import java.nio.file.Paths

def findNodeModule(projectDir, name) {
    def soLoaderSources = Paths.get(projectDir.toString(), "node_modules", name).toFile()
    if (soLoaderSources.exists()) {
        return soLoaderSources.absolutePath
    }
    // if not in the node_modules of the project, assume it's in the node_modules of the workspace
    return Paths.get(projectDir.toString(), "..", name).toFile().absolutePath
}

def applyNativeModulesSettings(settings) {
    def json = new JsonSlurper().parseText(new File(findNodeModule(settings.rootDir, "react-native"), "package.json").text)
    def reactNative = [
        name: "React",
        path: findNodeModule(settings.rootDir, "react-native")
    ]
    json.dependencies.each {
        name, version ->
            def packageJson = new File(findNodeModule(settings.rootDir, name), "package.json")
            if (packageJson.exists()) {
                def packageJsonConfig = new JsonSlurper().parseText(packageJson.text)
                if (packageJsonConfig.rnpm) {
                    def rnpm = packageJsonConfig.rnpm
                    if (rnpm.android) {
                        def android = rnpm.android
                        if (android.sourceDir) {
                            settings.include(":" + name)
                            def projectDir = new File(findNodeModule(settings.rootDir, name), android.sourceDir)
                            settings.project(":" + name).projectDir = projectDir
                        }
                    }
                }
            }
    }
}
EOF
```

---

## 🚀 The Definitive "Clean Room" Launch Sequence

### Step 1: Clean Room Setup
```powershell
# Run in PowerShell as Administrator
# Kill all ADB processes
taskkill /IM adb.exe /F

# Kill all Node.js processes
taskkill /IM node.exe /F

# Kill all Java processes
taskkill /IM java.exe /F
```

### Step 2: Start ADB Server
```powershell
# Start ADB server in no-daemon mode
adb -a nodaemon server start
```

### Step 3: Launch Backend Server
```bash
# In WSL Terminal 1
cd ~/projects/UPRISE-APP/WebApp-API
npm install
npm start
```

### Step 4: Launch Metro Bundler
```bash
# In WSL Terminal 2
cd ~/projects/UPRISE-APP
npm start
```

### Step 5: Launch Android App
```bash
# In WSL Terminal 3
cd ~/projects/UPRISE-APP
npm run android
```

### Step 6: Verify Services
```bash
# Check if services are running
netstat -tulpn | grep -E ':(3000|8081)'

# Check ADB devices
adb devices

# Check Metro bundler
curl http://localhost:8081/status
```

---

## 🔧 Troubleshooting

### Common Issues

#### Issue 1: "adb: command not found"
**Solution**: Ensure Android SDK is properly configured in `.bashrc`
```bash
echo $ANDROID_SDK_ROOT
ls $ANDROID_SDK_ROOT/platform-tools/adb
```

#### Issue 2: "JAVA_HOME is not set"
**Solution**: Verify Java installation and configuration
```bash
echo $JAVA_HOME
java -version
```

#### Issue 3: "Database connection failed"
**Solution**: Check PostgreSQL configuration and WSL IP
```bash
# Find WSL IP
ip route | grep default

# Test database connection
psql -h 172.30.112.1 -U postgres -d postgres
```

#### Issue 4: "Metro bundler not starting"
**Solution**: Clear Metro cache and restart
```bash
npx react-native start --reset-cache
```

#### Issue 5: "Android build failing"
**Solution**: Clean and rebuild
```bash
cd android
./gradlew clean
cd ..
npm run android
```

### WSL-Specific Issues

#### Issue 6: "Permission denied" errors
**Solution**: Fix file permissions
```bash
sudo chown -R $USER:$USER ~/projects/UPRISE-APP
chmod +x android/gradlew
```

#### Issue 7: "Port already in use"
**Solution**: Kill processes and restart
```bash
sudo lsof -ti:3000 | xargs kill -9
sudo lsof -ti:8081 | xargs kill -9
```

---

## ✅ Verification Checklist

### Environment Setup
- [ ] WSL2 Ubuntu installed and configured
- [ ] Node.js v16.20.2 installed via NVM
- [ ] OpenJDK 11 installed
- [ ] Android SDK accessible from WSL
- [ ] PostgreSQL configured for WSL connections

### Configuration Files
- [ ] `.bashrc` properly configured
- [ ] `WebApp-API/.env` created with correct database host
- [ ] Project root `.env` created with all endpoints
- [ ] `package.json` scripts updated (no legacy provider)
- [ ] `android/settings.gradle` fixed
- [ ] `native_modules.gradle` file exists

### Services
- [ ] Backend server starts on port 3000
- [ ] Metro bundler starts on port 8081
- [ ] ADB server running and connected
- [ ] Android emulator accessible
- [ ] Database connection working

### Application
- [ ] App builds successfully
- [ ] App installs on emulator
- [ ] Login/signup working
- [ ] Home screen loads
- [ ] API calls successful

---

## 📚 Additional Resources

- [React Native WSL Setup Guide](https://docs.microsoft.com/en-us/windows/dev-environment/javascript/react-native-on-wsl)
- [Android Studio WSL Integration](https://developer.android.com/studio/run/emulator-commandline)
- [PostgreSQL WSL Configuration](https://docs.microsoft.com/en-us/windows/wsl/tutorials/wsl-database)

---

## 🆘 Support

If you encounter issues not covered in this guide:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review the [QUICK-FIXES.md](QUICK-FIXES.md) document
3. Check the [PROJECT-STRUCTURE.md](PROJECT-STRUCTURE.md) for architecture details
4. Consult the [DEVELOPMENT-MINDSET-GUIDE.md](DEVELOPMENT-MINDSET-GUIDE.md) for debugging principles

---

**Last Updated**: January 2025  
**Environment**: Ubuntu WSL2  
**Status**: ✅ **STABLE** - All major issues resolved  
**Next Steps**: Feature development and optimization

