# Uprise Webapp - Complete Technical Specification Report

## Executive Summary

The Uprise webapp is a comprehensive music platform built with Angular 13 frontend and Node.js backend, designed to manage artists, bands, songs, events, and user interactions. This report provides a complete technical specification derived from reverse engineering the existing codebase.

---

## 1. System Architecture Overview

### Backend Architecture
- **Framework**: Node.js with Express.js
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: JWT-based authentication with refresh tokens
- **File Storage**: AWS S3 with CloudFront CDN
- **API Documentation**: Swagger/OpenAPI
- **Cron Jobs**: Node-schedule for automated tasks

### Frontend Architecture
- **Framework**: Angular 13
- **UI Library**: PrimeNG with PrimeFlex
- **State Management**: RxJS with Services
- **Styling**: SCSS with custom themes
- **Build Tools**: Angular CLI

### Infrastructure
- **File Processing**: FFmpeg for audio/video processing
- **Email Service**: SendGrid for notifications
- **Push Notifications**: Firebase Cloud Messaging
- **Maps Integration**: Google Maps API
- **Calendar Integration**: Google Calendar API

---

## 2. Authentication System

### Authentication Method
- **Primary**: JWT (JSON Web Tokens)
- **Access Token**: Short-lived, stored in memory
- **Refresh Token**: Long-lived, stored in database
- **Client Authentication**: Client ID/Secret for API access

### User Roles & Permissions
```javascript
Roles:
1. Admin - Full system access
2. Artist - Band management, song upload, event creation
3. Listener - Music consumption, user interactions
```

### Authentication Endpoints
```javascript
POST /auth/signup - User registration
POST /auth/login - User login
POST /auth/refresh - Token refresh
POST /auth/logout - User logout
POST /auth/verify/:token - Email verification
POST /auth/forgot-password - Password reset request
POST /auth/reset-password - Password reset
```

### Security Features
- **Password Policy**: 8+ characters, mixed case, numbers, special characters
- **Account Status**: ACTIVE, INACTIVE, BLOCKED
- **Email Verification**: Required for account activation
- **Rate Limiting**: Implemented for API endpoints
- **Input Validation**: Comprehensive validation middleware

---

## 3. Database Models & Data Structure

### Core Models

#### User Model
```javascript
{
  id: INTEGER (Primary Key),
  firstName: STRING,
  lastName: STRING,
  userName: STRING (Unique),
  email: STRING (Unique),
  password: STRING (Hashed),
  mobile: STRING,
  gender: ENUM ['MALE', 'FEMALE', 'PREFER NOT TO SAY'],
  avatar: STRING (URL),
  roleId: INTEGER (Foreign Key),
  status: ENUM ['ACTIVE', 'INACTIVE', 'BLOCKED'],
  onBoardingStatus: INTEGER,
  about: STRING,
  social: {
    facebook: STRING,
    twitter: STRING,
    instagram: STRING
  },
  fcmToken: STRING,
  refreshToken: STRING,
  emailVerificationToken: STRING,
  passwordResetToken: STRING,
  lastRadioRequestTimestamp: DATE,
  deletedAt: DATE (Soft Delete)
}
```

#### Band Model
```javascript
{
  id: INTEGER (Primary Key),
  title: STRING,
  description: STRING,
  logo: STRING (URL),
  social: {
    facebook: STRING,
    instagram: STRING,
    youtube: STRING,
    twitter: STRING
  },
  createdBy: INTEGER (Foreign Key),
  status: ENUM ['ACTIVE', 'INACTIVE', 'BLOCKED'],
  promosEnabled: BOOLEAN,
  createdAt: DATE,
  updatedAt: DATE
}
```

#### Songs Model
```javascript
{
  id: INTEGER (Primary Key),
  title: STRING,
  song: STRING (URL),
  thumbnail: STRING (URL),
  duration: FLOAT,
  location: {
    cityName: STRING,
    stateName: STRING,
    country: STRING,
    latitude: FLOAT,
    longitude: FLOAT
  },
  uploadedBy: INTEGER (Foreign Key),
  bandId: INTEGER (Foreign Key),
  albumId: INTEGER (Foreign Key),
  live: BOOLEAN,
  hashValue: STRING,
  promotedSong: ENUM ['CITY', 'STATE', 'NATIONAL'],
  airedOn: DATE,
  promotedToStateDate: DATE,
  promotedToNationalDate: DATE,
  deletedAt: DATE (Soft Delete)
}
```

