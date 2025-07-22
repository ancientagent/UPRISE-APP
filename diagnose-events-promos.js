#!/usr/bin/env node

/**
 * Comprehensive Diagnostic Script for Uprise Mobile App
 * Checks Events, Promos, Statistics, and Environment Variables
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 UPRISE MOBILE APP - COMPREHENSIVE DIAGNOSTIC\n');

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkFileExists(filePath, description) {
  const exists = fs.existsSync(filePath);
  const status = exists ? '✅' : '❌';
  const color = exists ? 'green' : 'red';
  log(`${status} ${description}: ${filePath}`, color);
  return exists;
}

function checkEnvironmentVariables() {
  log('\n📋 ENVIRONMENT VARIABLES CHECK', 'bold');
  log('================================', 'blue');
  
  const envFile = path.join(__dirname, '.env');
  const envExists = fs.existsSync(envFile);
  
  if (!envExists) {
    log('❌ .env file not found!', 'red');
    log('   Create .env file in the project root with the following variables:', 'yellow');
    return false;
  }
  
  log('✅ .env file found', 'green');
  
  const envContent = fs.readFileSync(envFile, 'utf8');
  const envLines = envContent.split('\n').map(line => line.trim()).filter(line => line && !line.startsWith('#'));
  const envVars = {};
  
  envLines.forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
      envVars[key.trim()] = value.trim();
    }
  });
  
  // Required environment variables for Events and Promos
  const requiredVars = {
    'BASE_URL': 'http://10.0.2.2:3000',
    'HOME_EVENTS': '/home/events/{STATENAME}',
    'HOME_PROMOS': '/home/promos/{STATENAME}',
    'CLIENT_ID': '437920819fa89d19abe380073d28839c',
    'CLIENT_SECRET': '28649120bdf32812f433f428b15ab1a1',
    'LOGIN_URL': '/auth/login',
    'SIGNUP_URL': '/auth/signup',
    'GET_ALL_GENRES_URL': '/auth/genres'
  };
  
  // Required environment variables for Statistics
  const requiredStatsVars = {
    'GET_RADIO_STATIONS_STATISTICS': '/popular/radio_stations',
    'GET_POPULAR_ARTIST_STATISTICS': '/popular/artist',
    'GET_GENRES_PREFRENCE_STATISTICS': '/popular/genres',
    'GET_EVENTS_STATISTICS': '/popular/events',
    'GET_BANDS_STATISTICS': '/popular/bands',
    'GET_POPULAR_ARTIST_GENRES_STATISTICS': '/popular/artist_per_genre',
    'GET_USERS_STATISTICS': '/popular/users'
  };
  
  log('\n🔧 Core Environment Variables:', 'blue');
  let coreIssues = 0;
  Object.entries(requiredVars).forEach(([key, expectedValue]) => {
    const value = envVars[key];
    if (!value) {
      log(`❌ Missing: ${key}`, 'red');
      log(`   Expected: ${key}=${expectedValue}`, 'yellow');
      coreIssues++;
    } else if (value !== expectedValue) {
      log(`⚠️  Mismatch: ${key}=${value}`, 'yellow');
      log(`   Expected: ${key}=${expectedValue}`, 'yellow');
      coreIssues++;
    } else {
      log(`✅ ${key}=${value}`, 'green');
    }
  });
  
  log('\n📊 Statistics Environment Variables:', 'blue');
  let statsIssues = 0;
  Object.entries(requiredStatsVars).forEach(([key, expectedValue]) => {
    const value = envVars[key];
    if (!value) {
      log(`❌ Missing: ${key}`, 'red');
      log(`   Expected: ${key}=${expectedValue}`, 'yellow');
      statsIssues++;
    } else if (value !== expectedValue) {
      log(`⚠️  Mismatch: ${key}=${value}`, 'yellow');
      log(`   Expected: ${key}=${expectedValue}`, 'yellow');
      statsIssues++;
    } else {
      log(`✅ ${key}=${value}`, 'green');
    }
  });
  
  if (coreIssues === 0 && statsIssues === 0) {
    log('\n🎉 All environment variables are correctly configured!', 'green');
    return true;
  } else {
    log(`\n⚠️  Found ${coreIssues + statsIssues} environment variable issues`, 'yellow');
    return false;
  }
}

function checkBackendEndpoints() {
  log('\n🔗 BACKEND ENDPOINTS CHECK', 'bold');
  log('==========================', 'blue');
  
  const backendRoutes = [
    'Webapp_API-Develop/src/routes/home.js',
    'Webapp_API-Develop/src/routes/statistics.js',
    'Webapp_API-Develop/src/routes/index.js'
  ];
  
  let allRoutesExist = true;
  backendRoutes.forEach(route => {
    allRoutesExist = checkFileExists(route, `Backend route: ${path.basename(route)}`) && allRoutesExist;
  });
  
  if (allRoutesExist) {
    log('\n✅ All backend route files found', 'green');
    
    // Check specific endpoints in home.js
    const homeRoute = path.join(__dirname, 'Webapp_API-Develop/src/routes/home.js');
    if (fs.existsSync(homeRoute)) {
      const homeContent = fs.readFileSync(homeRoute, 'utf8');
      
      const requiredEndpoints = [
        '/events',
        '/promos'
      ];
      
      log('\n🔍 Checking home.js endpoints:', 'blue');
      requiredEndpoints.forEach(endpoint => {
        if (homeContent.includes(endpoint)) {
          log(`✅ ${endpoint} endpoint found`, 'green');
        } else {
          log(`❌ ${endpoint} endpoint missing`, 'red');
        }
      });
    }
    
    // Check statistics endpoints
    const statsRoute = path.join(__dirname, 'Webapp_API-Develop/src/routes/statistics.js');
    if (fs.existsSync(statsRoute)) {
      const statsContent = fs.readFileSync(statsRoute, 'utf8');
      
      const requiredStatsEndpoints = [
        '/radio_stations',
        '/artist',
        '/genres',
        '/events',
        '/bands',
        '/artist_per_genre',
        '/users'
      ];
      
      log('\n🔍 Checking statistics.js endpoints:', 'blue');
      requiredStatsEndpoints.forEach(endpoint => {
        if (statsContent.includes(endpoint)) {
          log(`✅ ${endpoint} endpoint found`, 'green');
        } else {
          log(`❌ ${endpoint} endpoint missing`, 'red');
        }
      });
    }
  }
  
  return allRoutesExist;
}

function checkFrontendFiles() {
  log('\n📱 FRONTEND FILES CHECK', 'bold');
  log('======================', 'blue');
  
  const frontendFiles = [
    'src/services/homeEvents/homeEvents.service.js',
    'src/services/homePromos/homePromos.service.js',
    'src/state/sagas/homeEvents/homeEvents.saga.js',
    'src/state/sagas/homePromos/homePromos.saga.js',
    'src/screens/Event/Event.js',
    'src/screens/Promos/Promos.js',
    'src/screens/Statistics/Statistics.js',
    'src/screens/Home/HomeTabs.js'
  ];
  
  let allFilesExist = true;
  frontendFiles.forEach(file => {
    allFilesExist = checkFileExists(file, `Frontend file: ${path.basename(file)}`) && allFilesExist;
  });
  
  return allFilesExist;
}

function checkStatisticsServices() {
  log('\n📊 STATISTICS SERVICES CHECK', 'bold');
  log('============================', 'blue');
  
  const statsServices = [
    'src/services/getRadioStationStatistics/getRadioStationStatistics.service.js',
    'src/services/getPopularArtistStatistics/getPopularArtistStatistics.service.js',
    'src/services/getGenresPrefrenceStatistics/getGenresPrefrenceStatistics.service.js',
    'src/services/getEventsStatistics/getEventsStatistics.service.js',
    'src/services/getBandsStatistics/getBandsStatistics.service.js',
    'src/services/getPopularArtistGenresStatistics/getPopularArtistGenresStatistics.service.js',
    'src/services/getUserStatistics/getUserStatistics.service.js'
  ];
  
  let allServicesExist = true;
  statsServices.forEach(service => {
    allServicesExist = checkFileExists(service, `Statistics service: ${path.basename(service)}`) && allServicesExist;
  });
  
  return allServicesExist;
}

function generateSolutions() {
  log('\n💡 SOLUTIONS & NEXT STEPS', 'bold');
  log('==========================', 'blue');
  
  log('\n1. Environment Variables Fix:', 'yellow');
  log('   Add these lines to your .env file:', 'blue');
  log('   ```env', 'blue');
  log('   # Core variables', 'blue');
  log('   BASE_URL=http://10.0.2.2:3000', 'blue');
  log('   HOME_EVENTS=/home/events/{STATENAME}', 'blue');
  log('   HOME_PROMOS=/home/promos/{STATENAME}', 'blue');
  log('   CLIENT_ID=437920819fa89d19abe380073d28839c', 'blue');
  log('   CLIENT_SECRET=28649120bdf32812f433f428b15ab1a1', 'blue');
  log('   LOGIN_URL=/auth/login', 'blue');
  log('   SIGNUP_URL=/auth/signup', 'blue');
  log('   GET_ALL_GENRES_URL=/auth/genres', 'blue');
  log('   ', 'blue');
  log('   # Statistics variables', 'blue');
  log('   GET_RADIO_STATIONS_STATISTICS=/popular/radio_stations', 'blue');
  log('   GET_POPULAR_ARTIST_STATISTICS=/popular/artist', 'blue');
  log('   GET_GENRES_PREFRENCE_STATISTICS=/popular/genres', 'blue');
  log('   GET_EVENTS_STATISTICS=/popular/events', 'blue');
  log('   GET_BANDS_STATISTICS=/popular/bands', 'blue');
  log('   GET_POPULAR_ARTIST_GENRES_STATISTICS=/popular/artist_per_genre', 'blue');
  log('   GET_USERS_STATISTICS=/popular/users', 'blue');
  log('   ```', 'blue');
  
  log('\n2. Restart Services:', 'yellow');
  log('   Run: .\\stop-services.ps1', 'blue');
  log('   Then: .\\start-all.ps1', 'blue');
  
  log('\n3. Test the App:', 'yellow');
  log('   - Navigate to Events tab (should show 2 events)', 'blue');
  log('   - Navigate to Promos tab (should show empty state)', 'blue');
  log('   - Navigate to Statistics tab (should load data)', 'blue');
  
  log('\n4. Check Metro Logs:', 'yellow');
  log('   Look for successful API calls and no 404 errors', 'blue');
  
  log('\n5. VirtualizedLists Error Fix:', 'yellow');
  log('   ✅ Already fixed: Added key prop to Chip components in HomeTabs.js', 'green');
}

// Main execution
function main() {
  log('🚀 Starting comprehensive diagnostic...', 'bold');
  
  const envOk = checkEnvironmentVariables();
  const backendOk = checkBackendEndpoints();
  const frontendOk = checkFrontendFiles();
  const statsServicesOk = checkStatisticsServices();
  
  log('\n📋 SUMMARY', 'bold');
  log('==========', 'blue');
  
  log(`Environment Variables: ${envOk ? '✅ OK' : '❌ ISSUES FOUND'}`, envOk ? 'green' : 'red');
  log(`Backend Endpoints: ${backendOk ? '✅ OK' : '❌ ISSUES FOUND'}`, backendOk ? 'green' : 'red');
  log(`Frontend Files: ${frontendOk ? '✅ OK' : '❌ ISSUES FOUND'}`, frontendOk ? 'green' : 'red');
  log(`Statistics Services: ${statsServicesOk ? '✅ OK' : '❌ ISSUES FOUND'}`, statsServicesOk ? 'green' : 'red');
  
  if (envOk && backendOk && frontendOk && statsServicesOk) {
    log('\n🎉 All checks passed! Your app should work correctly.', 'green');
  } else {
    log('\n⚠️  Issues found. Please follow the solutions below.', 'yellow');
    generateSolutions();
  }
  
  log('\n📚 For more details, see QUICK-FIXES.md', 'blue');
}

// Run the diagnostic
main(); 