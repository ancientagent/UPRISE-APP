const axios = require('axios');

async function testLoginDirectly() {
    console.log('=== TESTING LOGIN ENDPOINT DIRECTLY ===');
    
    try {
        const loginData = {
            email: 'fourteen@yopmail.com',
            password: 'Loca$h2682',
            clientId: '437920819fa89d19abe380073d28839c',
            clientSecret: '28649120bdf32812f433f428b15ab1a1'
        };
        
        console.log('Sending login request with data:', JSON.stringify(loginData, null, 2));
        
        const response = await axios.post('http://localhost:3000/auth/login', loginData, {
            headers: {
                'Content-Type': 'application/json',
                'client-id': '437920819fa89d19abe380073d28839c',
                'client-secret': '28649120bdf32812f433f428b15ab1a1'
            }
        });
        
        console.log('✅ Login successful!');
        console.log('Response status:', response.status);
        console.log('Response data:', JSON.stringify(response.data, null, 2));
        
    } catch (error) {
        console.log('❌ Login failed');
        console.log('Error status:', error.response?.status);
        console.log('Error data:', error.response?.data);
        console.log('Error message:', error.message);
    }
}

testLoginDirectly(); 