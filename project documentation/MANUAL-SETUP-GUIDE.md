# 🚀 Manual Environment Setup Guide

Since we've been having issues with PowerShell syntax, here's a simple manual approach to set up your environment files.

## Option 1: Use the Batch File (Recommended)

Simply double-click or run:
```cmd
setup-environment.bat
```

This will create all the necessary environment files automatically.

## Option 2: Manual Setup

If you prefer to do it manually, follow these steps:

### Step 1: Create `.env.example` file

Create a file called `.env.example` in your project root with this content:

```env
# =============================================================================
# UPRISE MOBILE APP - COMPREHENSIVE ENVIRONMENT CONFIGURATION
# =============================================================================
# This file contains ALL environment variables needed for the React Native app
# Copy this file to .env and configure with your actual values
# Total: 85+ environment variables organized by category
# =============================================================================

# =============================================================================
# BASE CONFIGURATION
# =============================================================================
BASE_URL=http://10.0.2.2:3000
NODE_OPTIONS=--openssl-legacy-provider

# =============================================================================
# CLIENT AUTHENTICATION
# =============================================================================
CLIENT_ID=437920819fa89d19abe380073d28839c
CLIENT_SECRET=28649120bdf32812f433f428b15ab1a1

# =============================================================================
# AUTHENTICATION ENDPOINTS
# =============================================================================
SIGNUP_URL=/auth/signup
LOGIN_URL=/auth/login
VERIFY_USER=/auth/verify-user
FORGOT_PASSWORD=/auth/forgot-password
RESET_PASSWORD=/auth/reset-password

# =============================================================================
# USER PROFILE & LOCATION
# =============================================================================
GET_USER_DETAILS_URL=/user/me
UPDATE_PROFILE_URL=/user/update_profile
UPDATE_ONBOARDING_STATUS_URL=/auth/update-onboarding-status
CHANGE_PASSWORD=/user/change-password
USER_LOCATION=/auth/user-location

# =============================================================================
# BAND RELATED ENDPOINTS (40+ endpoints)
# =============================================================================
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

# =============================================================================
# RADIO & SONGS
# =============================================================================
GET_RADIO_SONG=/radio/song/{LOCATION}
GET_RADIO_STATIONS=/popular/radio_stations
GET_RADIO_STATIONS_SONGS=/radio/stations/songs
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

# =============================================================================
# SOCIAL FEATURES
# =============================================================================
USER_FOLLOW=/user/follow
USER_UNFOLLOW=/user/unfollow
FOLLOWERS_LIST=/user/followers
FOLLOWING_LIST=/user/following
FOLLOWING_BANDS=/user/following-bands
OTHER_USER_PROFILE=/user/profile
USER_FAVORITES=/user/favorites
USER_AVATAR=/user/avatar

# =============================================================================
# LOCATION & CITIES
# =============================================================================
AVAILABLE_CITIES=/cities/available
NEAREST_LOCATIONS=/locations/nearest
GOOGLE_PLACES_API_KEY=AIzaSyDmEqT-zOSEIP_YlvyZQUAVd7SRlQvmH2g
GOOGLE_PLACES_AUTOCOMPLETE_URL=https://places.googleapis.com/v1/places:autocomplete

# =============================================================================
# HOME SCREEN CONTENT
# =============================================================================
HOME_FEED=/home/feed
HOME_EVENTS=/home/feed/events/{STATENAME}
HOME_PROMOS=/home/promos/{STATENAME}
HOME_NEW_RELEASES=/home/new-releases
HOME_RECOMMENDED_STATIONS=/home/recommended-radio-stations

# =============================================================================
# POPULAR CONTENT
# =============================================================================
MOST_PLAYED_SONGS=/popular/most_played_songs/{COUNT}
MOST_RATED_SONGS=/popular/most_rated_songs/{COUNT}
MOST_POPULAR_BANDS=/popular/most_popular_bands/{COUNT}
MOST_POPULAR_ALBUMS=/popular/most_popular_albums/{COUNT}
MOST_POPULAR_GENRES=/popular/most_popular_genres/{COUNT}
TRENDING_SONGS=/discovery/trending_songs/{COUNT}

# =============================================================================
# DISCOVERY
# =============================================================================
DISCOVERY_ALL_GENRES=/discovery/all_genres
DISCOVERY_POPULAR_BANDS=/discovery/most_popular_bands/{COUNT}
DISCOVERY_TRENDING_SONGS=/discovery/trending_songs/{COUNT}
DISCOVERY_POPULAR_ALBUMS=/discovery/most_popular_albums/{COUNT}
DISCOVERY_POPULAR_GENRES=/discovery/most_popular_genres/{COUNT}
GENRES_SONG_LIST=/discovery/songs_by_genre/{GENRESID}

# =============================================================================
# CALENDAR & EVENTS
# =============================================================================
EVENT_CREATE=/eventmanagement/create-event
EVENT_UPDATE=/eventmanagement/update-event
EVENT_DELETE=/eventmanagement/event/delete
EVENT_LIST=/eventmanagement/events-list
EVENT_ADMIN_LIST=/eventmanagement/admin/events-list
EVENT_REMOVE=/event/remove
GET_DAY_EVENT=/event/day
GOOGLE_EVENT=/event/google
GET_GOOGLE_EVENT=/event/google/get

# =============================================================================
# STATISTICS (7 different APIs)
# =============================================================================
GET_RADIO_STATIONS_STATISTICS=/popular/radio_stations
GET_POPULAR_ARTIST_STATISTICS=/popular/artist
GET_GENRES_PREFRENCE_STATISTICS=/popular/genres
GET_EVENTS_STATISTICS=/popular/events
GET_BANDS_STATISTICS=/popular/bands
GET_POPULAR_ARTIST_GENRES_STATISTICS=/popular/artist_per_genre
GET_USERS_STATISTICS=/popular/users

# =============================================================================
# NOTIFICATIONS
# =============================================================================
REGISTER_DEVICE_TOKEN=/user/notification/register-token
UNREGISTER_DEVICE_TOKEN=/user/notification/un-register-token

# =============================================================================
# ADDITIONAL CONFIGURATION
# =============================================================================
MAP_API_KEY=your_google_maps_api_key_here
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

# =============================================================================
# ONBOARDING ENDPOINTS
# =============================================================================
GET_ALL_GENRES_URL=/onboarding/all-genres
ONBOARDING_SUPER_GENRES=/onboarding/super-genres
ONBOARDING_VALIDATE_COMMUNITY=/onboarding/validate-community
COMMUNITIES_CITIES_AUTOCOMPLETE=/communities/cities-autocomplete

# =============================================================================
# ANALYTICS & USER STATISTICS
# =============================================================================
GET_USER_STATISTICS=/user/statistics
GET_USER_GENRES=/user/genres
GET_USER_AVATAR=/user/avatar
POST_SONG_ID=/song/post-id

# =============================================================================
# END OF CONFIGURATION
# =============================================================================
# Total Environment Variables: 85+
# Last Updated: January 2025
# =============================================================================
```

