require('dotenv').config();
const { runQuery } = require('./src/utils/dbquery');
const { QueryTypes } = require('sequelize');

async function checkRecentListens() {
    console.log('=== CHECKING RECENT LISTENS FOR USER 166 ===\n');

    try {
        const recentListens = await runQuery(`
            SELECT 
                usl."songId",
                usl."createdAt",
                s.title,
                s."cityName"
            FROM "UserSongListens" usl
            LEFT JOIN "Songs" s ON s.id = usl."songId"
            WHERE usl."userId" = 166
            AND usl."createdAt" > NOW() - INTERVAL '24 hours'
            ORDER BY usl."createdAt" DESC
        `, { type: QueryTypes.SELECT });

        console.log('Recent listens for user 166:');
        console.log(JSON.stringify(recentListens, null, 2));
        console.log('\n');

        // Check if song 56 is in recent listens
        const song56Listens = recentListens.filter(listen => listen.songId === 56);
        if (song56Listens.length > 0) {
            console.log('❌ Song 56 ("healthy body") is in recent listens!');
            console.log('This would exclude it from the radio query.');
        } else {
            console.log('✅ Song 56 is NOT in recent listens - should be available');
        }

    } catch (error) {
        console.error('❌ ERROR:', error.message);
    }
}

checkRecentListens().then(() => {
    console.log('\nCheck complete.');
    process.exit(0);
}).catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
}); 