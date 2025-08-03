const { Sequelize } = require('sequelize');
const bcrypt = require('bcrypt');
const config = require('./src/config/index');

// Use the same database configuration as the backend
const sequelize = new Sequelize({
    dialect: 'postgres',
    host: config.db.HOST,
    port: config.db.PORT,
    username: config.db.USERNAME,
    password: config.db.PASSWORD,
    database: config.db.NAME,
    logging: false
});

async function updatePassword() {
    try {
        // Test connection
        await sequelize.authenticate();
        console.log('✅ Database connection established successfully.');

        // Generate new password hash for 'Loca$h2682'
        console.log('\n🔧 Generating new password hash for "Loca$h2682"...');
        const salt = await bcrypt.genSalt();
        const newHash = await bcrypt.hash('Loca$h2682', salt);
        console.log('New hash generated successfully');

        // Update the user's password
        console.log('\n🔧 Updating user password...');
        const updateResult = await sequelize.query(`
            UPDATE "Users" 
            SET password = :newHash
            WHERE email = 'testartist@example.com'
        `, {
            replacements: { newHash: newHash }
        });
        
        console.log('Password updated successfully');

        // Verify the update
        console.log('\n🔍 Verifying the update...');
        const verifyResult = await sequelize.query(`
            SELECT 
                id,
                "userName",
                email,
                password
            FROM "Users" 
            WHERE email = 'testartist@example.com'
        `);
        
        const user = verifyResult[0][0];
        console.log('User data after update:', {
            id: user.id,
            userName: user.userName,
            email: user.email,
            passwordHash: user.password.substring(0, 20) + '...'
        });

        // Test the new password
        const isMatch = await bcrypt.compare('Loca$h2682', user.password);
        console.log(`Password verification test: ${isMatch ? '✅ SUCCESS' : '❌ FAILED'}`);

        console.log('\n🎉 Password update completed successfully!');
        console.log('\n📝 Now you can login with:');
        console.log('   Email: testartist@example.com');
        console.log('   Username: testartist123');
        console.log('   Password: Loca$h2682');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await sequelize.close();
    }
}

updatePassword(); 