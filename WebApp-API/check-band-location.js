const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('uprise_radiyo', 'postgres', 'Loca$h2682', {
  host: 'localhost',
  dialect: 'postgres'
});

async function checkBandLocation() {
  try {
    const result = await sequelize.query(
      'SELECT id, title, "cityName", "stateName" FROM "Bands" WHERE id = 52',
      { type: Sequelize.QueryTypes.SELECT }
    );
    
    console.log('Band location data:', result);
    
    if (result.length > 0) {
      const band = result[0];
      console.log('Band ID:', band.id);
      console.log('Band Title:', band.title);
      console.log('City Name:', band.cityName);
      console.log('State Name:', band.stateName);
      
      if (!band.cityName || !band.stateName) {
        console.log('\n❌ Band is missing location data!');
        console.log('This is why song upload is failing.');
      } else {
        console.log('\n✅ Band has location data set.');
      }
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sequelize.close();
  }
}

checkBandLocation(); 