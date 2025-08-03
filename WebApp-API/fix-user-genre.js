const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('uprise_radiyo', 'postgres', 'Loca$h2682', {
  host: 'localhost',
  dialect: 'postgres'
});

async function fixUserGenre() {
  try {
    console.log('Fixing user genre preference from Blues to Punk...');
    
    // First, find the Punk genre ID from the comprehensive genres list
    const punkGenre = await sequelize.query(
      'SELECT id, "name" FROM "Genres" WHERE "name" = \'Punk\'',
      { type: Sequelize.QueryTypes.SELECT }
    );
    
    if (punkGenre.length === 0) {
      console.log('❌ Punk genre not found in database!');
      return;
    }
    
    const punkId = punkGenre[0].id;
    console.log(`Found Punk genre with ID: ${punkId}`);
    
    // Remove the old Blues preference
    await sequelize.query(
      'DELETE FROM "UserGenrePrefrences" WHERE "userId" = 166',
      { type: Sequelize.QueryTypes.DELETE }
    );
    
    console.log('Removed old genre preferences');
    
    // Add the new Punk preference
    await sequelize.query(
      'INSERT INTO "UserGenrePrefrences" ("userId", "genreId", "createdAt", "updatedAt") VALUES (166, :punkId, NOW(), NOW())',
      { 
        type: Sequelize.QueryTypes.INSERT,
        replacements: { punkId }
      }
    );
    
    console.log('Added new Punk genre preference');
    
    // Verify the change
    const verifyResult = await sequelize.query(
      `SELECT g.id, g."name"
       FROM "UserGenrePrefrences" ugp
       LEFT JOIN "Genres" g ON ugp."genreId" = g.id
       WHERE ugp."userId" = 166`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    
    console.log('\nUpdated user genre preferences:');
    if (verifyResult.length > 0) {
      verifyResult.forEach(genre => {
        console.log(`- ${genre.name} (ID: ${genre.id})`);
      });
      console.log(`\n✅ User now has ${verifyResult.length} genre preferences set correctly.`);
    } else {
      console.log('❌ User still has NO genre preferences!');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sequelize.close();
  }
}

fixUserGenre(); 