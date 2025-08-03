const fetch = require('node-fetch');

async function testLoginRoute() {
    try {
        console.log('🔍 Testing login route with FormData...');
        
        // Test 1: FormData (like the HTML forms)
        const FormData = require('form-data');
        const formData = new FormData();
        formData.append('email', 'testartist@example.com');
        formData.append('password', 'Loca$h2682');
        
        const response1 = await fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            headers: {
                'client-id': '437920819fa89d19abe380073d28839c',
                'client-secret': '28649120bdf32812f433f428b15ab1a1'
            },
            body: formData
        });
        
        const data1 = await response1.json();
        console.log('FormData Response Status:', response1.status);
        console.log('FormData Response:', data1);
        
        console.log('\n🔍 Testing login route with JSON...');
        
        // Test 2: JSON (like the webapp)
        const response2 = await fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'client-id': '437920819fa89d19abe380073d28839c',
                'client-secret': '28649120bdf32812f433f428b15ab1a1'
            },
            body: JSON.stringify({
                email: 'testartist@example.com',
                password: 'Loca$h2682'
            })
        });
        
        const data2 = await response2.json();
        console.log('JSON Response Status:', response2.status);
        console.log('JSON Response:', data2);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

testLoginRoute(); 