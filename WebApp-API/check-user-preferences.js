const { Sequelize, DataTypes } = require('sequelize');

// Database configuration
const sequelize = new Sequelize('uprise_radiyo', 'postgres', 'Loca$h2682', {
  host: 'localhost',
  port: 5432,
  dialect: 'postgres',
  logging: false,
});

async function checkUserPreferences() {
  try {
    console.log('🔍 Checking user preferences for lmnop@yopmail.com...\n');

    // Step 1: Find the user
    const userQuery = 'SELECT id, "userName", email, "onBoardingStatus" FROM "Users" WHERE email = \'lmnop@yopmail.com\';';
    const userResult = await sequelize.query(userQuery, {
      type: Sequelize.QueryTypes.SELECT
    });

    if (userResult.length === 0) {
      console.log('❌ User not found');
      return;
    }

    const userId = userResult[0].id;
    console.log('✅ User found:');
    console.log(`   ID: ${userId}`);
    console.log(`   Username: ${userResult[0].userName}`);
    console.log(`   Email: ${userResult[0].email}`);
    console.log(`   Onboarding Status: ${userResult[0].onBoardingStatus}\n`);

    // Step 2: Check station preferences
    const stationQuery = 'SELECT "userId", "stationPrefrence", "stationType", "active" FROM "UserStationPrefrences" WHERE "userId" = :userId;';
    const stationResult = await sequelize.query(stationQuery, {
      replacements: { userId },
      type: Sequelize.QueryTypes.SELECT
    });

    console.log('📍 Station Preferences:');
    if (stationResult.length === 0) {
      console.log('   ❌ No station preferences found');
    } else {
      stationResult.forEach(pref => {
        console.log(`   ✅ Station: ${pref.stationPrefrence}`);
        console.log(`   ✅ Type: ${pref.stationType === '1' ? 'CITYWIDE' : 'STATEWIDE'}`);
        console.log(`   ✅ Active: ${pref.active}`);
      });
    }
    console.log('');

    // Step 3: Check genre preferences
    const genreQuery = `
      SELECT g.id, g."name" 
      FROM "UserGenrePrefrences" ugp
      LEFT JOIN "Genres" g ON ugp."genreId" = g.id
      WHERE ugp."userId" = :userId;
    `;
    const genreResult = await sequelize.query(genreQuery, {
      replacements: { userId },
      type: Sequelize.QueryTypes.SELECT
    });

    console.log('🎵 Genre Preferences:');
    if (genreResult.length === 0) {
      console.log('   ❌ No genre preferences found');
    } else {
      genreResult.forEach(genre => {
        console.log(`   ✅ ${genre.name} (ID: ${genre.id})`);
      });
    }
    console.log('');

    // Step 4: Check if there are any songs in the user's location
    const songsQuery = `
      SELECT COUNT(*) as song_count 
      FROM "Songs" s
      LEFT JOIN "Bands" b ON s."bandId" = b.id
      WHERE s."deletedAt" IS NULL 
      AND b.status = 'ACTIVE' 
      AND s.live = true
      AND s."cityName" = 'Austin';
    `;
    const songsResult = await sequelize.query(songsQuery, {
      type: Sequelize.QueryTypes.SELECT
    });

    console.log('🎶 Available Songs in Austin:');
    console.log(`   Total songs: ${songsResult[0].song_count}`);
    console.log('');

    // Step 5: Check if there are any events in the user's location
    const eventsQuery = `
      SELECT COUNT(*) as event_count 
      FROM "Events" e
      LEFT JOIN "Bands" b ON e."bandId" = b.id
      WHERE e."deletedAt" IS NULL 
      AND b.status = 'ACTIVE'
      AND e."cityName" = 'Austin';
    `;
    const eventsResult = await sequelize.query(eventsQuery, {
      type: Sequelize.QueryTypes.SELECT
    });

    console.log('🎪 Available Events in Austin:');
    console.log(`   Total events: ${eventsResult[0].event_count}`);

  } catch (error) {
    console.error('❌ Database operation failed:', error.message);
    console.error('Full error:', error);
  } finally {
    await sequelize.close();
    console.log('\n🔌 Database connection closed.');
  }
}

checkUserPreferences(); 