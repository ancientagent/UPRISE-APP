const { Sequelize } = require('sequelize');

// Database configuration
const sequelize = new Sequelize('uprise_radiyo', 'postgres', 'Loca$h2682', {
    host: 'localhost',
    port: 5432,
    dialect: 'postgres',
    logging: false
});

async function updateExistingVotes() {
    try {
        console.log('=== UPDATING EXISTING VOTES WITH TIER ===');
        
        // Test database connection
        await sequelize.authenticate();
        console.log('✅ Database connection successful');
        
        // Update existing votes to have the default tier value
        const result = await sequelize.query(`
            UPDATE "Votes" 
            SET tier = 'CITYWIDE' 
            WHERE tier IS NULL
        `, { type: Sequelize.QueryTypes.UPDATE });
        
        console.log('✅ Updated existing votes with default tier value');
        
        // Verify the update
        const votes = await sequelize.query(`
            SELECT id, "userId", "songId", type, tier 
            FROM "Votes" 
            ORDER BY id
        `, { type: Sequelize.QueryTypes.SELECT });
        
        console.log('\nUpdated votes:');
        votes.forEach(vote => {
            console.log(`  - Vote ID ${vote.id}: User ${vote.userId}, Song ${vote.songId}, Type ${vote.type}, Tier ${vote.tier}`);
        });
        
        console.log(`\n✅ Successfully updated ${votes.length} votes with tier values`);
        
    } catch (error) {
        console.error('❌ ERROR:', error.message);
        console.error('Stack:', error.stack);
    } finally {
        await sequelize.close();
    }
}

updateExistingVotes(); 