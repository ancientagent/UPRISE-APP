# 🔍 Backend Forensic Analysis - Location Filtering Issues

## 📋 **Executive Summary**

This document details the findings from a comprehensive forensic analysis of the Uprise backend codebase, specifically focusing on location-based filtering issues in community "station" content queries. The analysis reveals critical inconsistencies in how different endpoints handle user location preferences.

---

## 🚨 **Critical Finding: Home Feed Location Filtering Missing**

### **Primary Issue**
The main home feed endpoint (`/home/feed`) that populates the mobile app's dashboard **completely ignores user location preferences** and shows global content instead of location-specific community content.

### **Impact**
- Users see content from all locations instead of their local community
- The "station" concept is broken for the main dashboard
- Local artists and events are buried in global content
- User experience doesn't match the location-based community concept

---

## 🔍 **Detailed Analysis Results**

### **1. CRITICAL FLAW: Home Feed Endpoint**

**File Path**: `Webapp_API-Develop/src/routes/home.js` (lines 68-220)

**Problem**: The main feed endpoint has **NO location filtering whatsoever**.

**Flawed Database Query**:
```sql
-- This query in the "songsList" CTE has NO location conditions:
select 'UPLOAD_SONG' as type,
       s."createdAt" as "createdAt",
       null as initiator,
       null::jsonb as "event",
       jsonb_build_object('isSongFavorite',case when sf."userId" is not null then true else false end,
       'id',s.id,'title',s.title,'song',replace(s.song,
         '${config.songUrl.AWS_S3_ENDPOINT}',
         '${config.songUrl.CLOUD_FRONT_ENDPOINT}'),'thumbnail',s.thumbnail,'duration',s.duration,
       'cityName',s."cityName",'stateName',s."stateName",'createdAt',s."createdAt")as song,
       jsonb_build_object('id',b.id,'title',b.title,'logo',b.logo) as band
       from "Songs" s  
       left join "Bands" b on b.id=s."bandId"
       left join "SongFavorites" sf on s.id = sf."songId" and sf."userId" = :userId
       where s."deletedAt" is null and b.status='ACTIVE' and s.live is true
       -- ❌ MISSING: No location filtering based on user's station preference
```

**Required Fix**:
```sql
-- The query should include location filtering like this:
where s."deletedAt" is null and b.status='ACTIVE' and s.live is true
AND (
  CASE 
    WHEN userStationType.stationType = '1' THEN lower(s."cityName") = lower('${userStationType.stationPrefrence}')
    WHEN userStationType.stationType = '2' THEN lower(s."stateName") = lower('${userStationType.stationPrefrence}')
    ELSE true -- For NATIONAL tier
  END
)
```

### **2. CORRECTLY IMPLEMENTED: Events Feed Endpoint**

**File Path**: `Webapp_API-Develop/src/routes/home.js` (lines 12-35)

**Status**: ✅ **Properly implements location filtering**

**Correct Implementation**:
```sql
-- This endpoint properly filters by location:
if (userStationType.stationType === '1') {
    query = `e."deletedAt" is null and b.status ='ACTIVE' 
    and lower(e."cityName") = lower('${station}')`;
} else if(userStationType.stationType === '2') {
    query = `e."deletedAt" is null and b.status ='ACTIVE'
     and lower(e."stateName") = lower('${station}')`;
}
```

### **3. CORRECTLY IMPLEMENTED: Promos Endpoint**

**File Path**: `Webapp_API-Develop/src/routes/home.js` (lines 294-310)

**Status**: ✅ **Properly implements location filtering**

**Correct Implementation**:
```sql
if (userStationType.stationType === '1') {
    query =` am.live is true and lower(am."city") = lower('${userStationType.stationPrefrence}')`;
} else if(userStationType.stationType === '2') {
    query = `am.live is true and lower(am."state") = lower('${userStationType.stationPrefrence}')`;
}
```

### **4. RADIO SYSTEM: Location Filtering via Tier System**

**File Path**: `Webapp_API-Develop/src/routes/radio.js` (lines 42-58)

