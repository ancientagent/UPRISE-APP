require('dotenv').config();

console.log('=== TESTING ENVIRONMENT VARIABLES ===');
console.log('CLIENT_ID:', process.env.CLIENT_ID);
console.log('CLIENT_SECRET:', process.env.CLIENT_SECRET);
console.log('PORT:', process.env.PORT);
console.log('DB_HOST:', process.env.DB_HOST);
console.log('JWT_ACCESS_TOKEN_SECRET:', process.env.JWT_ACCESS_TOKEN_SECRET ? 'SET' : 'NOT SET');
console.log('JWT_REFRESH_TOKEN_SECRET:', process.env.JWT_REFRESH_TOKEN_SECRET ? 'SET' : 'NOT SET'); 