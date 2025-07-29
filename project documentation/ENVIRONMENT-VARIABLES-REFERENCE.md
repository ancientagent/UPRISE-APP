# UPRISE Mobile App - Environment Variables Reference

> **📋 Complete Reference**: This document contains all environment variable templates for the UPRISE Mobile App
> **🔒 Security**: No secret values are included - only template structure
> **📊 Total Variables**: 138 environment variables organized by category

## **Project Structure**

### **React Native App** (Main Directory)
- **Environment File**: `Mobile_App-Dev/.env` (138 variables)
- **Backup File**: `Mobile_App-Dev/.env.backup`
- **Template**: Contains all API endpoints and configuration

### **Backend API** (`Webapp_API-Develop/.env`)
- **Database Configuration**: PostgreSQL connection settings
- **JWT Configuration**: Authentication tokens
- **Server Settings**: Port, environment, client credentials

---

## **Environment Variable Templates**

### **BASE CONFIGURATION**
```env
BASE_URL=http://10.0.2.2:3000
NODE_OPTIONS=--openssl-legacy-provider
```

### **CLIENT AUTHENTICATION**
```env
CLIENT_ID=your_client_id_here
CLIENT_SECRET=your_client_secret_here
```

### **AUTHENTICATION ENDPOINTS**
```env
SIGNUP_URL=/auth/signup
LOGIN_URL=/auth/login
VERIFY_USER=/auth/verify-user
FORGOT_PASSWORD=/auth/forgot-password
RESET_PASSWORD=/auth/reset-password
```

### **USER PROFILE & LOCATION**
```env
GET_USER_DETAILS_URL=/user/me
UPDATE_PROFILE_URL=/user/update_profile
UPDATE_ONBOARDING_STATUS_URL=/auth/update-onboarding-status
CHANGE_PASSWORD=/user/change-password
USER_LOCATION=/auth/user-location
```

### **BAND RELATED ENDPOINTS** (40+ endpoints)
```env
BAND_CREATE=/band/create
BAND_EDIT=/band/edit_band
BAND_DETAILS=/band/band_details
BAND_MEMBERS_LIST=/band/bandmembers_list
BAND_MEMBERS=/band/members
BAND_MEMBERS_USERNAME=/band/members_username
BAND_FOLLOW=/user/band-follow
BAND_UNFOLLOW=/user/undo-band-follow
BAND_EVENTS=/band/events
BAND_GALLERY=/band/gallery
BAND_SONGS=/band/songs
BAND_STATISTICS=/band/statistics
BAND_FOLLOWERS=/band/followers
BAND_FOLLOWING=/band/following
BAND_MEMEBERS_LIST=/band/{BANDID}/members
GET_BANDSONG_LIST=/band/{BANDID}/songs
BAND_ALBUMS_LIST=/band/{BANDID}/albums
ALBUM_DETAILS=/band/{BANDID}/album/{ALBUMID}
DELETE_FOLLOWERS=/user/{CURRNETUSERID}/followers/{FOLLOWERID}
```

### **RADIO & SONGS**
```env
GET_RADIO_SONG=/radio/song/{LOCATION}
GET_RADIO_STATIONS=/popular/radio_stations
GET_RADIO_STATIONS_SONGS=/home/recommended-radio-stations/{STATENAME}
GET_RADIO_AVAILABLE_STATES=/radio/avaliable-states
SONG_UPLOAD=/song/upload
SONG_EDIT=/song/edit
SONG_LIVE=/song/live
SONG_LIST=/song/songs-list
SONG_DELETE=/song/delete
SONG_FAVORITE=/user/song-favorite
SONG_UNFAVORITE=/user/song-unfavorite
SONG_VOTE=/votes/vote
SONG_UNDO_VOTE=/votes/undo-vote
SONG_BLAST=/votes/song-blast
SONG_REPORT=/song/report
SONG_DOWN_VOTE=/song/down-vote
SONG_LIKE_STATUS=/song-likes/song-like-status
SONG_SKIP=/song-likes/song-skip
SONG_LISTEN=/song-likes/song-listen
SONG_ENGAGEMENT=/song-likes/song-engagement
```

### **SOCIAL FEATURES**
```env
USER_FOLLOW=/user/follow
USER_UNFOLLOW=/user/unfollow
FOLLOWERS_LIST=/user/followers
FOLLOWING_LIST=/user/following
FOLLOWING_BANDS=/user/following-bands
OTHER_USER_PROFILE=/user/profile
USER_FAVORITES=/user/favorites
USER_AVATAR=/user/avatar
```

