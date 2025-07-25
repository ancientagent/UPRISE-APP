const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, 'Webapp_API-Develop', '.env');

try {
  let envContent = fs.readFileSync(envPath, 'utf8');
  
  // Update database credentials
  envContent = envContent.replace('DB_PASSWORD=postgres', 'DB_PASSWORD=Loca$h2682');
  envContent = envContent.replace('DB_NAME=postgres', 'DB_NAME=uprise_radiyo');
  
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Backend .env file updated with correct database credentials');
} catch (error) {
  console.error('❌ Error updating backend .env file:', error.message);
} 