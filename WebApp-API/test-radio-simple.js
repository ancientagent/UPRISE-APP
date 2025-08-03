require('dotenv').config();
const axios = require('axios');

async function testRadioSimple() {
    console.log('=== SIMPLE RADIO TEST ===\n');

    try {
        // Login
        console.log('🔍 Logging in...');
        const loginResponse = await axios.post('http://localhost:3000/auth/login', {
            email: 'thirteen@yopmail.com',
            password: 'Loca$h2682'
        }, {
            headers: {
                'client-id': process.env.CLIENT_ID,
                'client-secret': process.env.CLIENT_SECRET
            }
        });

        const token = loginResponse.data.data.accessToken;
        console.log('✅ Login successful');

        // Test radio endpoint
        console.log('\n🔍 Testing radio endpoint...');
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
        console.log('❌ ERROR:', error.message);
        if (error.response) {
            console.log('Status:', error.response.status);
            console.log('Data:', JSON.stringify(error.response.data, null, 2));
        }
    }

    console.log('\nTest complete.');
}

testRadioSimple(); 