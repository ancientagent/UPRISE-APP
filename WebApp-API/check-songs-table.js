const { Sequelize } = require('sequelize');

// Database configuration
const sequelize = new Sequelize('uprise_radiyo', 'postgres', 'Loca$h2682', {
    host: 'localhost',
    port: 5432,
    dialect: 'postgres',
    logging: false
});

async function checkSongsTable() {
    try {
        console.log('=== CHECKING SONGS TABLE STRUCTURE ===');
        
        // Test database connection
        await sequelize.authenticate();
        console.log('✅ Database connection successful');
        
        // Check Songs table structure
        const tableInfo = await sequelize.query(`
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns
            WHERE table_name = 'Songs'
            ORDER BY ordinal_position
        `, { type: Sequelize.QueryTypes.SELECT });
        
        console.log('Songs table structure:');
        tableInfo.forEach(col => {
            console.log(`  - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
        });
        
        // Get songs count
        const songsCount = await sequelize.query(`
            SELECT COUNT(*) as count FROM "Songs"
        `, { type: Sequelize.QueryTypes.SELECT });
        
        console.log(`\nTotal songs in database: ${songsCount[0].count}`);
        
        // Get songs for Austin location
        const austinSongs = await sequelize.query(`
            SELECT s.id, s.title, s."cityName", s."stateName", s.live
            FROM "Songs" s
            WHERE s."cityName" = 'Austin' AND s.live = true
            ORDER BY s.id
        `, { type: Sequelize.QueryTypes.SELECT });
        
        console.log(`\nSongs in Austin: ${austinSongs.length}`);
        austinSongs.forEach(song => {
            console.log(`  - ID ${song.id}: ${song.title} (Live: ${song.live})`);
        });
        
    } catch (error) {
        console.error('❌ ERROR:', error.message);
        console.error('Stack:', error.stack);
    } finally {
        await sequelize.close();
    }
}

checkSongsTable(); 