#### Events Model
```javascript
{
  id: INTEGER (Primary Key),
  title: STRING,
  description: STRING,
  thumbnail: STRING (URL),
  venue: STRING,
  location: {
    cityName: STRING,
    stateName: STRING,
    country: STRING,
    latitude: FLOAT,
    longitude: FLOAT
  },
  startDate: DATE,
  endDate: DATE,
  bandId: INTEGER (Foreign Key),
  createdBy: INTEGER (Foreign Key),
  status: ENUM ['ACTIVE', 'INACTIVE', 'CANCELLED']
}
```

### Relationship Models
- **BandMembers**: User-Band relationships
- **UserFollows**: User-User following relationships
- **UserBandFollows**: User-Band following relationships
- **SongGenres**: Song-Genre mappings
- **SongFavorites**: User song preferences
- **Votes**: Song voting system
- **SongLikes**: Song engagement tracking
- **UserSongListens**: Listen history tracking

---

## 4. API Endpoints Specification

### Authentication Routes (`/auth`)
```javascript
POST /auth/signup - User registration
POST /auth/login - User authentication
POST /auth/refresh - Token refresh
POST /auth/logout - User logout
POST /auth/verify/:token - Email verification
POST /auth/forgot-password - Password reset request
POST /auth/reset-password - Password reset completion
POST /auth/user-location - User location setup
GET /auth/genres - Available genres list
```

### User Management Routes (`/user`)
```javascript
GET /user/me - Current user profile
PUT /user/update_profile - Update user profile
PUT /user/change-password - Change password
POST /user/location - Set user location
POST /user/user_prefrence_genres - Set genre preferences
PUT /user/station_switching - Switch radio station
POST /user/follow - Follow another user
POST /user/unfollow - Unfollow user
POST /user/band-follow - Follow band
POST /user/undo-band-follow - Unfollow band
GET /user/:id/followers - Get user followers
GET /user/:id/following - Get user following
GET /user/:id/following-bands - Get followed bands
GET /user/:id/profile - Get user profile
GET /user/:id/favorites - Get user favorites
POST /user/song-favorite - Mark song as favorite
POST /user/song-unfavorite - Remove from favorites
POST /user/song-listens - Track song listen
POST /user/instrument - Set user instruments
POST /user/notification/register-token - Register FCM token
POST /user/notification/un-register-token - Unregister FCM token
```

### Admin Management Routes (`/admin`)
```javascript
GET /admin/users/list - List all users
DELETE /admin/user/:id - Delete user
PUT /admin/active-user/:id - Activate user
PUT /admin/block-user/:id - Block user
GET /admin/songs/list - List all songs
DELETE /admin/song/:id - Delete song
PUT /admin/song/status/:id - Update song status
GET /admin/bands/list - List all bands
DELETE /admin/band/:id - Delete band
PUT /admin/band/status/:id - Update band status
GET /admin/events/list - List all events
DELETE /admin/event/:id - Delete event
POST /admin/ads - Create advertisement
GET /admin/ads - List advertisements
PUT /admin/ads/:id - Update advertisement
DELETE /admin/ads/:id - Delete advertisement
```

### Band Management Routes (`/band`)
```javascript
POST /band/create - Create new band
PUT /band/edit_band - Edit band details
GET /band/band_details - Get band details
GET /band/bandmembers_list - List band members
DELETE /band/:bandId/bandmember/:id - Remove band member
GET /band/members - Get band members
GET /band/members_username - Get member usernames
```

### Song Management Routes (`/song`)
```javascript
POST /song/upload - Upload new song
PUT /song/edit/:id - Edit song details
PUT /song/live - Set song live status
GET /song/songs-list - List songs
DELETE /song/:songId - Delete song
GET /song/songs-list/album - List songs by album
```

### Event Management Routes (`/eventmanagement`)
```javascript
POST /eventmanagement/create-event - Create new event
PUT /eventmanagement/update-event/:id - Update event
DELETE /eventmanagement/event/:id - Delete event
GET /eventmanagement/events-list - List events
GET /eventmanagement/admin/events-list - Admin event list
```

