require('dotenv').config();
const { runQuery } = require('./src/utils/dbquery');
const { QueryTypes } = require('sequelize');

async function checkStationFormat() {
    console.log('=== CHECKING STATION FORMAT ===\n');

    try {
        // Check user thirteen's station preference
        const userStation = await runQuery(`
            SELECT 
                u.id as user_id,
                u."userName",
                usp."stationPrefrence",
                usp."stationType",
                usp.active
            FROM "Users" u
            LEFT JOIN "UserStationPrefrences" usp ON u.id = usp."userId" AND usp.active = true
            WHERE u."userName" = 'thirteen'
        `, { type: QueryTypes.SELECT });

        console.log('User Station Preference:');
        console.log(JSON.stringify(userStation, null, 2));
        console.log('\n');

        if (userStation.length > 0) {
            const station = userStation[0];
            console.log(`Current station preference: "${station.stationPrefrence}"`);
            console.log(`Expected format: "Austin TX Punk Uprise"`);
            
            // Parse the station preference to extract components
            const parts = station.stationPrefrence.split(' ');
            console.log('Station parts:', parts);
            
            if (parts.length >= 4 && parts[parts.length - 1] === 'Uprise') {
                const city = parts[0];
                const state = parts[1];
                const genre = parts[2];
                console.log(`Parsed - City: "${city}", State: "${state}", Genre: "${genre}"`);
            } else {
                console.log('❌ Station format does not match expected pattern');
                console.log('Expected: "Austin TX Punk Uprise"');
                console.log('Current: "' + station.stationPrefrence + '"');
            }
        }

        // Check what songs would match this station format
        console.log('\n=== CHECKING SONGS FOR STATION ===');
        
        // If station is "Austin TX Punk Uprise", we need to find songs that match:
        // - cityName: "Austin" 
        // - stateName: "Texas" (or "TX")
        // - genre: "Punk" (genreId: 1)
        
        const stationSongs = await runQuery(`
            SELECT 
                s.id,
                s.title,
                s."cityName",
                s."stateName",
                s.live,
                b.status as band_status,
                g.name as genre_name
            FROM "Songs" s
            LEFT JOIN "Bands" b ON b.id = s."bandId"
            LEFT JOIN "SongGenres" sg ON sg."songId" = s.id
            LEFT JOIN "Genres" g ON g.id = sg."genreId"
            WHERE s."deletedAt" IS NULL 
            AND s.live = true
            AND b.status = 'ACTIVE'
            AND lower(s."cityName") = lower('Austin')
            AND (lower(s."stateName") = lower('Texas') OR lower(s."stateName") = lower('TX'))
            AND sg."genreId" = 1
            ORDER BY s.id
        `, { type: QueryTypes.SELECT });

        console.log('Songs matching "Austin TX Punk Uprise" station:');
        console.log(JSON.stringify(stationSongs, null, 2));

    } catch (error) {
        console.error('❌ ERROR:', error.message);
    }
}

checkStationFormat().then(() => {
    console.log('\nCheck complete.');
    process.exit(0);
}).catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
}); 