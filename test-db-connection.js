const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('uprise_radiyo', 'postgres', 'Loca$h2682', {
    host: 'localhost',
    dialect: 'postgres',
    logging: false
});

async function testConnection() {
    try {
        console.log('=== TESTING DATABASE CONNECTION ===\n');
        
        // Test connection
        await sequelize.authenticate();
        console.log('✅ Database connection successful!');
        
        // Test the feed query
        const feedResults = await sequelize.query(`
            SELECT s.id, s.title, s.live, s."cityName", s."stateName", b.status as band_status
            FROM "Songs" s
            LEFT JOIN "Bands" b ON b.id = s."bandId"
            WHERE s."deletedAt" IS NULL 
            AND b.status = 'ACTIVE' 
            AND s.live = true
            AND lower(s."cityName") = lower('Austin')
            AND EXISTS (
                SELECT 1 FROM "SongGenres" sg
                WHERE sg."songId" = s.id
                AND sg."genreId" IN (1)
            )
        `, { type: Sequelize.QueryTypes.SELECT });
        
        console.log('\nFeed query results:', feedResults);
        console.log('✅ Feed query working with correct database!');
        
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
    } finally {
        await sequelize.close();
    }
}

testConnection(); 