// Load environment variables
require('dotenv').config({ path: require('path').resolve(__dirname, '../../../.env') });

module.exports = {
    development: {
      username: process.env.DB_USERNAME || "postgres",
      password: process.env.DB_PASSWORD || "Loca$h2682",
      database: process.env.DB_NAME || "uprise_radiyo",
      host: process.env.DB_HOST || "127.0.0.1",
      dialect: 'postgres',
      define: {
        freezeTableName: true // Prevent Sequelize from pluralizing table names
      }
    },
    test: {
      username: process.env.DB_USERNAME || "postgres",
      password: process.env.DB_PASSWORD || "Loca$h2682",
      database: process.env.DB_NAME || "uprise_radiyo",
      host: process.env.DB_HOST || "127.0.0.1",
      dialect: 'postgres',
      define: {
        freezeTableName: true
      }
    },
    production: {
      username: process.env.DB_USERNAME || "postgres",
      password: process.env.DB_PASSWORD || "Loca$h2682",
      database: process.env.DB_NAME || "uprise_radiyo",
      host: process.env.DB_HOST || "127.0.0.1",
      dialect: 'postgres',
      define: {
        freezeTableName: true
      }
    }
  };