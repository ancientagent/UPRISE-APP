#!/usr/bin/env node

/**
 * Test Script to Check Genres in Database
 * This script will help verify what genres are actually available
 */

const axios = require('axios');

console.log('🔍 TESTING GENRES ENDPOINT\n');

async function testGenresEndpoint() {
  try {
    console.log('📡 Testing /auth/genres endpoint...');
    
    const response = await axios.get('http://localhost:3000/auth/genres', {
      headers: {
        'client-id': '437920819fa89d19abe380073d28839c',
        'client-secret': '28649120bdf32812f433f428b15ab1a1'
      }
    });
    
    console.log('✅ Response received');
    console.log('📊 Response structure:', Object.keys(response.data));
    console.log('📋 Genres count:', response.data.data ? response.data.data.length : 'No data');
    
    if (response.data.data && response.data.data.length > 0) {
      console.log('\n🎵 Available Genres:');
      response.data.data.forEach((genre, index) => {
        console.log(`  ${index + 1}. ${genre.name} (ID: ${genre.id})`);
      });
      
      // Test some specific genres
      const testGenres = ['Punk', 'Rock', 'Jazz', 'Hip Hop', 'Electronic'];
      console.log('\n🔍 Testing specific genre searches:');
      
      testGenres.forEach(testGenre => {
        const found = response.data.data.find(g => 
          g.name.toLowerCase().includes(testGenre.toLowerCase())
        );
        console.log(`  "${testGenre}": ${found ? `✅ Found (${found.name})` : '❌ Not found'}`);
      });
      
    } else {
      console.log('❌ No genres found in response');
      console.log('Full response:', JSON.stringify(response.data, null, 2));
    }
    
  } catch (error) {
    console.error('❌ Error testing genres endpoint:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

// Run the test
testGenresEndpoint(); 