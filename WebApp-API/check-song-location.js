require('dotenv').config();
const { runQuery } = require('./src/utils/dbquery');
const { QueryTypes } = require('sequelize');

async function checkSongLocation() {
    console.log('=== CHECKING SONG LOCATION FORMAT ===\n');

    try {
        // Check song 56 specifically
        const song56 = await runQuery(`
            SELECT 
                s.id,
                s.title,
                s."cityName",
                s."stateName",
                s.live,
                b.status as band_status
            FROM "Songs" s
            LEFT JOIN "Bands" b ON b.id = s."bandId"
            WHERE s.id = 56
        `, { type: QueryTypes.SELECT });

        console.log('Song 56 details:');
        console.log(JSON.stringify(song56, null, 2));
        console.log('\n');

        // Check all songs in Austin
        const austinSongs = await runQuery(`
            SELECT 
                s.id,
                s.title,
                s."cityName",
                s."stateName",
                s.live,
                b.status as band_status
            FROM "Songs" s
            LEFT JOIN "Bands" b ON b.id = s."bandId"
            WHERE s."deletedAt" IS NULL 
            AND lower(s."cityName") = lower('Austin')
            ORDER BY s.id
        `, { type: QueryTypes.SELECT });

        console.log('All songs in Austin:');
        console.log(JSON.stringify(austinSongs, null, 2));
        console.log('\n');

        // Test the exact query that the radio endpoint uses
        const radioQuery = `
            SELECT s.id, s.title, s."promotedSong"
            FROM "Songs" s
            LEFT JOIN "Bands" b ON b.id = s."bandId"
            WHERE s."deletedAt" IS NULL 
            AND s.live = true 
            AND b.status = 'ACTIVE'
            AND s.id NOT IN (
                SELECT DISTINCT usl."songId" 
                FROM "UserSongListens" usl 
                WHERE usl."userId" = 166
                AND usl."createdAt" > NOW() - INTERVAL '24 hours'
            )
            AND lower(s."cityName") = lower('Austin')
            AND EXISTS (
                SELECT 1 FROM "SongGenres" sg 
                WHERE sg."songId" = s.id 
                AND sg."genreId" IN (1)
            )
            ORDER BY RANDOM() 
            LIMIT 1
        `;

        console.log('Testing radio query:');
        console.log(radioQuery);
        console.log('\n');

        const radioResult = await runQuery(radioQuery, { type: QueryTypes.SELECT });
        console.log('Radio query result:');
        console.log(JSON.stringify(radioResult, null, 2));

    } catch (error) {
        console.error('❌ ERROR:', error.message);
    }
}

checkSongLocation().then(() => {
    console.log('\nCheck complete.');
    process.exit(0);
}).catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
}); 