### Music & Radio Routes (`/radio`, `/home`)
```javascript
GET /radio/song - Get current radio song
GET /radio/avaliable-states - Get available states
GET /home/feed - Get user feed
GET /home/feed/events - Get events feed
GET /home/new-releases - Get new releases
GET /home/recommended-radio-stations - Get recommended stations
GET /home/promos - Get promotional content
```

### Statistics Routes (`/popular`)
```javascript
GET /popular/most_played_songs - Most played songs
GET /popular/most_popular_bands - Most popular bands
GET /popular/most_rated_songs - Most rated songs
GET /popular/users - User statistics
GET /popular/events - Event statistics
GET /popular/radio_stations - Radio station statistics
GET /popular/bands - Band statistics
GET /popular/artist - Artist statistics
GET /popular/genres - Genre statistics
GET /popular/artist_per_genre - Artist per genre statistics
```

### Discovery Routes (`/discovery`)
```javascript
GET /discovery/all_genres - All available genres
GET /discovery/most_popular_bands - Popular bands
GET /discovery/trending_songs - Trending songs
GET /discovery/most_popular_albums - Popular albums
GET /discovery/most_popular_genres - Popular genres
GET /discovery/songs_by_genre/:id - Songs by genre
```

### Voting & Engagement Routes (`/votes`, `/song-likes`)
```javascript
POST /votes/vote - Vote for song
POST /votes/undo-vote - Undo vote
POST /votes/song-blast - Song blast
POST /song-likes/song-like-status - Update like status
GET /song-likes/song-like-status/:songId/:tier - Get like status
POST /song-likes/song-skip - Skip song
POST /song-likes/song-listen - Track song listen
GET /song-likes/song-engagement/:songId/:tier - Get engagement
```

---

## 5. Core Business Logic Features

### 5.1 Band Management Module

#### Functionality
- **Band Creation**: Artists can create bands with logo, description, social links
- **Member Management**: Invite/remove band members via email
- **Band Profile**: Manage band information, gallery, social media
- **Band Following**: Users can follow/unfollow bands
- **Band Statistics**: Track followers, song plays, engagement

#### Key Features
- **Invitation System**: Email-based band member invitations
- **Role-Based Access**: Different permissions for band creators vs members
- **Promotional Tools**: Enable/disable promotional features
- **Gallery Management**: Upload and manage band photos
- **Social Integration**: Facebook, Instagram, YouTube, Twitter links

### 5.2 Song & Album Management Module

#### Functionality
- **Song Upload**: Multi-part upload with audio file and thumbnail
- **Metadata Management**: Title, genre, location, band association
- **Album Organization**: Group songs into albums
- **Song Promotion**: City/State/National promotion levels
- **Live Status**: Control when songs go live on radio

#### Key Features
- **File Processing**: FFmpeg integration for audio processing
- **Thumbnail Generation**: Automatic thumbnail creation
- **Genre Tagging**: Multiple genre assignment per song
- **Geographic Targeting**: Location-based song promotion
- **Quality Control**: Admin approval workflow
- **Duplicate Detection**: Hash-based duplicate prevention

### 5.3 Event Management Module

#### Functionality
- **Event Creation**: Create events with venue, date, description
- **Event Discovery**: Location-based event discovery
- **Calendar Integration**: Google Calendar sync
- **Event Promotion**: Featured events and recommendations
- **Attendance Tracking**: User interest and attendance

#### Key Features
- **Location Services**: Google Maps integration
- **Date/Time Management**: Timezone-aware scheduling
- **Image Upload**: Event thumbnail management
- **Notification System**: Event reminders and updates
- **Search & Filter**: Advanced event discovery

### 5.4 User Engagement System

#### Functionality
- **Radio System**: Location-based radio stations
- **Song Interactions**: Like, vote, skip, blast
- **Social Features**: Follow users, share content
- **Personalization**: Genre preferences, station switching
- **Listening History**: Track user listening patterns

#### Key Features
- **Voting System**: Democratic song selection
- **Song Blasting**: User-promoted songs
- **Engagement Tracking**: Comprehensive analytics
- **Recommendation Engine**: Personalized content
- **Social Graph**: User connections and influences

### 5.5 Admin Statistics Dashboard

