require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });

console.log('=== DEBUGGING ENVIRONMENT VARIABLES ===\n');

console.log('CLIENT_ID:', process.env.CLIENT_ID);
console.log('CLIENT_SECRET:', process.env.CLIENT_SECRET);
console.log('PORT:', process.env.PORT);
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_NAME:', process.env.DB_NAME);

console.log('\n=== TESTING CONFIG LOAD ===\n');

const config = require('./src/config/index.js');
console.log('config.client.CLIENT_ID:', config.client.CLIENT_ID);
console.log('config.client.CLIENT_SECRET:', config.client.CLIENT_SECRET);

console.log('\n=== TESTING AUTH MIDDLEWARE ===\n');

// Test the clientAuth middleware logic
const clientId = '437920819fa89d19abe380073d28839c';
const clientSecret = '28649120bdf32812f433f428b15ab1a1';

console.log('Expected CLIENT_ID:', clientId);
console.log('Expected CLIENT_SECRET:', clientSecret);
console.log('Config CLIENT_ID:', config.client.CLIENT_ID);
console.log('Config CLIENT_SECRET:', config.client.CLIENT_SECRET);

console.log('CLIENT_ID match:', clientId === config.client.CLIENT_ID);
console.log('CLIENT_SECRET match:', clientSecret === config.client.CLIENT_SECRET);

console.log('\nDebug complete.'); 