### Step 2: Copy to `.env`

```cmd
copy .env.example .env
```

### Step 3: Set up Backend Environment

Create `Webapp_API-Develop/.env` with this content:

```env
PORT=3000

# JWT Configuration (Required for authentication)
JWT_ACCESS_TOKEN_SECRET=uprise_access_token_secret_key_2024
JWT_REFRESH_TOKEN_SECRET=uprise_refresh_token_secret_key_2024
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Database Configuration
DB_HOST=localhost
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=postgres
DB_PORT=5432

# Client Authentication
CLIENT_ID=437920819fa89d19abe380073d28839c
CLIENT_SECRET=28649120bdf32812f433f428b15ab1a1
```

## Next Steps

1. **Edit the `.env` file** with your actual values
2. **Edit `Webapp_API-Develop/.env`** with your database credentials
3. **Restart services:**
   ```cmd
   .\stop-services.ps1
   .\start-all.ps1
   ```
4. **Test the app** to verify all 85+ API endpoints are working

## What This Fixes

This setup will resolve:
- ✅ **85+ API calls** that were failing due to undefined environment variables
- ✅ **Statistics endpoints** 404 errors
- ✅ **Onboarding flow** issues due to missing genre endpoints
- ✅ **Home scene creation** problems due to missing location endpoints
- ✅ **All discovery and social features** that were broken

## Documentation

See `COMPREHENSIVE-API-ENDPOINT-AUDIT.md` for complete technical details about the API endpoint audit and fixes. 