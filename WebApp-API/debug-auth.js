require('dotenv').config();
const axios = require('axios');

async function debugAuth() {
    console.log('=== DEBUGGING AUTHENTICATION ===\n');

    try {
        // Test 1: Check if backend is running
        console.log('🔍 Test 1: Checking if backend is running...');
        try {
            const healthCheck = await axios.get('http://localhost:3000/');
            console.log('✅ Backend is running');
        } catch (error) {
            console.log('❌ Backend is not running or not responding');
            return;
        }

        // Test 2: Try login without client auth
        console.log('\n🔍 Test 2: Trying login without client auth...');
        try {
            const loginResponse = await axios.post('http://localhost:3000/auth/login', {
                email: 'thirteen@yopmail.com',
                password: 'Loca$h2682'
            });
            console.log('✅ Login successful without client auth');
            console.log('Token:', loginResponse.data.data.accessToken.substring(0, 50) + '...');
        } catch (error) {
            console.log('❌ Login failed:', error.response?.data || error.message);
        }

        // Test 3: Try login with client auth
        console.log('\n🔍 Test 3: Trying login with client auth...');
        try {
            const loginResponse = await axios.post('http://localhost:3000/auth/login', {
                email: 'thirteen@yopmail.com',
                password: 'Loca$h2682'
            }, {
                headers: {
                    'client-id': process.env.CLIENT_ID,
                    'client-secret': process.env.CLIENT_SECRET
                }
            });
            console.log('✅ Login successful with client auth');
            const token = loginResponse.data.data.accessToken;
            console.log('Token:', token.substring(0, 50) + '...');

            // Test 4: Try radio endpoint with token
            console.log('\n🔍 Test 4: Trying radio endpoint...');
            const radioResponse = await axios.get('http://localhost:3000/radio/song', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'client-id': process.env.CLIENT_ID,
                    'client-secret': process.env.CLIENT_SECRET
                }
            });
            console.log('✅ Radio endpoint successful!');
            console.log('Response:', JSON.stringify(radioResponse.data, null, 2));

        } catch (error) {
            console.log('❌ Radio endpoint failed:', error.response?.data || error.message);
            console.log('Status:', error.response?.status);
        }

    } catch (error) {
        console.error('❌ ERROR:', error.message);
    }
}

debugAuth().then(() => {
    console.log('\nDebug complete.');
    process.exit(0);
}).catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
}); 