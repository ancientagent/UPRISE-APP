const { Sequelize } = require('sequelize');

// Database configuration
const sequelize = new Sequelize('uprise_radiyo', 'postgres', 'Loca$h2682', {
    host: 'localhost',
    port: 5432,
    dialect: 'postgres',
    logging: false
});

async function checkVotesTable() {
    try {
        console.log('=== CHECKING VOTES TABLE STRUCTURE ===');
        
        // Test database connection
        await sequelize.authenticate();
        console.log('✅ Database connection successful');
        
        // Check Votes table structure
        const tableInfo = await sequelize.query(`
            SELECT column_name, data_type, is_nullable, column_default
            FROM information_schema.columns
            WHERE table_name = 'Votes'
            ORDER BY ordinal_position
        `, { type: Sequelize.QueryTypes.SELECT });
        
        console.log('Votes table structure:');
        tableInfo.forEach(col => {
            console.log(`  - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable}, default: ${col.column_default})`);
        });
        
        // Check if tier column exists
        const tierColumn = tableInfo.find(col => col.column_name === 'tier');
        if (tierColumn) {
            console.log('\n✅ Tier column exists in Votes table');
            console.log(`  - Type: ${tierColumn.data_type}`);
            console.log(`  - Nullable: ${tierColumn.is_nullable}`);
            console.log(`  - Default: ${tierColumn.column_default}`);
        } else {
            console.log('\n❌ Tier column is MISSING from Votes table');
        }
        
        // Check for any existing votes
        const voteCount = await sequelize.query(`
            SELECT COUNT(*) as count FROM "Votes"
        `, { type: Sequelize.QueryTypes.SELECT });
        
        console.log(`\nTotal votes in table: ${voteCount[0].count}`);
        
    } catch (error) {
        console.error('❌ ERROR:', error.message);
        console.error('Stack:', error.stack);
    } finally {
        await sequelize.close();
    }
}

checkVotesTable(); 