#### Functionality
- **User Analytics**: Registration, activity, engagement metrics
- **Content Analytics**: Song uploads, plays, popularity
- **Band Analytics**: Band performance, member activity
- **Event Analytics**: Event creation, attendance, engagement
- **System Analytics**: API usage, performance metrics

#### Key Features
- **Real-time Data**: Live statistics updates
- **Exportable Reports**: CSV/PDF export functionality
- **Time-based Filtering**: Date range analysis
- **Geographic Analytics**: Location-based insights
- **Comparative Analysis**: Period-over-period comparisons

---

## 6. Frontend UI Component Inventory

### 6.1 Shared Components (`/shared/components`)

#### Input Components
- **TextBoxComponent**: Standard text input with validation
- **TextPasswordComponent**: Password input with visibility toggle
- **DropdownComponent**: Select dropdown with search
- **AutocompleteComponent**: Typeahead input component
- **CheckBoxComponent**: Checkbox with custom styling
- **MultiSelectComponent**: Multi-selection dropdown
- **InputTextareaComponent**: Textarea with character count
- **CalenderComponent**: Date picker with range selection
- **UploadButtonComponent**: File upload with progress

#### UI Components
- **HeaderComponent**: Main navigation header
- **SidenavComponent**: Sidebar navigation
- **LoadingSpinnerComponent**: Loading state indicator
- **SpinnerComponent**: Global loading overlay
- **AvatarComponent**: User avatar display
- **BlockComponent**: Content blocking/unblocking
- **DeleteComponent**: Confirmation dialog

#### Form Components
- **SubmitComponentComponent**: Primary submit button
- **SubmitComponenet2Component**: Secondary submit button
- **ToggleSwitchComponent**: Toggle switch control
- **BandComponent**: Band selection component
- **InputBoxLoginComponent**: Login-specific input

### 6.2 Module-Specific Components

#### Admin Module Components
- **UserManagementComponent**: User CRUD operations
- **SongsManagementComponent**: Song administration
- **EventsManagementComponent**: Event administration
- **StatisticsComponent**: Analytics dashboard
- **AdsManagementComponent**: Advertisement management
- **ProfileComponent**: Admin profile management
- **BrandMemberlistComponent**: Brand member management

#### Auth Module Components
- **LoginComponent**: User authentication
- **SignupComponent**: User registration
- **ForgotPasswordComponent**: Password reset
- **EmailVerificationComponent**: Email verification

#### Band Module Components
- **BandProfileComponent**: Band profile management
- **BandMembersComponent**: Member management
- **BandSongsComponent**: Band song management
- **BandEventsComponent**: Band event management
- **BandStatisticsComponent**: Band analytics

### 6.3 Utility Components

#### Services
- **AuthService**: Authentication management
- **UserService**: User operations
- **BandService**: Band operations
- **SongService**: Song operations
- **EventService**: Event operations
- **StatisticsService**: Analytics service
- **NotificationService**: Push notifications
- **FileUploadService**: File upload handling

#### Pipes
- **DatePipe**: Date formatting
- **DurationPipe**: Audio duration formatting
- **TextTruncatePipe**: Text truncation
- **SafeHtmlPipe**: HTML sanitization

#### Guards
- **AuthGuard**: Route protection
- **RoleGuard**: Role-based access
- **AdminGuard**: Admin-only routes

---

## 7. Technical Dependencies

### Backend Dependencies
```json
{
  "express": "^4.17.2",
  "sequelize": "^6.12.5",
  "pg": "^8.7.1",
  "jsonwebtoken": "^8.5.1",
  "bcrypt": "^5.0.1",
  "multer": "^1.4.4",
  "multer-s3": "^2.10.0",
  "aws-sdk": "^2.1073.0",
  "ffmpeg-static": "^4.4.1",
  "fluent-ffmpeg": "^2.1.2",
  "@sendgrid/mail": "^7.6.0",
  "firebase-admin": "^11.0.0",
  "googleapis": "^102.0.0",
  "node-schedule": "^2.1.0",
  "swagger-ui-express": "^4.3.0",
  "winston": "^3.7.2"
}
```

### Frontend Dependencies
```json
{
  "@angular/core": "~13.2.0",
  "@angular/common": "~13.2.0",
  "@angular/forms": "~13.2.0",
  "@angular/router": "~13.2.0",
  "primeng": "^13.2.0",
  "primeflex": "^3.1.3",
  "primeicons": "^5.0.0",
  "ngx-toastr": "^14.2.1",
  "ngx-spinner": "^10.0.1",
  "ngx-google-places-autocomplete": "^2.0.5",
  "lodash": "^4.17.21",
  "rxjs": "~7.5.0"
}
```

