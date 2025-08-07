# 🚀 UPRISE Mobile App - React Native Project

> **🚨 CRITICAL**: This project **MUST** be developed using Ubuntu via WSL (Windows Subsystem for Linux). Development directly on the Windows file system is **DEPRECATED** and **UNSUPPORTED**.

## 📱 Project Overview

UPRISE is a comprehensive React Native mobile application for iOS and Android that provides:

- **🎵 Music Discovery**: Local community-based music discovery and streaming
- **👥 Social Features**: Artist profiles, following, and community engagement
- **📍 Location-Based Content**: City and state-specific content filtering
- **📊 Analytics**: Comprehensive user and content analytics
- **🎪 Events Management**: Local music events and calendar integration
- **📻 Radio System**: Tier-based radio stations with fair play algorithms

## 🐧 Development Environment

### **Mandatory Requirements**
- **WSL2**: Ubuntu 20.04+ via Windows Subsystem for Linux
- **Node.js**: v16.20.2 (installed via NVM)
- **Java**: OpenJDK 11
- **Android SDK**: Installed on Windows, accessible from WSL
- **PostgreSQL**: Server on Windows, configured for WSL connections

### **Quick Start**
1. **Follow the complete setup guide**: [WSL-DEVELOPMENT-ENVIRONMENT-SETUP.md](WSL-DEVELOPMENT-ENVIRONMENT-SETUP.md)
2. **Configure environment files**: See [MANUAL-SETUP-GUIDE.md](MANUAL-SETUP-GUIDE.md)
3. **Launch the application**: Use the "Clean Room" launch sequence

## 🏗️ Project Architecture

### **Frontend (React Native)**
- **Framework**: React Native 0.66.4
- **State Management**: Redux with Redux-Saga
- **Navigation**: React Navigation v5
- **UI Components**: Custom components with modern design
- **API Integration**: Comprehensive service layer with 85+ endpoints

### **Backend (Node.js)**
- **Framework**: Express.js with Sequelize ORM
- **Database**: PostgreSQL with comprehensive schema
- **Authentication**: JWT with access/refresh token pattern
- **File Storage**: Local storage with AWS S3 fallback
- **Real-time Features**: WebSocket integration for live updates

### **Key Features**
- ✅ **Artist Unification System**: Unified ArtistProfile model
- ✅ **Location Filtering**: City and state-based content filtering
- ✅ **Genre System**: 97 comprehensive genres with sub-genres
- ✅ **Song Upload**: Complete file upload with metadata extraction
- ✅ **Fair Play Algorithm**: Intelligent song selection and rotation
- ✅ **Analytics Dashboard**: Comprehensive user and content analytics
- ✅ **Event Management**: Local music events with calendar integration
- ✅ **Radio System**: Tier-based radio stations (Citywide, Statewide, National)

## 🚀 Getting Started

### **Prerequisites**
1. **WSL2 Setup**: Follow [WSL-DEVELOPMENT-ENVIRONMENT-SETUP.md](WSL-DEVELOPMENT-ENVIRONMENT-SETUP.md)
2. **Environment Configuration**: Complete all configuration steps
3. **Database Setup**: Configure PostgreSQL for WSL connections

### **Launch Sequence**
```bash
# 1. Clean Room Setup (PowerShell as Administrator)
taskkill /IM adb.exe /F
taskkill /IM node.exe /F
taskkill /IM java.exe /F

# 2. Start ADB Server (PowerShell)
adb -a nodaemon server start

# 3. Launch Backend (WSL Terminal 1)
cd ~/projects/UPRISE-APP/WebApp-API
npm start

# 4. Launch Metro Bundler (WSL Terminal 2)
cd ~/projects/UPRISE-APP
npm start

# 5. Launch Android App (WSL Terminal 3)
cd ~/projects/UPRISE-APP
npm run android
```

## 📁 Project Structure

```
UPRISE-APP/
├── 📱 React Native App (Main)
│   ├── src/
│   │   ├── screens/          # UI screens
│   │   ├── components/       # Reusable components
│   │   ├── services/         # API services (85+ endpoints)
│   │   ├── state/           # Redux store and sagas
│   │   └── utilities/       # Utility functions
│   ├── android/             # Android-specific code
│   └── .env                 # Environment variables
├── 🌐 WebApp-API/           # Backend server
│   ├── src/
│   │   ├── routes/          # API endpoints
│   │   ├── database/        # Models and migrations
│   │   ├── utils/           # Utilities and algorithms
│   │   └── config/          # Configuration
│   └── .env                 # Backend environment
├── 🖥️ webapp-ui/            # React/TypeScript web app
└── 📚 project documentation/ # Comprehensive documentation
```

## 🔧 Key Configuration Files

### **Environment Files**
- **`.env`**: Frontend environment variables (85+ endpoints)
- **`WebApp-API/.env`**: Backend configuration
- **`webapp-ui/.env`**: Web app configuration

