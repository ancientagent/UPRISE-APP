require('dotenv').config();
const { runQuery } = require('./src/utils/dbquery');
const { QueryTypes } = require('sequelize');

async function checkStationPreference() {
    console.log('=== CHECKING STATION PREFERENCE FOR USER THIRTEEN ===\n');

    try {
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
            console.log(`Station Preference: "${station.stationPrefrence}"`);
            console.log(`Station Type: ${station.stationType} (1=City, 2=State, 3=National)`);
            
            // Parse the station preference to extract city and state
            const parts = station.stationPrefrence.split(',');
            if (parts.length >= 2) {
                const city = parts[0].trim();
                const state = parts[1].trim();
                console.log(`Parsed - City: "${city}", State: "${state}"`);
            } else {
                console.log(`Could not parse city/state from: "${station.stationPrefrence}"`);
            }
        }

    } catch (error) {
        console.error('❌ ERROR:', error.message);
    }
}

checkStationPreference().then(() => {
    console.log('\nCheck complete.');
    process.exit(0);
}).catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
}); 