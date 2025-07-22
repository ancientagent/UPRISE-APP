const { Sequelize } = require('sequelize');
const bcrypt = require('bcrypt');
const config = require('./Webapp_API-Develop/src/config/index');

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

async function resetMariaPassword() {
    try {
        // Test connection
        await sequelize.authenticate();
        console.log('✅ Database connection established successfully.');

        // Generate new password
        const newPassword = 'Maria123!'; // You can change this
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update Maria's password
        const updateResult = await sequelize.query(`
            UPDATE "Users" 
            SET password = :hashedPassword, 
                "updatedAt" = NOW()
            WHERE email = 'maria.rodriguez@email.com'
        `, {
            replacements: { hashedPassword },
            type: Sequelize.QueryTypes.UPDATE
        });

        console.log('✅ Password updated successfully!');
        console.log('📧 Email: maria.rodriguez@email.com');
        console.log('🔑 New Password: ' + newPassword);
        console.log('💡 Please change this password after logging in!');

        // Verify the update
        const user = await sequelize.query(`
            SELECT id, "userName", email, status, "onBoardingStatus"
            FROM "Users" 
            WHERE email = 'maria.rodriguez@email.com'
        `, { type: Sequelize.QueryTypes.SELECT });

        if (user.length > 0) {
            console.log('\n📋 User Details:');
            console.log('ID:', user[0].id);
            console.log('Username:', user[0].userName);
            console.log('Status:', user[0].status);
            console.log('Onboarding Status:', user[0].onBoardingStatus);
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await sequelize.close();
    }
}

resetMariaPassword(); 