### **Build Configuration**
- **`android/settings.gradle`**: Android build settings
- **`package.json`**: Node.js dependencies and scripts
- **`babel.config.js`**: Babel configuration

## 📚 Documentation

### **Setup & Configuration**
- [🐧 WSL Development Environment Setup](WSL-DEVELOPMENT-ENVIRONMENT-SETUP.md) - **CRITICAL**
- [🔧 Manual Setup Guide](MANUAL-SETUP-GUIDE.md) - Environment configuration
- [📋 Project Structure](PROJECT-STRUCTURE.md) - Complete architecture overview

### **Development Guides**
- [🚀 Quick Fixes](QUICK-FIXES.md) - Common issues and solutions
- [🧠 Development Mindset](DEVELOPMENT-MINDSET-GUIDE.md) - Debugging principles
- [📊 System Analysis](WEBAPP-SYSTEM-ANALYSIS.md) - Backend architecture

### **Feature Documentation**
- [🎵 Song Upload System](PROJECT-MANAGER-REPORT-SONG-UPLOAD-SUCCESS.md)
- [👥 Artist Unification](ARTIST-UNIFICATION-IMPLEMENTATION.md)
- [📍 Location Filtering](BACKEND-FORENSIC-ANALYSIS.md)
- [🎪 Architectural Realignment](ARCHITECTURAL-REALIGNMENT-IMPLEMENTATION.md)

## 🐛 Troubleshooting

### **Common Issues**
1. **Environment Setup**: Follow [WSL-DEVELOPMENT-ENVIRONMENT-SETUP.md](WSL-DEVELOPMENT-ENVIRONMENT-SETUP.md)
2. **Build Failures**: Check [QUICK-FIXES.md](QUICK-FIXES.md)
3. **API Errors**: Verify environment variables in `.env` files
4. **Database Issues**: Check PostgreSQL WSL configuration

### **Support Resources**
- **Quick Fixes**: [QUICK-FIXES.md](QUICK-FIXES.md) - 39KB of solutions
- **Troubleshooting Guide**: [TROUBLESHOOTING-REFERENCE.md](TROUBLESHOOTING-REFERENCE.md)
- **Development Mindset**: [DEVELOPMENT-MINDSET-GUIDE.md](DEVELOPMENT-MINDSET-GUIDE.md)

## 🎯 Development Status

### **✅ Completed Features**
- **Core Architecture**: Stable Redux store and API integration
- **Authentication**: Complete JWT-based auth system
- **User Management**: Profile, location, and preferences
- **Content Discovery**: Location and genre-based filtering
- **Song Management**: Upload, playback, and engagement
- **Analytics**: Comprehensive user and content analytics
- **Event System**: Local music events with calendar integration

### **🚧 Current Development**
- **Performance Optimization**: Metro bundler and build system
- **UI/UX Improvements**: Modern component library
- **Testing**: Comprehensive test coverage
- **Documentation**: Continuous documentation updates

## 🤝 Contributing

### **Development Workflow**
1. **Environment Setup**: Follow WSL setup guide
2. **Feature Development**: Create feature branches
3. **Testing**: Ensure all tests pass
4. **Documentation**: Update relevant documentation
5. **Code Review**: Submit merge requests

### **Code Standards**
- **React Native**: Follow React Native best practices
- **JavaScript**: Use ES6+ features and proper error handling
- **Database**: Use Sequelize migrations for schema changes
- **API Design**: Follow RESTful principles with proper error handling

## 📊 Project Metrics

- **Lines of Code**: 50,000+ (React Native + Backend)
- **API Endpoints**: 85+ comprehensive endpoints
- **Environment Variables**: 120+ configuration variables
- **Database Tables**: 20+ with complex relationships
- **Documentation**: 25+ comprehensive guides

## 🆘 Support & Contact

### **Documentation Priority**
1. **WSL Setup**: [WSL-DEVELOPMENT-ENVIRONMENT-SETUP.md](WSL-DEVELOPMENT-ENVIRONMENT-SETUP.md)
2. **Quick Fixes**: [QUICK-FIXES.md](QUICK-FIXES.md)
3. **Project Structure**: [PROJECT-STRUCTURE.md](PROJECT-STRUCTURE.md)

### **Development Resources**
- **Architecture**: [WEBAPP-SYSTEM-ANALYSIS.md](WEBAPP-SYSTEM-ANALYSIS.md)
- **API Reference**: [COMPREHENSIVE-API-ENDPOINT-AUDIT.md](COMPREHENSIVE-API-ENDPOINT-AUDIT.md)
- **Environment Variables**: [ENVIRONMENT-VARIABLES-REFERENCE.md](ENVIRONMENT-VARIABLES-REFERENCE.md)

---

**Last Updated**: January 2025  
**Environment**: Ubuntu WSL2  
**Status**: ✅ **STABLE** - All major issues resolved  
**Next Steps**: Feature development and optimization

