const { Pool } = require('pg');

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'Loca$h2682',
    database: 'uprise_radiyo',
    port: 5432
});

async function verifyUserGenre() {
    try {
        console.log('=== VERIFYING USER GENRE PREFERENCE ===\n');

        const userId = 135; // xxx@yopmail.com

        // 1. Check current genre preferences
        console.log('1. Checking current genre preferences for user 135:');
        const genrePrefs = await pool.query(`
            SELECT ugp."genreId", g.name as genre_name
            FROM "UserGenrePrefrences" ugp
            JOIN "Genres" g ON g.id = ugp."genreId"
            WHERE ugp."userId" = $1
        `, [userId]);
        
        console.log('Current genre preferences:');
        genrePrefs.rows.forEach(row => {
            console.log(`  - Genre ID: ${row.genreId}, Name: ${row.genre_name}`);
        });
        console.log('');

        // 2. Check what Punk is
        console.log('2. Checking Punk genre in database:');
        const punkGenre = await pool.query(`
            SELECT id, name
            FROM "Genres"
            WHERE name ILIKE '%punk%'
            ORDER BY id
        `);
        
        console.log('Punk-related genres found:');
        punkGenre.rows.forEach(row => {
            console.log(`  - ID: ${row.id}, Name: "${row.name}"`);
        });
        console.log('');

        // 3. Check what Blues is
        console.log('3. Checking Blues genre in database:');
        const bluesGenre = await pool.query(`
            SELECT id, name
            FROM "Genres"
            WHERE name ILIKE '%blues%'
            ORDER BY id
        `);
        
        console.log('Blues-related genres found:');
        bluesGenre.rows.forEach(row => {
            console.log(`  - ID: ${row.id}, Name: "${row.name}"`);
        });
        console.log('');

        // 4. Summary
        console.log('4. SUMMARY:');
        if (genrePrefs.rows.length === 0) {
            console.log('❌ User has NO genre preferences set');
        } else if (genrePrefs.rows.some(row => row.genre_name.toLowerCase().includes('punk'))) {
            console.log('✅ User has Punk genre preference - CORRECT!');
        } else if (genrePrefs.rows.some(row => row.genre_name.toLowerCase().includes('blues'))) {
            console.log('❌ User has Blues genre preference - INCORRECT!');
        } else {
            console.log('⚠️ User has different genre preference:', genrePrefs.rows.map(r => r.genre_name).join(', '));
        }

        pool.end();

    } catch (error) {
        console.error('Error:', error.message);
        pool.end();
    }
}

verifyUserGenre(); 