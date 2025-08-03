require('dotenv').config();
const axios = require('axios');

async function simpleTest() {
    console.log('=== SIMPLE LOGIN TEST ===\n');

    try {
        console.log('🔍 Testing login endpoint with client auth...');
        const response = await axios.post('http://localhost:3000/auth/login', {
            email: 'thirteen@yopmail.com',
            password: 'Loca$h2682'
        }, {
            headers: {
                'client-id': process.env.CLIENT_ID,
                'client-secret': process.env.CLIENT_SECRET
            }
        });

        console.log('✅ Login successful!');
        console.log('Response status:', response.status);
        console.log('Token length:', response.data.data.accessToken.length);

    } catch (error) {
        console.log('❌ Login failed:', error.message);
        if (error.response) {
            console.log('Status:', error.response.status);
            console.log('Data:', error.response.data);
        }
    }

    console.log('\nTest complete.');
}

simpleTest(); 