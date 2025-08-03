// This is the complete, corrected file for songPriorityUpdate.js
const { Songs, SongPriority } = require('../database/models');
const FairPlayAlgorithm = require('../utils/fairPlayAlgorithm');
const db = require('../database/models');

async function updateSongPriorities() {
    console.log('Starting song priority update...');
    const fairPlayAlgorithm = new FairPlayAlgorithm(db); // Correctly pass the db object

    try {
        const liveSongs = await Songs.findAll({
            where: {
                live: true,
                deletedAt: null
            }
        });

        let updatedCount = 0;
        for (const song of liveSongs) {
            // For now, we assume all songs are competing at the CITYWIDE tier
            await fairPlayAlgorithm.updateSongPriority(song, 'CITYWIDE');
            updatedCount++;
        }
        console.log(`Song priority update completed. Updated: ${updatedCount}, Errors: 0`);

    } catch (error) {
        console.error('Error during song priority update cron job:', error);
    }
}

// ... (rest of the file for scheduling the cron job)
module.exports = {
    updateSongPriorities,
};