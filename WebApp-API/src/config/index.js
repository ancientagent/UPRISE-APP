const path = require('path');

// Environment variables are now loaded in main index.js before this config is imported
// require('dotenv').config({ path: path.resolve(__dirname, '..', '..', '.env') });

const config = {
    app: {
        PORT: process.env.PORT,
    },
    db: {
        HOST: process.env.DB_HOST,
        USERNAME: process.env.DB_USERNAME,
        PASSWORD: process.env.DB_PASSWORD,
        NAME: process.env.DB_NAME,
        PORT:process.env.DB_PORT || 5432
    },
    mailer: {
        API_KEY: process.env.SENDGRID_API_KEY,
        SENDER_MAIL: process.env.SENDGRID_FALLBACK_EMAIL,
        ADMIN_MAIL: process.env.ADMIN_MAIL,
    },
    jwt: {
        ACCESS_TOKEN: process.env.JWT_ACCESS_TOKEN_SECRET,
        REFRESH_TOKEN: process.env.JWT_REFRESH_TOKEN_SECRET,
        ACCESS_TOKEN_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN,
        REFRESH_TOKEN_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN,
    },
    web: {
        WEB_URL: process.env.WEB_URL,
    },
    client: {
        CLIENT_ID: process.env.CLIENT_ID,
        CLIENT_SECRET: process.env.CLIENT_SECRET,
    },
    aws:{
        ACCESS_KEY:process.env.AWS_ACCESS_KEY,
        SECRET_KEY:process.env.AWS_SECRET_KEY,
        REGION:process.env.AWS_REGION,
        BUCKET_NAME:process.env.AWS_BUCKET_NAME
    },
    songUrl:{
        AWS_S3_ENDPOINT:process.env.AWS_S3_ENDPOINT,
        CLOUD_FRONT_ENDPOINT:process.env.CLOUD_FRONT_ENDPOINT
    }
};
module.exports = config;
