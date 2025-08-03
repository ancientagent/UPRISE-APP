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

async function debugLogin() {
    try {
        // Test connection
        await sequelize.authenticate();
        console.log('✅ Database connection established successfully.');

        // Simulate the login logic from the backend
        const testEmail = 'testartist@example.com';
        const testPassword = 'Loca$h2682';

        console.log('\n🔍 Testing login logic:');
        console.log('Email:', testEmail);
        console.log('Password:', testPassword);

        // Test the User.findOne query
        const { User } = require('./src/database/models/');
        const { Op } = require('sequelize');

        console.log('\n🔍 Executing User.findOne query...');
        const userData = await User.findOne({
            where: { 
                [Op.or]: [{userName: testEmail }, { email: testEmail }],
            },
            paranoid: false
        });

        if (!userData) {
            console.log('❌ User not found');
            return;
        }

        console.log('✅ User found:', {
            id: userData.id,
            userName: userData.userName,
            email: userData.email,
            status: userData.status,
            deletedAt: userData.deletedAt
        });

        // Test password comparison
        console.log('\n🔍 Testing password comparison...');
        const passwordMatch = await bcrypt.compare(testPassword, userData.password);
        console.log('Password match:', passwordMatch ? '✅ SUCCESS' : '❌ FAILED');

        if (passwordMatch) {
            console.log('\n🎉 Login would be successful!');
        } else {
            console.log('\n❌ Login would fail due to password mismatch');
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error('Stack:', error.stack);
    } finally {
        await sequelize.close();
    }
}

debugLogin(); 