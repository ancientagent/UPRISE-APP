const { Sequelize, DataTypes } = require('sequelize');

// Database configuration
const sequelize = new Sequelize('uprise_radiyo', 'postgres', 'Loca$h2682', {
  host: 'localhost',
  port: 5432,
  dialect: 'postgres',
  logging: false,
});

async function checkGenreSongs() {
  try {
    console.log('🔍 Checking songs in Austin with Blues genre...\n');

    // Check songs in Austin with Blues genre
    const songsQuery = `
      SELECT s.id, s.title, s."cityName", b.title as "bandName"
      FROM "Songs" s
      LEFT JOIN "Bands" b ON s."bandId" = b.id
      LEFT JOIN "SongGenres" sg ON s.id = sg."songId"
      WHERE s."deletedAt" IS NULL 
      AND b.status = 'ACTIVE' 
      AND s.live = true
      AND s."cityName" = 'Austin'
      AND sg."genreId" = 1
      ORDER BY s."createdAt" DESC;
    `;
    const songsResult = await sequelize.query(songsQuery, {
      type: Sequelize.QueryTypes.SELECT
    });

    console.log('🎵 Songs in Austin with Blues genre:');
    if (songsResult.length === 0) {
      console.log('   ❌ No songs found with Blues genre in Austin');
    } else {
      songsResult.forEach(song => {
        console.log(`   ✅ ${song.title} by ${song.bandName}`);
      });
    }
    console.log('');

    // Check all songs in Austin (regardless of genre)
    const allSongsQuery = `
      SELECT s.id, s.title, s."cityName", b.title as "bandName"
      FROM "Songs" s
      LEFT JOIN "Bands" b ON s."bandId" = b.id
      WHERE s."deletedAt" IS NULL 
      AND b.status = 'ACTIVE' 
      AND s.live = true
      AND s."cityName" = 'Austin'
      ORDER BY s."createdAt" DESC
      LIMIT 10;
    `;
    const allSongsResult = await sequelize.query(allSongsQuery, {
      type: Sequelize.QueryTypes.SELECT
    });

    console.log('🎵 All songs in Austin (first 10):');
    if (allSongsResult.length === 0) {
      console.log('   ❌ No songs found in Austin');
    } else {
      allSongsResult.forEach(song => {
        console.log(`   ✅ ${song.title} by ${song.bandName}`);
      });
    }
    console.log('');

    // Check what genres are available for songs in Austin
    const genresQuery = `
      SELECT DISTINCT g.id, g."name", COUNT(s.id) as "songCount"
      FROM "Songs" s
      LEFT JOIN "Bands" b ON s."bandId" = b.id
      LEFT JOIN "SongGenres" sg ON s.id = sg."songId"
      LEFT JOIN "Genres" g ON sg."genreId" = g.id
      WHERE s."deletedAt" IS NULL 
      AND b.status = 'ACTIVE' 
      AND s.live = true
      AND s."cityName" = 'Austin'
      GROUP BY g.id, g."name"
      ORDER BY "songCount" DESC;
    `;
    const genresResult = await sequelize.query(genresQuery, {
      type: Sequelize.QueryTypes.SELECT
    });

    console.log('🎵 Available genres for songs in Austin:');
    if (genresResult.length === 0) {
      console.log('   ❌ No genres found for songs in Austin');
    } else {
      genresResult.forEach(genre => {
        console.log(`   ✅ ${genre.name} (ID: ${genre.id}) - ${genre.songCount} songs`);
      });
    }

  } catch (error) {
    console.error('❌ Database operation failed:', error.message);
    console.error('Full error:', error);
  } finally {
    await sequelize.close();
    console.log('\n🔌 Database connection closed.');
  }
}

checkGenreSongs(); 