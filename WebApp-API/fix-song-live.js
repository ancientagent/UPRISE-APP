const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('uprise_radiyo', 'postgres', 'Loca$h2682', {
    host: 'localhost',
    dialect: 'postgres',
    logging: false
});

async function fixSongLive() {
    try {
        console.log('=== FIXING SONG 56 LIVE STATUS ===\n');
        
        // Update song to live = true
        await sequelize.query(`
            UPDATE "Songs" 
            SET live = true, "updatedAt" = NOW()
            WHERE id = 56
        `, { type: Sequelize.QueryTypes.UPDATE });
        
        console.log('✅ Song 56 updated to live = true');
        
        // Verify the change
        const song = await sequelize.query(`
            SELECT id, title, live, "cityName", "stateName"
            FROM "Songs" 
            WHERE id = 56
        `, { type: Sequelize.QueryTypes.SELECT });
        
        console.log('\nUpdated song details:', song);
        
        // Test the feed query now
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
        
        console.log('\nFeed query results after fix:', feedResults);
        
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
}

fixSongLive(); 