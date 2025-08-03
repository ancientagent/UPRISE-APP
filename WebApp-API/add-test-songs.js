const { Pool } = require('pg');

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'Loca$h2682',
    database: 'uprise_radiyo',
    port: 5432
});

async function addTestSongs() {
    try {
        console.log('=== ADDING TEST SONGS TO AUSTIN PUNK COMMUNITY ===\n');

        // 1. First, let's find or create a test band for Austin
        console.log('1. Finding/Creating test band for Austin...');
        
        // Check if we have a band for Austin (Bands table doesn't have location columns)
        const existingBand = await pool.query(`
            SELECT id, title FROM "Bands" 
            WHERE title LIKE '%Austin%' OR title LIKE '%Punk%'
            LIMIT 1
        `);

        let bandId;
        if (existingBand.rows.length > 0) {
            bandId = existingBand.rows[0].id;
            console.log(`   Using existing band: ${existingBand.rows[0].title} (ID: ${bandId})`);
        } else {
            // Create a test band (Bands table doesn't have cityName/stateName columns)
            const newBand = await pool.query(`
                INSERT INTO "Bands" (title, logo, "createdAt", "updatedAt")
                VALUES ($1, $2, NOW(), NOW())
                RETURNING id, title
            `, ['Austin Punk Collective', 'https://example.com/logo.png']);
            
            bandId = newBand.rows[0].id;
            console.log(`   Created new band: ${newBand.rows[0].title} (ID: ${bandId})`);
        }

        // 2. Add test songs
        console.log('\n2. Adding test songs...');
        
        const testSongs = [
            {
                title: 'Austin Nights',
                duration: 180,
                cityName: 'Austin',
                stateName: 'Texas',
                thumbnail: 'https://example.com/thumbnail1.jpg',
                song: 'https://example.com/song1.mp3'
            },
            {
                title: 'Punk Revolution',
                duration: 210,
                cityName: 'Austin',
                stateName: 'Texas',
                thumbnail: 'https://example.com/thumbnail2.jpg',
                song: 'https://example.com/song2.mp3'
            },
            {
                title: 'Texas Hardcore',
                duration: 165,
                cityName: 'Austin',
                stateName: 'Texas',
                thumbnail: 'https://example.com/thumbnail3.jpg',
                song: 'https://example.com/song3.mp3'
            },
            {
                title: 'Underground Scene',
                duration: 195,
                cityName: 'Austin',
                stateName: 'Texas',
                thumbnail: 'https://example.com/thumbnail4.jpg',
                song: 'https://example.com/song4.mp3'
            },
            {
                title: 'Punk Rock Anthem',
                duration: 225,
                cityName: 'Austin',
                stateName: 'Texas',
                thumbnail: 'https://example.com/thumbnail5.jpg',
                song: 'https://example.com/song5.mp3'
            }
        ];

        const songIds = [];
        for (const songData of testSongs) {
            const song = await pool.query(`
                INSERT INTO "Songs" (
                    title, duration, "cityName", "stateName", thumbnail, song, 
                    "bandId", "createdAt", "updatedAt"
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
                RETURNING id, title
            `, [
                songData.title, songData.duration, songData.cityName, songData.stateName,
                songData.thumbnail, songData.song, bandId
            ]);
            
            songIds.push(song.rows[0].id);
            console.log(`   Added song: ${song.rows[0].title} (ID: ${song.rows[0].id})`);
        }

        // 3. Add Punk genre associations to songs
        console.log('\n3. Adding Punk genre associations...');
        
        const punkGenreId = 21; // Punk genre ID
        for (const songId of songIds) {
            await pool.query(`
                INSERT INTO "SongGenres" ("songId", "genreId", "createdAt", "updatedAt")
                VALUES ($1, $2, NOW(), NOW())
            `, [songId, punkGenreId]);
        }
        console.log(`   Associated all songs with Punk genre (ID: ${punkGenreId})`);

        // 4. Add some initial SongPriority records
        console.log('\n4. Adding initial SongPriority records...');
        
        for (let i = 0; i < songIds.length; i++) {
            const timeBasedPriority = Math.random() * 2; // Random priority 0-2
            const communityPriority = 0; // Start at 0
            const finalPriority = timeBasedPriority; // Initial final priority
            
            await pool.query(`
                INSERT INTO "SongPriority" (
                    "songId", tier, "timeBasedPriority", "communityPriority", "finalPriority",
                    "communityThresholdReached", "totalUsersHeard", "requiredUsersThreshold",
                    "lastCalculated", "createdAt", "updatedAt"
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW(), NOW())
            `, [
                songIds[i], 
                'CITYWIDE', 
                timeBasedPriority, 
                communityPriority, 
                finalPriority,
                false, // communityThresholdReached
                0, // totalUsersHeard
                10 // requiredUsersThreshold
            ]);
        }
        console.log('   Added SongPriority records for all songs');

        // 5. Verify the data
        console.log('\n5. Verifying data...');
        
        const songCount = await pool.query(`
            SELECT COUNT(*) as count FROM "Songs" 
            WHERE "cityName" = 'Austin' AND "stateName" = 'Texas'
        `);
        
        const priorityCount = await pool.query(`
            SELECT COUNT(*) as count FROM "SongPriority" sp
            JOIN "Songs" s ON s.id = sp."songId"
            WHERE s."cityName" = 'Austin' AND s."stateName" = 'Texas'
        `);

        console.log(`   Total Austin songs: ${songCount.rows[0].count}`);
        console.log(`   Songs with priorities: ${priorityCount.rows[0].count}`);

        console.log('\n✅ TEST SONGS ADDED SUCCESSFULLY!');
        console.log('\n🎵 You now have 5 Austin Punk songs to test with:');
        console.log('   - Austin Nights');
        console.log('   - Punk Revolution');
        console.log('   - Texas Hardcore');
        console.log('   - Underground Scene');
        console.log('   - Punk Rock Anthem');
        console.log('\n🎯 You can now test:');
        console.log('   - Home feed loading');
        console.log('   - SongPriorities system');
        console.log('   - Fair Play algorithm');
        console.log('   - Genre filtering');

    } catch (error) {
        console.error('Error adding test songs:', error);
    } finally {
        await pool.end();
    }
}

addTestSongs(); 