### **LOCATION & CITIES**
```env
AVAILABLE_CITIES=/cities/available
NEAREST_LOCATIONS=/locations/nearest
GOOGLE_PLACES_API_KEY=your_google_places_api_key_here
GOOGLE_PLACES_AUTOCOMPLETE_URL=https://places.googleapis.com/v1/places:autocomplete
```

### **HOME SCREEN CONTENT**
```env
HOME_FEED=/home/feed
HOME_EVENTS=/home/feed/events/{STATENAME}
HOME_PROMOS=/home/promos/{STATENAME}
HOME_NEW_RELEASES=/home/new-releases
HOME_RECOMMENDED_STATIONS=/home/recommended-radio-stations
```

### **POPULAR CONTENT**
```env
MOST_PLAYED_SONGS=/popular/most_played_songs/{COUNT}
MOST_RATED_SONGS=/popular/most_rated_songs/{COUNT}
MOST_POPULAR_BANDS=/popular/most_popular_bands/{COUNT}
MOST_POPULAR_ALBUMS=/popular/most_popular_albums/{COUNT}
MOST_POPULAR_GENRES=/popular/most_popular_genres/{COUNT}
TRENDING_SONGS=/discovery/trending_songs/{COUNT}
```

### **DISCOVERY**
```env
DISCOVERY_ALL_GENRES=/discovery/all_genres
DISCOVERY_POPULAR_BANDS=/discovery/most_popular_bands/{COUNT}
DISCOVERY_TRENDING_SONGS=/discovery/trending_songs/{COUNT}
DISCOVERY_POPULAR_ALBUMS=/discovery/most_popular_albums/{COUNT}
DISCOVERY_POPULAR_GENRES=/discovery/most_popular_genres/{COUNT}
GENRES_SONG_LIST=/discovery/songs_by_genre/{GENRESID}
```

### **CALENDAR & EVENTS**
```env
EVENT_CREATE=/eventmanagement/create-event
EVENT_UPDATE=/eventmanagement/update-event
EVENT_DELETE=/eventmanagement/event/delete
EVENT_LIST=/eventmanagement/events-list
EVENT_ADMIN_LIST=/eventmanagement/admin/events-list
EVENT_REMOVE=/event/remove
GET_DAY_EVENT=/event/day
GOOGLE_EVENT=/event/google
GET_GOOGLE_EVENT=/event/google/get
```

### **STATISTICS** (7 different APIs)
```env
GET_RADIO_STATIONS_STATISTICS=/popular/radio_stations
GET_POPULAR_ARTIST_STATISTICS=/popular/artist
GET_GENRES_PREFRENCE_STATISTICS=/popular/genres
GET_EVENTS_STATISTICS=/popular/events
GET_BANDS_STATISTICS=/popular/bands
GET_POPULAR_ARTIST_GENRES_STATISTICS=/popular/artist_per_genre
GET_USERS_STATISTICS=/popular/users
```

### **NOTIFICATIONS**
```env
REGISTER_DEVICE_TOKEN=/user/notification/register-token
UNREGISTER_DEVICE_TOKEN=/user/notification/un-register-token
```

### **ADDITIONAL CONFIGURATION**
```env
MAP_API_KEY=your_map_api_key_here
ALBUM_DETAILS=/album/details
ALBUMS_LIST=/album/list
FAVORITE_SONG_LIST=/song/favorites
SONG_LIST_BY_GENRE=/song/list/by-genre
INSTRUMENT_GET=/user/instrument
INSTRUMENT_UPDATE=/user/instrument/update
CITY_UPDATE=/user/city/update
STATION_SWITCHING=/user/station_switching
USER_GENRES=/user/genres
ARTIST_PROFILE=/artist/profile
DELETE_FOLLOWERS=/user/followers/delete
GET_INSTRUMENTS=/auth/instruments
GET_USER_AVATAR=/user/avatar
GET_BANDSONG_LIST=/band/{BANDID}/songs
```

### **ONBOARDING ENDPOINTS**
```env
GET_ALL_GENRES_URL=/onboarding/all-genres
ONBOARDING_SUPER_GENRES=/onboarding/super-genres
ONBOARDING_VALIDATE_COMMUNITY=/onboarding/validate-community
COMMUNITIES_CITIES_AUTOCOMPLETE=/communities/cities-autocomplete
```

