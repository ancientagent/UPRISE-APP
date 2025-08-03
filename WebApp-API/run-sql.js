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

async function runSQL() {
    try {
        // Test connection
        await sequelize.authenticate();
        console.log('✅ Database connection established successfully.');

        // SQL statements from check-and-fix-account.sql
        const statements = [
            // Check current status
            `SELECT 
                id,
                "firstName",
                "lastName",
                email,
                status,
                "onBoardingStatus",
                "emailVerificationToken"
            FROM "Users" 
            WHERE email = 'testartist@example.com'`,
            
            // Update if inactive
            `UPDATE "Users" 
            SET 
                status = 'ACTIVE',
                "emailVerificationToken" = NULL,
                "onBoardingStatus" = 2
            WHERE email = 'testartist@example.com' AND status = 'INACTIVE'`,
            
            // Check again after update
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
        
        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i];
            console.log(`\n🔍 Executing statement ${i + 1}:`);
            console.log(statement);
            
            const result = await sequelize.query(statement);
            console.log('✅ Result:', result[0]);
        }
        
        console.log('\n🎉 SQL execution completed successfully!');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.log('\n💡 Database config:', {
            host: config.db.HOST,
            port: config.db.PORT,
            username: config.db.USERNAME,
            database: config.db.NAME
        });
    } finally {
        await sequelize.close();
    }
}

runSQL(); 