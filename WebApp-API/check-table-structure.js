const { Sequelize } = require('sequelize');

// Database configuration
const sequelize = new Sequelize('uprise_radiyo', 'postgres', 'Loca$h2682', {
    host: 'localhost',
    port: 5432,
    dialect: 'postgres',
    logging: false
});

async function checkTableStructure() {
    try {
        console.log('=== CHECKING TABLE STRUCTURE ===');
        
        // Test database connection
        await sequelize.authenticate();
        console.log('✅ Database connection successful');
        
        // Check UserStationPrefrences table structure
        const tableInfo = await sequelize.query(`
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns
            WHERE table_name = 'UserStationPrefrences'
            ORDER BY ordinal_position
        `, { type: Sequelize.QueryTypes.SELECT });
        
        console.log('\n📋 UserStationPrefrences table structure:');
        tableInfo.forEach(col => {
            console.log(`${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
        });
        
        // Check if table exists and has data
        const tableExists = await sequelize.query(`
            SELECT COUNT(*) as count
            FROM "UserStationPrefrences"
        `, { type: Sequelize.QueryTypes.SELECT });
        
        console.log(`\n📊 UserStationPrefrences record count: ${tableExists[0].count}`);
        
        // Get sample data
        const sampleData = await sequelize.query(`
            SELECT *
            FROM "UserStationPrefrences"
            LIMIT 5
        `, { type: Sequelize.QueryTypes.SELECT });
        
        console.log('\n📄 Sample UserStationPrefrences data:');
        sampleData.forEach(record => {
            console.log(record);
        });
        
    } catch (error) {
        console.log('❌ Error:', error.message);
    } finally {
        await sequelize.close();
    }
}

checkTableStructure(); 