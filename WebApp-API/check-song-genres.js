require('dotenv').config();
const { runQuery } = require('./src/utils/dbquery');
const { QueryTypes } = require('sequelize');

async function checkSongGenres() {
    console.log('=== CHECKING SONG GENRES ===\n');

    try {
        // Check what genres are associated with song 56
        const songGenres = await runQuery(`
            SELECT 
                s.id,
                s.title,
                sg."genreId",
                g.name as genre_name
            FROM "Songs" s
            LEFT JOIN "SongGenres" sg ON sg."songId" = s.id
            LEFT JOIN "Genres" g ON g.id = sg."genreId"
            WHERE s.id = 56
            ORDER BY sg."genreId"
        `, { type: QueryTypes.SELECT });

        console.log('Song 56 genres:');
        console.log(JSON.stringify(songGenres, null, 2));
        console.log('\n');

        // Check all songs with genre 1 (Punk)
        const punkSongs = await runQuery(`
            SELECT 
                s.id,
                s.title,
                s."cityName",
                s.live,
                g.name as genre_name
            FROM "Songs" s
            LEFT JOIN "SongGenres" sg ON sg."songId" = s.id
            LEFT JOIN "Genres" g ON g.id = sg."genreId"
            WHERE sg."genreId" = 1
            AND s."deletedAt" IS NULL
            ORDER BY s.id
        `, { type: QueryTypes.SELECT });

        console.log('All songs with genre 1 (Punk):');
        console.log(JSON.stringify(punkSongs, null, 2));
        console.log('\n');

        // Check if song 56 has genre 1
        const song56Punk = songGenres.filter(sg => sg.genreId === 1);
        if (song56Punk.length > 0) {
            console.log('✅ Song 56 has genre 1 (Punk)');
        } else {
            console.log('❌ Song 56 does NOT have genre 1 (Punk)');
            console.log('Available genres for song 56:', songGenres.map(sg => `${sg.genreId} (${sg.genre_name})`));
        }

    } catch (error) {
        console.error('❌ ERROR:', error.message);
    }
}

checkSongGenres().then(() => {
    console.log('\nCheck complete.');
    process.exit(0);
}).catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
}); 