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

async function checkPassword() {
    try {
        // Test connection
        await sequelize.authenticate();
        console.log('✅ Database connection established successfully.');

        // Get the user's password hash
        const result = await sequelize.query(`
            SELECT 
                id,
                "userName",
                email,
                password
            FROM "Users" 
            WHERE email = 'testartist@example.com'
        `);
        
        const user = result[0][0];
        console.log('\n🔍 User data:', {
            id: user.id,
            userName: user.userName,
            email: user.email,
            passwordHash: user.password.substring(0, 20) + '...'
        });

        // Test password verification
        const testPasswords = ['test123', 'Test123!', 'test123!', 'Test123'];
        
        console.log('\n🔍 Testing password verification:');
        for (const testPassword of testPasswords) {
            try {
                const isMatch = await bcrypt.compare(testPassword, user.password);
                console.log(`Password "${testPassword}": ${isMatch ? '✅ MATCH' : '❌ NO MATCH'}`);
            } catch (error) {
                console.log(`Password "${testPassword}": ❌ ERROR - ${error.message}`);
            }
        }

        // Generate a new password hash for 'test123'
        console.log('\n🔧 Generating new hash for "test123":');
        const salt = await bcrypt.genSalt();
        const newHash = await bcrypt.hash('test123', salt);
        console.log('New hash:', newHash);
        
        // Test the new hash
        const isNewHashValid = await bcrypt.compare('test123', newHash);
        console.log('New hash test:', isNewHashValid ? '✅ VALID' : '❌ INVALID');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await sequelize.close();
    }
}

checkPassword(); 