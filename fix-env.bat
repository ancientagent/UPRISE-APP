@echo off
echo ============================================================================
echo FIXING .env FILE - REMOVING DUPLICATES AND FIXING BROKEN LINES
echo ============================================================================
echo.

echo Creating backup...
copy .env .env.backup

echo Creating corrected .env file...

REM Create the corrected .env file
(
echo # =============================================================================
echo # UPRISE MOBILE APP - ENVIRONMENT VARIABLES ^(FIXED VERSION^)
echo # =============================================================================
echo # BASE CONFIGURATION
echo # =============================================================================
echo BASE_URL=http://10.0.2.2:3000
echo CLIENT_ID=437920819fa89d19abe380073d28839c
echo CLIENT_SECRET=28649120bdf32812f433f428b15ab1a1
echo # =============================================================================
echo # AUTHENTICATION ENDPOINTS
echo # =============================================================================
echo LOGIN_URL=/auth/login
echo SIGNUP_URL=/auth/signup
echo VERIFY_USER=/auth/verify-user
echo VERIFY_USERNAME=/auth/verify-username
echo SSOLOGIN=/auth/sso-login
echo # =============================================================================
echo # USER PROFILE ^& LOCATION
echo # =============================================================================
echo GET_USER_DETAILS_URL=/user/me
echo UPDATE_PROFILE_URL=/auth/update-profile
echo UPDATE_ONBOARDING_STATUS_URL=/auth/update-onboarding-status
echo USER_LOCATION=/auth/user-location
echo UPDATE_CITY=/auth/update-city
echo GET_USER_AVATAR=/user/avatar
echo GET_USER_STATISTICS=/user/statistics
echo # ============================================================================= 
echo # BAND RELATED ENDPOINTS
echo # ============================================================================= 
echo BAND_MEMEBERS_LIST=/band/{BANDID}/members
echo GET_BANDSONG_LIST=/band/{BANDID}/songs
echo OTHER_USER_PROFILE=/user/{CURRNETUSERID}/profile/{OTHERUSERPROFILEID}
echo FOLLOWING_BANDS=/user/{CURRNETUSERID}/following-bands
echo FOLLOWING=/user/{CURRNETUSERID}/following
echo FOLLOWERS_LIST=/user/{CURRNETUSERID}/followers
echo FOLLOW=/user/follow
echo UNFOLLOW=/user/unfollow
echo UNDO_BAND_FOLLOW=/band/unfollow
echo # ============================================================================= 
echo # RADIO ^& SONGS
echo # ============================================================================= 
echo GET_RADIO_STATIONS=/radio/stations
echo GET_RADIOSTATIONS_SONGS=/radio/stations/{STATENAME}/songs
echo GET_RADIO_SONG=/radio/song/{LOCATION}
echo GET_RADIO_STATIONS_STATISTICS=/radio/stations/statistics
echo STATION_SWITCHING=/radio/station-switching
echo POST_SONGID=/radio/song
echo GET_RADIO_SONG_URL=/radio/song
echo # ============================================================================= 
echo # SOCIAL FEATURES
echo # ============================================================================= 
echo FAV_SONG=/song/favorite
echo UNFAV_SONG=/song/unfavorite
echo FAV_SONG_LIST=/song/favorites/{id}
echo SONG_VOTE=/song/vote
echo SONG_DOWNVOTE=/song/downvote
echo SONG_BLAST=/song/blast
echo SONG_REPORT=/song/report
echo # ============================================================================= 
echo # LOCATION ^& CITIES
echo # ============================================================================= 
echo AVALIABLE_CITIES=/cities/available
echo NEAREST_LOCATION=/location/nearest
echo # ============================================================================= 
echo # HOME SCREEN CONTENT
echo # ============================================================================= 
echo HOME_FEED=/home/feed
echo HOME_EVENTS=/home/events/{STATENAME}
echo HOME_PROMOS=/home/promos/{STATENAME}
echo # ============================================================================= 
echo # POPULAR CONTENT
echo # ============================================================================= 
echo MOST_PLAYED_SONGS=/popular/songs/{STATENAME}/{COUNT}
echo MOST_POPULAR_ALBUMS=/popular/albums/{COUNT}
echo MOST_POPULAR_BANDS=/popular/bands/{STATENAME}/{COUNT}
echo MOST_POPULAR_GENRES=/popular/genres/{COUNT}
echo MOST_RATED_SONGS=/popular/rated-songs/{STATENAME}/{COUNT}
echo TREANDING_SONGS=/popular/trending/{COUNT}
echo GET_NEW_RELEASES=/releases/new
echo # ============================================================================= 
echo # DISCOVERY
echo # ============================================================================= 
echo SONG_LIST=/songs/album/{ALBUMID}/band/{BANDID}
echo GENRES_SONG_LIST=/songs/genre/{GENRESID}
echo # ============================================================================= 
echo # CALENDAR ^& EVENTS
echo # ============================================================================= 
echo GET_DAY_EVENT=/events/day/{DAY}
echo GET_GOOGLE_EVENT=/events/google
echo GOOGLE_EVENT=/events/google/add
echo REMOVE_EVENT=/events/remove
echo # ============================================================================= 
echo # STATISTICS ^(FIXED - All endpoints working in backend^)
echo # ============================================================================= 
echo GET_BANDS_STATISTICS=/statistics/bands
echo GET_EVENTS_STATISTICS=/statistics/events
echo GET_GENRES_PREFRENCE_STATISTICS=/statistics/genres-preference
echo GET_POPULAR_ARTIST_STATISTICS=/statistics/popular-artists
echo GET_POPULAR_ARTIST_GENRES_STATISTICS=/statistics/popular-artist-genres
echo GET_USERS_STATISTICS=/statistics/users
echo # ============================================================================= 
echo # NOTIFICATIONS
echo # ============================================================================= 
echo REGISTER_DEVICE_TOKEN=/notifications/register-token
echo UNREGISTER_DEVICE_TOKEN=/notifications/unregister-token
echo # ============================================================================= 
echo # ADDITIONAL CONFIGURATION
echo # ============================================================================= 
echo MAP_API_KEY=AIzaSyDmEqT-zOSEIP_YlvyZQUAVd7SRlQvmH2g
echo GOOGLE_PLACES_API_KEY=AIzaSyDmEqT-zOSEIP_YlvyZQUAVd7SRlQvmH2g
echo GOOGLE_PLACES_AUTOCOMPLETE_URL=https://places.googleapis.com/v1/places:autocomplete
echo GET_INSTRUMENTS=/instruments
echo UPDATE_INSTRUMENTS=/instruments/update
echo SAMPLEAPI=https://jsonplaceholder.typicode.com/posts
echo # Database Configuration
echo DB_HOST=localhost
echo DB_USERNAME=postgres
echo DB_PASSWORD=Loca$h2682
echo DB_NAME=uprise_radiyo
echo DB_PORT=5432
echo # ============================================================================= 
echo # USER GENRES ENDPOINTS
echo # ============================================================================= 
echo GET_USER_GENRES=/user/user_prefrence_genres
echo GET_ALL_GENRES_URL=/onboarding/all-genres
) > .env

echo ✅ .env file fixed successfully!
echo.
echo 🔧 Changes made:
echo - Removed duplicate GET_ALL_GENRES_URL entries
echo - Fixed broken GOOGLE_PLACES_AUTOCOMPLETE_URL line
echo - Added missing GET_USERS_STATISTICS endpoint
echo - Cleaned up formatting
echo.
echo 📋 Next steps:
echo 1. Restart Metro bundler: .\stop-services.ps1 then .\start-all.ps1
echo 2. Test the app - statistics should now work properly
echo.
pause 