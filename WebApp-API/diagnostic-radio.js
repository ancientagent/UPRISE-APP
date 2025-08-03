require('dotenv').config();
const { runQuery } = require('./src/utils/dbquery');
const { QueryTypes } = require('sequelize');

async function diagnosticRadio() {
    console.log('=== RADIO PLAYER DIAGNOSTIC START ===\n');

    try {
        // Part 1: Verify the User's Context
        console.log('🔍 PART 1: VERIFYING USER CONTEXT');
        console.log('Finding user "thirteen" and their preferences...\n');

        const userContext = await runQuery(`
            SELECT 
                u.id as user_id,
                u."userName",
                u.email,
                usp."stationPrefrence",
                usp."stationType",
                usp.active as station_active,
                ugp."genreId"
            FROM "Users" u
            LEFT JOIN "UserStationPrefrences" usp ON u.id = usp."userId" AND usp.active = true
            LEFT JOIN "UserGenrePrefrences" ugp ON u.id = ugp."userId"
            WHERE u."userName" = 'thirteen'
            ORDER BY ugp."genreId"
        `, { type: QueryTypes.SELECT });

        console.log('User Context Results:');
        console.log(JSON.stringify(userContext, null, 2));
        console.log('\n');

        if (userContext.length === 0) {
            console.log('❌ ERROR: User "thirteen" not found!');
            return;
        }

        const user = userContext[0];
        const userGenres = userContext.map(row => row.genreId).filter(id => id !== null);

        console.log(`✅ User found: ID ${user.user_id}, Station: ${user.stationPrefrence}, Genres: ${userGenres.join(', ')}`);
        console.log('\n');

        // Part 2: Verify the Content Pool
        console.log('🔍 PART 2: VERIFYING CONTENT POOL');
        console.log(`Looking for songs in ${user.stationPrefrence} with genres: ${userGenres.join(', ')}\n`);

        // Build location filter
        let locationFilter = '';
        if (user.stationType === '1') {
            locationFilter = `AND lower(s."cityName") = lower('${user.stationPrefrence}')`;
        } else if (user.stationType === '2') {
            locationFilter = `AND lower(s."stateName") = lower('${user.stationPrefrence}')`;
        }

        // Build genre filter
        const genreFilter = userGenres.length > 0 ? `AND EXISTS (
            SELECT 1 FROM "SongGenres" sg 
            WHERE sg."songId" = s.id 
            AND sg."genreId" IN (${userGenres.join(',')})
        )` : '';

        const contentPoolQuery = `
            SELECT 
                s.id,
                s.title,
                s."cityName",
                s."stateName",
                s.live,
                s."deletedAt",
                b.status as band_status,
                b.title as band_title,
                sg."genreId",
                g.name as genre_name
            FROM "Songs" s
            LEFT JOIN "Bands" b ON b.id = s."bandId"
            LEFT JOIN "SongGenres" sg ON sg."songId" = s.id
            LEFT JOIN "Genres" g ON g.id = sg."genreId"
            WHERE s."deletedAt" IS NULL 
            AND s.live = true 
            AND b.status = 'ACTIVE'
            ${locationFilter}
            ${genreFilter}
            ORDER BY s.id, sg."genreId"
        `;

        console.log('Executing Content Pool Query:');
        console.log(contentPoolQuery);
        console.log('\n');

        const contentPool = await runQuery(contentPoolQuery, { 
            type: QueryTypes.SELECT 
        });

        console.log('Content Pool Results:');
        console.log(JSON.stringify(contentPool, null, 2));
        console.log('\n');

        // Part 3: The Final Diagnostic
        console.log('🔍 PART 3: FINAL DIAGNOSTIC');
        
        if (contentPool.length === 0) {
            console.log('❌ NO SONGS FOUND! Let\'s investigate further...\n');
            
            // Check if there are any songs at all in the location
            const locationSongs = await runQuery(`
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
                ${locationFilter}
                ORDER BY s.live DESC, s.id
            `, { type: QueryTypes.SELECT });

            console.log(`Songs in location ${user.stationPrefrence} (any genre, any live status):`);
            console.log(JSON.stringify(locationSongs, null, 2));
            console.log('\n');

            // Check if there are any songs with the user's genres
            const genreSongs = await runQuery(`
                SELECT 
                    s.id,
                    s.title,
                    s."cityName",
                    s."stateName",
                    s.live,
                    b.status as band_status,
                    g.name as genre_name
                FROM "Songs" s
                LEFT JOIN "Bands" b ON b.id = s."bandId"
                LEFT JOIN "SongGenres" sg ON sg."songId" = s.id
                LEFT JOIN "Genres" g ON g.id = sg."genreId"
                WHERE s."deletedAt" IS NULL 
                AND sg."genreId" IN (${userGenres.join(',')})
                ORDER BY s.live DESC, s.id
            `, { type: QueryTypes.SELECT });

            console.log(`Songs with user's genres (any location, any live status):`);
            console.log(JSON.stringify(genreSongs, null, 2));
            console.log('\n');

            // Check if there are any live songs at all
            const liveSongs = await runQuery(`
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
                AND s.live = true
                ORDER BY s.id
                LIMIT 10
            `, { type: QueryTypes.SELECT });

            console.log(`All live songs (first 10):`);
            console.log(JSON.stringify(liveSongs, null, 2));
            console.log('\n');

        } else {
            console.log(`✅ FOUND ${contentPool.length} SONGS! The query should work.`);
        }

        console.log('=== DIAGNOSTIC COMPLETE ===');

    } catch (error) {
        console.error('❌ DIAGNOSTIC ERROR:', error.message);
        console.error(error.stack);
    }
}

// Run the diagnostic
diagnosticRadio().then(() => {
    console.log('\nDiagnostic finished. Check the results above.');
    process.exit(0);
}).catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
}); 