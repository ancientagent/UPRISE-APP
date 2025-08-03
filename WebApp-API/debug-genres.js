const { Pool } = require('pg');

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'Loca$h2682',
    database: 'uprise_radiyo',
    port: 5432
});

async function debugGenres() {
    try {
        console.log('=== DEBUGGING GENRE MATCHING ===\n');

        // 1. Check what genres the Austin bands have
        console.log('1. Checking genres for Austin bands:');
        const austinBandGenres = await pool.query(`
            SELECT DISTINCT 
                b.id as band_id,
                b.title as band_name,
                s.id as song_id,
                s.title as song_title,
                g.id as genre_id,
                g.name as genre_name
            FROM "Bands" b
            JOIN "Songs" s ON s."bandId" = b.id
            JOIN "SongGenres" sg ON sg."songId" = s.id
            JOIN "Genres" g ON g.id = sg."genreId"
            WHERE s."cityName" = 'Austin'
            AND s."deletedAt" IS NULL
            AND s.live = true
            ORDER BY b.title, s.title, g.name
        `);
        console.log('Austin band genres:', austinBandGenres.rows);
        console.log('');

        // 2. Check if any Austin songs have Blues genre
        console.log('2. Checking if Austin songs have Blues genre:');
        const bluesInAustin = await pool.query(`
            SELECT 
                s.id as song_id,
                s.title as song_title,
                b.title as band_name,
                g.name as genre_name
            FROM "Songs" s
            JOIN "Bands" b ON b.id = s."bandId"
            JOIN "SongGenres" sg ON sg."songId" = s.id
            JOIN "Genres" g ON g.id = sg."genreId"
            WHERE s."cityName" = 'Austin'
            AND s."deletedAt" IS NULL
            AND s.live = true
            AND g.name = 'Blues'
        `);
        console.log('Blues songs in Austin:', bluesInAustin.rows);
        console.log('');

        // 3. Check what genres exist in the database
        console.log('3. All available genres:');
        const allGenres = await pool.query(`
            SELECT id, name FROM "Genres" ORDER BY name
        `);
        console.log('Available genres:', allGenres.rows);
        console.log('');

        // 4. Check what genres the user's preferred genre (Blues) is associated with
        console.log('4. Checking what songs have Blues genre:');
        const bluesSongs = await pool.query(`
            SELECT 
                s.id as song_id,
                s.title as song_title,
                s."cityName",
                s."stateName",
                b.title as band_name
            FROM "Songs" s
            JOIN "Bands" b ON b.id = s."bandId"
            JOIN "SongGenres" sg ON sg."songId" = s.id
            JOIN "Genres" g ON g.id = sg."genreId"
            WHERE s."deletedAt" IS NULL
            AND s.live = true
            AND g.name = 'Blues'
            ORDER BY s."cityName", s."stateName"
        `);
        console.log('All Blues songs:', bluesSongs.rows);
        console.log('');

        // 5. Check if there are any songs without genre associations
        console.log('5. Checking songs without genre associations:');
        const songsWithoutGenres = await pool.query(`
            SELECT 
                s.id as song_id,
                s.title as song_title,
                s."cityName",
                s."stateName",
                b.title as band_name
            FROM "Songs" s
            JOIN "Bands" b ON b.id = s."bandId"
            LEFT JOIN "SongGenres" sg ON sg."songId" = s.id
            WHERE s."deletedAt" IS NULL
            AND s.live = true
            AND sg."songId" IS NULL
            AND s."cityName" = 'Austin'
            LIMIT 10
        `);
        console.log('Austin songs without genres:', songsWithoutGenres.rows);
        console.log('');

    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await pool.end();
    }
}

debugGenres(); 