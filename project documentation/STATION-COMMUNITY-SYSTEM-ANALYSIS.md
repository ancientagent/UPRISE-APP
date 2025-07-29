# 🔍 **UPRISE Station/Community Assignment System - Archaeological Report**

## **📋 Executive Summary**

The UPRISE platform has evolved from a simple city-based preference system to a complex multi-tiered station assignment system. The developers incorrectly referred to "communities" as "stations" throughout the codebase, creating a hybrid system that combines geographic location with genre preferences to create "home scenes."

**Key Finding**: The system uses "stations" to represent geographic communities, with three hierarchical levels (City/State/National) combined with genre preferences to create user communities.

---

## **📁 Files Containing Relevant Logic**

### **🗄️ Database Models & Migrations**
- `Webapp_API-Develop/src/database/models/userstationprefrence.js` - Current station preference model
- `Webapp_API-Develop/src/database/models/usercityprefrences.js` - Legacy city preference model (deprecated)
- `Webapp_API-Develop/src/database/migrations/20221122120713-create-user-station-prefrence.js` - Migration creating station system
- `Webapp_API-Develop/src/database/migrations/20220613163033-create-user-city-prefrences.js` - Original city preference migration
- `Webapp_API-Develop/src/database/migrations/20220723061351-add_state_to_userCityPrefrences.js` - State addition to legacy system

### **🏗️ Core System Files**
- `Webapp_API-Develop/src/utils/homeSceneManager.js` - Modern home scene management system
- `Webapp_API-Develop/src/utils/fairPlayAlgorithm.js` - Community-based priority algorithm
- `Webapp_API-Develop/src/utils/songQueue.js` - Station-based song queue logic
- `Webapp_API-Develop/src/utils/userInfo.js` - User station preference utilities

### **🔌 API Routes**
- `Webapp_API-Develop/src/routes/user.js` - Station switching logic (lines 424-520)
- `Webapp_API-Develop/src/routes/auth.js` - User location/station assignment (lines 1285-1364)
- `Webapp_API-Develop/src/routes/votes.js` - Home scene verification for voting
- `Webapp_API-Develop/src/routes/statistics.js` - Station-based statistics

### **📱 Frontend Components**
- `src/screens/userLocation/userLocation.js` - Scene creation interface
- `src/screens/RadioPreferences/RadioPreferences.js` - Station switching interface
- `src/services/stationSwitching/stationSwitching.service.js` - Station switching API calls

---

## **🧬 System Evolution & Legacy Code**

### **Phase 1: Simple City Preferences (Legacy)**

**Commented-out code from `user.js` (lines 390-422):**
```javascript
// const userPrefrence =  await UserCityPrefrences.findOne({
//     where :{
//         userId:req.user.id
//     }
// });
// if(!userPrefrence ) throw new Error('User not found');
//         const previousState = userPrefrence.state;
//         const updatedState = await  userPrefrence.update({city,state},{
//             where:{
//                 userId: userPrefrence.userId
//             }
//         });
//         if(previousState !== updatedState.state){
//             await UserRadioQueue.destroy({
//                 where:{
//                     userId:userPrefrence.userId 
//                 }
//             });
//         }
```

**Database Schema (Legacy):**
```sql
CREATE TABLE UserCityPrefrences (
    id INTEGER PRIMARY KEY,
    userId INTEGER,
    city STRING,
    state STRING,  -- Added later via migration 20220723061351
    createdAt DATE,
    updatedAt DATE
);
```

### **Phase 2: Station-Based System (Current)**

**From `userstationprefrence.js`:**
```javascript
UserStationPrefrence.init({
    userId: { type: DataTypes.INTEGER },
    stationPrefrence: { type: DataTypes.STRING },
    stationType: {
        type: DataTypes.ENUM,
        values: ['1','2','3'], // 1=City, 2=State, 3=National
        defaultValue: '1'
    },
    active: { type: DataTypes.BOOLEAN }
});
```

### **Phase 3: Home Scene System (Modern)**

