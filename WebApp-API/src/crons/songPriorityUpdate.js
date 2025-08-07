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
            await fairPlayAlgorithm.updateSongPriority(db, song, 'CITYWIDE');
            updatedCount++;
        }
        console.log(`Song priority update completed. Updated: ${updatedCount}, Errors: 0`);

    } catch (error) {
        console.error('Error during song priority update cron job:', error);
    }
}

async function cleanupPriorityRecords() {
    console.log('Starting priority records cleanup...');
    
    try {
        // Clean up priority records older than 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const deletedCount = await SongPriority.destroy({
            where: {
                lastCalculated: {
                    [db.Sequelize.Op.lt]: thirtyDaysAgo
                }
            }
        });
        
        console.log(`Priority records cleanup completed. Deleted: ${deletedCount} old records`);
        
    } catch (error) {
        console.error('Error during priority records cleanup:', error);
    }
}

async function initializePriorityRecords() {
    console.log('Starting priority records initialization...');
    const fairPlayAlgorithm = new FairPlayAlgorithm(db);
    
    try {
        // Find songs that don't have priority records yet
        const songsWithoutPriority = await Songs.findAll({
            where: {
                live: true,
                deletedAt: null
            },
            include: [{
                model: SongPriority,
                required: false,
                where: {
                    tier: 'CITYWIDE'
                }
            }],
            having: db.Sequelize.literal('SongPriorities.id IS NULL')
        });
        
        let initializedCount = 0;
        for (const song of songsWithoutPriority) {
            await fairPlayAlgorithm.updateSongPriority(db, song, 'CITYWIDE');
            initializedCount++;
        }
        
        console.log(`Priority records initialization completed. Initialized: ${initializedCount} new records`);
        
    } catch (error) {
        console.error('Error during priority records initialization:', error);
    }
}

module.exports = {
    updateSongPriorities,
    cleanupPriorityRecords,
    initializePriorityRecords
};