@echo off
echo ============================================================================
echo UPRISE MOBILE APP - ENVIRONMENT SETUP
echo ============================================================================
echo.

echo Creating comprehensive .env.example file...
echo.

REM Create the .env.example file with all environment variables
(
echo # =============================================================================
echo # UPRISE MOBILE APP - COMPREHENSIVE ENVIRONMENT CONFIGURATION
echo # =============================================================================
echo # This file contains ALL environment variables needed for the React Native app
echo # Copy this file to .env and configure with your actual values
echo # Total: 85+ environment variables organized by category
echo # =============================================================================
echo.
echo # =============================================================================
echo # BASE CONFIGURATION
echo # =============================================================================
echo BASE_URL=http://10.0.2.2:3000
echo NODE_OPTIONS=--openssl-legacy-provider
echo.
echo # =============================================================================
echo # CLIENT AUTHENTICATION
echo # =============================================================================
echo CLIENT_ID=437920819fa89d19abe380073d28839c
echo CLIENT_SECRET=28649120bdf32812f433f428b15ab1a1
echo.
echo # =============================================================================
echo # AUTHENTICATION ENDPOINTS
echo # =============================================================================
echo SIGNUP_URL=/auth/signup
echo LOGIN_URL=/auth/login
echo VERIFY_USER=/auth/verify-user
echo FORGOT_PASSWORD=/auth/forgot-password
echo RESET_PASSWORD=/auth/reset-password
echo.
echo # =============================================================================
echo # USER PROFILE ^& LOCATION
echo # =============================================================================
echo GET_USER_DETAILS_URL=/user/me
echo UPDATE_PROFILE_URL=/user/update_profile
echo UPDATE_ONBOARDING_STATUS_URL=/auth/update-onboarding-status
echo CHANGE_PASSWORD=/user/change-password
echo USER_LOCATION=/auth/user-location
echo.
echo # =============================================================================
echo # BAND RELATED ENDPOINTS ^(40+ endpoints^)
echo # =============================================================================
echo BAND_CREATE=/band/create
echo BAND_EDIT=/band/edit_band
echo BAND_DETAILS=/band/band_details
echo BAND_MEMBERS_LIST=/band/bandmembers_list
echo BAND_MEMBERS=/band/members
echo BAND_MEMBERS_USERNAME=/band/members_username
echo BAND_FOLLOW=/user/band-follow
echo BAND_UNFOLLOW=/user/undo-band-follow
echo BAND_EVENTS=/band/events
echo BAND_GALLERY=/band/gallery
echo BAND_SONGS=/band/songs
echo BAND_STATISTICS=/band/statistics
echo BAND_FOLLOWERS=/band/followers
echo BAND_FOLLOWING=/band/following
echo.
echo # =============================================================================
echo # RADIO ^& SONGS
echo # =============================================================================
echo GET_RADIO_SONG=/radio/song/{LOCATION}
echo GET_RADIO_STATIONS=/radio/stations
echo GET_RADIO_STATIONS_SONGS=/radio/stations/songs
echo GET_RADIO_AVAILABLE_STATES=/radio/avaliable-states
echo SONG_UPLOAD=/song/upload
echo SONG_EDIT=/song/edit
echo SONG_LIVE=/song/live
echo SONG_LIST=/song/songs-list
echo SONG_DELETE=/song/delete
echo SONG_FAVORITE=/user/song-favorite
echo SONG_UNFAVORITE=/user/song-unfavorite
echo SONG_VOTE=/votes/vote
echo SONG_UNDO_VOTE=/votes/undo-vote
echo SONG_BLAST=/votes/song-blast
echo SONG_REPORT=/song/report
echo SONG_DOWN_VOTE=/song/down-vote
echo SONG_LIKE_STATUS=/song-likes/song-like-status
echo SONG_SKIP=/song-likes/song-skip
echo SONG_LISTEN=/song-likes/song-listen
echo SONG_ENGAGEMENT=/song-likes/song-engagement
echo.
echo # =============================================================================
echo # SOCIAL FEATURES
echo # =============================================================================
echo USER_FOLLOW=/user/follow
echo USER_UNFOLLOW=/user/unfollow
echo FOLLOWERS_LIST=/user/followers
echo FOLLOWING_LIST=/user/following
echo FOLLOWING_BANDS=/user/following-bands
echo OTHER_USER_PROFILE=/user/profile
echo USER_FAVORITES=/user/favorites
echo USER_AVATAR=/user/avatar
echo.
echo # =============================================================================
echo # LOCATION ^& CITIES
echo # =============================================================================
echo AVAILABLE_CITIES=/cities/available
echo NEAREST_LOCATIONS=/locations/nearest
echo GOOGLE_PLACES_API_KEY=AIzaSyDmEqT-zOSEIP_YlvyZQUAVd7SRlQvmH2g
echo GOOGLE_PLACES_AUTOCOMPLETE_URL=https://places.googleapis.com/v1/places:autocomplete
echo.
echo # =============================================================================
echo # HOME SCREEN CONTENT
echo # =============================================================================
echo HOME_FEED=/home/feed
echo HOME_EVENTS=/home/feed/events/{STATENAME}
echo HOME_PROMOS=/home/promos/{STATENAME}
echo HOME_NEW_RELEASES=/home/new-releases
echo HOME_RECOMMENDED_STATIONS=/home/recommended-radio-stations
echo.
echo # =============================================================================
echo # POPULAR CONTENT
echo # =============================================================================
echo MOST_PLAYED_SONGS=/popular/most_played_songs/{COUNT}
echo MOST_RATED_SONGS=/popular/most_rated_songs/{COUNT}
echo MOST_POPULAR_BANDS=/popular/most_popular_bands/{COUNT}
echo MOST_POPULAR_ALBUMS=/popular/most_popular_albums/{COUNT}
echo MOST_POPULAR_GENRES=/popular/most_popular_genres/{COUNT}
echo TRENDING_SONGS=/discovery/trending_songs/{COUNT}
echo.
echo # =============================================================================
echo # DISCOVERY
echo # =============================================================================
echo DISCOVERY_ALL_GENRES=/discovery/all_genres
echo DISCOVERY_POPULAR_BANDS=/discovery/most_popular_bands/{COUNT}
echo DISCOVERY_TRENDING_SONGS=/discovery/trending_songs/{COUNT}
echo DISCOVERY_POPULAR_ALBUMS=/discovery/most_popular_albums/{COUNT}
echo DISCOVERY_POPULAR_GENRES=/discovery/most_popular_genres/{COUNT}
echo GENRES_SONG_LIST=/discovery/songs_by_genre/{GENRESID}
echo.
echo # =============================================================================
echo # CALENDAR ^& EVENTS
echo # =============================================================================
echo EVENT_CREATE=/eventmanagement/create-event
echo EVENT_UPDATE=/eventmanagement/update-event
echo EVENT_DELETE=/eventmanagement/event/delete
echo EVENT_LIST=/eventmanagement/events-list
echo EVENT_ADMIN_LIST=/eventmanagement/admin/events-list
echo EVENT_REMOVE=/event/remove
echo GET_DAY_EVENT=/event/day
echo GOOGLE_EVENT=/event/google
echo GET_GOOGLE_EVENT=/event/google/get
echo.
echo # =============================================================================
echo # STATISTICS ^(7 different APIs^)
echo # =============================================================================
echo GET_RADIO_STATIONS_STATISTICS=/popular/radio_stations
echo GET_POPULAR_ARTIST_STATISTICS=/popular/artist
echo GET_GENRES_PREFRENCE_STATISTICS=/popular/genres
echo GET_EVENTS_STATISTICS=/popular/events
echo GET_BANDS_STATISTICS=/popular/bands
echo GET_POPULAR_ARTIST_GENRES_STATISTICS=/popular/artist_per_genre
echo GET_USERS_STATISTICS=/popular/users
echo.
echo # =============================================================================
echo # NOTIFICATIONS
echo # =============================================================================
echo REGISTER_DEVICE_TOKEN=/user/notification/register-token
echo UNREGISTER_DEVICE_TOKEN=/user/notification/un-register-token
echo.
echo # =============================================================================
echo # ADDITIONAL CONFIGURATION
echo # =============================================================================
echo MAP_API_KEY=your_google_maps_api_key_here
echo ALBUM_DETAILS=/album/details
echo ALBUMS_LIST=/album/list
echo FAVORITE_SONG_LIST=/song/favorites
echo SONG_LIST_BY_GENRE=/song/list/by-genre
echo INSTRUMENT_GET=/user/instrument
echo INSTRUMENT_UPDATE=/user/instrument/update
echo CITY_UPDATE=/user/city/update
echo STATION_SWITCHING=/user/station_switching
echo USER_GENRES=/user/genres
echo ARTIST_PROFILE=/artist/profile
echo DELETE_FOLLOWERS=/user/followers/delete
echo.
echo # =============================================================================
echo # ONBOARDING ENDPOINTS
echo # =============================================================================
echo GET_ALL_GENRES_URL=/onboarding/all-genres
echo ONBOARDING_SUPER_GENRES=/onboarding/super-genres
echo ONBOARDING_VALIDATE_COMMUNITY=/onboarding/validate-community
echo COMMUNITIES_CITIES_AUTOCOMPLETE=/communities/cities-autocomplete
echo.
echo # =============================================================================
echo # ANALYTICS ^& USER STATISTICS
echo # =============================================================================
echo GET_USER_STATISTICS=/user/statistics
echo GET_USER_GENRES=/user/genres
echo GET_USER_AVATAR=/user/avatar
echo POST_SONG_ID=/song/post-id
echo.
echo # =============================================================================
echo # END OF CONFIGURATION
echo # =============================================================================
echo # Total Environment Variables: 85+
echo # Last Updated: January 2025
echo # =============================================================================
) > .env.example

