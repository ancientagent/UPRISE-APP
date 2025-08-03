const { Sequelize } = require('sequelize');

// Database configuration
const sequelize = new Sequelize('uprise_radiyo', 'postgres', 'Loca$h2682', {
    host: 'localhost',
    port: 5432,
    dialect: 'postgres',
    logging: false
});

async function checkStationPrefs() {
    try {
        console.log('=== CHECKING USER STATION PREFERENCES ===');
        
        // Test database connection
        await sequelize.authenticate();
        console.log('✅ Database connection successful');
        
        // Get all station preferences
        const stationPrefs = await sequelize.query(`
            SELECT usp.*, u.email
            FROM "UserStationPrefrences" usp
            LEFT JOIN "Users" u ON u.id = usp."userId"
            WHERE usp.active = true
            ORDER BY usp.id
        `, { type: Sequelize.QueryTypes.SELECT });
        
        console.log(`\n📊 Found ${stationPrefs.length} active station preferences:`);
        stationPrefs.forEach(pref => {
            console.log(`ID: ${pref.id} | User: ${pref.email} | Station: ${pref.stationPrefrence} | Type: ${pref.stationType} | Active: ${pref.active}`);
        });
        
        // Check for user 166 specifically
        const user166Prefs = await sequelize.query(`
            SELECT usp.*, u.email
            FROM "UserStationPrefrences" usp
            LEFT JOIN "Users" u ON u.id = usp."userId"
            WHERE usp."userId" = 166
        `, { type: Sequelize.QueryTypes.SELECT });
        
        console.log(`\n🎯 User 166 (thirteen@yopmail.com) station preferences:`);
        user166Prefs.forEach(pref => {
            console.log(`ID: ${pref.id} | Station: ${pref.stationPrefrence} | Type: ${pref.stationType} | Active: ${pref.active}`);
        });
        
        // Check what the stationPrefrence values look like
        const uniqueStations = await sequelize.query(`
            SELECT DISTINCT "stationPrefrence", COUNT(*) as count
            FROM "UserStationPrefrences"
            WHERE active = true
            GROUP BY "stationPrefrence"
            ORDER BY count DESC
        `, { type: Sequelize.QueryTypes.SELECT });
        
        console.log(`\n📍 Unique station preference values:`);
        uniqueStations.forEach(station => {
            console.log(`${station.stationPrefrence}: ${station.count} users`);
        });
        
    } catch (error) {
        console.log('❌ Error:', error.message);
    } finally {
        await sequelize.close();
    }
}

checkStationPrefs(); 