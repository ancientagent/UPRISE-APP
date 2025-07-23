# Redux Store Troubleshooting Guide - Uprise Mobile App

> **📋 Technical Documentation**: Complete guide for resolving Redux store initialization issues in React Native applications.

## 🎯 **Problem Summary**

**Issue**: Uprise mobile app experiencing critical startup failures with Redux store initialization
**Impact**: App crashes on startup, preventing any user interaction
**Resolution Time**: Multi-phase diagnostic and fix process
**Status**: ✅ **RESOLVED** - Complete solution implemented

---

## 🚨 **Initial Symptoms**

### **Primary Error Messages**
```
ERROR  TypeError: undefined is not a function, js engine: hermes
ERROR  Invariant Violation: Module AppRegistry is not a registered callable module
```

### **Behavioral Symptoms**
- App hangs on title screen indefinitely
- No Redux store console logs appear
- Metro bundler shows successful bundle but app fails to launch
- Authentication flow completely broken

---

## 🔍 **Diagnostic Process**

### **Phase 1: Entry Point Isolation**
**Goal**: Determine if issue is in `index.js` or `App.js`

**Approach**: Created minimal "Hello World" components
```javascript
// index.js diagnostic
import React from 'react';
import { AppRegistry, Text, View, StyleSheet } from 'react-native';
import { name as appName } from './app.json';

const App = () => (
  <View style={styles.container}>
    <Text style={styles.text}>INDEX.JS DIAGNOSTIC</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' },
  text: { color: 'white', fontSize: 20 },
});

AppRegistry.registerComponent(appName, () => App);
```

**Result**: ✅ Entry point working correctly

### **Phase 2: Redux Store Import Testing**
**Goal**: Isolate Redux store as the source of the problem

**Approach**: Created diagnostic component testing store import
```javascript
// App.js diagnostic
let storeStatus = 'Testing...';
let storeError = null;

try {
  console.log('--- TEST: Attempting to import Redux store ---');
  const { store, storePersistor } = require('./src/state/store');
  
  if (store && storePersistor) {
    storeStatus = 'SUCCESS: Redux store loaded';
  } else {
    storeStatus = 'ERROR: Store objects undefined';
  }
} catch (error) {
  storeError = error.message;
  storeStatus = `ERROR: ${error.message}`;
}
```

**Result**: ❌ Redux store import failing with "undefined is not a function"

### **Phase 3: Dependency Isolation**
**Goal**: Identify which specific dependency is causing the function error

**Approach**: Tested each Redux dependency individually
```javascript
// Test each import individually
testImport('redux');
testImport('react-native-offline');
testImport('redux-persist');
testImport('AsyncStorage');
testImport('redux-saga');
testImport('redux-devtools-extension');
testImport('rootReducer');
testImport('migrations');
testImport('rootSaga');
testImport('persistKeys');
```

**Result**: ✅ All core dependencies working correctly

### **Phase 4: Saga Import Testing**
**Goal**: Identify which specific saga is causing the issue

**Approach**: Tested rootSaga import specifically
```javascript
try {
  console.log('--- TEST: Attempting to import rootSaga...');
  const rootSaga = require('./src/state/sagas/rootSaga');
  
  if (typeof rootSaga.default === 'function') {
    console.log('--- TEST: rootSaga.default is a function');
  }
} catch (error) {
  console.log('--- TEST: rootSaga import failed:', error.message);
}
```

**Result**: ❌ rootSaga import failing with "undefined is not a function"

### **Phase 5: Saga Batch Testing**
**Goal**: Identify which specific saga is problematic

**Approach**: Added sagas in batches to isolate the issue
1. **Minimal Set**: Basic sagas only
2. **Core Set**: Authentication and user management sagas
3. **Full Set**: All sagas including statistics and analytics

**Result**: Issue identified in statistics/analytics sagas batch

---

## 🛠️ **Root Cause Analysis**

### **Primary Issue: Circular Dependencies**
**Problem**: Reducers importing sagas, creating initialization loops
```javascript
// PROBLEMATIC: src/state/reducers/index.js
import { reduxHelpers } from '../store/reduxHelpers';
import { unRegisterDeviceTokenSagaAction } from '../actions/sagas';
```

**Impact**: Redux store initialization hangs before any logs appear

### **Secondary Issue: Incorrect Import Path**
**Problem**: `artistProfile.actions.js` importing from wrong path
```javascript
// PROBLEMATIC: src/state/actions/request/artistProfile/artistProfile.actions.js
import { createRequestResponseActionTypeSet } from '../../../types/listener/listener';
```

**Impact**: Function `createRequestResponseActionTypeSet` undefined, causing runtime error

---

## ✅ **Complete Solution**

### **1. Separated Reducers and Sagas**

**Before**: Mixed concerns in `src/state/reducers/index.js`
```javascript
// OLD: Mixed reducers and sagas
import { reduxHelpers } from '../store/reduxHelpers';
import { unRegisterDeviceTokenSagaAction } from '../actions/sagas';

const rootReducer = (state, action) => {
  if (action.type === SIGN_OUT) {
    // Saga logic mixed with reducer logic
    yield call(unRegisterDeviceTokenSagaAction);
  }
  return appReducer(state, action);
};
```

**After**: Clean separation of concerns
```javascript
// NEW: Pure reducer logic only
const rootReducer = (state, action) => {
  if (action.type === SIGN_OUT) {
    // Pure reducer logic only
    TrackPlayer.stop();
    AsyncStorage.removeItem('persist:root');
    GoogleSignin.revokeAccess();
    return appReducer(initialState, { type: '' });
  }
  return appReducer(state, action);
};
```

