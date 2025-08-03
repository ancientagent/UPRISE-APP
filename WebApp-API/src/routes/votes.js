const Router = require('express').Router();
const {  Songs,Votes,SongBlast,Notifications, UserStationPrefrence } = require('../database/models');
const { generateNotification } = require('../utils/notificationService');
const { notificationTypes } = require('../utils/types/notificationTypes');
const { getUserFollowers } = require('../utils/userInfo');
const { sendPushNotification } = require('../utils/pushNotifications');
const fairPlayAlgorithm = require('../utils/fairPlayAlgorithm');

//SONG UPVOTE AND DOWNVOTE
Router.post('/vote',async(req,res) => {
    try{
        if(!req.user.id) throw new Error('Invalid user id');
        let userId = req.user.id;
        let { songId, type, location, tier } = req.body;
        
        if(!userId) throw new Error('Invalid user id');
        if(!songId) throw new Error('Invalid song id');
        if(!type && typeof(type) === 'string') throw new Error('Invalid type');
        if(!location) throw new Error('Location data required for voting');
        if(!tier) throw new Error('Tier information required for voting');
        
        // Reject votes for NATIONAL tier - no voting allowed in nationwide broadcasts
        if(tier === 'NATIONAL') {
            throw new Error('Voting is not available for nationwide broadcasts');
        }
        
        type = type.toUpperCase();
       
        const song = await Songs.findOne({
            where:{
                id:songId
            }
        });
        if(!song) throw new Error('song not found');

        // Verify user is in their home scene
        const isInHomeScene = await verifyHomeSceneLocation(userId, location);
        if (!isInHomeScene) {
            throw new Error('You can only vote in your home scene');
        }

        // Check if user has already voted on this song in this tier
        const existingVote = await Votes.findOne({
            where: {
                userId,
                songId,
                tier
            }
        });

        if (existingVote) {
            throw new Error('You have already voted on this song in this tier');
        }

        // Create or update vote
        const votes = await Votes.findOrCreate({
            where:{
                userId,
                songId
            }
        });
        
        votes[0].type = type;
        votes[0].tier = tier;
        votes[0].location = JSON.stringify(location);
        await votes[0].save();

        // Calculate Fair Play score for the song
        const fairPlayScore = await fairPlayAlgorithm.calculateFairPlayScore(songId, tier);
        
        // Check if song meets tier progression criteria
        const canProgress = await fairPlayAlgorithm.checkTierProgression(songId, tier);
        if (canProgress) {
            await fairPlayAlgorithm.promoteSong(songId, tier);
        }

        // Generate notifications for followers
        const users  = await getUserFollowers({userId});
        if(users.length > 0){
            const userIds = users.map( id => id.userId);
            
            for await (const userId of userIds){
                await generateNotification(
                    { 
                        type: notificationTypes.UPVOTE_SONG,
                        receiverId:userId,
                        initiatorId:req.user.id,
                        referenceId:songId
                    });
            }
        }
        
        res.status(200).json({
            data: votes[0],
            fairPlayScore,
            tierProgression: canProgress
        });   
    }catch(error){
        res.status(400).json({error:error.message});
    }
});

//undo vote
Router.post('/undo-vote/',async(req,res) => {
    try{
        let { songId, type, tier } = req.body;
        if(!songId) throw new Error('Invalid song id');
        if(!type && typeof(type) === 'string') throw new Error('Invalid type');
        if(!tier) throw new Error('Tier information required');
        
        type = type.toUpperCase();
        const undoUpVote = await Votes.findOne({
            where:{
                userId:req.user.id,
                songId,
                type,
                tier
            }
        });
        if(!undoUpVote) throw new Error('vote not found');
        
        if(type === 'UPVOTE_SONG'){
            await Notifications.destroy({
                where:{
                    type:notificationTypes.UPVOTE_SONG,
                    referenceId:songId
                }});
        }
        await undoUpVote.destroy();
        res.status(200).json({data: undoUpVote});
           
    }
    catch(error){
        res.status(400).json({error:error.message});
    }
});

/**
 * Verify user is in their home scene location
 */
async function verifyHomeSceneLocation(userId, location) {
    try {
        // Get user's station preference to determine home scene
        const userStationPref = await UserStationPrefrence.findOne({
            where: {
                userId,
                active: true
            }
        });

        if (!userStationPref) {
            return false;
        }

        // In a real implementation, you would:
        // 1. Geocode the GPS coordinates to get city/state
        // 2. Compare with user's registered home scene
        // 3. Check if the location is within acceptable radius
        
        // For now, we'll do a basic check
        // This should be enhanced with proper geocoding and distance calculation
        return true;
    } catch (error) {
        console.error('Error verifying home scene location:', error);
        return false;
    }
}

//song-blast
Router.post('/song-blast',async(req,res) => {
    try{
        if(!req.user.id) throw new Error('User not found');
        const { songId } = req.body;
        const song = await Songs.findOne({
            where:{
                id:songId
            }
        });
        if(!song) throw new Error('Song not found');

        const songBlast = await SongBlast.create({
            songId,
            userId:req.user.id
        });

        const users  = await getUserFollowers({userId:req.user.id});
        if(users.length > 0){
            const userIds = users.map( id => id.userId);
            
            for await (const userId of userIds){
                await generateNotification(
                    { 
                        type: notificationTypes.BLAST_SONG,
                        receiverId:userId,
                        initiatorId:req.user.id,
                        referenceId:song.id

                    });
            }
            // push-notifications
            await sendPushNotification(userIds,{
                type: notificationTypes.BLAST_SONG,
                referenceId:songId,
            });
            
        }
        res.json({message:'song has been blast',data:songBlast});
    }
    catch(error){
        res.status(400).json({error:error.message});
    }

});

module.exports = Router;