**Status**: ✅ **Uses tier-based filtering system**

**Implementation**:
```javascript
// Determines tier based on station preference
const tierMapping = {
    '1': 'CITYWIDE',
    '2': 'STATEWIDE', 
    '3': 'NATIONAL'
};
const tier = tierMapping[userStationPrefrence.stationType] || 'CITYWIDE';

// Uses Fair Play algorithm to get next song
let RadioSong = await fairPlayAlgorithm.getNextSongForUser(user.id, tier, genreIds);
```

**Fair Play Algorithm Filtering**:
```javascript
// File: Webapp_API-Develop/src/utils/fairPlayAlgorithm.js (lines 500-523)
async getFallbackSong(userId, tier, genres = []) {
    const tierMapping = {
        'CITYWIDE': 'CITY',
        'STATEWIDE': 'STATE',
        'NATIONAL': 'NATIONAL'
    };

    const whereClause = {
        promotedSong: tierMapping[tier], // ✅ Filters by tier
        live: true,
        deletedAt: null
    };
}
```

### **5. STATISTICS ENDPOINTS: Properly Implemented**

**File Path**: `Webapp_API-Develop/src/routes/statistics.js` (lines 179-200)

**Status**: ✅ **Properly implements location filtering**

**Correct Implementation**:
```sql
if (userStationType.stationType === '1') {
    query = `u."deletedAt" is null and u.status ='ACTIVE' 
    and lower(l.city) = lower('${userStationType.stationPrefrence}')`;
} else if(userStationType.stationType === '2') {
    query = `u."deletedAt" is null and u.status ='ACTIVE'
     and lower(l.state) = lower('${userStationType.stationPrefrence}')`;
}
```

### **6. DISCOVERY ENDPOINTS: No Location Filtering**

**File Path**: `Webapp_API-Develop/src/routes/discovery.js` (lines 20-80)

**Status**: ❌ **No location filtering implemented**

**Problem**: Discovery endpoints show global content without location restrictions.

**Flawed Queries**:
```sql
-- These queries show global content without location restrictions:
where s."deletedAt" is null and s.live is true and b.status ='ACTIVE'
-- ❌ MISSING: No location-based filtering
```

---

## 🎯 **Root Cause Analysis**

### **Why This Happens**
1. **Inconsistent Implementation**: Some endpoints properly check `UserStationPrefrence` and filter by location, while others don't
2. **Missing Logic**: The main feed endpoint doesn't fetch or use the user's station preference at all
3. **Global Content**: The feed shows all songs and events globally instead of filtering by the user's selected city/state

### **User Station Preference System**
The backend has a robust user station preference system:

```javascript
// UserStationPrefrence model structure:
{
    userId: number,
    stationPrefrence: string, // City or state name
    stationType: string,      // '1' = CITYWIDE, '2' = STATEWIDE, '3' = NATIONAL
    active: boolean
}
```

**How it should work**:
1. User selects location during onboarding
2. System creates `UserStationPrefrence` record
3. All content queries should filter by this preference
4. Content shown should be location-specific

---

## 🔧 **Required Fixes**

### **Priority 1: Fix Home Feed Endpoint**

**File**: `Webapp_API-Develop/src/routes/home.js`

**Required Changes**:
1. Add user station preference lookup at the beginning of `/feed` endpoint
2. Modify the `songsList` CTE to include location filtering
3. Modify the `eventsList` CTE to include location filtering
4. Test with different station types (CITYWIDE, STATEWIDE, NATIONAL)

**Implementation Pattern**:
```javascript
// Add this at the beginning of the /feed endpoint:
const userStationType = await UserStationPrefrence.findOne({
    where: {
        userId: req.user.id,
        active: true
    }
});

if (!userStationType) {
    throw new Error('User station preference not found');
}

// Then use userStationType.stationPrefrence and userStationType.stationType
// in the database queries for location filtering
```

### **Priority 2: Fix Discovery Endpoints**

**File**: `Webapp_API-Develop/src/routes/discovery.js`

