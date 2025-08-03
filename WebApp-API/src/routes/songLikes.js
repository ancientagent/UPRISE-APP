const Router = require('express').Router();
const { Songs, SongLikes, UserSongListens, SongSkips } = require('../database/models');
const { generateNotification } = require('../utils/notificationService');
const { notificationTypes } = require('../utils/types/notificationTypes');
const { getUserFollowers } = require('../utils/userInfo');
const { sendPushNotification } = require('../utils/pushNotifications');
const fairPlayAlgorithm = require('../utils/fairPlayAlgorithm');

/**
 * Update song like/dislike status
 * Supports three states: LIKE, NEUTRAL, DISLIKE
 * Can be changed during song playback, final state is recorded when song ends
 */
Router.post('/song-like-status', async (req, res) => {
    try {
        if (!req.user.id) throw new Error('Invalid user id');
        let { songId, status, tier, location } = req.body;
        
        if (!songId) throw new Error('Invalid song id');
        if (!status) throw new Error('Status is required');
        if (!tier) throw new Error('Tier information required');
        if (!location) throw new Error('Location data required');
        
        // Validate status
        const validStatuses = ['LIKE', 'NEUTRAL', 'DISLIKE'];
        if (!validStatuses.includes(status.toUpperCase())) {
            throw new Error('Invalid status. Must be LIKE, NEUTRAL, or DISLIKE');
        }
        
        status = status.toUpperCase();
        
        // Validate tier
        const validTiers = ['CITYWIDE', 'STATEWIDE', 'NATIONAL'];
        if (!validTiers.includes(tier.toUpperCase())) {
            throw new Error('Invalid tier. Must be CITYWIDE, STATEWIDE, or NATIONAL');
        }
        
        tier = tier.toUpperCase();
        
        const song = await Songs.findOne({
            where: { id: songId }
        });
        if (!song) throw new Error('Song not found');

        // Verify user is in their home scene (except for NATIONAL tier)
        if (tier !== 'NATIONAL') {
            const isInHomeScene = await verifyHomeSceneLocation(req.user.id, location);
            if (!isInHomeScene) {
                throw new Error('You can only engage with songs in your home scene');
            }
        }

        // Create or update like status
        const [songLike, created] = await SongLikes.findOrCreate({
            where: {
                userId: req.user.id,
                songId,
                tier
            },
            defaults: {
                status,
                location: JSON.stringify(location)
            }
        });

        if (!created) {
            // Update existing record
            songLike.status = status;
            songLike.location = JSON.stringify(location);
            await songLike.save();
        }

        // Update song priority
        await fairPlayAlgorithm.updateSongPriority(songId, tier);

        // Generate notifications for followers (only for likes)
        if (status === 'LIKE') {
            const users = await getUserFollowers({ userId: req.user.id });
            if (users.length > 0) {
                const userIds = users.map(id => id.userId);
                
                for await (const userId of userIds) {
                    await generateNotification({
                        type: notificationTypes.LIKE_SONG,
                        receiverId: userId,
                        initiatorId: req.user.id,
                        referenceId: songId
                    });
                }
                
                // Send push notifications
                await sendPushNotification(userIds, {
                    type: notificationTypes.LIKE_SONG,
                    referenceId: songId,
                });
            }
        }
        
        res.status(200).json({
            data: songLike,
            message: `Song ${status.toLowerCase()} status updated successfully`
        });
        
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * Get user's like status for a song in a specific tier
 */
Router.get('/song-like-status/:songId/:tier', async (req, res) => {
    try {
        if (!req.user.id) throw new Error('Invalid user id');
        const { songId, tier } = req.params;
        
        if (!songId) throw new Error('Invalid song id');
        if (!tier) throw new Error('Tier information required');
        
        const validTiers = ['CITYWIDE', 'STATEWIDE', 'NATIONAL'];
        if (!validTiers.includes(tier.toUpperCase())) {
            throw new Error('Invalid tier. Must be CITYWIDE, STATEWIDE, or NATIONAL');
        }
        
        const songLike = await SongLikes.findOne({
            where: {
                userId: req.user.id,
                songId,
                tier: tier.toUpperCase()
            }
        });
        
        res.status(200).json({
            data: songLike || { status: 'NEUTRAL' },
            message: 'Like status retrieved successfully'
        });
        
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * Record song skip with timing information
 */
Router.post('/song-skip', async (req, res) => {
    try {
        if (!req.user.id) throw new Error('Invalid user id');
        let { songId, skipTime, songDuration, tier, location } = req.body;
        
        if (!songId) throw new Error('Invalid song id');
        if (!skipTime) throw new Error('Skip time is required');
        if (!songDuration) throw new Error('Song duration is required');
        if (!tier) throw new Error('Tier information required');
        if (!location) throw new Error('Location data required');
        
        // Validate tier
        const validTiers = ['CITYWIDE', 'STATEWIDE', 'NATIONAL'];
        if (!validTiers.includes(tier.toUpperCase())) {
            throw new Error('Invalid tier. Must be CITYWIDE, STATEWIDE, or NATIONAL');
        }
        
        tier = tier.toUpperCase();
        
        const song = await Songs.findOne({
            where: { id: songId }
        });
        if (!song) throw new Error('Song not found');

        // Verify user is in their home scene (except for NATIONAL tier)
        if (tier !== 'NATIONAL') {
            const isInHomeScene = await verifyHomeSceneLocation(req.user.id, location);
            if (!isInHomeScene) {
                throw new Error('You can only engage with songs in your home scene');
            }
        }

        // Calculate skip percentage
        const skipPercentage = (skipTime / songDuration) * 100;

        // Create skip record
        const songSkip = await SongSkips.create({
            userId: req.user.id,
            songId,
            tier,
            skipTime: parseFloat(skipTime),
            songDuration: parseFloat(songDuration),
            skipPercentage: parseFloat(skipPercentage.toFixed(2))
        });

        // Update song priority
        await fairPlayAlgorithm.updateSongPriority(songId, tier);

        res.status(200).json({
            data: songSkip,
            message: 'Song skip recorded successfully'
        });
        
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * Record full song listen
 */
Router.post('/song-listen', async (req, res) => {
    try {
        if (!req.user.id) throw new Error('Invalid user id');
        let { songId, tier, location } = req.body;
        
        if (!songId) throw new Error('Invalid song id');
        if (!tier) throw new Error('Tier information required');
        if (!location) throw new Error('Location data required');
        
        // Validate tier
        const validTiers = ['CITYWIDE', 'STATEWIDE', 'NATIONAL'];
        if (!validTiers.includes(tier.toUpperCase())) {
            throw new Error('Invalid tier. Must be CITYWIDE, STATEWIDE, or NATIONAL');
        }
        
        tier = tier.toUpperCase();
        
        const song = await Songs.findOne({
            where: { id: songId }
        });
        if (!song) throw new Error('Song not found');

        // Verify user is in their home scene (except for NATIONAL tier)
        if (tier !== 'NATIONAL') {
            const isInHomeScene = await verifyHomeSceneLocation(req.user.id, location);
            if (!isInHomeScene) {
                throw new Error('You can only engage with songs in your home scene');
            }
        }

        // Create listen record
        const songListen = await UserSongListens.create({
            userId: req.user.id,
            songId,
            listenSource: 'RADIO'
        });

        // Update song priority
        await fairPlayAlgorithm.updateSongPriority(songId, tier);

        res.status(200).json({
            data: songListen,
            message: 'Song listen recorded successfully'
        });
        
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * Get song engagement statistics for a specific tier
 */
Router.get('/song-engagement/:songId/:tier', async (req, res) => {
    try {
        const { songId, tier } = req.params;
        
        if (!songId) throw new Error('Invalid song id');
        if (!tier) throw new Error('Tier information required');
        
        const validTiers = ['CITYWIDE', 'STATEWIDE', 'NATIONAL'];
        if (!validTiers.includes(tier.toUpperCase())) {
            throw new Error('Invalid tier. Must be CITYWIDE, STATEWIDE, or NATIONAL');
        }
        
        const tierUpper = tier.toUpperCase();
        
        // Get engagement metrics
        const [likes, dislikes, fullListens, skips] = await Promise.all([
            SongLikes.count({ where: { songId, tier: tierUpper, status: 'LIKE' } }),
            SongLikes.count({ where: { songId, tier: tierUpper, status: 'DISLIKE' } }),
            UserSongListens.count({ where: { songId } }),
            SongSkips.count({ where: { songId, tier: tierUpper } })
        ]);
        
        // Get average skip percentage
        const skipData = await SongSkips.findAll({
            where: { songId, tier: tierUpper },
            attributes: ['skipPercentage']
        });
        
        const averageSkipPercentage = skipData.length > 0 
            ? skipData.reduce((sum, record) => sum + record.skipPercentage, 0) / skipData.length
            : 0;
        
        res.status(200).json({
            data: {
                songId,
                tier: tierUpper,
                likes,
                dislikes,
                fullListens,
                skips,
                averageSkipPercentage: parseFloat(averageSkipPercentage.toFixed(2)),
                totalEngagement: likes + dislikes + fullListens + skips
            },
            message: 'Song engagement statistics retrieved successfully'
        });
        
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * Helper function to verify user is in their home scene
 */
async function verifyHomeSceneLocation(userId, location) {
    // This would typically check if the user's location matches their registered home scene
    // For now, we'll return true as a placeholder
    // In a real implementation, you would:
    // 1. Get user's registered home scene (city, state)
    // 2. Convert GPS coordinates to city/state
    // 3. Compare the two
    return true;
}

module.exports = Router; 