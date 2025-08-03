const { Sequelize, DataTypes } = require('sequelize');

// Database configuration
const sequelize = new Sequelize('uprise_radiyo', 'postgres', 'Loca$h2682', {
  host: 'localhost',
  port: 5432,
  dialect: 'postgres',
  logging: false, // Disable logging for cleaner output
});

async function fixStationPreference() {
  try {
    console.log('🔍 Connecting to database...');
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');

    // Step 1: Find the user ID for user "i"
    console.log('\n🔍 Step 1: Finding user ID for user "i"...');
    const userQuery = 'SELECT id FROM "Users" WHERE "userName" = \'i\';';
    const [userResult] = await sequelize.query(userQuery);
    
    if (userResult.length === 0) {
      console.log('❌ User "i" not found in database!');
      return;
    }
    
    const userId = userResult[0].id;
    console.log(`✅ Found user "i" with ID: ${userId}`);

    // Step 2: Check current station preference status
    console.log('\n🔍 Step 2: Checking current station preference status...');
    const checkQuery = 'SELECT "userId", "active" FROM "UserStationPrefrences" WHERE "userId" = :userId;';
    const currentStatus = await sequelize.query(checkQuery, {
      replacements: { userId },
      type: Sequelize.QueryTypes.SELECT
    });
    
    if (currentStatus.length === 0) {
      console.log('❌ No station preference found for this user!');
      return;
    }
    
    console.log(`📊 Current status: userId=${currentStatus[0].userId}, active=${currentStatus[0].active}`);

    // Step 3: Update the station preference to active
    console.log('\n🔧 Step 3: Updating station preference to active...');
    const updateQuery = 'UPDATE "UserStationPrefrences" SET "active" = true WHERE "userId" = :userId;';
    const updateResult = await sequelize.query(updateQuery, {
      replacements: { userId }
    });
    
    console.log(`✅ Update completed. Rows affected: ${updateResult[1]}`);

    // Step 4: Verify the fix
    console.log('\n🔍 Step 4: Verifying the fix...');
    const verifyQuery = 'SELECT "userId", "active" FROM "UserStationPrefrences" WHERE "userId" = :userId;';
    const verifyResult = await sequelize.query(verifyQuery, {
      replacements: { userId },
      type: Sequelize.QueryTypes.SELECT
    });
    
    if (verifyResult.length > 0) {
      const isActive = verifyResult[0].active;
      console.log(`📊 Verification result: userId=${verifyResult[0].userId}, active=${isActive}`);
      
      if (isActive) {
        console.log('✅ SUCCESS: Station preference is now active!');
        console.log('\n🎉 SURGICAL DATABASE CORRECTION COMPLETED SUCCESSFULLY!');
        console.log('📋 Summary:');
        console.log(`   - User ID: ${userId}`);
        console.log(`   - User Name: i`);
        console.log(`   - Station Preference Status: ACTIVE`);
        console.log('\n🔍 Please test the webapp login now to verify the fix.');
      } else {
        console.log('❌ FAILED: Station preference is still not active!');
      }
    } else {
      console.log('❌ FAILED: Could not verify the update!');
    }

  } catch (error) {
    console.error('❌ Database operation failed:', error.message);
    console.error('Full error:', error);
  } finally {
    await sequelize.close();
    console.log('\n🔌 Database connection closed.');
  }
}

// Run the fix
console.log('🚀 Starting surgical database correction for user "i"...\n');
fixStationPreference(); 