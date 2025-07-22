# Uprise Mobile App - Project Structure & Key Files

> **🧠 Development Mindset:** Always trace the full user journey and consider edge cases. See `DEVELOPMENT-MINDSET-GUIDE.md` for critical thinking principles.

## 🏗️ **Project Overview**
- **React Native App**: Main mobile application
- **Backend API**: Node.js server in `Webapp_API-Develop/`
- **Web UI**: Angular app in `Webapp_UI-Develop/`
- **Webapp-UI**: React/TypeScript web app in `webapp-ui/` ✅ **NEW**

---

## 📱 **React Native App (Main Directory)**

### **Environment Configuration**
- **`.env`** - Environment variables for API URLs and client credentials
- **`babel.config.js`** - Babel configuration
- **`app.json`** - React Native app configuration
- **`App.js`** - Main app entry point

### **Key Directories**

#### **`src/services/`** - API Services
- **`login/login.service.js`** - Login API calls
- **`signup/signup.service.js`** - Signup API calls
- **`request/request.service.js`** - Base HTTP request service
- **`constants/Constants.js`** - API constants (GET, POST, etc.)
- **`googlePlaces/googlePlaces.service.js`** - Google Places API integration ⭐ **NEW**

#### **`src/utilities/`** - Utility Functions
- **`utilities.js`** - Contains `getRequestURL()` function for building API URLs
- **`networkUtils.js`** - Network utility functions
- **`TokenService.js`** - Token management

#### **`src/screens/`** - UI Screens
- **`Login/`** - Login screen components
- **`Signup/`** - Signup screen components
- **`WelcomeScreen/`** - Welcome/onboarding screens

#### **`src/state/`** - State Management (Redux)
- **`actions/`** - Redux actions
- **`reducers/`** - Redux reducers
- **`sagas/`** - Redux-Saga middleware
- **`store/`** - Redux store configuration

#### **`src/components/`** - Reusable Components
- **`Applebtn/`** - Apple sign-in button
- **`Googlebtn/`** - Google sign-in button
- **`URTextfield/`** - Custom text input component

---

## 🌐 **Webapp-UI (React/TypeScript Web App)**

### **Project Location**
- **Directory**: `webapp-ui/`
- **Status**: ✅ Fully initialized and tracked in version control
- **Framework**: React + TypeScript + Vite

### **Key Files**
- **`.env.example`** - Complete environment template (85+ variables)
- **`package.json`** - Dependencies and scripts
- **`vite.config.ts`** - Vite configuration
- **`src/`** - Source code directory

### **Environment Configuration**
```env
# Main API URL for the backend server
VITE_API_BASE_URL=http://10.0.2.2:3000
# Plus 85+ additional environment variables from template
```

### **Setup Instructions**
1. Copy `webapp-ui/.env.example` to `webapp-ui/.env`
2. Configure environment variables with actual values
3. Run `npm install` to install dependencies
4. Run `npm run dev` to start development server

---

## 🔧 **Backend API (`Webapp_API-Develop/`)**

### **Key Files**
- **`src/index.js`** - Main server entry point
- **`src/config/index.js`** - Environment configuration and client authentication
- **`src/routes/auth.js`** - Authentication routes (signup, login, etc.) ✅ **ARTIST UNIFICATION COMPLETE**
- **`src/routes/user.js`** - User profile and artist management ✅ **ARTIST UNIFICATION COMPLETE**
- **`src/routes/band.js`** - Legacy band routes (⚠️ **DEPRECATED**)
- **`src/routes/home.js`** - Home feed and community content ✅ **Location filtering working**
- **`src/routes/discovery.js`** - Discovery content ✅ **Location filtering working**
- **`src/routes/radio.js`** - Radio system with tier-based filtering
- **`src/routes/statistics.js`** - Statistics with proper location filtering
- **`src/utils/fairPlayAlgorithm.js`** - Fair Play algorithm for song selection
- **`src/database/models/artistprofile.js`** - Unified ArtistProfile model ✅ **NEW**
- **`src/database/migrations/20241202000002-unify-bands-into-artist-profiles.js`** - Artist unification migration ✅ **NEW**
- **`package.json`** - Backend dependencies and scripts

### **Location Filtering System** ✅ **RESOLVED**
The backend location filtering has been implemented and tested:
- **✅ Working**: Events, Promos, Statistics, Radio endpoints
- **✅ Working**: Home feed, Discovery endpoints (recently fixed)
- **✅ Impact**: Users now see local community content as intended

**See**: `BACKEND-FORENSIC-ANALYSIS.md` for complete implementation details

### **Artist Unification System** ✅ **COMPLETE**
The backend artist unification has been fully implemented:
- **✅ Database Migration**: ArtistProfiles table created with 48 records migrated
- **✅ Model Refactoring**: New ArtistProfile model with User associations
- **✅ API Endpoint Refactoring**: All endpoints use unified ArtistProfile model
- **✅ Signup Integration**: New artists create ArtistProfile records
- **✅ Profile Management**: Unified artist profile management endpoints
- **✅ Backward Compatibility**: Legacy Band model preserved during transition