---

## 8. Environment Configuration

### Backend Environment Variables
```env
# Database
DB_HOST=localhost
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=uprise_db
DB_PORT=5432

# JWT
JWT_ACCESS_TOKEN_SECRET=your_access_secret
JWT_REFRESH_TOKEN_SECRET=your_refresh_secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Client Authentication
CLIENT_ID=your_client_id
CLIENT_SECRET=your_client_secret

# AWS
AWS_ACCESS_KEY=your_aws_key
AWS_SECRET_KEY=your_aws_secret
AWS_REGION=us-east-1
AWS_BUCKET_NAME=uprise-media
AWS_S3_ENDPOINT=https://s3.amazonaws.com
CLOUD_FRONT_ENDPOINT=https://d1234567890.cloudfront.net

# Email
SENDGRID_API_KEY=your_sendgrid_key
SENDGRID_FALLBACK_EMAIL=noreply@uprise.com
ADMIN_MAIL=admin@uprise.com

# Application
PORT=3000
WEB_URL=http://localhost:4321
```

### Frontend Environment Variables
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',
  clientId: 'your_client_id',
  clientSecret: 'your_client_secret',
  googleMapsApiKey: 'your_google_maps_key',
  firebaseConfig: {
    // Firebase configuration
  }
};
```

---

## 9. Cron Jobs & Automated Tasks

### Scheduled Tasks
```javascript
// Event notifications - Every hour
'0 * * * *' => sendEventPushNotification()

// Song priority updates - Every hour  
'0 * * * *' => updateSongPriorities()

// Priority cleanup - Daily at 2 AM
'0 2 * * *' => cleanupPriorityRecords()

