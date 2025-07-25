# 🌍 Environment Files Tracker - Uprise Mobile App

## 📋 **Overview**
This document tracks ALL environment-related files across the Uprise project after comprehensive cleanup and organization.

**✅ STATUS UPDATE**: All environment file visibility issues have been resolved. Template and backup files are now properly tracked and visible, while secret `.env` files remain appropriately ignored.

---

## 🗂️ **Environment Files Inventory (CLEANED & PROTECTED)**

### **1. React Native App (Main Directory)**
| File | Status | Purpose | Location | Visibility |
|------|--------|---------|----------|------------|
| `.env` | ✅ **EXISTS** | React Native environment variables | `Mobile_App-Dev/.env` | ❌ **IGNORED** (contains secrets) |
| `.env.example` | ✅ **COMPLETE** | 85+ variable template | `Mobile_App-Dev/.env.example` | ✅ **TRACKED** |
| `.env.backup` | ✅ **BACKUP** | Backup of working config | `Mobile_App-Dev/.env.backup` | ✅ **TRACKED** |

**React Native Config Path**: `Mobile_App-Dev/src/config/index.js` (line 2)
```javascript
require('dotenv').config({ path: path.resolve(__dirname, '..', '..', '.env') });
```

### **2. Backend API (Webapp_API-Develop)**
| File | Status | Purpose | Location | Visibility |
|------|--------|---------|----------|------------|
| `.env` | ✅ **EXISTS** | Backend environment variables | `Webapp_API-Develop/.env` | ❌ **IGNORED** (contains secrets) |
| `sample.env` | ✅ **COMPLETE** | Complete backend template | `Webapp_API-Develop/sample.env` | ✅ **TRACKED** |
| `.env.backup` | ✅ **BACKUP** | Backup of backend config | `Webapp_API-Develop/.env.backup` | ✅ **TRACKED** |

**Backend Config Path**: `Webapp_API-Develop/src/config/index.js` (line 2)
```javascript
require('dotenv').config({ path: path.resolve(__dirname, '..', '..', '.env') });
```

### **3. Webapp-UI (React/TypeScript Web App)**
| File | Status | Purpose | Location | Visibility |
|------|--------|---------|----------|------------|
| `.env` | ✅ **EXISTS** | Web UI environment variables | `webapp-ui/.env` | ❌ **IGNORED** (contains secrets) |
| `.env.example` | ✅ **COMPLETE** | Web UI template | `webapp-ui/.env.example` | ✅ **TRACKED** |

**Web UI Config**: Uses Vite environment variables

### **4. Legacy Angular App (ARCHIVED)**
| File | Status | Purpose | Location | Visibility |
|------|--------|---------|----------|------------|
| `.env` | ❌ **CORRUPTED** | Legacy Angular config | `legacy-angular-app/src/.env` | ❌ **ARCHIVED** |
| `config.json` | ⚠️ **OUTDATED** | Generated config | `legacy-angular-app/config.json` | ❌ **ARCHIVED** |

**Status**: ❌ **DEPRECATED** - Replaced by React/TypeScript web app

---

## 🛡️ **Protection Status**

### **✅ Files Properly Tracked (Visible)**
- `Mobile_App-Dev/.env.example` - Complete template with 85+ variables
- `Mobile_App-Dev/.env.backup` - Working configuration backup
- `Webapp_API-Develop/sample.env` - Complete backend template
- `Webapp_API-Develop/.env.backup` - Backend configuration backup
- `webapp-ui/.env.example` - Vite environment template

### **❌ Files Properly Ignored (Hidden)**
- `Mobile_App-Dev/.env` - Contains actual secrets
- `Webapp_API-Develop/.env` - Contains actual secrets
- `webapp-ui/.env` - Contains actual secrets

### **🔧 Protection Mechanisms**
- **Multi-layer .gitignore**: Explicit negation patterns prevent accidental ignoring
- **Automated scripts**: `protect-environment-files.ps1` ensures proper tracking
- **Validation tools**: `validate-gitignore.ps1` verifies protection status
- **Documentation**: Comprehensive guides for maintenance and recovery

---

## 🔧 **Required Environment Variables**

### **React Native App (`.env`)**
```env
# API URLs
BASE_URL=http://10.0.2.2:3000
SIGNUP_URL=/auth/signup
LOGIN_URL=/auth/login
VERIFY_USER=/auth/verify-user
UPDATE_PROFILE_URL=/auth/update-profile
UPDATE_ONBOARDING_STATUS_URL=/auth/update-onboarding-status

# Client Credentials
CLIENT_ID=437920819fa89d19abe380073d28839c
CLIENT_SECRET=28649120bdf32812f433f428b15ab1a1

# Other Configuration
NODE_OPTIONS=--openssl-legacy-provider
```

