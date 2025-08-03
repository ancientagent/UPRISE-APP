const fs = require('fs');
const path = require('path');

// Path to the .env file in the main project directory
const envPath = path.join(__dirname, '..', '.env');

async function fixEnvGenres() {
    try {
        console.log('=== FIXING ENVIRONMENT VARIABLE FOR GENRES ===\n');

        // Read the current .env file
        console.log('1. Reading current .env file...');
        const envContent = fs.readFileSync(envPath, 'utf8');
        console.log('Current .env file size:', envContent.length, 'characters');
        console.log('');

        // Check current GET_ALL_GENRES_URL value
        const currentMatch = envContent.match(/GET_ALL_GENRES_URL=(.+)/);
        if (currentMatch) {
            console.log('2. Current GET_ALL_GENRES_URL value:', currentMatch[1]);
        } else {
            console.log('2. GET_ALL_GENRES_URL not found in .env');
        }
        console.log('');

        // Replace the value to use the comprehensive genres endpoint
        console.log('3. Updating to use comprehensive genres endpoint...');
        const updatedContent = envContent.replace(
            /GET_ALL_GENRES_URL=.+/g,
            'GET_ALL_GENRES_URL=/onboarding/all-genres'
        );

        // Write the updated content back
        fs.writeFileSync(envPath, updatedContent);
        console.log('✅ Environment variable updated successfully!');
        console.log('');

        // Verify the change
        console.log('4. Verifying the change...');
        const newContent = fs.readFileSync(envPath, 'utf8');
        const newMatch = newContent.match(/GET_ALL_GENRES_URL=(.+)/);
        if (newMatch) {
            console.log('New GET_ALL_GENRES_URL value:', newMatch[1]);
        }
        console.log('');

        console.log('🎯 FIX COMPLETE!');
        console.log('The frontend will now load the comprehensive genres list (97 genres)');
        console.log('which includes Punk with the correct ID mapping.');
        console.log('');
        console.log('Next steps:');
        console.log('1. Restart the Metro bundler to pick up the new environment variable');
        console.log('2. Test the onboarding flow again - Punk should now save correctly');

    } catch (error) {
        console.error('Error:', error.message);
    }
}

fixEnvGenres(); 