// Priority initialization - Daily at 3 AM
'0 3 * * *' => initializePriorityRecords()
```

### Automated Features
- **Song Promotion**: Automatic promotion from city to state to national
- **Priority Management**: Song play order optimization
- **Notification System**: Event reminders and updates
- **Cleanup Tasks**: Old records and temporary files
- **Statistics Aggregation**: Daily analytics compilation

---

## 10. Security Implementation

### Authentication Security
- **JWT Tokens**: Access and refresh token pattern
- **Password Hashing**: bcrypt with salt rounds
- **Client Authentication**: API key validation
- **Session Management**: Secure token storage
- **Account Lockout**: Failed login protection

### Authorization Security
- **Role-Based Access**: Granular permissions
- **Resource Ownership**: User-specific data access
- **API Rate Limiting**: Request throttling
- **Input Validation**: Comprehensive sanitization
- **File Upload Security**: Type and size restrictions

### Data Security
- **Soft Deletes**: Recoverable data deletion
- **Audit Trails**: User action logging
- **Encryption**: Sensitive data encryption
- **CORS Configuration**: Cross-origin request control
- **SQL Injection Prevention**: Parameterized queries

---

## 11. Performance Optimization

### Backend Optimization
- **Database Indexing**: Optimized query performance
- **Connection Pooling**: Efficient database connections
- **Caching Strategy**: Redis for session management
- **File Compression**: Optimized media delivery
- **CDN Integration**: CloudFront for static assets

### Frontend Optimization
- **Lazy Loading**: Module-based code splitting
- **Component Optimization**: OnPush change detection
- **Image Optimization**: Responsive image loading
- **Bundle Optimization**: Tree shaking and minification
- **Caching Strategy**: Service worker implementation

---

## 12. Integration Points

### External Services
- **AWS S3**: Media file storage
- **CloudFront**: CDN for content delivery
- **SendGrid**: Email service
- **Firebase**: Push notifications
- **Google Maps**: Location services
- **Google Calendar**: Event integration
- **Google Places**: Location autocomplete

### API Integrations
- **Google Places API**: Address autocomplete
- **Google Maps API**: Location services
- **Firebase Admin SDK**: Push notifications
- **SendGrid API**: Email delivery
- **AWS SDK**: File operations

---

## 13. Error Handling & Logging

### Error Handling Strategy
- **Global Error Handler**: Centralized error processing
- **Validation Errors**: User-friendly error messages
- **Database Errors**: Transaction rollback support
- **File Upload Errors**: Graceful failure handling
- **Network Errors**: Retry mechanisms

### Logging Implementation
- **Winston Logger**: Structured logging
- **Daily Rotation**: Log file management
- **Log Levels**: Debug, info, warn, error
- **Request Logging**: API call tracking
- **Error Tracking**: Exception monitoring

---

## 14. Testing Strategy

### Backend Testing
- **Unit Tests**: Jest framework
- **Integration Tests**: API endpoint testing
- **Database Tests**: Model validation
- **Authentication Tests**: Security validation
- **File Upload Tests**: Media handling

### Frontend Testing
- **Unit Tests**: Jasmine/Karma
- **Component Tests**: Angular testing utilities
- **E2E Tests**: Protractor/Cypress
- **User Flow Tests**: Complete user journeys
- **Accessibility Tests**: WCAG compliance

---

## 15. Deployment Architecture

### Development Environment
- **Local Development**: Docker containers
- **Database**: PostgreSQL local instance
- **File Storage**: Local filesystem
- **Email**: Mock email service
- **Push Notifications**: Firebase test tokens

### Production Environment
- **Container Orchestration**: Docker/Kubernetes
- **Database**: Managed PostgreSQL
- **File Storage**: AWS S3 + CloudFront
- **Email Service**: SendGrid production
- **Monitoring**: Application performance monitoring
- **Load Balancing**: Distributed traffic handling

---

## 16. Migration Considerations

### Database Migration
- **Data Export**: Complete data extraction
- **Schema Evolution**: Incremental updates
- **Data Validation**: Integrity checks
- **Rollback Strategy**: Backup and restore
- **Performance Testing**: Load testing

### Application Migration
- **Feature Parity**: Complete functionality match
- **User Experience**: Improved interface design
- **Performance**: Optimized response times
- **Security**: Enhanced security measures
- **Scalability**: Improved architecture

---

## 17. Recommendations for Rewrite

### Backend Recommendations
1. **Upgrade to Node.js 18+** for better performance
2. **Implement TypeScript** for better type safety
3. **Add comprehensive API documentation** with OpenAPI 3.0
4. **Implement proper error handling** with custom error classes
5. **Add comprehensive testing** with >80% code coverage
6. **Implement caching layer** with Redis
7. **Add database migrations** for schema management
8. **Implement proper logging** with structured logging
9. **Add monitoring and alerting** for production
10. **Implement proper validation** with schema validation

### Frontend Recommendations
1. **Upgrade to Angular 15+** for better performance
2. **Implement NgRx** for state management
3. **Add comprehensive component library** with Storybook
4. **Implement proper error handling** with global error handler
5. **Add comprehensive testing** with >80% code coverage
6. **Implement accessibility** with WCAG compliance
7. **Add performance optimization** with lazy loading
8. **Implement PWA features** for offline support
9. **Add proper routing guards** for security
10. **Implement proper form validation** with reactive forms

### Architecture Recommendations
1. **Microservices Architecture** for scalability
2. **Event-Driven Architecture** for real-time features
3. **CQRS Pattern** for read/write separation
4. **API Gateway** for centralized routing
5. **Message Queue** for asynchronous processing
6. **Database Sharding** for horizontal scaling
7. **CDN Implementation** for global content delivery
8. **Monitoring Stack** for observability
9. **CI/CD Pipeline** for automated deployment
10. **Security Hardening** for production readiness

---

## Conclusion

This technical specification provides a comprehensive foundation for rewriting the Uprise webapp. The existing system demonstrates a solid understanding of music platform requirements but requires modernization in architecture, security, and user experience. The recommended approach should focus on:

1. **Modernizing the technology stack** with current best practices
2. **Implementing robust security** measures throughout
3. **Improving user experience** with modern UI/UX patterns
4. **Enhancing performance** through optimization techniques
5. **Ensuring scalability** for future growth
6. **Maintaining feature parity** while improving functionality

The new system should be built with maintainability, scalability, and security as primary concerns, while delivering an exceptional user experience for artists, listeners, and administrators.

---

*This document serves as the complete technical specification for the Uprise webapp rewrite project, providing detailed insights into the existing system architecture, functionality, and recommendations for improvement.* 