echo ✅ .env.example created successfully!
echo.

REM Check if .env exists
if exist ".env" (
    echo ⚠️  .env already exists. You may want to update it with new variables.
) else (
    echo 📝 Creating .env file from template...
    copy .env.example .env
    echo ✅ .env file created! Please edit it with your actual values.
)

echo.
echo 🔧 Setting up backend environment...

REM Setup backend environment
if exist "Webapp_API-Develop\sample.env" (
    if exist "Webapp_API-Develop\.env" (
        echo ⚠️  Backend .env already exists. Backing up...
        copy "Webapp_API-Develop\.env" "Webapp_API-Develop\.env.backup"
    )
    
    copy "Webapp_API-Develop\sample.env" "Webapp_API-Develop\.env"
    echo ✅ Backend .env created from sample.env
    
    REM Add required backend variables
    (
        echo.
        echo # JWT Configuration ^(Required for authentication^)
        echo JWT_ACCESS_TOKEN_SECRET=uprise_access_token_secret_key_2024
        echo JWT_REFRESH_TOKEN_SECRET=uprise_refresh_token_secret_key_2024
        echo JWT_ACCESS_EXPIRES_IN=15m
        echo JWT_REFRESH_EXPIRES_IN=7d
        echo.
        echo # Database Configuration
        echo DB_HOST=localhost
        echo DB_USERNAME=postgres
        echo DB_PASSWORD=postgres
        echo DB_NAME=postgres
        echo DB_PORT=5432
        echo.
        echo # Client Authentication
        echo CLIENT_ID=437920819fa89d19abe380073d28839c
        echo CLIENT_SECRET=28649120bdf32812f433f428b15ab1a1
    ) >> "Webapp_API-Develop\.env"
    
    echo ✅ Backend environment variables added
) else (
    echo ❌ Backend sample.env not found. Please create Webapp_API-Develop\.env manually.
)

echo.
echo ============================================================================
echo 🎉 ENVIRONMENT SETUP COMPLETE!
echo ============================================================================
echo.
echo 📋 Next Steps:
echo 1. Edit .env file with your actual values
echo 2. Edit Webapp_API-Develop\.env with your database credentials
echo 3. Run: .\stop-services.ps1
echo 4. Run: .\start-all.ps1
echo 5. Test the app to verify all 85+ API endpoints are working
echo.
echo 📚 Documentation: See COMPREHENSIVE-API-ENDPOINT-AUDIT.md for details
echo.
pause 