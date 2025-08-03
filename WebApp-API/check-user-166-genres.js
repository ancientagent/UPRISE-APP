const { Sequelize } = require('sequelize');

// Database configuration
const sequelize = new Sequelize('uprise_radiyo', 'postgres', 'Loca$h2682', {
    host: 'localhost',
    port: 5432,
    dialect: 'postgres',
    logging: false
});

async function checkUser166Genres() {
    try {
        console.log('=== CHECKING USER 166 GENRE PREFERENCES ===');
        
        // Test database connection
        await sequelize.authenticate();
        console.log('✅ Database connection successful');
        
        // Check user 166's genre preferences
        const userGenres = await sequelize.query(`
            SELECT ugp.id, ugp."userId", ugp."genreId", g.name as genre_name, u.email
            FROM "UserGenrePrefrences" ugp
            LEFT JOIN "Genres" g ON g.id = ugp."genreId"
            LEFT JOIN "Users" u ON u.id = ugp."userId"
            WHERE ugp."userId" = 166
            ORDER BY ugp.id
        `, { type: Sequelize.QueryTypes.SELECT });
        
        console.log(`User 166 genre preferences: ${userGenres.length}`);
        userGenres.forEach(pref => {
            console.log(`  - ID ${pref.id}: genreId ${pref.genreId} (${pref.genre_name || 'INVALID'})`);
        });
        
        // Check if user 166 has any genre preferences at all
        const userGenreCount = await sequelize.query(`
            SELECT COUNT(*) as count
            FROM "UserGenrePrefrences"
            WHERE "userId" = 166
        `, { type: Sequelize.QueryTypes.SELECT });
        
        console.log(`\nUser 166 total genre preferences: ${userGenreCount[0].count}`);
        
        // Check user 166's station preference
        const userStation = await sequelize.query(`
            SELECT usp.*, u.email
            FROM "UserStationPrefrences" usp
            LEFT JOIN "Users" u ON u.id = usp."userId"
            WHERE usp."userId" = 166
            ORDER BY usp.id
        `, { type: Sequelize.QueryTypes.SELECT });
        
        console.log(`\nUser 166 station preferences: ${userStation.length}`);
        userStation.forEach(station => {
            console.log(`  - ID ${station.id}: ${station.stationPrefrence} (Type: ${station.stationType}, Active: ${station.active})`);
        });
        
        // Check if user 166 has any songs
        const userSongs = await sequelize.query(`
            SELECT COUNT(*) as count
            FROM "Songs"
            WHERE "uploadedBy" = 166
        `, { type: Sequelize.QueryTypes.SELECT });
        
        console.log(`\nUser 166 songs: ${userSongs[0].count}`);
        
    } catch (error) {
        console.error('❌ ERROR:', error.message);
        console.error('Stack:', error.stack);
    } finally {
        await sequelize.close();
    }
}

checkUser166Genres(); 