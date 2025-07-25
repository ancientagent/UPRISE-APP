const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  user: 'postgres',
  password: 'Loca$h2682',
  database: 'uprise_radiyo',
  port: 5432,
});

async function checkDatabaseContent() {
  try {
    console.log('=== DATABASE CONTENT CHECK ===\n');

    // Check users
    const users = await pool.query('SELECT id, "firstName", "lastName", email, "onBoardingStatus" FROM "Users" LIMIT 5');
    console.log('Users:', users.rows);

    // Check user station preferences
    const stationPrefs = await pool.query('SELECT "userId", "stationPrefrence", "stationType", active FROM "UserStationPrefrences" LIMIT 5');
    console.log('Station Preferences:', stationPrefs.rows);

    // Check user genre preferences
    const genrePrefs = await pool.query('SELECT "userId", "genreId" FROM "UserGenrePrefrences" LIMIT 10');
    console.log('Genre Preferences:', genrePrefs.rows);

    // Check songs
    const songs = await pool.query('SELECT id, title, "cityName", "stateName", live FROM "Songs" WHERE live = true LIMIT 5');
    console.log('Songs:', songs.rows);

    // Check events
    const events = await pool.query('SELECT id, "eventName", "cityName", "stateName" FROM "Events" WHERE "deletedAt" IS NULL LIMIT 5');
    console.log('Events:', events.rows);

    // Check bands
    const bands = await pool.query('SELECT id, title, status FROM "Bands" WHERE status = \'ACTIVE\' LIMIT 5');
    console.log('Bands:', bands.rows);

    // Check notifications
    const notifications = await pool.query('SELECT id, type, "receiverId", "referenceId" FROM "Notifications" LIMIT 5');
    console.log('Notifications:', notifications.rows);

    console.log('\n=== END DATABASE CHECK ===');
  } catch (error) {
    console.error('Database check error:', error);
  } finally {
    await pool.end();
  }
}

checkDatabaseContent(); 