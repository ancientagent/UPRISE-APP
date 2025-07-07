# 🌍 Environment Files Tracker - Uprise Mobile App

## 📋 **Overview**
This document tracks ALL environment-related files across the Uprise project to avoid confusion and repeated searches.

---

## 🗂️ **Environment Files Inventory**

### **1. React Native App (Main Directory)**
| File | Status | Purpose | Location |
|------|--------|---------|----------|
| `.env` | ❌ **MISSING** | React Native environment variables | `Mobile_App-Dev/.env` |
| `.env.dev` | ❓ **UNKNOWN** | Development environment variables | `Mobile_App-Dev/.env.dev` |
| `.env.prod` | ❓ **UNKNOWN** | Production environment variables | `Mobile_App-Dev/.env.prod` |

**React Native Config Path**: `Mobile_App-Dev/src/config/index.js` (line 2)
```javascript
require('dotenv').config({ path: path.resolve(__dirname, '..', '..', '.env') });
```

### **2. Backend API (Webapp_API-Develop)**
| File | Status | Purpose | Location |
|------|--------|---------|----------|
| `.env` | ❌ **MISSING** | Backend environment variables | `Webapp_API-Develop/.env` |
| `sample.env` | ✅ **EXISTS** | Template for backend env vars | `Webapp_API-Develop/sample.env` |

**Backend Config Path**: `Webapp_API-Develop/src/config/index.js` (line 2)
```javascript
require('dotenv').config({ path: path.resolve(__dirname, '..', '..', '.env') });
```

### **3. Web UI (Webapp_UI-Develop)**
| File | Status | Purpose | Location |
|------|--------|---------|----------|
| `.env` | ❌ **MISSING** | Angular environment variables | `Webapp_UI-Develop/.env` |
| `config.json` | ✅ **EXISTS** | Generated config from .env | `Webapp_UI-Develop/config.json` |

**Web UI Config Generation**: `Webapp_UI-Develop/scripts/generateConfig.js`

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
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
DB_PORT=5432

# JWT Configuration
JWT_ACCESS_TOKEN_SECRET=your_access_token_secret
JWT_REFRESH_TOKEN_SECRET=your_refresh_token_secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Client Authentication
CLIENT_ID=437920819fa89d19abe380073d28839c
CLIENT_SECRET=28649120bdf32812f433f428b15ab1a1

# Email Configuration (SendGrid)
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FALLBACK_EMAIL=your_email@domain.com
ADMIN_MAIL=admin@domain.com

# AWS Configuration (if using)
AWS_ACCESS_KEY=your_aws_access_key
AWS_SECRET_KEY=your_aws_secret_key
AWS_REGION=us-east-1
AWS_BUCKET_NAME=your_bucket_name
AWS_S3_ENDPOINT=your_s3_endpoint
CLOUD_FRONT_ENDPOINT=your_cloudfront_endpoint

# Web URL
WEB_URL=http://localhost:4321
```

### **Web UI (`.env`)**
```env
# API Configuration
API_URL=http://localhost:3000
CLIENT_ID=437920819fa89d19abe380073d28839c
CLIENT_SECRET=28649120bdf32812f433f428b15ab1a1
GOOGLE_API_KEY=your_google_api_key
```

---

## 🚀 **Quick Commands**

### **Create Missing Environment Files**
```bash
# React Native App
echo "BASE_URL=http://10.0.2.2:3000" > .env
echo "SIGNUP_URL=/auth/signup" >> .env
echo "LOGIN_URL=/auth/login" >> .env
echo "CLIENT_ID=437920819fa89d19abe380073d28839c" >> .env
echo "CLIENT_SECRET=28649120bdf32812f433f428b15ab1a1" >> .env

# Backend API
cp Webapp_API-Develop/sample.env Webapp_API-Develop/.env
# Then edit Webapp_API-Develop/.env with your values

# Web UI
echo "API_URL=http://localhost:3000" > Webapp_UI-Develop/.env
echo "CLIENT_ID=437920819fa89d19abe380073d28839c" >> Webapp_UI-Develop/.env
echo "CLIENT_SECRET=28649120bdf32812f433f428b15ab1a1" >> Webapp_UI-Develop/.env
```

### **Generate Web UI Config**
```bash
cd Webapp_UI-Develop
npm run config
```

---

## 🔍 **Common Issues & Solutions**

### **1. "Config.BASE_URL is undefined"**
**Problem**: React Native can't find environment variables
**Solution**: 
- Check if `.env` exists in `Mobile_App-Dev/`
- Restart Metro bundler: `npx react-native start --reset-cache`
- Rebuild app: `npx react-native run-android`

### **2. "You don't have access" Error**
**Problem**: Backend missing client credentials
**Solution**:
- Check `Webapp_API-Develop/.env` has `CLIENT_ID` and `CLIENT_SECRET`
- Restart backend server

### **3. Web UI API Calls Failing**
**Problem**: Angular app can't find API
**Solution**:
- Check `Webapp_UI-Develop/.env` has `API_URL`
- Run `npm run config` to regenerate `config.json`
- Restart Angular dev server

---

## 📝 **File Dependencies**

### **React Native App**
- **Primary**: `Mobile_App-Dev/.env`
- **Used by**: `src/utilities/utilities.js` (getRequestURL function)
- **Read by**: `react-native-config` package

### **Backend API**
- **Primary**: `Webapp_API-Develop/.env`
- **Template**: `Webapp_API-Develop/sample.env`
- **Used by**: `src/config/index.js`

### **Web UI**
- **Primary**: `Webapp_UI-Develop/.env`
- **Generated**: `Webapp_UI-Develop/config.json`
- **Generator**: `Webapp_UI-Develop/scripts/generateConfig.js`

---

## 🎯 **Quick Reference**

| When You Need To... | Check This File |
|-------------------|-----------------|
| Fix React Native API calls | `Mobile_App-Dev/.env` |
| Fix backend authentication | `Webapp_API-Develop/.env` |
| Fix web UI API calls | `Webapp_UI-Develop/.env` |
| See backend env template | `Webapp_API-Develop/sample.env` |
| See web UI config | `Webapp_UI-Develop/config.json` |

---

## 📞 **Last Updated**
- **Date**: Current session
- **Status**: Environment files need to be created
- **Next Action**: Create missing `.env` files for all three components 