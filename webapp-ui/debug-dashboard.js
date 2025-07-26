// Debug script to test dashboard API calls
// Run this in the browser console when logged in as user "i"

console.log('🔍 Starting dashboard API debugging...');

// Get the current user token
const token = localStorage.getItem('userToken');
console.log('Token present:', !!token);

if (!token) {
  console.log('❌ No token found. Please log in first.');
} else {
  console.log('✅ Token found, testing API calls...');
  
  // Test the band details API call
  fetch('http://localhost:3000/band/band_details', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'client-id': '437920819fa89d19abe380073d28839c',
      'client-secret': '28649120bdf32812f433f428b15ab1a1',
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    console.log('📊 Band Details API Response Status:', response.status);
    return response.json();
  })
  .then(data => {
    console.log('📊 Band Details API Response Data:', data);
  })
  .catch(error => {
    console.error('❌ Band Details API Error:', error);
  });
  
  // Test the events API call
  fetch('http://localhost:3000/eventmanagement/events-list', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'client-id': '437920819fa89d19abe380073d28839c',
      'client-secret': '28649120bdf32812f433f428b15ab1a1',
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    console.log('📊 Events API Response Status:', response.status);
    return response.json();
  })
  .then(data => {
    console.log('📊 Events API Response Data:', data);
  })
  .catch(error => {
    console.error('❌ Events API Error:', error);
  });
}

console.log('🔍 Debugging complete. Check the console output above.'); 