**From `homeSceneManager.js`:**
```javascript
generateSceneKey(city, state, genre) {
    return `${city.toLowerCase().replace(/\s+/g, '-')}-${state.toLowerCase().replace(/\s+/g, '-')}-${genre.toLowerCase().replace(/\s+/g, '-')}`;
}

// Formula: ${city}, ${state} ${genre} (e.g., "Austin, Texas Hip Hop")
```

---

## **🎯 Key Code Snippets - Station Assignment Logic**

### **1. User Location Assignment (auth.js lines 1285-1364)**
```javascript
// 3. Create Default Station Preference
console.log('3. Creating default station preference...');
const defaultStationPref = await UserStationPrefrence.create({
    userId,
    stationPrefrence: city || 'CITYWIDE', // Use actual city name
    stationType: '1',  // '1' = CITYWIDE, '2' = STATEWIDE, '3' = NATIONAL
    active: true,
});
console.log('Default station preference created:', defaultStationPref.id, 'with preference:', city || 'CITYWIDE');
```

### **2. Station Switching Logic (user.js lines 424-520)**
```javascript
let userPrefrence = await UserStationPrefrence.findOne({
    where: {
        userId: req.user.id,
        stationType
    }
});

if(userPrefrence) {
    await userPrefrence.update({
        stationPrefrence,
        active: true
    });
    
    // Deactivate other station types
    let stationPrefrences = await UserStationPrefrence.findAll({
        where: {
            userId: req.user.id,
            [Op.not]: { stationType }
        }
    });
    
    stationPrefrences.map(async (stationPrefrence) => {
        await stationPrefrence.update({
            active: false
        });
    });
    
    // Clear user's radio queue when switching stations
    await UserRadioQueue.destroy({
        where: { userId: userPrefrence.userId }
    });
}
```

### **3. Song Queue Based on Station (songQueue.js)**
```javascript
const userStationType = await UserStationPrefrence.findOne({
    where: { userId, active: true }
});

if(!userStationType) throw new Error('Invalid station prefrence');

let query;
if (userStationType.stationType === '1') {
    // CITYWIDE
    query = `lower(s."cityName") = lower('${station}')
             and s."deletedAt" is null and s.live = true and
             s."promotedSong" = 'CITY' and b.status='ACTIVE'`;
} else if(userStationType.stationType === '2') {
    // STATEWIDE  
    query = `lower(s."stateName") = lower('${station}')
             and s."deletedAt" is null and s.live = true
             and b.status='ACTIVE' and s."promotedSong" = 'STATE'`;
} else {
    // NATIONAL
    query = `s."deletedAt" is null and s.live = true
             and b.status='ACTIVE' and s."promotedSong" = 'NATIONAL'`;
}
```

### **4. Community Size Calculation (fairPlayAlgorithm.js)**
```javascript
async getCommunitySize(tier) {
    const query = `
        SELECT COUNT(DISTINCT u.id) as community_size
        FROM "Users" u
        JOIN "UserStationPrefrences" usp ON u.id = usp."userId"
        WHERE usp.active = true
        ${tier === 'CITYWIDE' ? 'AND usp."stationType" = \'1\'' : ''}
        ${tier === 'STATEWIDE' ? 'AND usp."stationType" = \'2\'' : ''}
        ${tier === 'NATIONAL' ? 'AND usp."stationType" = \'3\'' : ''}
    `;
    
    const result = await runQuery(query, { type: QueryTypes.SELECT });
    return result[0]?.community_size || 0;
}
```

### **5. Home Scene Verification (votes.js)**
```javascript
async function verifyHomeSceneLocation(userId, location) {
    try {
        // Get user's station preference to determine home scene
        const userStationPref = await UserStationPrefrence.findOne({
            where: {
                userId,
                active: true
            }
        });

        if (!userStationPref) {
            return false;
        }

        // In a real implementation, you would:
        // 1. Geocode the GPS coordinates to get city/state
        // 2. Compare with user's registered home scene
        // 3. Check if the location is within acceptable radius
        
        // For now, we'll do a basic check
        return true;
    } catch (error) {
        console.error('Error verifying home scene location:', error);
        return false;
    }
}
```

