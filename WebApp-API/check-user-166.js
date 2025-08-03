const { Sequelize } = require('sequelize');

// Database configuration
const sequelize = new Sequelize('uprise_radiyo', 'postgres', 'Loca$h2682', {
    host: 'localhost',
    port: 5432,
    dialect: 'postgres',
    logging: false
});

async function checkUser166() {
    try {
        console.log('=== CHECKING USER 166 (thirteen@yopmail.com) ===');
        
        // Test database connection
        await sequelize.authenticate();
        console.log('✅ Database connection successful');
        
        // Get user 166 details
        const user166 = await sequelize.query(`
            SELECT id, email, "firstName", "lastName", "onBoardingStatus", status
            FROM "Users" 
            WHERE id = 166
        `, { type: Sequelize.QueryTypes.SELECT });
        
        console.log('\n👤 User 166 details:');
        if (user166.length > 0) {
            console.log(user166[0]);
        } else {
            console.log('❌ User 166 not found');
            return;
        }
        
        // Check station preferences for user 166
        const stationPrefs = await sequelize.query(`
            SELECT *
            FROM "UserStationPrefrences"
            WHERE "userId" = 166
        `, { type: Sequelize.QueryTypes.SELECT });
        
        console.log('\n📍 Station preferences for user 166:');
        if (stationPrefs.length > 0) {
            stationPrefs.forEach(pref => {
                console.log(pref);
            });
        } else {
            console.log('❌ No station preferences found for user 166');
        }
        
        // Check genre preferences for user 166
        const genrePrefs = await sequelize.query(`
            SELECT ugp.*, g.name as genre_name
            FROM "UserGenrePrefrences" ugp
            LEFT JOIN "Genres" g ON g.id = ugp."genreId"
            WHERE ugp."userId" = 166
        `, { type: Sequelize.QueryTypes.SELECT });
        
        console.log('\n🎵 Genre preferences for user 166:');
        if (genrePrefs.length > 0) {
            genrePrefs.forEach(pref => {
                console.log(`Genre ID: ${pref.genreId} | Name: ${pref.genre_name}`);
            });
        } else {
            console.log('❌ No genre preferences found for user 166');
        }
        
        // Check if user 166 has any songs
        const userSongs = await sequelize.query(`
            SELECT COUNT(*) as song_count
            FROM "Songs"
            WHERE "uploadedBy" = 166 AND "deletedAt" IS NULL
        `, { type: Sequelize.QueryTypes.SELECT });
        
        console.log(`\n🎵 Songs uploaded by user 166: ${userSongs[0].song_count}`);
        
    } catch (error) {
        console.log('❌ Error:', error.message);
    } finally {
        await sequelize.close();
    }
}

checkUser166(); 