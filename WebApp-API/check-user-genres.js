const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('uprise_radiyo', 'postgres', 'Loca$h2682', {
  host: 'localhost',
  dialect: 'postgres'
});

async function checkUserGenres() {
  try {
    console.log('Checking genre preferences for user ID 166...');
    
    // Check user's genre preferences
    const genreResult = await sequelize.query(
      `SELECT g.id, g."name"
       FROM "UserGenrePrefrences" ugp
       LEFT JOIN "Genres" g ON ugp."genreId" = g.id
       WHERE ugp."userId" = 166`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    
    console.log('User genre preferences:');
    if (genreResult.length > 0) {
      genreResult.forEach(genre => {
        console.log(`- ${genre.name} (ID: ${genre.id})`);
      });
      console.log(`\n✅ User has ${genreResult.length} genre preferences set.`);
    } else {
      console.log('❌ User has NO genre preferences set!');
      console.log('This might be causing the song upload validation to fail.');
    }
    
    // Also check the user's station preferences
    const stationResult = await sequelize.query(
      `SELECT "stationPrefrence", "stationType", active
       FROM "UserStationPrefrences"
       WHERE "userId" = 166 AND active = true`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    
    console.log('\nUser station preferences:');
    if (stationResult.length > 0) {
      stationResult.forEach(station => {
        console.log(`- ${station.stationPrefrence} (Type: ${station.stationType}, Active: ${station.active})`);
      });
    } else {
      console.log('❌ User has NO active station preferences!');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sequelize.close();
  }
}

checkUserGenres(); 