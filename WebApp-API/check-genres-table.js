const { Sequelize } = require('sequelize');

// Database configuration
const sequelize = new Sequelize('uprise_radiyo', 'postgres', 'Loca$h2682', {
    host: 'localhost',
    port: 5432,
    dialect: 'postgres',
    logging: false
});

async function checkGenresTable() {
    try {
        console.log('=== CHECKING GENRES TABLE STRUCTURE ===');
        
        // Test database connection
        await sequelize.authenticate();
        console.log('✅ Database connection successful');
        
        // Check Genres table structure
        const tableInfo = await sequelize.query(`
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns
            WHERE table_name = 'Genres'
            ORDER BY ordinal_position
        `, { type: Sequelize.QueryTypes.SELECT });
        
        console.log('Genres table structure:');
        tableInfo.forEach(col => {
            console.log(`  - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
        });
        
        // Get all genres
        const genres = await sequelize.query(`
            SELECT * FROM "Genres" ORDER BY id
        `, { type: Sequelize.QueryTypes.SELECT });
        
        console.log(`\nFound ${genres.length} genres:`);
        genres.slice(0, 10).forEach(genre => {
            console.log(`  - ID ${genre.id}: ${genre.name}`);
        });
        
        if (genres.length > 10) {
            console.log(`  ... and ${genres.length - 10} more`);
        }
        
    } catch (error) {
        console.error('❌ ERROR:', error.message);
        console.error('Stack:', error.stack);
    } finally {
        await sequelize.close();
    }
}

checkGenresTable(); 