### **2. Created Dedicated Root Saga**

**New File**: `src/state/sagas/rootSaga.js`
```javascript
import { all, fork } from 'redux-saga/effects';
import { networkSaga } from 'react-native-offline';
import sampleWatcherSaga from './samplerequest/samplerequest.saga';
// ... all saga imports

export default function* rootSaga() {
  yield all([
    fork(networkSaga, { pingInterval: 20000 }),
    sampleWatcherSaga(),
    // ... all saga calls
  ]);
}
```

### **3. Fixed Import Path**

**Before**: Incorrect import path
```javascript
// WRONG: src/state/actions/request/artistProfile/artistProfile.actions.js
import { createRequestResponseActionTypeSet } from '../../../types/listener/listener';
```

**After**: Correct import path
```javascript
// CORRECT: src/state/actions/request/artistProfile/artistProfile.actions.js
import { createRequestResponseActionTypeSet } from '../../../types/generic/requestResponse.types';
```

### **4. Updated Store Configuration**

**Updated**: `src/state/store/ReduxStoreManager.js`
```javascript
// OLD: Using mixed saga approach
import initialSaga from '../sagas';

// NEW: Using dedicated root saga
import rootSaga from '../sagas/rootSaga';

// In constructor
sagaMiddleware.run(rootSaga); // Updated to use rootSaga
```

---

## 📊 **Verification Results**

### **Before Fix**
```
ERROR  TypeError: undefined is not a function, js engine: hermes
ERROR  Invariant Violation: Module AppRegistry is not a registered callable module
```

### **After Fix**
```
LOG  --- REDUX STORE: Starting store index.js initialization ---
LOG  --- REDUX STORE: Starting ReduxStoreManager constructor ---
LOG  --- REDUX STORE: Creating saga middleware ---
LOG  --- REDUX STORE: Saga middleware created successfully ---
LOG  --- REDUX STORE: Creating network middleware ---
LOG  --- REDUX STORE: Network middleware created successfully ---
LOG  --- REDUX STORE: Setting up persist configuration ---
LOG  --- REDUX STORE: Persist configuration created successfully ---
LOG  --- REDUX STORE: Creating store with middleware ---
LOG  --- REDUX STORE: Store with middleware created successfully ---
LOG  --- REDUX STORE: Creating persisted root reducer ---
LOG  --- REDUX STORE: Persisted root reducer created successfully ---
LOG  --- REDUX STORE: Starting store creation ---
LOG  --- REDUX STORE: Store creation COMPLETE ---
LOG  --- REDUX PERSIST: Starting persistence ---
LOG  --- REDUX PERSIST: Persistence COMPLETE ---
LOG  --- REDUX SAGA: Starting root saga ---
LOG  --- REDUX SAGA: Root saga started successfully ---
LOG  --- REDUX STORE: ReduxStoreManager constructor COMPLETE ---
LOG  --- AUTH LOADING: Starting auth check ---
LOG  --- AUTH LOADING: No token, navigating to WelcomeScreen ---
```

---

## 🛡️ **Prevention Measures**

### **1. Import Path Validation**
- Always verify import paths exist before using
- Use absolute imports where possible
- Create import path constants for shared utilities

### **2. Architecture Best Practices**
- Keep reducers pure (no side effects)
- Separate saga logic from reducer logic
- Use dedicated files for different concerns

### **3. Development Workflow**
- Test Redux store initialization with minimal components
- Use comprehensive logging during development
- Implement step-by-step testing for complex issues

### **4. Code Review Checklist**
- [ ] No circular dependencies between modules
- [ ] Import paths are correct and verified
- [ ] Reducers contain only pure functions
- [ ] Sagas are properly organized and imported

---

## 📁 **Files Modified**

| File | Change Type | Description |
|------|-------------|-------------|
| `src/state/reducers/index.js` | Refactor | Removed saga imports, simplified reducer logic |
| `src/state/sagas/rootSaga.js` | New | Created dedicated root saga file |
| `src/state/store/ReduxStoreManager.js` | Update | Updated to use new rootSaga |
| `src/state/actions/request/artistProfile/artistProfile.actions.js` | Fix | Corrected import path |
| `App.js` | Refactor | Improved service initialization |

---

## 🎯 **Lessons Learned**

### **1. Systematic Approach**
- Step-by-step isolation is crucial for complex issues
- Start with minimal components and build up
- Test each dependency individually

### **2. Architecture Matters**
- Circular dependencies are a common source of initialization issues
- Clear separation of concerns prevents complex debugging
- Proper import organization saves significant time

### **3. Logging is Essential**
- Comprehensive logging helps identify exact failure points
- Console logs provide crucial debugging information
- Structured logging makes issues easier to track

### **4. Redux Best Practices**
- Keep reducers pure and side-effect free
- Organize sagas in dedicated files
- Use proper import paths for shared utilities

---

## 🔗 **Related Documentation**

- [QUICK-FIXES.md](./QUICK-FIXES.md) - Quick reference for common issues
- [PROJECT-STRUCTURE.md](./PROJECT-STRUCTURE.md) - Project architecture overview
- [DEVELOPMENT-MINDSET-GUIDE.md](./DEVELOPMENT-MINDSET-GUIDE.md) - Development best practices

---

**Last Updated**: December 2024  
**Status**: ✅ Resolved  
**Impact**: Critical - App startup functionality restored 