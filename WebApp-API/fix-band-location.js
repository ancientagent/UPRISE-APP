const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('uprise_radiyo', 'postgres', 'Loca$h2682', {
  host: 'localhost',
  dialect: 'postgres'
});

async function fixBandLocation() {
  try {
    console.log('Fixing band location for band ID 52...');
    
    // Update the band with location data
    const result = await sequelize.query(
      'UPDATE "Bands" SET "cityName" = \'Austin\', "stateName" = \'Texas\' WHERE id = 52 RETURNING id, title, "cityName", "stateName"',
      { type: Sequelize.QueryTypes.UPDATE }
    );
    
    console.log('Band location updated successfully!');
    
    // Verify the update
    const verifyResult = await sequelize.query(
      'SELECT id, title, "cityName", "stateName" FROM "Bands" WHERE id = 52',
      { type: Sequelize.QueryTypes.SELECT }
    );
    
    if (verifyResult.length > 0) {
      const band = verifyResult[0];
      console.log('Updated band data:');
      console.log('Band ID:', band.id);
      console.log('Band Title:', band.title);
      console.log('City Name:', band.cityName);
      console.log('State Name:', band.stateName);
      
      if (band.cityName && band.stateName) {
        console.log('\n✅ Band now has location data set!');
        console.log('Song upload should now work.');
      } else {
        console.log('\n❌ Band still missing location data.');
      }
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sequelize.close();
  }
}

fixBandLocation(); 