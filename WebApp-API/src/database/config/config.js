// This is a temporary, direct configuration to bypass a failing .env load.
module.exports = {
    development: {
      username: "postgres", // Assuming the user is the default 'postgres'
      password: "Loca$h2682",
      database: "uprise_radiyo",
      host: "127.0.0.1",
      dialect: 'postgres',
      define: {
        freezeTableName: true // Prevent Sequelize from pluralizing table names
      }
    },
    test: {
      username: "postgres",
      password: "Loca$h2682",
      database: "uprise_radiyo_test",
      host: "127.0.0.1",
      dialect: 'postgres',
      define: {
        freezeTableName: true
      }
    },
    production: {
      username: "postgres",
      password: "Loca$h2682",
      database: "uprise_radiyo_prod",
      host: "127.0.0.1",
      dialect: 'postgres',
      define: {
        freezeTableName: true
      }
    }
  };