**Required Changes**:
1. Add location filtering to `/discovery/most_popular_bands`
2. Add location filtering to `/discovery/trending_songs`
3. Add location filtering to `/discovery/most_popular_albums`

### **Priority 3: Standardize Location Filtering**

Create a utility function for consistent location filtering across all endpoints:

```javascript
// File: Webapp_API-Develop/src/utils/locationFilter.js
async function buildLocationFilter(userId, tableAlias = 's') {
    const userStationType = await UserStationPrefrence.findOne({
        where: {
            userId,
            active: true
        }
    });

    if (!userStationType) {
        return ''; // No filtering if no preference
    }

    switch (userStationType.stationType) {
        case '1': // CITYWIDE
            return `AND lower(${tableAlias}."cityName") = lower('${userStationType.stationPrefrence}')`;
        case '2': // STATEWIDE
            return `AND lower(${tableAlias}."stateName") = lower('${userStationType.stationPrefrence}')`;
        case '3': // NATIONAL
            return ''; // No filtering for national
        default:
            return '';
    }
}
```

---

## 📊 **Endpoint Status Summary**

| Endpoint | File | Status | Location Filtering |
|----------|------|--------|-------------------|
| `/home/feed` | `home.js` | ❌ **BROKEN** | Missing |
| `/home/feed/events` | `home.js` | ✅ **WORKING** | Implemented |
| `/home/promos` | `home.js` | ✅ **WORKING** | Implemented |
| `/radio/song` | `radio.js` | ✅ **WORKING** | Tier-based |
| `/statistics/*` | `statistics.js` | ✅ **WORKING** | Implemented |
| `/discovery/*` | `discovery.js` | ❌ **BROKEN** | Missing |

---

## 🧪 **Testing Strategy**

### **Test Cases for Location Filtering**

1. **CITYWIDE User (stationType = '1')**
   - Should only see content from their selected city
   - Test with multiple cities to verify isolation

2. **STATEWIDE User (stationType = '2')**
   - Should only see content from their selected state
   - Test with multiple states to verify isolation

3. **NATIONAL User (stationType = '3')**
   - Should see content from all locations
   - Test to verify no location restrictions

4. **No Station Preference**
   - Should handle gracefully with fallback behavior
   - Test error handling

### **Test Data Requirements**

Create test data with:
- Songs from different cities (Austin, Houston, Dallas)
- Songs from different states (Texas, California, New York)
- Users with different station preferences
- Events in different locations

---

## 📝 **Implementation Checklist**

### **Phase 1: Critical Fixes**
- [ ] Fix `/home/feed` endpoint location filtering
- [ ] Add user station preference lookup to feed endpoint
- [ ] Test feed endpoint with different station types
- [ ] Verify mobile app dashboard shows location-specific content

### **Phase 2: Discovery Endpoints**
- [ ] Fix `/discovery/most_popular_bands` location filtering
- [ ] Fix `/discovery/trending_songs` location filtering
- [ ] Fix `/discovery/most_popular_albums` location filtering
- [ ] Test discovery endpoints with different station types

### **Phase 3: Standardization**
- [ ] Create location filtering utility function
- [ ] Refactor existing endpoints to use utility function
- [ ] Add comprehensive tests for location filtering
- [ ] Document location filtering patterns

### **Phase 4: Validation**
- [ ] End-to-end testing with mobile app
- [ ] Performance testing with location filters
- [ ] User acceptance testing
- [ ] Documentation updates

---

## 🔗 **Related Documentation**

- **QUICK-FIXES.md** - Common issues and solutions
- **PROJECT-STRUCTURE.md** - Project architecture overview
- **README-Scripts.md** - Development workflow scripts

---

## 📞 **Contact & Support**

For questions about this analysis or implementation of fixes:
- Review the code examples in this document
- Check the file paths and line numbers provided
- Test changes incrementally to avoid breaking existing functionality
- Use the testing strategy outlined above

---

*Last Updated: December 2024*
*Analysis Version: 1.0* 