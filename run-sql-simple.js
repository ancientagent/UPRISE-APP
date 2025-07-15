const { Sequelize } = require('sequelize');

// Simple database connection (using common PostgreSQL defaults)
const sequelize = new Sequelize({
    dialect: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'password',
    database: 'uprise_radiyo',
    logging: false
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
        console.log('\n💡 If you get connection errors, make sure:');
        console.log('1. PostgreSQL is running');
        console.log('2. Database credentials are correct');
        console.log('3. Database "uprise_db" exists');
    } finally {
        await sequelize.close();
    }
}

runSQL(); 