### **ANALYTICS & USER STATISTICS**
```env
GET_USER_STATISTICS=/user/statistics
GET_USER_GENRES=/user/genres
GET_USER_AVATAR=/user/avatar
POST_SONG_ID=/song/post-id
```

---

## **Backend Environment Variables** (`Webapp_API-Develop/.env`)

### **Server Configuration**
```env
PORT=3000
NODE_ENV=development
```

### **Database Configuration**
```env
DB_HOST=localhost
DB_USERNAME=postgres
DB_PASSWORD=your_database_password_here
DB_NAME=your_database_name_here
DB_PORT=5432
```

### **JWT Configuration**
```env
JWT_ACCESS_TOKEN_SECRET=your_access_token_secret_here
JWT_REFRESH_TOKEN_SECRET=your_refresh_token_secret_here
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

### **Client Authentication**
```env
CLIENT_ID=your_client_id_here
CLIENT_SECRET=your_client_secret_here
```

### **Web URL**
```env
WEB_URL=http://localhost:4321
```

---

## **Common Issues & Solutions**

### **1. SASL Authentication Error**
**Problem**: Database connection fails with "client password must be a string"
**Solution**: Ensure `dotenv.config()` is called first in `index.js` before any imports

### **2. "Not Found" API Errors**
**Problem**: Services trying to use undefined environment variables
**Common Fixes**:
- `Config.GET_NEW_RELEASES` → `Config.HOME_NEW_RELEASES`
- `Config.GET_RADIOSTATIONS_SONGS` → `Config.GET_RADIO_STATIONS_SONGS`

### **3. Missing Environment Variables**
**Problem**: Services failing due to missing variables
**Solution**: Add missing variables to `.env` file:
```env
GET_INSTRUMENTS=/auth/instruments
GET_USER_AVATAR=/user/avatar
GET_BANDSONG_LIST=/band/{BANDID}/songs
VERIFY_USERNAME=/auth/verify-username
SSOLOGIN=/auth/sso-login
TREANDING_SONGS=/popular/trending_songs/{COUNT}
UNFAV_SONG=/song/unfavorite
UPDATE_CITY=/user/city/update
UPDATE_INSTRUMENTS=/user/instrument/update
REMOVE_EVENT=/event/remove
UNFOLLOW=/user/unfollow
UNDO_BAND_FOLLOW=/user/undo-band-follow
FAV_SONG_LIST=/song/favorites
FOLLOWING=/user/following/{CURRNETUSERID}
FOLLOW=/user/follow
POST_SONGID=/song/post-id
FAV_SONG=/song/favorite
SONG_DOWNVOTE=/song/downvote
```

---

## **File Locations**

| Purpose | File Path |
|---------|-----------|
| React Native Environment | `Mobile_App-Dev/.env` |
| Backend Environment | `Webapp_API-Develop/.env` |
| Environment Backup | `Mobile_App-Dev/.env.backup` |
| Sample Environment | `Webapp_API-Develop/sample.env` |

---

## **Validation Checklist**

### **React Native App** (`.env`)
- [ ] `BASE_URL` points to correct backend URL
- [ ] All `GET_*` variables have correct endpoint paths
- [ ] API keys are properly configured
- [ ] Client credentials are set

### **Backend Server** (`Webapp_API-Develop/.env`)
- [ ] Database connection parameters are correct
- [ ] JWT secrets are properly configured
- [ ] Client credentials match React Native app
- [ ] Server port is set correctly

---

## **Quick Reference Commands**

### **Check Environment Variables**
```powershell
# Check specific variables
findstr "GET_RADIO" .env
findstr "DB_" .env

# Check for missing variables
findstr "GET_INSTRUMENTS\|GET_USER_AVATAR" .env
```

### **Copy Environment Template**
```powershell
# Copy backup to main file
copy .env.backup .env
```

---

## **Last Updated**
- **Date**: July 28, 2025
- **Total Variables**: 138
- **Status**: ✅ Complete and verified

---

## **Related Documentation**
- `QUICK-FIXES.md` - Common issues and solutions
- `PROJECT-STRUCTURE.md` - Complete project architecture
- `README-Scripts.md` - Development scripts and commands 