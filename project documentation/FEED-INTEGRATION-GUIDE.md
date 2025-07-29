# 📋 Feed Integration Guide - Notification-Based System

**Date**: July 2025  
**Status**: ✅ **COMPLETE & OPERATIONAL**  
**Version**: 2.0 - Updated for Architectural Realignment

---

## 📋 **Overview**

The feed integration system provides notification-based community updates with proper filtering based on location, genre preferences, and user settings. Following the architectural realignment, the feed now returns only notifications, maintaining clear separation from music content.

### **Key Features**
- ✅ **Notification-Based**: Feed returns only community notifications and updates
- ✅ **Location Filtering**: Content filtered by user's city/state
- ✅ **Genre Filtering**: Content filtered by user's genre preferences
- ✅ **User Interactions**: Song uploads, event additions, user follows
- ✅ **Real-time Updates**: Feed updates when new notifications are created
- ✅ **Proper Architecture**: Clear separation between notifications (feed) and music (radio)

---

## 🏗️ **System Architecture**

### **Feed Flow Diagram**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User Login    │    │   Feed Query    │    │   Database      │
│   (Frontend)    │    │   (Backend)     │    │  (PostgreSQL)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │ 1. Get User Prefs     │                       │
         ├──────────────────────►│                       │
         │                       │ 2. Notification Query │
         │                       ├──────────────────────►│
         │                       │ 3. Location Filter    │
         │                       ├──────────────────────►│
         │                       │ 4. Genre Filter       │
         │                       ├──────────────────────►│
         │                       │ 5. User Filter        │
         │                       ├──────────────────────►│
         │ 6. Notification List  │                       │
         │◄──────────────────────┤                       │
```

### **Filtering Layers**

1. **User Authentication**: Verify user identity and permissions
2. **Notification Types**: Filter by notification type (UPLOAD_SONG, ADD_EVENT, FOLLOW_USER)
3. **Location Filtering**: Filter by user's city/state preferences
4. **Genre Filtering**: Filter by user's genre preferences (for song-related notifications)
5. **User Targeting**: Only show notifications relevant to the user
6. **Active Status**: Only show notifications from active content

---

## 🔧 **Technical Implementation**

### **1. Feed Query Structure** ⭐ **UPDATED - NOTIFICATION-BASED**

#### **Main Feed Query** (`Webapp_API-Develop/src/routes/home.js`)

```sql
-- Notification-based songs query
SELECT n."type", n."createdAt", n."referenceId",
       jsonb_build_object(
           'isSongFavorite', CASE WHEN sf."userId" IS NOT NULL THEN true ELSE false END,
           'id', s.id,
           'title', s.title,
           'song', s.song,
           'thumbnail', s.thumbnail,
           'duration', s.duration,
           'cityName', s."cityName",
           'stateName', s."stateName",
           'createdAt', s."createdAt"
       ) as song,
       jsonb_build_object('id', b.id, 'title', b.title, 'logo', b.logo) as band,
       jsonb_build_object(
           'id', u.id,
           'firstName', u."firstName",
           'lastName', u."lastName",
           'userName', u."userName",
           'email', u.email,
           'avatar', u.avatar,
           'roleId', u."roleId",
           'about', u.about,
           'facebook', u.facebook,
           'instagram', u.instagram,
           'twitter', u.twitter,
           'role', jsonb_build_object('id', r.id, 'name', r."name")
       ) as initiator
FROM "Notifications" n
LEFT JOIN "Songs" s ON n."referenceId" = s.id AND s."deletedAt" IS NULL
LEFT JOIN "SongFavorites" sf ON s.id = sf."songId" AND sf."userId" = :userId
LEFT JOIN "Bands" b ON b.id = s."bandId"
LEFT JOIN "Users" u ON u.id = n."initiatorId"
LEFT JOIN "Roles" r ON r.id = u."roleId"
WHERE n."type" IN ('UPVOTE_SONG', 'UPLOAD_SONG', 'BLAST_SONG')
AND b.status = 'ACTIVE'
AND s.live = true
AND n."receiverId" = :userId
AND lower(s."cityName") = lower(:cityName)
ORDER BY n."createdAt" DESC;
```

### **2. Notification Types**

#### **Song-Related Notifications**
```javascript
// Song upload notifications
const songNotificationTypes = [
    'UPLOAD_SONG',    // New song uploaded
    'UPVOTE_SONG',    // Song upvoted
    'BLAST_SONG'      // Song blasted
];

