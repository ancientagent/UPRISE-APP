const { Sequelize } = require('sequelize');

// Database configuration
const sequelize = new Sequelize('uprise_radiyo', 'postgres', 'Loca$h2682', {
    host: 'localhost',
    port: 5432,
    dialect: 'postgres',
    logging: false
});

async function fixCorruptedUserGenres() {
    try {
        console.log('=== FIXING CORRUPTED USER GENRE DATA ===');
        
        // Test database connection
        await sequelize.authenticate();
        console.log('✅ Database connection successful');
        
        // Step 1: Get all valid genre IDs from the Genres table
        console.log('\n📋 Step 1: Getting valid genre IDs...');
        const validGenres = await sequelize.query(`
            SELECT id, name FROM "Genres" 
            ORDER BY id
        `, { type: Sequelize.QueryTypes.SELECT });
        
        console.log(`Found ${validGenres.length} valid genres`);
        console.log('First 5 valid genres:', validGenres.slice(0, 5));
        
        // Step 2: Find corrupted user genre preferences
        console.log('\n🔍 Step 2: Finding corrupted user genre preferences...');
        const corruptedPreferences = await sequelize.query(`
            SELECT ugp.id, ugp."userId", ugp."genreId", u.email
            FROM "UserGenrePrefrences" ugp
            LEFT JOIN "Users" u ON u.id = ugp."userId"
            WHERE ugp."genreId" NOT IN (
                SELECT id FROM "Genres"
            )
            ORDER BY ugp.id
        `, { type: Sequelize.QueryTypes.SELECT });
        
        console.log(`Found ${corruptedPreferences.length} corrupted genre preferences`);
        
        if (corruptedPreferences.length > 0) {
            console.log('Corrupted preferences:');
            corruptedPreferences.forEach(pref => {
                console.log(`  - User ${pref.userId} (${pref.email}): Invalid genreId ${pref.genreId}`);
            });
            
            // Step 3: Fix corrupted preferences by setting them to Punk (ID: 1)
            console.log('\n🔧 Step 3: Fixing corrupted preferences...');
            const punkGenreId = 1; // Punk genre ID
            
            const updateResult = await sequelize.query(`
                UPDATE "UserGenrePrefrences" 
                SET "genreId" = :punkGenreId
                WHERE "genreId" NOT IN (
                    SELECT id FROM "Genres"
                )
            `, { 
                replacements: { punkGenreId },
                type: Sequelize.QueryTypes.UPDATE 
            });
            
            console.log(`✅ Fixed ${corruptedPreferences.length} corrupted genre preferences`);
            console.log(`All corrupted preferences now set to Punk (ID: ${punkGenreId})`);
            
        } else {
            console.log('✅ No corrupted genre preferences found');
        }
        
        // Step 4: Verify the fix
        console.log('\n✅ Step 4: Verifying the fix...');
        const remainingCorrupted = await sequelize.query(`
            SELECT COUNT(*) as count
            FROM "UserGenrePrefrences" ugp
            WHERE ugp."genreId" NOT IN (
                SELECT id FROM "Genres"
            )
        `, { type: Sequelize.QueryTypes.SELECT });
        
        console.log(`Remaining corrupted preferences: ${remainingCorrupted[0].count}`);
        
        if (remainingCorrupted[0].count === 0) {
            console.log('🎉 SUCCESS: All corrupted genre preferences have been fixed!');
        } else {
            console.log('⚠️ WARNING: Some corrupted preferences still exist');
        }
        
        // Step 5: Show summary of user genre preferences
        console.log('\n📊 Step 5: Summary of user genre preferences...');
        const userGenreSummary = await sequelize.query(`
            SELECT g.name as genre_name, COUNT(ugp."userId") as user_count
            FROM "UserGenrePrefrences" ugp
            JOIN "Genres" g ON g.id = ugp."genreId"
            GROUP BY g.id, g.name
            ORDER BY user_count DESC
        `, { type: Sequelize.QueryTypes.SELECT });
        
        console.log('User genre preferences summary:');
        userGenreSummary.forEach(item => {
            console.log(`  - ${item.genre_name}: ${item.user_count} users`);
        });
        
        console.log('\n=== FIX COMPLETE ===');
        
    } catch (error) {
        console.error('❌ ERROR:', error.message);
        console.error('Stack:', error.stack);
    } finally {
        await sequelize.close();
    }
}

fixCorruptedUserGenres(); 