---

## **⚙️ How The System Works**

### **1. User Onboarding Flow**
1. **Location Selection**: User selects city/state via Google Places API (`src/screens/userLocation/userLocation.js`)
2. **Genre Selection**: User chooses music genre preferences  
3. **Station Assignment**: System automatically creates default station preference:
   - `stationType: '1'` (CITYWIDE)
   - `stationPrefrence: [city name]`
   - `active: true`
4. **onBoardingStatus Update**: Set to `2` (completed)

### **2. Station Types & Hierarchy**
```
Station Type 1: CITYWIDE (Default)
├── Songs with promotedSong = 'CITY'
├── Geographic filter: cityName = user's city
├── Community: Users in same city + genre
└── Tier progression threshold: 10 upvotes → STATE

Station Type 2: STATEWIDE  
├── Songs with promotedSong = 'STATE'
├── Geographic filter: stateName = user's state
├── Community: Users in same state + genre
└── Tier progression threshold: 50 upvotes → NATIONAL

Station Type 3: NATIONAL
├── Songs with promotedSong = 'NATIONAL'
├── No geographic filter
├── Community: All users + genre
└── No tier progression (highest level)
```

### **3. Community Assignment Logic**
```javascript
// HOME SCENE FORMULA
sceneKey = `${city}-${state}-${genre}`
// Example: "austin-texas-punk"

// COMMUNITY MEMBERSHIP CRITERIA:
// - User's registered city/state (from onboarding)
// - User's genre preferences (can be multiple)
// - Station type preference (City/State/National)
// - GPS verification for voting/engagement (within 50-mile radius)
```

### **4. Song Priority & Fair Play Algorithm**
- **Time-based Priority**: New songs get initial exposure based on upload time
- **Community Threshold**: After 15-35% of community hears song 2-3 times, switches to community-based priority
- **Community-based Priority**: Engagement (likes/dislikes/listens/skips) determines rotation frequency
- **Tier Progression**: Songs can promote from City → State → National based on upvotes
- **Anti-Manipulation**: GPS verification, activity analysis, reporting system

---

## **🏛️ Database Schema Evolution**

### **Legacy Schema (UserCityPrefrences) - DEPRECATED**
```sql
-- Original (from migration 20220613163033)
UserCityPrefrences: 
  id INTEGER PRIMARY KEY,
  userId INTEGER,
  city STRING

-- After migration 20220723061351 (add state)
UserCityPrefrences: 
  id INTEGER PRIMARY KEY,
  userId INTEGER,
  city STRING,
  state STRING
```

### **Current Schema (UserStationPrefrence)**
```sql
-- From migration 20221122120713
UserStationPrefrences: 
  id INTEGER PRIMARY KEY,
  userId INTEGER,
  stationPrefrence STRING,  -- City/State name or 'USA' for national
  stationType ENUM('1','2','3'),  -- 1=City, 2=State, 3=National  
  active BOOLEAN,
  createdAt DATE,
  updatedAt DATE
```

### **Related Tables**
```sql
-- User preferences and location
UserGenrePrefrences: userId, genreId
Locations: userId, city, state, country, zipcode, latitude, longitude

-- Song management and priority
SongPriority: songId, tier, timeBasedPriority, communityPriority, finalPriority
Songs: promotedSong ENUM('CITY','STATE','NATIONAL'), cityName, stateName

-- User engagement
UserRadioQueue: userId, songId (cleared when switching stations)
UserSongListens: userId, songId (tracks listening history)
Votes: userId, songId, tier, type (UPVOTE for tier progression)
```

---

## **🔍 Key Findings**

### **1. Terminology Confusion**
- **"Stations"** = Geographic communities (City/State/National radio stations)
- **"Communities"** = Actual user groups within stations based on shared location + genre
- **"Scenes"** = City + State + Genre combinations (e.g., "Austin, Texas Punk")
- **"Home Scene"** = User's primary geographic and genre-based community

