const { Sequelize } = require('sequelize');
const config = require('./src/config/index');

// Use the same database configuration as the backend
const sequelize = new Sequelize({
    dialect: 'postgres',
    host: config.db.HOST,
    port: config.db.PORT,
    username: config.db.USERNAME,
    password: config.db.PASSWORD,
    database: config.db.NAME,
    logging: console.log
});

async function fixAccount() {
    try {
        // Test connection
        await sequelize.authenticate();
        console.log('✅ Database connection established successfully.');

        // Fix the test account
        const fixStatements = [
            // Clear email verification token and set onboarding status
            `UPDATE "Users" 
            SET 
                "emailVerificationToken" = NULL,
                "onBoardingStatus" = 2,
                status = 'ACTIVE'
            WHERE email = 'testartist@example.com'`,
            
            // Check the result
            `SELECT 
                id,
                "firstName",
                "lastName",
                email,
                status,
                "onBoardingStatus",
                "emailVerificationToken"
            FROM "Users" 
            WHERE email = 'testartist@example.com'`
        ];
        
        for (let i = 0; i < fixStatements.length; i++) {
            const statement = fixStatements[i];
            console.log(`\n🔧 Executing fix statement ${i + 1}:`);
            console.log(statement);
            
            const result = await sequelize.query(statement);
            console.log('✅ Result:', result[0]);
        }
        
        console.log('\n🎉 Account fix completed successfully!');
        console.log('\n📝 Now you can test login with:');
        console.log('   Email: testartist@example.com');
        console.log('   Password: test123');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await sequelize.close();
    }
}

fixAccount(); 