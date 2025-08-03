const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('uprise_radiyo', 'postgres', 'Loca$h2682', {
    host: 'localhost',
    dialect: 'postgres',
    logging: false
});

async function checkSongFeed() {
    try {
        console.log('=== CHECKING SONG 56 FEED ISSUE ===\n');
        
        // Check song details
        const songDetails = await sequelize.query(`
            SELECT s.id, s.title, s.song, s.live, s."cityName", s."stateName", 
                   b.status as band_status, b.id as band_id, b.title as band_title
            FROM "Songs" s 
            LEFT JOIN "Bands" b ON b.id = s."bandId" 
            WHERE s.id = 56
        `, { type: Sequelize.QueryTypes.SELECT });
        
        console.log('Song 56 details:', JSON.stringify(songDetails, null, 2));
        
        // Check if song has genre
        const songGenres = await sequelize.query(`
            SELECT sg."songId", g.id as genre_id, g.name as genre_name
            FROM "SongGenres" sg
            JOIN "Genres" g ON g.id = sg."genreId"
            WHERE sg."songId" = 56
        `, { type: Sequelize.QueryTypes.SELECT });
        
        console.log('\nSong genres:', JSON.stringify(songGenres, null, 2));
        
        // Check user's genre preference
        const userGenres = await sequelize.query(`
            SELECT ugp."userId", g.id as genre_id, g.name as genre_name
            FROM "UserGenrePrefrences" ugp
            JOIN "Genres" g ON g.id = ugp."genreId"
            WHERE ugp."userId" = 166
        `, { type: Sequelize.QueryTypes.SELECT });
        
        console.log('\nUser genre preferences:', JSON.stringify(userGenres, null, 2));
        
        // Check user's location preference
        const userLocation = await sequelize.query(`
            SELECT "userId", "stationPrefrence", "stationType", active
            FROM "UserStationPrefrences"
            WHERE "userId" = 166 AND active = true
        `, { type: Sequelize.QueryTypes.SELECT });
        
        console.log('\nUser location preferences:', JSON.stringify(userLocation, null, 2));
        
        // Test the exact feed query
        const feedQuery = `
            SELECT s.id, s.title, s.live, s."cityName", s."stateName", b.status as band_status
            FROM "Songs" s
            LEFT JOIN "Bands" b ON b.id = s."bandId"
            LEFT JOIN "SongFavorites" sf ON s.id = sf."songId" AND sf."userId" = 166
            WHERE s."deletedAt" IS NULL 
            AND b.status = 'ACTIVE' 
            AND s.live = true
            AND lower(s."cityName") = lower('Austin')
            AND EXISTS (
                SELECT 1 FROM "SongGenres" sg
                WHERE sg."songId" = s.id
                AND sg."genreId" IN (1)
            )
        `;
        
        const feedResults = await sequelize.query(feedQuery, { type: Sequelize.QueryTypes.SELECT });
        console.log('\nFeed query results:', JSON.stringify(feedResults, null, 2));
        
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
}

checkSongFeed(); 