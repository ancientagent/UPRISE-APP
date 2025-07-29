const { Sequelize } = require('sequelize');

// Database configuration
const sequelize = new Sequelize('uprise_radiyo', 'postgres', 'Loca$h2682', {
    host: 'localhost',
    port: 5432,
    dialect: 'postgres',
    logging: false
});

async function checkAvailableUsers() {
    try {
        console.log('=== CHECKING AVAILABLE USERS ===');
        
        // Test database connection
        await sequelize.authenticate();
        console.log('✅ Database connection successful');
        
        // Get all users with their basic info
        const users = await sequelize.query(`
            SELECT id, email, "firstName", "lastName", "onBoardingStatus", status
            FROM "Users" 
            WHERE "deletedAt" IS NULL 
            ORDER BY id
        `, { type: Sequelize.QueryTypes.SELECT });
        
        console.log(`\n📊 Found ${users.length} users:`);
        users.forEach(user => {
            console.log(`ID: ${user.id} | Email: ${user.email} | Name: ${user.firstName} ${user.lastName} | Onboarding: ${user.onBoardingStatus} | Status: ${user.status}`);
        });
        
        // Check users with station preferences
        const usersWithStationPrefs = await sequelize.query(`
            SELECT u.id, u.email, usp."cityName", usp."stateName", usp."stationType", usp.active
            FROM "Users" u
            LEFT JOIN "UserStationPrefrence" usp ON u.id = usp."userId"
            WHERE u."deletedAt" IS NULL
            ORDER BY u.id
        `, { type: Sequelize.QueryTypes.SELECT });
        
        console.log(`\n📍 Users with station preferences:`);
        usersWithStationPrefs.forEach(user => {
            if (user.cityName) {
                console.log(`ID: ${user.id} | Email: ${user.email} | Location: ${user.cityName}, ${user.stateName} | Type: ${user.stationType} | Active: ${user.active}`);
            }
        });
        
        // Check users with genre preferences
        const usersWithGenres = await sequelize.query(`
            SELECT u.id, u.email, COUNT(ugp."genreId") as genre_count
            FROM "Users" u
            LEFT JOIN "UserGenrePrefrences" ugp ON u.id = ugp."userId"
            WHERE u."deletedAt" IS NULL
            GROUP BY u.id, u.email
            HAVING COUNT(ugp."genreId") > 0
            ORDER BY u.id
        `, { type: Sequelize.QueryTypes.SELECT });
        
        console.log(`\n🎵 Users with genre preferences:`);
        usersWithGenres.forEach(user => {
            console.log(`ID: ${user.id} | Email: ${user.email} | Genres: ${user.genre_count}`);
        });
        
    } catch (error) {
        console.log('❌ Error:', error.message);
    } finally {
        await sequelize.close();
    }
}

checkAvailableUsers(); 