**See**: `ARTIST-UNIFICATION-IMPLEMENTATION.md` for complete implementation details

### **Environment Variables Needed**
```bash
# Server Configuration
PORT=3000

# Database Configuration
DB_HOST=localhost
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=postgres
DB_PORT=5432

# JWT Configuration (Required for authentication)
JWT_ACCESS_TOKEN_SECRET=uprise_access_token_secret_key_2024
JWT_REFRESH_TOKEN_SECRET=uprise_refresh_token_secret_key_2024
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Client Authentication
CLIENT_ID=437920819fa89d19abe380073d28839c
CLIENT_SECRET=28649120bdf32812f433f428b15ab1a1
```

---

## 🚀 **Development Scripts**

### **PowerShell Scripts (Root Directory)**
- **`start-all.ps1`** - Start both backend and Metro bundler
- **`start-backend.ps1`** - Start backend server only
- **`start-metro.ps1`** - Start Metro bundler only
- **`stop-services.ps1`** - Stop all services and free ports

---

## 🔍 **Common Issues & Solutions**

### **1. Login Not Working**
**Problem**: Login requests going to `http://10.0.2.2:3000undefined`
**Solution**: Add `LOGIN_URL=/auth/login` to `.env` file

### **2. Signup Not Working**
**Problem**: "you dont have access" error
**Solution**: Set `CLIENT_ID` and `CLIENT_SECRET` in backend environment

### **3. Port Already in Use**
**Problem**: `EADDRINUSE` errors
**Solution**: Run `.\stop-services.ps1` then `.\start-all.ps1`

### **4. PowerShell Syntax Errors**
**Problem**: `&&` not working in PowerShell
**Solution**: Use `;` instead or use the helper scripts

---

## 📋 **Quick Reference Commands**

### **Start Development Environment**
```powershell
.\start-all.ps1
```

### **Stop All Services**
```powershell
.\stop-services.ps1
```

### **Check Running Services**
```powershell
netstat -ano | findstr ":3000\|:8081"
```

### **Rebuild Android App**
```powershell
cd android; ./gradlew clean; cd ..; npx react-native run-android
```

---

## 🔧 **Environment Variables Reference**

### **React Native App (`.env`)**
```env
BASE_URL=http://10.0.2.2:3000
SIGNUP_URL=/auth/signup
LOGIN_URL=/auth/login
GET_USER_DETAILS_URL=/user/me
CLIENT_ID=437920819fa89d19abe380073d28839c
CLIENT_SECRET=28649120bdf32812f433f428b15ab1a1

# Google Places API Integration
GOOGLE_PLACES_API_KEY=AIzaSyDmEqT-zOSEIP_YlvyZQUAVd7SRlQvmH2g
GOOGLE_PLACES_AUTOCOMPLETE_URL=https://places.googleapis.com/v1/places:autocomplete

# Statistics Endpoints (Fixed - Updated to /popular/...)
GET_RADIO_STATIONS_STATISTICS=/popular/radio_stations
GET_POPULAR_ARTIST_STATISTICS=/popular/artist
GET_GENRES_PREFRENCE_STATISTICS=/popular/genres
GET_EVENTS_STATISTICS=/popular/events
GET_BANDS_STATISTICS=/popular/bands
GET_POPULAR_ARTIST_GENRES_STATISTICS=/popular/artist_per_genre
GET_USERS_STATISTICS=/popular/users
```

### **Backend Server (Environment Variables)**
```bash
CLIENT_ID=437920819fa89d19abe380073d28839c
CLIENT_SECRET=28649120bdf32812f433f428b15ab1a1
PORT=3000
```

---

## 🎯 **Key Functions to Remember**

### **`getRequestURL()` in `src/utilities/utilities.js`**
- Builds complete API URLs by combining `BASE_URL` + endpoint
- Used by all service files

### **`request()` in `src/services/request/request.service.js`**
- Base HTTP request function
- Handles headers, authentication, and error handling

### **Client Authentication in `Webapp_API-Develop/src/config/index.js`**
- Validates `client-id` and `client-secret` headers
- Required for all API requests

---

## 📝 **File Modification Checklist**

When making changes, remember to:

1. **Update `.env`** - If changing API URLs or credentials
2. **Restart Backend** - If changing backend environment variables
3. **Restart Metro** - If changing React Native code
4. **Rebuild App** - If changing native dependencies
5. **Clear Cache** - If experiencing strange behavior

---

## 🆘 **Troubleshooting Quick Guide**

| Issue | Check This File | Common Solution |
|-------|----------------|-----------------|
| Login not working | `src/services/login/login.service.js` | Add `LOGIN_URL` to `.env` |
| Signup not working | `Webapp_API-Develop/src/config/index.js` | Set backend environment variables |
| API 404 errors | `src/utilities/utilities.js` | Check `BASE_URL` in `.env` |
| Port conflicts | `stop-services.ps1` | Run script to free ports |
| Build errors | `babel.config.js` | Check Babel configuration | 