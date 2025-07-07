# Troubleshooting Reference - React Native Module Resolution Issues

## Overview
This document outlines critical module resolution errors encountered during React Native development and their solutions.

---

## Issue 1: Missing AlertUtility Module

### **Error Pattern**
```
Unable to resolve module ../state/sagas/AlertUtility from [file_path]
None of these files exist:
* src\state\sagas\AlertUtility(.native|.android.js|.native.js|.js|...)
```

### **Root Cause**
- Multiple files import `showAlert` from `../state/sagas/AlertUtility`
- The `AlertUtility.js` file was missing from the codebase
- 30+ files depend on this utility function

### **Solution**
Create `src/state/sagas/AlertUtility.js`:
```javascript
import { Alert } from 'react-native';

const showAlert = (message, title = 'Alert') => {
  Alert.alert(title, message, [
    { text: 'OK', onPress: () => {} }
  ]);
};

export default showAlert;
```

### **Detection Method**
- Search for imports: `grep -r "AlertUtility" src/`
- Look for error mentioning `AlertUtility` in Metro logs

---

## Issue 2: Incorrect Store Import Path

### **Error Pattern**
```
Unable to resolve module ../../state/store/store from [file_path]
```

### **Root Cause**
- File imports `{ store }` from non-existent path `../../state/store/store`
- Actual store is managed by `ReduxStoreManager` class
- Store is exported as default from `../../state/store/index`

### **Solution**
In affected files (e.g., `src/services/request/apiSauce.js`):

**Before:**
```javascript
import { store } from '../../state/store/store';
// Usage: store.dispatch(action)
```

**After:**
```javascript
import storeManager from '../../state/store';
// Usage: storeManager.store.dispatch(action)
```

### **Detection Method**
- Search for imports: `grep -r "state/store/store" src/`
- Check if `src/state/store/store.js` exists (it shouldn't)

---

## Issue 3: Missing redux-actions Package

### **Error Pattern**
```
Unable to resolve module redux-actions from [file_path]
redux-actions could not be found within the project or in these directories: node_modules
```

### **Root Cause**
- Code imports `createAction` from `redux-actions`
- Package not listed in `package.json` dependencies
- Common in older React Native projects with incomplete dependencies

### **Solution**
```bash
npm install redux-actions --legacy-peer-deps
```

**Note:** Use `--legacy-peer-deps` flag due to peer dependency conflicts in older React Native versions.

### **Detection Method**
- Search for imports: `grep -r "redux-actions" src/`
- Check if `redux-actions` exists in `package.json`

---

## Prevention Strategies

### **1. Dependency Audit**
Before development, run:
```bash
# Check for common missing imports
grep -r "import.*from.*\.\." src/ | grep -E "(AlertUtility|redux-actions|store/store)"
```

### **2. Package Verification**
```bash
# Verify all imported packages exist
npm ls --depth=0 | grep -E "(redux-actions|other-suspicious-packages)"
```

### **3. Store Architecture Check**
Verify store structure:
```bash
ls -la src/state/store/
# Should contain: index.js, ReduxStoreManager.js, NOT store.js
```

---

## Quick Fix Commands

### **Stop/Start Services**
```bash
.\stop-services.ps1
.\start-all.ps1
```

### **Clear Metro Cache**
```bash
npx react-native start --reset-cache
```

### **Install Missing Dependencies**
```bash
npm install [package-name] --legacy-peer-deps
```

---

## File Structure Reference

### **Critical Files**
- `src/state/sagas/AlertUtility.js` - Must exist for alert functionality
- `src/state/store/index.js` - Exports store manager
- `src/state/store/ReduxStoreManager.js` - Actual store implementation
- `package.json` - Check for missing dependencies

### **Common Import Patterns**
```javascript
// Correct patterns
import showAlert from '../AlertUtility';
import storeManager from '../../state/store';
import { createAction } from 'redux-actions';

// Incorrect patterns (will cause errors)
import { store } from '../../state/store/store';
import showAlert from '../state/sagas/AlertUtility'; // Wrong path
```

---

## Diagnostic Checklist

When encountering module resolution errors:

1. **Check file existence**: Does the imported file actually exist?
2. **Verify import path**: Is the relative path correct?
3. **Check package.json**: Is the package listed as a dependency?
4. **Search codebase**: Are there other files with similar imports?
5. **Clear cache**: Try resetting Metro cache
6. **Check store structure**: Verify Redux store architecture

---

## Success Indicators

App is working correctly when:
- Metro bundler starts without module resolution errors
- Backend API responds on port 3000
- Mobile app loads in emulator without red error screens
- All import statements resolve successfully

---

## Notes for Future Development

- This is an older React Native project (0.66.4) with legacy dependencies
- Use `--legacy-peer-deps` flag for npm installs
- Store architecture uses class-based `ReduxStoreManager`
- Alert utility is widely used across 30+ files
- Always restart services after fixing module resolution issues 