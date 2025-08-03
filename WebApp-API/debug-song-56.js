const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('uprise_radiyo', 'postgres', 'Loca$h2682', {
    host: 'localhost',
    dialect: 'postgres',
    logging: false
});

async function debugSong56() {
    try {
        console.log('=== DEBUGGING SONG 56 FEED ISSUE ===\n');
        
        // 1. Check if song exists
        const song = await sequelize.query(`
            SELECT id, title, live, "cityName", "stateName", "bandId"
            FROM "Songs" 
            WHERE id = 56
        `, { type: Sequelize.QueryTypes.SELECT });
        
        console.log('1. Song 56:', song);
        
        // 2. Check band status
        const band = await sequelize.query(`
            SELECT id, title, status
            FROM "Bands" 
            WHERE id = 52
        `, { type: Sequelize.QueryTypes.SELECT });
        
        console.log('\n2. Band 52:', band);
        
        // 3. Check song genres
        const genres = await sequelize.query(`
            SELECT sg."songId", g.id, g.name
            FROM "SongGenres" sg
            JOIN "Genres" g ON g.id = sg."genreId"
            WHERE sg."songId" = 56
        `, { type: Sequelize.QueryTypes.SELECT });
        
        console.log('\n3. Song genres:', genres);
        
        // 4. Test each condition separately
        console.log('\n4. Testing feed conditions:');
        
        // Condition 1: Song exists and not deleted
        const condition1 = await sequelize.query(`
            SELECT COUNT(*) as count FROM "Songs" WHERE id = 56 AND "deletedAt" IS NULL
        `, { type: Sequelize.QueryTypes.SELECT });
        console.log('   - Song exists and not deleted:', condition1[0].count);
        
        // Condition 2: Band is ACTIVE
        const condition2 = await sequelize.query(`
            SELECT COUNT(*) as count FROM "Bands" WHERE id = 52 AND status = 'ACTIVE'
        `, { type: Sequelize.QueryTypes.SELECT });
        console.log('   - Band is ACTIVE:', condition2[0].count);
        
        // Condition 3: Song is live
        const condition3 = await sequelize.query(`
            SELECT COUNT(*) as count FROM "Songs" WHERE id = 56 AND live = true
        `, { type: Sequelize.QueryTypes.SELECT });
        console.log('   - Song is live:', condition3[0].count);
        
        // Condition 4: City matches Austin
        const condition4 = await sequelize.query(`
            SELECT COUNT(*) as count FROM "Songs" WHERE id = 56 AND lower("cityName") = lower('Austin')
        `, { type: Sequelize.QueryTypes.SELECT });
        console.log('   - City matches Austin:', condition4[0].count);
        
        // Condition 5: Has Punk genre (ID 1)
        const condition5 = await sequelize.query(`
            SELECT COUNT(*) as count FROM "SongGenres" sg
            WHERE sg."songId" = 56 AND sg."genreId" = 1
        `, { type: Sequelize.QueryTypes.SELECT });
        console.log('   - Has Punk genre (ID 1):', condition5[0].count);
        
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
}

debugSong56(); 