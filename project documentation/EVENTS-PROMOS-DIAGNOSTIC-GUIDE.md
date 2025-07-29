# 🔍 Events & Promos Tabs Diagnostic Guide

## 📋 **Issue Summary**
The Events and Promos tabs on the mobile app's dashboard are not displaying content. This guide provides comprehensive logging and troubleshooting steps to diagnose and resolve the issue.

---

## ✅ **Enhanced Logging Implementation**

### **1. Saga Files Enhanced**
**Files Modified:**
- `src/state/sagas/homeEvents/homeEvents.saga.js`
- `src/state/sagas/homePromos/homePromos.saga.js`

**Added Logging:**
- Saga initialization and execution flow
- User data retrieval (token, location, preferences)
- Location resolution logic
- API payload preparation
- Response handling and error details
- Redux action dispatching

### **2. Service Files Enhanced**
**Files Modified:**
- `src/services/homeEvents/homeEvents.service.js`
- `src/services/homePromos/homePromos.service.js`

**Added Logging:**
- Environment variable values
- API request configuration
- Full URL construction
- Response status and data
- Error handling with detailed information

### **3. Component Files Enhanced**
**Files Modified:**
- `src/screens/Event/Event.js`
- `src/screens/Promos/Promos.js`

**Added Logging:**
- Component lifecycle events
- Redux state details
- Data type and structure validation
- Loading state tracking
- Render decision logic

---

## 🔍 **Diagnostic Steps**

### **Step 1: Run the App and Check Logs**
1. Start the backend server: `.\start-backend.ps1`
2. Start Metro bundler: `.\start-metro.ps1`
3. Open the React Native app
4. Navigate to the Events or Promos tab
5. Check the console logs for detailed debugging information

### **Step 2: Look for Key Log Entries**
When you navigate to Events/Promos tabs, look for these log entries:

```
--- EVENTS SAGA: Starting homeEventsWorkerSaga ---
--- EVENTS SAGA: User data retrieved ---
--- EVENTS SAGA: API payload prepared ---
--- HOME EVENTS SERVICE: Starting API request ---
--- HOME EVENTS SERVICE: Config.HOME_EVENTS ---
--- HOME EVENTS SERVICE: Full URL ---
--- EVENTS COMPONENT: Component rendered ---
--- EVENTS COMPONENT: EventData from Redux ---
```

### **Step 3: Common Issues to Check**

#### **A. Environment Variables**
- ✅ All required variables are present (confirmed by diagnostic script)
- Check if `HOME_EVENTS` and `HOME_PROMOS` point to correct endpoints
- Verify `BASE_URL` is set to `http://10.0.2.2:3000`

#### **B. Authentication Issues**
- Check if user has valid JWT token
- Verify token is being passed in API requests
- Look for 401/403 errors in logs

#### **C. Location/State Issues**
- Check if user has location preferences set
- Verify the `state` parameter being sent to API
- Look for location resolution in saga logs

#### **D. Backend Issues**
- Verify backend server is running on port 3000
- Check if `/home/events` and `/home/promos` endpoints exist
- Verify backend routes are working correctly

---

## 🚨 **Common Error Patterns**

### **1. "Config.HOME_EVENTS is undefined"**
**Cause:** Environment variable not loaded
**Solution:** Restart Metro bundler after .env changes

### **2. "401 Unauthorized"**
**Cause:** Invalid or missing JWT token
**Solution:** Re-login user or refresh token

### **3. "404 Not Found"**
**Cause:** Incorrect API endpoint
**Solution:** Check environment variable configuration

### **4. "Response is null"**
**Cause:** API call failed or returned null
**Solution:** Check backend logs and API response

### **5. "EventData is empty array"**
**Cause:** No data returned from API
**Solution:** Check backend data and location filtering

---

## 🔧 **Troubleshooting Commands**

### **Check Environment Variables**
```bash
node diagnose-events-promos.js
```

### **Check Backend Status**
```bash
curl -X GET "http://10.0.2.2:3000/home/events" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "client-id: 437920819fa89d19abe380073d28839c" \
  -H "client-secret: 28649120bdf32812f433f428b15ab1a1"
```

### **Check Metro Logs**
```bash
npx react-native log-android
```

### **Restart Services**
```bash
.\stop-services.ps1
.\start-all.ps1
```

---

## 📊 **Expected Log Flow**

### **Successful Flow:**
```
1. Component mounts → dispatches saga action
2. Saga starts → retrieves user data
3. Saga prepares payload → calls service
4. Service makes API request → receives response
5. Saga dispatches success action → updates Redux
6. Component receives data → renders content
```

### **Failed Flow Indicators:**
```
- "Config.HOME_EVENTS is undefined" → Environment issue
- "401 Unauthorized" → Authentication issue
- "404 Not Found" → Endpoint issue
- "Response is null" → API issue
- "EventData is empty" → Data issue
```

---

## 🎯 **Backend Endpoints**

### **Expected Endpoints:**
- `GET /home/events` - Returns events for user location
- `GET /home/promos` - Returns promotions for user location

### **Required Headers:**
- `Authorization: Bearer <JWT_TOKEN>`
- `client-id: 437920819fa89d19abe380073d28839c`
- `client-secret: 28649120bdf32812f433f428b15ab1a1`

### **Location Filtering:**
- Events and promos are filtered by user's station preference
- User must have location preferences set during onboarding

---

## 📝 **Debugging Checklist**

- [ ] Backend server running on port 3000
- [ ] Metro bundler running on port 8081
- [ ] User is logged in with valid token
- [ ] User has location preferences set
- [ ] Environment variables are loaded
- [ ] API endpoints are accessible
- [ ] Backend routes are working
- [ ] Data exists in database
- [ ] Location filtering is working

---

## 🆘 **Getting Help**

1. **Check Console Logs:** Look for detailed logging messages
2. **Run Diagnostic Script:** `node diagnose-events-promos.js`
3. **Check Backend Logs:** Look for API request/response details
4. **Verify Environment:** Ensure all variables are set correctly
5. **Test API Endpoints:** Use Postman or curl to test directly

---

## 📞 **Next Steps**

1. **Run the app** and navigate to Events/Promos tabs
2. **Check console logs** for the enhanced debugging information
3. **Identify the specific issue** based on log patterns
4. **Apply the appropriate fix** from the troubleshooting guide
5. **Verify the solution** by checking if content appears

The enhanced logging will provide detailed information about exactly where the issue occurs in the data flow, making it much easier to diagnose and fix the problem. 