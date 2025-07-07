# 🚀 Quick Fixes - Uprise Mobile App

## 🚨 **Most Common Issues & Immediate Solutions**

### **1. Login Not Working (Frontend Unresponsive)**
**Symptom**: Login button does nothing, no network requests
**Quick Fix**: 
```powershell
# Check if LOGIN_URL is in .env file
notepad .env
# Add this line if missing:
LOGIN_URL=/auth/login
```

### **2. Signup "You Don't Have Access" Error**
**Symptom**: 400 error with "you dont have access" message
**Quick Fix**:
```powershell
# Restart backend with environment variables
.\stop-services.ps1
.\start-all.ps1
```

### **3. Port Already in Use Errors**
**Symptom**: `EADDRINUSE: address already in use :::3000` or `:8081`
**Quick Fix**:
```powershell
.\stop-services.ps1
.\start-all.ps1
```

### **4. PowerShell Syntax Errors**
**Symptom**: `&&` not recognized, parser errors
**Quick Fix**: Use helper scripts instead of manual commands
```powershell
# Instead of: cd Webapp_API-Develop && npm start
# Use:
.\start-backend.ps1
```

### **5. API 404 Errors**
**Symptom**: Requests going to wrong URLs like `http://10.0.2.2:3000undefined`
**Quick Fix**: Check `.env` file has correct URLs
```env
BASE_URL=http://10.0.2.2:3000
SIGNUP_URL=/auth/signup
LOGIN_URL=/auth/login
```

### **6. Email Verification Not Working**
**Symptom**: "API key does not start with 'SG.'" in backend logs
**Quick Fix**: This is expected - SendGrid not configured. User accounts are created but emails won't be sent.

---

## 🔧 **Essential Commands**

### **Start Everything**
```powershell
.\start-all.ps1
```

### **Stop Everything**
```powershell
.\stop-services.ps1
```

### **Check What's Running**
```powershell
netstat -ano | findstr ":3000\|:8081"
```

### **Rebuild App After Changes**
```powershell

```

---

## 📁 **Key Files to Remember**

| Purpose | File Path |
|---------|-----------|
| Environment Variables | `.env` |
| Login Service | `src/services/login/login.service.js` |
| Signup Service | `src/services/signup/signup.service.js` |
| URL Builder | `src/utilities/utilities.js` |
| Backend Config | `Webapp_API-Develop/src/config/index.js` |
| Backend Entry | `Webapp_API-Develop/src/index.js` |

---

## 🎯 **Environment Variables Checklist**

### **React Native App (`.env`)**
- [ ] `BASE_URL=http://10.0.2.2:3000`
- [ ] `SIGNUP_URL=/auth/signup`
- [ ] `LOGIN_URL=/auth/login`
- [ ] `CLIENT_ID=437920819fa89d19abe380073d28839c`
- [ ] `CLIENT_SECRET=28649120bdf32812f433f428b15ab1a1`

### **Backend Server (Environment Variables)**
- [ ] `CLIENT_ID=437920819fa89d19abe380073d28839c`
- [ ] `CLIENT_SECRET=28649120bdf32812f433f428b15ab1a1`
- [ ] `PORT=3000`

---

## 🚀 **Development Workflow**

1. **Start Services**: `.\start-all.ps1`
2. **Make Changes**: Edit files as needed
3. **Test**: Use app in emulator
4. **If Issues**: Check this quick fixes guide
5. **Stop Services**: `.\stop-services.ps1` when done

---

## 📞 **When to Check Backend Logs**

- Signup/login not working
- "You don't have access" errors
- 404 errors
- Database connection issues

**Backend logs show**: Client authentication, request URLs, database queries, email service status 