### **Backend API (`.env`)**
```env
# Server Configuration
PORT=3000
NODE_ENV=development

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

# Web URL
WEB_URL=http://localhost:4321
```

### **Webapp-UI (`.env`)**
```env
# Vite Environment Variables (must be prefixed with VITE_)
VITE_API_BASE_URL=http://10.0.2.2:3000
VITE_CLIENT_ID=437920819fa89d19abe380073d28839c
VITE_CLIENT_SECRET=28649120bdf32812f433f428b15ab1a1
```

---

## 🚀 **Quick Commands**

### **Setup Environment Files**
```bash
# React Native App (already exists)
# .env file is in root directory (hidden by .gitignore)

# Backend API
cp Webapp_API-Develop/sample.env Webapp_API-Develop/.env
# Then edit Webapp_API-Develop/.env with your values

# Webapp-UI (already exists)
# .env file is in webapp-ui directory (hidden by .gitignore)
```

---

## 🔍 **Common Issues & Solutions**

### **1. "Config.BASE_URL is undefined"**
**Problem**: React Native can't find environment variables
**Solution**: 
- Check if `.env` exists in `Mobile_App-Dev/` (it should)
- Restart Metro bundler: `npx react-native start --reset-cache`
- Rebuild app: `npx react-native run-android`

### **2. "You Don't Have Access" Error**
**Problem**: Backend missing client credentials
**Solution**:
- Check `Webapp_API-Develop/.env` has `CLIENT_ID` and `CLIENT_SECRET`
- Restart backend server

### **3. Web UI API Calls Failing**
**Problem**: React app can't find API
**Solution**:
- Check `webapp-ui/.env` has correct `BASE_URL`
- Restart Vite dev server

---

## 📝 **File Dependencies**

### **React Native App**
- **Primary**: `Mobile_App-Dev/.env` (hidden by .gitignore)
- **Template**: `Mobile_App-Dev/.env.example`
- **Backup**: `Mobile_App-Dev/.env.backup`
- **Used by**: `src/utilities/utilities.js` (getRequestURL function)
- **Read by**: `react-native-config` package

### **Backend API**
- **Primary**: `Webapp_API-Develop/.env` (hidden by .gitignore)
- **Template**: `Webapp_API-Develop/sample.env`
- **Backup**: `Webapp_API-Develop/.env.backup`
- **Used by**: `src/config/index.js`

### **Webapp-UI**
- **Primary**: `webapp-ui/.env` (hidden by .gitignore)
- **Template**: `webapp-ui/.env.example`
- **Used by**: Vite environment system

---

## 🎯 **Quick Reference**

| When You Need To... | Check This File |
|-------------------|-----------------|
| Fix React Native API calls | `Mobile_App-Dev/.env` (hidden) |
| Fix backend authentication | `Webapp_API-Develop/.env` (hidden) |
| Fix web UI API calls | `webapp-ui/.env` (hidden) |
| See React Native template | `Mobile_App-Dev/.env.example` |
| See backend template | `Webapp_API-Develop/sample.env` |
| See web UI template | `webapp-ui/.env.example` |

---

## 🧹 **Cleanup Summary**

### **Files Removed:**
- ❌ `Mobile_App-Dev/.env.dev` - Confusing development file
- ❌ `Webapp_API-Develop/.env.dev` - Misplaced frontend variables
- ❌ `Webapp_UI-Develop/` - Empty directory (removed)

### **Files Archived:**
- 📦 `legacy-angular-app/` - Legacy Angular app (moved to archive)

### **Files Updated:**
- ✅ `Webapp_API-Develop/sample.env` - Now complete backend template
- ✅ `ENVIRONMENT-FILES-TRACKER.md` - Updated documentation
- ✅ `legacy-angular-app/README.md` - Added archive documentation

### **Files Preserved:**
- ✅ `Mobile_App-Dev/.env` - Main React Native config (hidden)
- ✅ `Mobile_App-Dev/.env.example` - Complete template
- ✅ `Mobile_App-Dev/.env.backup` - Backup file
- ✅ `Webapp_API-Develop/.env` - Backend config (hidden)
- ✅ `Webapp_API-Develop/.env.backup` - Backend backup
- ✅ `webapp-ui/.env` - Web UI config (hidden)
- ✅ `webapp-ui/.env.example` - Web UI template

---

## 📞 **Last Updated**
- **Date**: January 2025
- **Status**: ✅ **CLEANED** - All environment files organized and documented
- **Next Action**: All environment files are properly configured and ready for development 