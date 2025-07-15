const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, 'Webapp_API-Develop', '.env') });

// Database configuration (using the same config as the backend)
const sequelize = new Sequelize({
    dialect: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'uprise_db',
    logging: console.log
});

async function runSQL() {
    try {
        // Test connection
        await sequelize.authenticate();
        console.log('✅ Database connection established successfully.');

        // Read and execute the SQL file
        const fs = require('fs');
        const sqlContent = fs.readFileSync('check-and-fix-account.sql', 'utf8');
        
        // Split by semicolon and execute each statement
        const statements = sqlContent.split(';').filter(stmt => stmt.trim());
        
        for (const statement of statements) {
            if (statement.trim()) {
                console.log('\n🔍 Executing:', statement.trim());
                const result = await sequelize.query(statement.trim());
                console.log('✅ Result:', result[0]);
            }
        }
        
        console.log('\n🎉 SQL execution completed successfully!');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await sequelize.close();
    }
}

runSQL(); 