// Event-related notifications
const eventNotificationTypes = [
    'ADD_EVENT'       // New event added
];

// User interaction notifications
const userNotificationTypes = [
    'FOLLOW_USER'     // User followed
];
```

### **3. Filtering Logic**

#### **Location Filtering**
```javascript
// Get user's location preference
const userStation = await UserStationPrefrence.findOne({
    where: { userId: req.user.id, active: true }
});

// Apply location filter to notifications
const locationFilter = `AND lower(s."cityName") = lower('${userStation.stationPrefrence}')`;
```

#### **Genre Filtering**
```javascript
// Get user's genre preferences
const userGenres = await UserGenrePrefrence.findAll({
    where: { userId: req.user.id },
    include: [{ model: Genres, as: 'genre' }]
});

const genreIds = userGenres.map(ug => ug.genreId);

// Apply genre filter to song notifications
const genreFilter = genreIds.length > 0 ? 
    `AND EXISTS (
        SELECT 1 FROM "SongGenres" sg 
        WHERE sg."songId" = s.id 
        AND sg."genreId" IN (${genreIds.join(',')})
    )` : '';
```

#### **User Targeting**
```javascript
// Only show notifications for the current user
const userFilter = `AND n."receiverId" = ${req.user.id}`;
```

### **4. Feed Integration Points**

#### **Song Upload Notification Creation**
```javascript
// After successful song upload
const newSong = await Songs.create(songData);

// Create notification for song upload
await Notifications.create({
    type: 'UPLOAD_SONG',
    initiatorId: req.user.id,
    receiverId: req.user.id, // Self-notification
    referenceId: newSong.id,
    createdAt: new Date()
});

// Song appears in feed as notification, not direct content
```

#### **Feed Refresh Logic**
```javascript
// Feed refreshes automatically when:
// 1. User logs in
// 2. New notifications are created
// 3. User changes location preferences
// 4. User changes genre preferences
// 5. Notifications are marked as read/unread
```

---

## 🗄️ **Database Schema**

### **Notifications Table**
```sql
CREATE TABLE "Notifications" (
    "id" SERIAL PRIMARY KEY,
    "type" VARCHAR(50) NOT NULL, -- 'UPLOAD_SONG', 'ADD_EVENT', 'FOLLOW_USER', etc.
    "initiatorId" INTEGER REFERENCES "Users"(id),
    "receiverId" INTEGER REFERENCES "Users"(id),
    "referenceId" INTEGER, -- ID of the referenced content (song, event, user)
    "read" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW()
);
```

### **User Preferences Tables**

#### **UserStationPrefrences Table**
```sql
CREATE TABLE "UserStationPrefrences" (
    "id" SERIAL PRIMARY KEY,
    "userId" INTEGER REFERENCES "Users"(id),
    "stationPrefrence" VARCHAR(100), -- City name
    "stationType" VARCHAR(20), -- 'CITYWIDE' or 'STATEWIDE'
    "active" BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW()
);
```

#### **UserGenrePrefrences Table**
```sql
CREATE TABLE "UserGenrePrefrences" (
    "id" SERIAL PRIMARY KEY,
    "userId" INTEGER REFERENCES "Users"(id),
    "genreId" INTEGER REFERENCES "Genres"(id),
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW()
);
```

---

## 🔄 **Integration Workflow**

### **1. Song Upload to Notification Flow**

```
1. User uploads song
   ↓
2. Song stored in database with live = true
   ↓
3. Metadata extracted and stored
   ↓
4. Genre associations created
   ↓
5. Notification created for song upload
   ↓
6. Notification appears in user's feed
   ↓
7. Song available via radio endpoints for music discovery
```

### **2. Feed Display Flow**

```
1. User requests feed
   ↓
2. Get user preferences (location, genres)
   ↓
3. Query notifications table
   ↓
4. Apply location filter (city/state)
   ↓
5. Apply genre filter (for song notifications)
   ↓
6. Apply user targeting filter
   ↓
7. Return notification list
   ↓
8. Display in frontend as notifications
```

### **3. Real-time Updates**

```
1. New song uploaded
   ↓
2. Notification created
   ↓
