require('dotenv').config();
const axios = require('axios');

async function testRadioEndpoint() {
    console.log('=== TESTING RADIO ENDPOINT ===\n');

    try {
        // Step 1: Login to get token
        console.log('🔍 Step 1: Logging in...');
        const loginResponse = await axios.post('http://localhost:3000/auth/login', {
            email: 'thirteen@yopmail.com',
            password: 'Loca$h2682'
        });

        const token = loginResponse.data.data.accessToken;
        console.log('✅ Login successful');
        console.log('Token:', token.substring(0, 50) + '...');

        // Step 2: Test radio endpoint
        console.log('\n🔍 Step 2: Testing radio endpoint...');
        
        const headers = {
            'Authorization': `Bearer ${token}`,
            'client-id': process.env.CLIENT_ID,
            'client-secret': process.env.CLIENT_SECRET
        };

        console.log('Headers being sent:');
        console.log('Authorization:', headers['Authorization'].substring(0, 50) + '...');
        console.log('client-id:', headers['client-id']);
        console.log('client-secret:', headers['client-secret']);

        const radioResponse = await axios.get('http://localhost:3000/radio/song', { headers });

        console.log('\n✅ SUCCESS: Radio endpoint working!');
        console.log('Response:', JSON.stringify(radioResponse.data, null, 2));

    } catch (error) {
        console.log('\n❌ ERROR:', error.message);
        if (error.response) {
            console.log('Response status:', error.response.status);
            console.log('Response data:', error.response.data);
        }
    }

    console.log('\nTest complete.');
}

testRadioEndpoint(); 