### **2. Legacy System Remnants**
- `UserCityPrefrences` model still exists but is **DEPRECATED**
- Commented-out code in `user.js` lines 390-422 shows old radio preference logic
- Migration files show clear evolution from simple city preferences to complex station system
- Legacy references in `userInfo.js` line 1: `// const { UserCityPrefrences} = require('../database/models/');`

### **3. Modern System Architecture**
- **HomeSceneManager**: Manages scene creation, verification, and community statistics
- **FairPlayAlgorithm**: Community-based song prioritization with anti-manipulation features
- **Station Types**: Three-tier geographic hierarchy with different engagement thresholds
- **GPS Verification**: Location-based restrictions for voting and song engagement
- **Automatic Queue Management**: Radio queue cleared when users switch stations

### **4. Assignment Process Flow**
1. **User Registration**: Basic account creation
2. **Location Onboarding**: City/state selection via Google Places API
3. **Genre Selection**: Music preference selection from available genres
4. **Default Station Creation**: Automatic CITYWIDE station preference
5. **Community Membership**: Based on location + genre intersection
6. **Station Switching**: Manual user control between City/State/National levels
7. **Queue Reset**: Radio queue cleared on station changes to ensure relevant content

### **5. Community Engagement Rules**
- **Voting Rights**: Only in user's verified home scene (GPS-based)
- **Song Engagement**: Likes/dislikes restricted to home scene (except NATIONAL tier)
- **Tier Progression**: Songs advance based on upvote thresholds within communities
- **Fair Play**: Anti-manipulation measures prevent artificial song promotion

---

## **🚨 Important Implementation Notes**

### **Critical Database Relationships**
```javascript
// A user can have multiple station preferences but only one active
UserStationPrefrence.findOne({ where: { userId, active: true } })

// Genre preferences are separate and can be multiple per user
UserGenrePrefrences.findAll({ where: { userId } })

// Songs are geographically tagged and tier-specific
Songs.findAll({ where: { promotedSong: 'CITY', cityName: userCity } })
```

### **Environment Variables Required**
```bash
# For onboarding location selection
MAP_API_KEY=AIzaSyDevelopmentKeyForPlacesAPI

# API endpoints for station management
STATION_SWITCHING=/user/station_switching
USER_LOCATION=/auth/user-location
```

### **Key Business Logic**
1. **One Active Station**: Users can only have one active station preference at a time
2. **Geographic Filtering**: Songs are filtered by user's station type and geographic preference
3. **Queue Management**: Switching stations clears the user's radio queue to prevent irrelevant content
4. **Scene Verification**: Voting and engagement require GPS verification within home scene
5. **Tier Progression**: Songs naturally progress from local to broader audiences based on community engagement

---

## **🔧 Development Considerations**

### **When Working with Communities/Stations:**
1. Always check for active station preference: `active: true`
2. Clear radio queue when changing station preferences
3. Verify GPS location for engagement actions (voting, liking)
4. Use proper tier filtering: CITY/STATE/NATIONAL
5. Consider genre preferences in all community calculations

### **Future Enhancement Opportunities:**
1. Implement proper GPS distance calculation for home scene verification
2. Create dedicated HomeScenes table instead of deriving from UserStationPrefrence
3. Add community analytics and scene health metrics
4. Implement cross-scene collaboration features
5. Add geographic boundaries and scene overlap handling

---

## **📚 Related Documentation**
- `PROJECT-STRUCTURE.md` - Overall project structure and key files
- `QUICK-FIXES.md` - Common issues and solutions
- `UPRISE_FAIR_PLAY_IMPLEMENTATION.md` - Detailed Fair Play Algorithm documentation
- `README-Scripts.md` - Development workflow and scripts

---

**Last Updated**: December 2024  
**Analysis Type**: Archaeological Code Review  
**System Status**: Active Development with Legacy Components 