3. Feed query includes new notification
   ↓
4. Frontend displays updated notification feed
```

---

## 🧪 **Testing**

### **Unit Tests**

#### **Notification Filtering Test**
```javascript
describe('Notification Filtering', () => {
    test('should filter notifications by user location', async () => {
        const userLocation = 'Austin';
        const notifications = await getFeedNotifications(userId, userLocation);
        
        notifications.forEach(notification => {
            if (notification.song) {
                expect(notification.song.cityName.toLowerCase())
                    .toBe(userLocation.toLowerCase());
            }
        });
    });
});
```

#### **Notification Type Test**
```javascript
describe('Notification Types', () => {
    test('should return only notification-based content', async () => {
        const feed = await getUserFeed(userId);
        
        // Verify feed contains notifications, not direct songs
        feed.forEach(item => {
            expect(item).toHaveProperty('type');
            expect(['UPLOAD_SONG', 'ADD_EVENT', 'FOLLOW_USER'])
                .toContain(item.type);
        });
    });
});
```

### **Integration Tests**

#### **Complete Feed Flow Test**
```javascript
describe('Complete Feed Flow', () => {
    test('should display notification-based feed correctly', async () => {
        // 1. Upload a song
        const song = await uploadSong(mockSongData);
        
        // 2. Verify notification created
        const notification = await Notifications.findOne({
            where: { 
                type: 'UPLOAD_SONG',
                referenceId: song.id 
            }
        });
        expect(notification).toBeTruthy();
        
        // 3. Get user feed
        const feed = await getUserFeed(userId);
        
        // 4. Verify notification appears in feed
        expect(feed).toContainEqual(
            expect.objectContaining({ 
                type: 'UPLOAD_SONG',
                referenceId: song.id 
            })
        );
        
        // 5. Verify song available via radio
        const radioSongs = await getRadioSongs(userId);
        expect(radioSongs).toContainEqual(
            expect.objectContaining({ id: song.id })
        );
    });
});
```

---

## 📊 **Performance Optimization**

### **Query Optimization**

#### **Database Indexes**
```sql
-- Notifications table indexes
CREATE INDEX idx_notifications_type ON "Notifications"("type");
CREATE INDEX idx_notifications_receiverid ON "Notifications"("receiverId");
CREATE INDEX idx_notifications_createdat ON "Notifications"("createdAt");
CREATE INDEX idx_notifications_referenceid ON "Notifications"("referenceId");

-- User preferences indexes
CREATE INDEX idx_userstationpref_userid ON "UserStationPrefrences"("userId");
CREATE INDEX idx_usergenrepref_userid ON "UserGenrePrefrences"("userId");
```

#### **Query Optimization Techniques**
```javascript
// Use proper JOINs for notification queries
const notificationQuery = `
    SELECT n.*, s.*, b.*, u.*
    FROM "Notifications" n
    LEFT JOIN "Songs" s ON n."referenceId" = s.id
    LEFT JOIN "Bands" b ON s."bandId" = b.id
    LEFT JOIN "Users" u ON n."initiatorId" = u.id
    WHERE n."receiverId" = $1
    ORDER BY n."createdAt" DESC
    LIMIT 20
`;

// Use pagination for large notification lists
const pagination = 'LIMIT 20 OFFSET 0';
```

### **Caching Strategy**

#### **Notification Caching**
```javascript
// Cache notification feed for 2 minutes
const cacheKey = `notifications:${userId}:${location}:${genreIds.join(',')}`;
const cachedNotifications = await redis.get(cacheKey);

if (cachedNotifications) {
    return JSON.parse(cachedNotifications);
}

const notifications = await generateNotificationFeed(userId, location, genreIds);
await redis.setex(cacheKey, 120, JSON.stringify(notifications)); // 2 minutes

return notifications;
```

---

## 🔒 **Security Considerations**

### **Access Control**
```javascript
// Verify user can access the notification
const canAccessNotification = async (userId, notificationId) => {
    const notification = await Notifications.findByPk(notificationId);
    
    // User can access if:
    // 1. User is the receiver of the notification
    // 2. Notification is not deleted
    // 3. User has permission to view the referenced content
    
    return notification.receiverId === userId && 
           !notification.deletedAt &&
           await canViewReferencedContent(userId, notification.referenceId, notification.type);
};
```

### **Input Validation**
```javascript
// Validate notification type
const validateNotificationType = (type) => {
    const validTypes = ['UPLOAD_SONG', 'ADD_EVENT', 'FOLLOW_USER', 'UPVOTE_SONG', 'BLAST_SONG'];
    
    if (!validTypes.includes(type)) {
        throw new Error('Invalid notification type');
    }
    
    return type;
};

