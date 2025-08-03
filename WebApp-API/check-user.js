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

async function checkUser() {
    try {
        // Test connection
        await sequelize.authenticate();
        console.log('✅ Database connection established successfully.');

        // Check the user data
        const checkStatements = [
            // Check all fields for the test user
            `SELECT 
                id,
                "firstName",
                "lastName",
                "userName",
                email,
                password,
                status,
                "onBoardingStatus",
                "emailVerificationToken",
                "roleId"
            FROM "Users" 
            WHERE email = 'testartist@example.com'`,
            
            // Check what roles exist
            `SELECT id, name FROM "Roles" WHERE name IN ('artist', 'user', 'admin')`,
            
            // Check if there are any users with null userName
            `SELECT COUNT(*) as null_username_count FROM "Users" WHERE "userName" IS NULL`
        ];
        
        for (let i = 0; i < checkStatements.length; i++) {
            const statement = checkStatements[i];
            console.log(`\n🔍 Executing check ${i + 1}:`);
            console.log(statement);
            
            const result = await sequelize.query(statement);
            console.log('✅ Result:', result[0]);
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await sequelize.close();
    }
}

checkUser(); 