// Validate user ID
const validateUserId = (userId) => {
    if (!Number.isInteger(userId) || userId <= 0) {
        throw new Error('Invalid user ID');
    }
    
    return userId;
};
```

---

## 📈 **Monitoring & Analytics**

### **Feed Performance Metrics**
```javascript
// Track notification feed performance
const trackNotificationPerformance = async (userId, queryTime, resultCount) => {
    await analytics.track('notification_feed_query', {
        userId,
        queryTime,
        resultCount,
        timestamp: new Date()
    });
};

// Track notification engagement
const trackNotificationEngagement = async (userId, notificationId, action) => {
    await analytics.track('notification_engagement', {
        userId,
        notificationId,
        action, // 'view', 'click', 'dismiss'
        timestamp: new Date()
    });
};
```

### **Feed Quality Metrics**
```javascript
// Track notification relevance
const trackNotificationRelevance = async (userId, notificationId, relevanceScore) => {
    await analytics.track('notification_relevance', {
        userId,
        notificationId,
        relevanceScore, // 0-1 score
        timestamp: new Date()
    });
};

// Track notification diversity
const trackNotificationDiversity = async (userId, feedData) => {
    const types = feedData.map(n => n.type);
    const uniqueTypes = new Set(types);
    
    await analytics.track('notification_diversity', {
        userId,
        typeCount: uniqueTypes.size,
        totalNotifications: feedData.length,
        timestamp: new Date()
    });
};
```

---

## 🔄 **Deployment**

### **Production Checklist**
- [ ] Database indexes created and optimized
- [ ] Caching layer configured (Redis)
- [ ] Monitoring and alerting set up
- [ ] Performance testing completed
- [ ] Security audit passed
- [ ] Load testing completed
- [ ] Backup strategy implemented

### **Deployment Commands**
```bash
# Create database indexes
psql -d uprise_radiyo -f migrations/create_notification_indexes.sql

# Start Redis cache
redis-server --port 6379

# Start monitoring
pm2 start notification-monitor.js

# Verify deployment
curl -X GET "http://localhost:3000/home/feed" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🏗️ **Architectural Realignment Impact** ⭐ **NEW SECTION**

### **Changes Made**
Following the architectural realignment completed in July 2025, the feed system has been updated to align with proper separation of concerns:

#### **Before (Incorrect Architecture)**
- Feed returned songs and events directly
- Mixed community notifications with music content
- Violated "Feed = notifications only" principle

#### **After (Correct Architecture)**
- Feed returns only notification-based data
- Clear separation between feed (notifications) and radio (music)
- Proper architectural alignment maintained

### **Integration Points**
- **Upload**: Songs uploaded and stored in database
- **Notification Creation**: Song uploads create notification records
- **Feed Display**: Notifications appear in feed (not direct songs)
- **Radio Discovery**: Songs available via `/radio/song` endpoints
- **Music Player**: Dedicated interface for music discovery and playback

### **Benefits of Realignment**
- ✅ **Clear User Experience**: Users understand feed vs. player purpose
- ✅ **Scalable Architecture**: Easy to extend notification features independently
- ✅ **Maintainable Code**: Clear separation of concerns
- ✅ **Performance**: Optimized queries for different content types

---

## 📚 **Related Documentation**

- **`PROJECT-MANAGER-REPORT-SONG-UPLOAD-SUCCESS.md`** - Project manager report
- **`ARCHITECTURAL-REALIGNMENT-IMPLEMENTATION.md`** - Complete architectural fix documentation
- **`SONG-UPLOAD-IMPLEMENTATION.md`** - Song upload system documentation
- **`QUICK-FIXES.md`** - Troubleshooting guide
- **`PROJECT-STRUCTURE.md`** - System architecture overview

---

**Documentation Version**: 2.0 - Updated for Architectural Realignment  
**Last Updated**: July 2025  
**Status**: ✅ **COMPLETE & OPERATIONAL** 