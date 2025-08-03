const Router = require('express').Router();
const bcrypt = require('bcrypt');

const config = require('../config/index');
const { User,Roles,Locations,Band,BandMembers,Genres,UserGenrePrefrences,Events,
    Songs,UserSongListens,UserFollows,UserBandFollows,SongFavorite,Instruments,UserInstruments,
    Notifications,UserCalenderEvent,avatars,Reports,UserRadioQueue, UserStationPrefrence, ArtistProfile } = require('../database/models/');
const {
    isvalidPassword,
    isValidEmail,
    //isValidMobile,
    isValidUserName
} = require('../utils/index');
const { getUserLocation,getUserGenres,getUserFollowing,getUserFollowers, getUserfollowingBands,getUserInstruments, 
    getUserStationType,getUserSwitchStationsByState, getUserSwitchStationsByCity } = require('../utils/userInfo');
const { getUserById } = require('../datastore/index');
const { handleFileUpload} = require('../utils/fileUpload');
const { generateNotification } = require('../utils/notificationService');
const { notificationTypes } = require('../utils/types/notificationTypes');
const { addingUserAsAttandees,RemoveUserFromAttandees } = require('../utils/calender');
const { sendMailToAdmin, sendMailToArtist } = require('../utils/sendgrid');
const { states } = require('../utils/states');
const { runQuery } = require('../utils/dbquery');
const { QueryTypes } = require('sequelize');
const logger = require('../utils/logger');
const { Op } = require('sequelize');
const upload = require('multer')();


/**
 * @swagger
 *
 * /user/:
 *  get:
 *    description: returns the user
 *    responses:
 *      '200':
 *         description: Success response
 */


Router.get('/me', async (req, res) => {
    try {
        console.log('=== GET /user/me DIAGNOSTIC START ===');
        console.log('User ID from request:', req.user.id);
        
        let user = await User.findOne({
            where: {
                id: req.user.id,
            },
            attributes:['id','firstName','userName','lastName','email','mobile','gender',
                'avatar','status','onBoardingStatus','facebook','about','instagram','twitter'],
            include: [
                {
                    model: Roles,
                    as: 'role',
                    attributes: ['id', 'name'],
                },
            ],
        });
        
        if (!user) {
            console.log('❌ USER NOT FOUND - User ID:', req.user.id);
            return res.status(404).json({ error: 'User not found' });
        }
        
        user = user.toJSON();
        console.log('✅ User found:', { id: user.id, email: user.email, onBoardingStatus: user.onBoardingStatus });
        
        if(user.avatar){
            const avatar = await avatars.findOne({
                where: {
                    url: user.avatar
                },
            });
            if(avatar){
                user.avatarId = avatar.id;
            }
        }
        
        // Get user's artist profile using the new unified model
        const artistProfile = await ArtistProfile.findOne({
            where: {
                userId: req.user.id,
            },
            attributes: ['id', 'title', 'description', 'logo', 'facebook', 'instagram', 'youtube', 'twitter', 'status', 'promosEnabled']
        });
        
        console.log('Artist Profile found:', artistProfile ? { id: artistProfile.id, title: artistProfile.title } : 'None');
        
        // Keep backward compatibility with BandMembers for now
        const bands = await runQuery(`
                           select b.id,b.title,b.logo,b."promosEnabled",bm."bandRoleId"  from "BandMembers" bm
                           left join "Bands" b on b.id = bm."bandId"
                           where bm."userId" = :userId`,
        { type:QueryTypes.SELECT, replacements: { userId: user.id} });
        
        console.log('Bands found:', bands.length, bands);
        
        const band = {};
        if(artistProfile){
            // Use the Band ID from the bands query, not the ArtistProfile ID
            if(bands && bands.length > 0) {
                band.id = bands[0].id; // This is the actual Band.id that the song upload expects
                band.title = artistProfile.title;
                band.description = artistProfile.description;
                band.logo = artistProfile.logo;
                band.facebook = artistProfile.facebook;
                band.instagram = artistProfile.instagram;
                band.youtube = artistProfile.youtube;
                band.twitter = artistProfile.twitter;
                band.status = artistProfile.status;
                band.promosEnabled = artistProfile.promosEnabled;
            } else {
                // If no band found, create a fallback band object
                band.id = null;
                band.title = artistProfile.title;
                band.description = artistProfile.description;
                band.logo = artistProfile.logo;
                band.facebook = artistProfile.facebook;
                band.instagram = artistProfile.instagram;
                band.youtube = artistProfile.youtube;
                band.twitter = artistProfile.twitter;
                band.status = artistProfile.status;
                band.promosEnabled = artistProfile.promosEnabled;
            }
        }
        user.band = band;
        user.bands = bands;
        user.radioPrefrence = {};
        
        // CRITICAL: Get user's station preference
        console.log('🔍 Checking UserStationPrefrence for user ID:', user.id);
        const stationPreference = await UserStationPrefrence.findOne({
            where: {
                userId: user.id,
                active: true
            }
        });
        
        if (stationPreference) {
            console.log('✅ ACTIVE STATION PREFERENCE FOUND:', {
                id: stationPreference.id,
                userId: stationPreference.userId,
                cityName: stationPreference.cityName,
                stateName: stationPreference.stateName,
                status: stationPreference.status
            });
        } else {
            console.log('❌ NO ACTIVE STATION PREFERENCE FOUND for user ID:', user.id);
            
            // Check if there are any inactive preferences
            const inactivePreferences = await UserStationPrefrence.findAll({
                where: {
                    userId: user.id
                }
            });
            console.log('Inactive station preferences found:', inactivePreferences.length);
        }
        
        user.city = await getUserSwitchStationsByCity({userId:user.id});
        user.state = await getUserSwitchStationsByState({userId:user.id});
        user.radioPrefrence.location = await getUserLocation({userId:user.id});
        user.radioPrefrence.stationType = await getUserStationType({userId:user.id});
        user.radioPrefrence.genres = await getUserGenres({userId:user.id});
        
        console.log('📍 Location data:', {
            city: user.city,
            state: user.state,
            location: user.radioPrefrence.location,
            stationType: user.radioPrefrence.stationType,
            genres: user.radioPrefrence.genres
        });
        
        const followersCount = await getUserFollowers({userId:user.id});
        user.followers = followersCount.length > 0 ?parseInt(followersCount[0].totalCount):0;

        const followingMembersCount = await  getUserFollowing({userId:user.id});
        const followingBandsCount = await getUserfollowingBands(user.id);
       
        let userFollowingMembers = followingMembersCount.length > 0 ? parseInt(followingMembersCount[0].totalCount): 0;
        let userFollowingBands = followingBandsCount.length > 0 ? parseInt(followingBandsCount[0].totalCount): 0;
        //add following bands and members
        user.following = userFollowingMembers + userFollowingBands ; 
        user.instruments = await getUserInstruments({userId:user.id});

        console.log('=== GET /user/me DIAGNOSTIC COMPLETE ===');
        console.log('Final user object keys:', Object.keys(user));
        console.log('Band object:', user.band);
        console.log('Radio preference:', user.radioPrefrence);

        res.json({ data: user });
    } catch (error) {
        console.log('❌ GET /user/me ERROR:', error.message);
        console.log('Error stack:', error.stack);
        res.status(400).json({ error: error.message });
    }
});

//fcm -token
Router.post('/notification/register-token', async (req, res) => {
    try {
        const { token } = req.body;
        if(!token) throw new Error('Token is required');
        let user = await User.findOne({
            where: {
                id: req.user.id,
            },
        });
        if(!user) throw new Error('User not found');
        user.fcmToken = token;
        await user.save();
        res.json({ data: user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
);

//un-register fcm token
Router.post('/notification/un-register-token', async (req, res) => {
    try {
        const user = await User.findOne({
            where: {
                id: req.user.id,
            },
        });
        if(!user) throw new Error('User not found');
        user.fcmToken = null;
        await user.save();
        res.json({ data: user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


Router.get('/band',async(req,res)=>{
    try{
        // Get user's artist profile using the new unified model
        const artistProfile = await ArtistProfile.findOne({
            where:{
                userId: req.user.id
            },
            attributes: ['id', 'title', 'description', 'logo', 'facebook', 'instagram', 'youtube', 'twitter', 'status', 'promosEnabled', 'createdAt', 'updatedAt']
        }); 
        
        if(!artistProfile) throw new Error('Artist profile not found');
        
        res.json({data: artistProfile});
    }
    catch(error){
        res.status(400).json({error:error.message});
    }
});

// Create artist profile for existing users
Router.post('/create-artist-profile', upload.single('logo'), async(req,res) => {
    try {
        const { title, description, cityName, stateName } = req.body;
        
        if (!title || title.trim() === '') {
            throw new Error('Artist/Band name is required');
        }
        
        // Check if user already has an artist profile
        const existingProfile = await ArtistProfile.findOne({
            where: { userId: req.user.id }
        });
        
        if (existingProfile) {
            throw new Error('User already has an artist profile');
        }
        
        // Create new ArtistProfile
        const artistProfileData = {
            title: title.trim(),
            description: description || '',
            cityName: cityName || null,
            stateName: stateName || null,
            userId: req.user.id,
            status: 'ACTIVE',
            promosEnabled: false,
        };
        
        // Handle logo upload if provided
        if (req.file) {
            const logoFile = await handleFileUpload(req.file, 'artist-logos');
            artistProfileData.logo = logoFile.Location;
        }
        
        const newArtistProfile = await ArtistProfile.create(artistProfileData);
        
        // Also create a Band record for backward compatibility
        const newBand = await Band.create({
            title: title.trim(),
            cityName: cityName || null,
            stateName: stateName || null,
            description: description || '',
            createdBy: req.user.id,
            status: 'ACTIVE',
            promosEnabled: false,
        });
        
        // Create BandMembers record
        const bandRole = await Roles.findOne({
            where: { name: 'band_owner' }
        });
        
        await BandMembers.create({
            bandId: newBand.id,
            userId: req.user.id,
            bandRoleId: bandRole.id,
        });
        
        res.json({
            message: 'Artist profile created successfully',
            data: newArtistProfile
        });
        
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * @swagger
 *
 * /user/change-password:
 *  get:
 *    description: returns the user
 *    responses:
 *      '200':
 *         description: Success response
 */

Router.put('/change-password', async (req, res) => {
    try {
        const { currentPassword, password } = req.body;
        if (!currentPassword || !password) throw new Error('Invalid password');
        if(!req.user.id) throw new Error('Invalid user id');
        if(currentPassword === password) throw new Error('New password should be different from current password');
        const user = await User.findOne({
            where: {
                id: req.user.id,
            },
        });
        if (!user) {
            throw new Error('you dont have access to change the password');
        }
        // eslint-disable-next-line quotes
        if(user.id !== req.user.id) throw new Error(`you can't change the password`);
        const decodePassword = await bcrypt.compare(currentPassword, user.password);
        if (!decodePassword) {
            throw new Error(' Invalid password ');
        }
        if (!isvalidPassword(password)) {
            throw new Error(
                'password must have atlease 8 characters consists of atleast one lowercase letter, one uppercase letter, one number and a special character'
            );
        }
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        await user.update({ password: hashedPassword });
        const userInfo = await getUserById(user.id);
        res.json({
            message: 'Password has been changed',
            data: {
                userInfo,
            },
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * @swagger
 *
 * /profile/:
 *  put:
 *    description: update user profile firstName,lastName,email,mobile
 *    responses:
 *      '200':
 *         description: Success response
 */

Router.put('/update_profile',upload.single('avatar'), async (req, res) => {
    try {
        let { userName = '', email, mobile,userId,avatar,about='',facebook,instagram,twitter,avatarId} = req.body;
        if(!userId) throw new Error('Invalid user id');
        if(!userName) throw new Error('User name has been required');
        const existingUser = await User.findOne({
            where: {
                id:userId,
            },
        });
        if (!existingUser) {
            throw new Error('user not found');
        }
        // eslint-disable-next-line quotes
        if(existingUser.id !== req.user.id) throw new Error(`you can't update the profile`);
        let updateData = {};
        if(userName){
            if(!isValidUserName(userName)){
                throw new Error('you must contain valid username');
            }
            const existingUserName = await User.findOne({
                where: {
                    userName
                },
            });
            if(existingUserName){
                if(existingUserName.userName !== req.body.userName) throw new Error('User name already exist another user');
            }
            else{
                updateData.userName = userName.trim();
            }
            
        }
        
        if(email){
            if (existingUser.email !== req.body.email) {
                throw new Error('Email is already taken');
            }
            if (!isValidEmail(email)) {
                throw new Error('Invalid email');
            }
            updateData.email = email;
        }
        if(mobile){
            // if (!isValidMobile(mobile)) {
            //     throw new Error('Invalid mobile number');
            // }
            updateData.mobile = mobile.toString();
        }else{
            updateData.mobile = null;
        }
        if (!avatar) {
            updateData.avatar = null;
        }
        if(parseInt(avatarId)){
            let avatar = await avatars.findOne({
                where: {
                    id: avatarId
                }
            });
            if(!avatar) throw new Error('Invalid avatar');
            updateData.avatar = avatar.url;
        }
        const avatarFile = req.file;
        if (avatarFile){
            const file = await handleFileUpload(avatarFile,'profile-pics');
            updateData.avatar = file.Location;
        }
        if(about){
            updateData.about = about;
        }else{
            updateData.about = null;
        }
        if(facebook){
            updateData.facebook = facebook;
        }
        else{
            updateData.facebook = null;
        }
        if(instagram){
            updateData.instagram = instagram;
        }
        else{
            updateData.instagram = null;
        }
        if(twitter){
            updateData.twitter = twitter;
        }else{
            updateData.twitter = null;
        }
        const previousAvatar = existingUser.avatar;
        const updatedUser = await existingUser.update(updateData);
        
        // Update artist profile if user is an artist
        let artistProfile = null;
        if (existingUser.roleId === 2) { // Assuming roleId 2 is artist role
            artistProfile = await ArtistProfile.findOne({
                where: { userId: existingUser.id }
            });
            
            if (artistProfile) {
                const artistUpdateData = {};
                if (facebook !== undefined) artistUpdateData.facebook = facebook;
                if (instagram !== undefined) artistUpdateData.instagram = instagram;
                if (twitter !== undefined) artistUpdateData.twitter = twitter;
                
                if (Object.keys(artistUpdateData).length > 0) {
                    await artistProfile.update(artistUpdateData);
                }
            }
        }
        
        const user = await getUserById(updatedUser.id);
        if(previousAvatar !== user.avatar){
            return res.json({
                message: 'Profile Pic has been updated',
                data: {
                    user,
                    artistProfile: artistProfile ? artistProfile.toJSON() : null
                },
            });
        }
        
        return res.json({
            message: 'User has been updated',
            data: {
                user,
                artistProfile: artistProfile ? artistProfile.toJSON() : null
            },
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * @swagger
 *
 * /user/artist-profile:
 *  put:
 *    description: Update artist profile information
 *    responses:
 *      '200':
 *         description: Success response
 */

Router.put('/artist-profile', upload.single('logo'), async (req, res) => {
    try {
        const { title, description, facebook, instagram, youtube, twitter, promosEnabled, cityName, stateName } = req.body;
        
        // Find user's artist profile
        const artistProfile = await ArtistProfile.findOne({
            where: { userId: req.user.id }
        });
        
        if (!artistProfile) {
            throw new Error('Artist profile not found');
        }
        
        const updateData = {};
        
        // Update title if provided
        if (title && title.trim()) {
            updateData.title = title.trim();
        }
        
        // Update description if provided
        if (description !== undefined) {
            if (description && description.length > 255) {
                throw new Error('Description must be 255 characters or less');
            }
            updateData.description = description ? description.replace(/(\r\n)/gm, '\n') : null;
        }
        
        // Update social media links
        if (facebook !== undefined) updateData.facebook = facebook || null;
        if (instagram !== undefined) updateData.instagram = instagram || null;
        if (youtube !== undefined) updateData.youtube = youtube || null;
        if (twitter !== undefined) updateData.twitter = twitter || null;
        
        // Update promos enabled status
        if (promosEnabled !== undefined) {
            updateData.promosEnabled = promosEnabled === 'true' || promosEnabled === true;
        }
        
        // Update location (home scene)
        if (cityName !== undefined) updateData.cityName = cityName || null;
        if (stateName !== undefined) updateData.stateName = stateName || null;
        
        // Handle logo upload
        const logoFile = req.file;
        if (logoFile) {
            const file = await handleFileUpload(logoFile, 'Artist-logos');
            updateData.logo = file.Location;
        }
        
        // Update the artist profile
        await artistProfile.update(updateData);
        
        // Get updated profile
        const updatedProfile = await ArtistProfile.findOne({
            where: { userId: req.user.id },
            attributes: ['id', 'title', 'description', 'logo', 'facebook', 'instagram', 'youtube', 'twitter', 'status', 'promosEnabled', 'cityName', 'stateName', 'createdAt', 'updatedAt']
        });
        
        const message = logoFile ? 'Artist profile and logo have been updated' : 'Artist profile has been updated';
        
        res.json({
            message: message,
            data: updatedProfile
        });
        
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

Router.post('/location',async(req,res) => {
    try{
        let { street,city,state,country,zipcode,latitude,longitude,userId } = req.body;
        if(!userId) throw new Error('Invalid user id');
        const user = await User.findOne({
            where:{
                id:userId,
            }
        });
        if(!user){
            throw new Error('User not found');
        } 
        if(req.user.id !== user.id) throw new Error('you dont have access to update location');
        let keys = Object.keys(states);
        if(keys.includes(state)){ 
            state = states[state.slice(0,2)];  
        }
        const locationDetails = {
            street,
            city,
            state,
            country,
            zipcode,
            latitude,
            longitude,
            userId:user.id,
        };
        const location = await Locations.create(locationDetails);
        await user.update({
            onBoardingStatus:1
        });
        await UserStationPrefrence.create({
            userId: user.id,
            stationPrefrence: city,
            stationType: '1',
            active:true
        });
        res.json({message :'Location has been detected',data:location});
    }
    catch(error){
        res.status(400).json({error:error.message});
    }
});

// user update radio location city,state
// Router.put('/radio_prefrence', async(req,res) => {
//     try{
//         const { city ,state } = req.body;
// const userPrefrence =  await UserCityPrefrences.findOne({
//     where :{
//         userId:req.user.id
//     }
// });
// if(!userPrefrence ) throw new Error('User not found');
//         const previousState = userPrefrence.state;
//         const updatedState = await  userPrefrence.update({city,state},{
//             where:{
//                 userId: userPrefrence.userId
//             }
//         });
//         if(previousState !== updatedState.state){
//             await UserRadioQueue.destroy({
//                 where:{
//                     userId:userPrefrence.userId 
//                 }
//             });

//         }
//         res.json({data:userPrefrence });

//     }
//     catch(error){
//         res.status(400).json({error:error.message});
//     }
// });

//user switching stations // city, state, national
Router.put('/station_switching', async(req,res) => {
    try { 
        let { stationPrefrence, stationType } = req.body;
        if(!req.user.id) throw('User not found');
        if(!stationPrefrence) throw new Error('Invalid station Prefrence');
        if(!stationType) throw new Error('Invalid station type');
        let keys = Object.keys(states);
        if(keys.includes(stationPrefrence)){ 
            stationPrefrence = states[stationPrefrence.slice(0,2)];  
        }
        let userPrefrence =  await UserStationPrefrence.findOne({
            where :{
                userId:req.user.id,
                stationType
            }
        });
        if(userPrefrence){
            const previousStationPrefrence = userPrefrence.stationType; 
            if(userPrefrence.stationType === '1' || userPrefrence.stationType === '2' || userPrefrence.stationType === '3'){
                await userPrefrence.update(
                    {
                        stationPrefrence,
                        active: true
                    });
                let stationPrefrences =  await UserStationPrefrence.findAll({
                    where :{
                        userId:req.user.id,
                        [Op.not]:{
                            stationType
                        }
                    }
                });
                if(stationPrefrences.length > 0){
                    stationPrefrences.map(async (stationPrefrence) => {
                        await stationPrefrence.update({
                            active: false
                        });
                    });
                } 
                const updatedStationPrefrence = await UserStationPrefrence.findOne({
                    where :{
                        userId:req.user.id,
                        stationType
                    }
                });
                if(previousStationPrefrence !== updatedStationPrefrence.stationPrefrence){
                    await UserRadioQueue.destroy({
                        where:{
                            userId:userPrefrence.userId 
                        }
                    });
                } 
            }
        }else {
            let stationPrefrences =  await UserStationPrefrence.findAll({
                where :{
                    userId:req.user.id,
                    [Op.not]:{
                        stationType
                    }
                }
            });
            if(stationPrefrences.length > 0){
                stationPrefrences.map(async (stationPrefrence) => {
                    await stationPrefrence.update({
                        active: false
                    });
                });
            }  
            await UserStationPrefrence.create({
                userId: req.user.id,
                stationPrefrence,
                stationType,
                active: true
            }); 
            await UserRadioQueue.destroy({
                where:{
                    userId:req.user.id, 
                }
            });
 
        }
        res.json({message:'Station switch successfully' });
    }
    catch(error){
        res.status(400).json({error:error.message});
    }
});


Router.post('/user_prefrence_genres',async(req,res) => {
    try{
        let { userId, genres=[] } = req.body;
        let doesPreferencesChanged = false;
        if(!userId) throw new Error('userId is required');
        if (typeof genres === 'string') {
            genres = [genres];
        }
        if (!Array.isArray(genres)) throw new Error('invalid genres format');
        let user = await User.findOne({
            where:{
                id:userId
            }
        });
        if(!user) throw new Error('User not found');
        if(req.user.id !== user.id) throw new Error('you are not authorized to update this user');
        //existing genres
        const existingGenres = await UserGenrePrefrences.findAll({
            where:{
                userId:user.id,
            }
        });
        const existingGenresIds = existingGenres.map(({ genreId }) => genreId);
        if(existingGenresIds.length === 0){
            for await(const genre of genres) {
                const [_genre] = await Genres.findOrCreate({
                    where:{
                        name:genre
                    }
                });
                const userGenre = {
                    userId: user.id, 
                    genreId: _genre.id,
                };
                await UserGenrePrefrences.create(userGenre);
            }
        }
        if(existingGenresIds.length > 0){
            const incomingGenreIds = [];
            for await (const genre of genres) {
                const [_genre] = await Genres.findOrCreate({
                    where: {
                        name: genre
                    }
                });
                incomingGenreIds.push(_genre.id);
            }
            console.log('incoming genres id',incomingGenreIds);

            const commonGenreIds = [];
            for (const genreId of incomingGenreIds) {
                if (existingGenresIds.includes(genreId)) {
                    commonGenreIds.push(genreId);
                }
            }
            console.log('common genres ids ',commonGenreIds);
            const toDeleteGenreIds = [];
            for (const genreId of existingGenresIds) {
                if (!commonGenreIds.includes(genreId)) {
                    toDeleteGenreIds.push(genreId);
                }
            }
            console.log('to delete genres ids ',toDeleteGenreIds);
            const toInsertGenreIds = [];
            for (const genreId of incomingGenreIds) {
                if (!commonGenreIds.includes(genreId)) {
                    toInsertGenreIds.push(genreId);
                }
            }
            console.log('insert genres ids',toInsertGenreIds);
            if (toDeleteGenreIds.length > 0) {
                await UserGenrePrefrences.destroy({
                    where: {
                        userId: user.id,
                        genreId: toDeleteGenreIds
                    }
                });
            }
            if (toInsertGenreIds.length > 0) {
                const genresToInsert = toInsertGenreIds.map(genreId => ({
                    userId: user.id,
                    genreId
                }));
                await UserGenrePrefrences.bulkCreate(genresToInsert);
            }
            doesPreferencesChanged = toInsertGenreIds.length > 0 || toDeleteGenreIds.length > 0;
        }
        await user.update({
            onBoardingStatus:2
        });
        if (doesPreferencesChanged) {
            await UserRadioQueue.destroy({
                where: {
                    userId: user.id
                }
            });
        }
        const userGenres = await runQuery(`select g.id ,g."name",ugp ."userId"  
        from "UserGenrePrefrences" ugp 
        left join "Genres" g 
        on ugp ."genreId" = g.id
        where ugp ."userId" = :userId;`,
        { type:QueryTypes.SELECT, replacements: { userId: user.id} }); 

        res.json({data:{userGenres}});

    }
    catch(error){
        res.status(400).json({error:error.message});
    }
});

//user-song-listens
Router.post('/song-listens',async(req,res) => {
    try{
        let { songId,listenSource = '' } = req.body;
        if(!songId) throw new Error('Song id is required');
        if(!req.user.id) throw new Error('User id is required');
        if(!listenSource && typeof(listenSource) === 'string') throw new Error('Listen source is required');
        const source = ['RADIO','ONDEMAND'];
        listenSource = listenSource.toUpperCase();
        if(source.includes(listenSource) === false ? listenSource = null : listenSource);
    
        const user = await  User.findOne({
            where:{
                id:req.user.id
            }
        });
        if(!user) throw new Error('user not found');
        const song = await Songs.findOne({
            where:{
                id:songId
            }
        });
        if(!song) throw new Error('song not found');
        const songListen = await UserSongListens.create({
            songId,
            userId:user.id,
            listenSource
        });
    
        await UserRadioQueue.destroy({
            where:{
                userId:user.id,
                songId
            }});

        logger.info(`${user.id} listened to ${song.id}`);
        res.json({data:songListen});
    
    }
    catch(error){
        res.status(400).json({error:error.message});
    }
});

//user song favorite
Router.post('/song-favorite',async(req,res) => {
    try{
        let { songId } = req.body;
        if(!req.user.id) throw new Error('User id is required');
        if(!songId) throw new Error('Song id is required');
        const song = await Songs.findOne({
            where:{
                id:songId
            }
        });
        if(!song) throw new Error('song not found');
        let verifySongFavorite = await SongFavorite.findOne({
            where:{
                songId,
                userId:req.user.id
            }
        });
        if(!verifySongFavorite){
            let songFavorites = await SongFavorite.create({
                songId,
                userId:req.user.id
    
            });
            songFavorites = songFavorites.toJSON();
            songFavorites.favorite = true;
            res.json({data:songFavorites});
        }
        if(verifySongFavorite) {
            verifySongFavorite = verifySongFavorite.toJSON();
            verifySongFavorite.favorite = true;
            res.json({data:verifySongFavorite});
        }
        
    }
    catch(error){
        res.status(400).json({error:error.message});
    }
});

//undo user song favorite
Router.post('/song-unfavorite',async(req,res) => {
    try{
        let { songId } = req.body;
        if(!req.user.id) throw new Error('User id is required');
        if(!songId) throw new Error('Song id is required');
        const song = await Songs.findOne({
            where:{
                id:songId
            }
        });
        if(!song) throw new Error('Song not found');
        let songFavorite = await SongFavorite.findOne({
            where:{
                songId,
                userId:req.user.id
            }
        });
        if(!songFavorite) throw new Error('Song not found');
        songFavorite = songFavorite.toJSON();
        songFavorite.favorite = false;
        await SongFavorite.destroy({where:{songId,userId:req.user.id}});
        res.json({data:songFavorite});
    }
    catch(error){
        res.status(400).json({error:error.message});
    }
});

//get user song favorite
Router.get('/:id/favorites',async(req,res) => {
    try{
        if(!req.params.id || req.params.id === undefined) throw new Error('User id is required');
        const songFavorite = await runQuery(`
        select  case when sf."userId"  is not null then true else false end as "isSongFavorite",
                s.id,s.title,replace(s.song,
                    '${config.songUrl.AWS_S3_ENDPOINT}',
                    '${config.songUrl.CLOUD_FRONT_ENDPOINT}') as song,s.thumbnail,
                s.duration,s."cityName",s."stateName",
                jsonb_build_object('id',b.id,'title',b.title) as band
        from "Songs" s left join "SongFavorites" sf 
        on s.id = sf."songId" 
        left join "Bands" b on b.id = s."bandId"  
       where sf."userId" = ${req.params.id} and s.live is true  and s."deletedAt" is null and b.status = 'ACTIVE'`,
        { type:QueryTypes.SELECT});
        res.json({data:songFavorite});
    }
    catch(error){
        res.status(400).json({error:error.message});
    }
});


//user-follows
Router.post('/follow',async(req,res) => {
    try{
        let { followeeId} = req.body;
        if(!followeeId) throw new Error('Invalid followee id');
        
        const followee = await User.findOne({
            where:{
                id:followeeId
            }
        });
        if(!followee ) throw new Error('user not found');
        let userFollows = await UserFollows.findOne({
            where:{ 
                followerId:req.user.id,
                followeeId
            }
        });
        if(userFollows) throw new Error('user has been already following');

        userFollows = await UserFollows.create({
            followerId:req.user.id,
            followeeId,
        });
        await generateNotification(
            { 
                type: notificationTypes.FOLLOW_USER,
                receiverId:followeeId,
                initiatorId:req.user.id,
                referenceId:req.user.id

            });
        res.json({meassage:'User has been followed',data:userFollows});
    }
    catch(error){
        res.status(400).json({error:error.message});
    }
});

//undo-follow
Router.post('/unfollow',async(req,res) => {
    try{
        let { followeeId } = req.body;
        if(!followeeId) throw new Error('Invalid followee id');
        const followee = await User.findOne({
            where:{
                id:followeeId
            }
        });
        if(!followee) throw new Error('user not found');
        const userFollows = await UserFollows.findOne({
            where:{ 
                followerId:req.user.id,
                followeeId
            }
        });
        if(!userFollows) throw new Error('user not found');
        await userFollows.destroy();
        await Notifications.destroy({
            where:{
                type:notificationTypes.FOLLOW_USER,
                referenceId:req.user.id
            }});
       
        res.json({message:'User has been unfollowed',data:userFollows});
    }
    catch(error){
        res.status(400).json({error:error.message});
    }
});

//user band follows
Router.post('/band-follow',async(req,res) => {
    try{
        let { bandId } = req.body;
        if(!bandId) throw new Error('Invalid band id');
        const band = await Band.findOne({
            where:{
                id:bandId
            }
        });
        if(!band) throw new Error('band not found');
        let userBandFollows = await UserBandFollows.findOne({
            where:{
                userId:req.user.id,
                bandId
            }
        });
        if(userBandFollows) throw new Error('user has been already following');
        userBandFollows = await UserBandFollows.create({
            userId:req.user.id,
            bandId
        });
        res.json({meassage:'user has been followed',data:userBandFollows});
    }
    catch(error){
        res.status(400).json({error:error.message});
    }
});

//undo-band-follow
Router.post('/undo-band-follow',async(req,res) => {
    try{
        let { bandId } = req.body;
        if(!bandId) throw new Error('Invalid band id');
        const band = await Band.findOne({
            where:{
                id:bandId
            }
        });
        if(!band) throw new Error('band not found');
        const userBandFollows = await UserBandFollows.findOne({
            where:{
                userId:req.user.id,
                bandId
            }
        });
        if(!userBandFollows) throw new Error('user not found');
        await userBandFollows.destroy();
        res.json({message:'User has been unfollowed',data:userBandFollows});
    }
    catch(error){
        res.status(400).json({error:error.message});
    }
}
);

//user-followers
Router.get('/:id/followers',async(req,res) => {
    try{
        if(!req.params.id) throw new Error('Invalid user id');
        let search = (req.query.search || '').toLowerCase();
        const user = await User.findOne({
            where:{
                id:req.params.id
            }
        });
        if(!user) throw new Error('user not found');
        const userFollowers = await runQuery(`
        with "userByFollowers" as (
            select * from "UserFollows" uf where uf."followeeId" = :userId)
        select u.id ,u."userName" ,u.avatar,
              jsonb_build_object('id',r.id,'name',r."name")as role  
              from "userByFollowers" ubf 
         left join  "Users" u on ubf."followerId" = u.id 
         left join "Roles" r on r.id =u."roleId"
       where ubf."followeeId"=:userId  
       and lower(u."userName") like '%${search}%'; `,
        { type:QueryTypes.SELECT,replacements:{userId:user.id}});
        res.json({data:userFollowers});
    }
    catch(error){
        res.status(400).json({error:error.message});
    }
});

//user can remove followers
Router.delete('/:userId/follower/:id',async(req,res) => {
    try{
        if(!req.params.userId) throw new Error('Invalid user id');
        if(!req.params.id) throw new Error('Invalid user id');
        const user = await User.findOne({
            where:{
                id:req.params.userId
            }
        });
        if(!user) throw new Error('user not found');
        const userFollowers = await UserFollows.findOne({
            where:{
                followerId:req.params.id,
                followeeId:user.id
            }
        });
        if(!userFollowers) throw new Error('user follower not found');
        await userFollowers.destroy();
        res.json({message:'User has been unfollowed'});
    }
    catch(error){
        res.status(400).json({error:error.message});
    }
});


//user-following
Router.get('/:id/following',async(req,res) => {
    try{
        if(!req.params.id || req.params.id === undefined) throw new Error('Invalid user id');
        let search = (req.query.search || '').toLowerCase();
        const user = await User.findOne({
            where:{
                id:req.params.id
            }
        });
        if(!user) throw new Error('user not found');
        const userFollowing = await runQuery(`       
           select  
             case when uf."followeeId" is not null then true else false end as "amiFollowing",
             uf."followeeId" "userId",
             u."userName",u.avatar,
            jsonb_build_object('id',r.id,'name',r."name") as role
          from "UserFollows" uf  left join "Users" u on  u.id = uf."followeeId"
         left join "Roles" r on r.id =u."roleId"
       where uf."followerId" = :userId
           and lower(u."userName") like '%${search}%';`,
        { type:QueryTypes.SELECT,replacements:{userId:user.id}});
        res.json({message:'following',data:userFollowing});
    }
    catch(error){
        res.status(400).json({error:error.message});
    }
});


//user-following-bands
Router.get('/:id/following-bands',async(req,res) => {
    try{
        if(!req.params.id || req.params.id === undefined) throw new Error('Invalid user id');
        let search = (req.query.search || '').toLowerCase();
        const user = await User.findOne({
            where:{
                id:req.params.id
            }
        });
        if(!user) throw new Error('user not found');
        const userFollowingBands = await runQuery(`
        select 
        case when ubf."bandId"  is not null then true else false end as "amiFollowing",
         b.id "bandId",b.title,b.logo,
         jsonb_build_object('id',r.id,'name',r."name") as role
        from "Bands" b  left join "UserBandFollows" ubf on b.id =ubf."bandId" 
        left join "Users" u on u.id = b."createdBy"
        left join "Roles" r on r.id =u."roleId"
        where ubf."userId" = :userId and b.status = 'ACTIVE'
         and lower(b.title) like lower('%${search}%');`,
        { type:QueryTypes.SELECT,replacements:{userId:user.id}});
        res.json({message:'following bands',data:userFollowingBands});
    }
    catch(error){
        res.status(400).json({error:error.message});
    }
});

//other user profile details
Router.get('/:id/profile',async(req,res) => {
    try{
        if(!req.params.id) throw new Error('Invalid user id');
        const { userId } = req.query;
        if(!userId) throw new Error('Invalid listener id');
        const user = await User.findOne({
            where:{
                id:req.params.id
            }
        });
        if(!user) throw new Error('User not found');
        const otherUser = await User.findOne({
            where:{
                id:userId
            }
        });
        if(!otherUser) throw new Error('Listener not found');
        let userProfile = await runQuery(` 
        select case when uf."followeeId" is  null then false else true end as "iamFollowing",
        case when ubf."userId"  is  null then false else true end as "iamFollowingBand",
               u.id ,u."firstName" ,u."lastName" ,
               u."userName" ,u.email,u.avatar ,u.about ,
               u.facebook ,u.instagram ,u.twitter,
              jsonb_build_object('id',r.id,'name',r."name") as role
           from "Users" u left join "UserFollows" uf on uf."followeeId"  = u.id and uf."followerId" =${req.user.id}
           left join "Roles" r on u."roleId" =r.id
           left join "Bands" b on b."createdBy"=u.id
           left join "UserBandFollows" ubf on ubf."bandId" =b.id  and ubf."userId" = ${req.user.id}
           where  u.id = :otherUserId`,
        { type:QueryTypes.SELECT,replacements:{otherUserId:otherUser.id}});

        userProfile = userProfile[0];

        //roleId 2 is artist
        if(userProfile.role.id === 2){
            const band = await Band.findOne({
                where:{
                    createdBy:userProfile.id
                },
                attributes:['id','title','logo']
            });
            userProfile.band = band;
        }else{
            userProfile.band = null;
        }
        res.json({data:userProfile});
    }
    catch(error){
        res.status(400).json({error:error.message});
    }

}); 
//user notifications
Router.get('/:id/notifications',async(req,res) => {
    try{
        if(!req.params.id) throw new Error('Invalid user id');
        const user = await User.findOne({
            where:{
                id:req.params.id
            }
        });
        if(!user) throw new Error('user not found');
        const notifications = await Notifications.findAll({
            where:{
                receiverId:user.id
            }
        });
        res.json({data: notifications});

    }
    catch(error){
        res.status(400).json({error:error.message});
    }
});
//user instrument selection
Router.post('/instrument', async(req,res) => {
    try {
        const { userId, instrumentIds } = req.body;
        if(!userId) throw new Error('Invalid user id');
        if (!Array.isArray(instrumentIds)) throw new Error('Invalid instrument ids');
        const user = await User.findOne({
            where:{
                id:userId
            }
        });
        if(!user) throw new Error('User not found');
        const userInstruments = await UserInstruments.findAll({
            where:{
                userId,
                instrumentId:instrumentIds
            }
        });
        if(userInstruments.length === 0) {
            await UserInstruments.destroy({where:{userId}});
            const instruments = await Instruments.findAll({
                where:{
                    id:instrumentIds
                }
            });
            if(instruments.length === 0) throw new Error('Instruments not found');
            instrumentIds.map(async (instrumentId) => {
                await UserInstruments.create({
                    userId:user.id,
                    instrumentId
                });
            });
        }
        res.json({message:'Instruments has been updated'});
    }
    catch(error){
        res.status(400).json({error:error.message});
    }
});


//get user band details follow or  not follow
Router.get('/band-details', async(req,res) => {
    try{
        if(!req.query.bandId) throw new Error('Invalid band id');
        const verifyBand = await Band.findOne({
            where:{
                id:req.query.bandId
            },
            attributes:['id','title','description','createdAt','logo','status'],
        });
        if(!verifyBand) throw new Error('Band not found');
        if(verifyBand.status === 'BLOCKED') throw new Error('Band not found');
        let band = await runQuery(` with "banddetails" as(
            select b.id,b.title ,b.description,b.logo,b."createdAt" 
                  from "Bands" b where b.id = :bandId and b.status = 'ACTIVE'
                )
    select case when ubf2."bandId"  is  null then false else true end as "amiFollowingBand",
                bd.* 
                from "banddetails" bd 
                left join "UserBandFollows" ubf2 
                on ubf2."bandId" = bd.id and ubf2."userId"= :userId`,
        { type:QueryTypes.SELECT,replacements:{bandId:verifyBand.id,userId:req.user.id}});
        band = band[0];
        res.json({data:band}); 
    }
    catch(error){
        res.status(400).json({error:error.message});
    }

});

//user add to calender
Router.post('/add_to_calender',async(req,res) => {
    try{
        if(!req.user.id) throw new Error('Invalid user id');
        const user = await User.findOne({
            where:{
                id:req.user.id
            }
        });
        if(!user) throw new Error('User not found');
        const { eventId } = req.body;
        if(!eventId) throw new Error('Invalid event id');
        const event = await Events.findOne({
            where:{
                id:eventId
            }
        });
        if(!event) throw new Error('Event not found');
        const eventCalender = await UserCalenderEvent.create({
            userId:req.user.id,
            eventId
        });
        await addingUserAsAttandees(event.googleEventId,req.user.id);
        
        res.json({data:eventCalender});
    }
    catch(error){
        res.status(400).json({error:error.message});
    }
});

//user remove the event from calender
Router.delete('/remove_from_calender',async(req,res) => {
    try{
        if(!req.user.id) throw new Error('Invalid user id');
        const user = await User.findOne({
            where:{
                id:req.user.id
            }
        });
        if(!user) throw new Error('User not found');
        const { eventId } = req.body;
        if(!eventId) throw new Error('Invalid event id');
        const event = await Events.findOne({
            where:{
                id:eventId
            }
        });
        if(!event) throw new Error('Event not found');
        await RemoveUserFromAttandees(req.user.id,event.googleEventId);
        await UserCalenderEvent.destroy({
            where:{
                userId:req.user.id,
                eventId
            }
        });
        res.json({message:'Event removed from calender'});
    }
    catch(error){
        res.status(400).json({error:error.message});
    }
}
);

//get all events only dates
Router.get('/calender_events',async(req,res) => {
    try{
        let events = await runQuery(`
        with "dates" as (
            SELECT  generate_series(e2."startTime" ,e2."endTime"  ,'1 day') as events
            from  "UserCalenderEvents" uce left join "Events" e2 on e2.id =uce."eventId"
            where uce."userId" =:userId
            
          ), 
"orderedEvents" as(
             select  to_char("events",'YYYY-MM-DD') as events  from "dates"
             ),

"distinctEvents" as( 
             select distinct events from  "orderedEvents"
             )
select jsonb_agg(events) as events  from "distinctEvents"
        `,{ type:QueryTypes.SELECT,replacements:{userId:req.user.id}});
       
        if(events.length > 0){
            events = events[0].events;
        }
        res.json({events});
    }
    catch(error){
        res.status(400).json({error:error.message});
    }
});

Router.get('/nearest_locations',async(req,res) => {
    try {
        const userLocation = await Locations.findOne({
            where: {
                userId: req.user.id
            }
        });
        if(!userLocation) throw new Error('user location not found');
        const userGenres = await UserGenrePrefrences.findAll({
            where:{
                userId:req.user.id
            }
        });
        if(!userGenres) throw new Error('user genres not found');
        const genreIds = userGenres.map(genre => genre.genreId);
        const userStationPrefrence = await UserStationPrefrence.findOne({
            where :{
                userId:req.user.id,
                active:true 
            }
        });
        if(!userStationPrefrence) throw new Error('user station prefrence not found');
        if(userStationPrefrence.stationType === '1') {
            let stations = await runQuery(`  with "nearestCity" as (
            select distinct s."cityName",s.id "songId",ST_DISTANCE(s.geolocation,st_makepoint(${userLocation.longitude},${userLocation.latitude})) as distance 
            from "Songs" s where s.live is true and s."promotedSong" = 'CITY'),
       "songCities" as (select nc.* from "nearestCity" nc left join "SongGenres" sg on nc."songId" = sg."songId"
             where sg."genreId" in (${genreIds}) order by distance asc limit 10)
             select distinct sc."cityName",sc.distance from "songCities" sc order by sc.distance asc limit 10 `);
            return res.json({data: stations[0]});
        }else {
            let stations = await runQuery(`  with "nearestCity" as (
                select distinct s."stateName",s.id "songId",ST_DISTANCE(s.geolocation,st_makepoint(${userLocation.longitude},${userLocation.latitude})) as distance 
                from "Songs" s where s.live is true and s."promotedSong" = 'STATE'),
           "songCities" as (select nc.* from "nearestCity" nc left join "SongGenres" sg on nc."songId" = sg."songId"
                 where sg."genreId" in (${genreIds}) order by distance asc limit 10)
                 select distinct sc."stateName",sc.distance from "songCities" sc order by sc.distance asc limit 10 `);

            res.json({data: stations[0]});
        }
        
    } catch(error){
        res.status(400).json({error:error.message});
    }
});

//get events by date
Router.get('/calender_events/:date',async(req,res) => {
    try{
        const { date } = req.params;
        if(!date) throw new Error('Invalid date');
        let events = await runQuery(`
        with "events" as(select * from "Events" e where (e."startTime"::DATE,e."endTime"::DATE) overlaps ('${date}', '${date}')
        or e."startTime"::DATE ='${date}' or e."endTime"::DATE='${date}')
        select e.id,e.thumbnail,e."eventName",e.description,e."startTime",e."endTime",e."location",
        e."cityName" from "events" e 
        left join "UserCalenderEvents" uce on uce."eventId"=e.id
        where uce."userId"=:userId
          `,{ type:QueryTypes.SELECT,replacements:{userId:req.user.id}});
        //events = events.length > 0?events:events = null;
        res.json({events});
    }
    catch(error){
        res.status(400).json({error:error.message});
    }
}
);

//user song report
Router.post('/song_report',async(req,res) => {
    try{
        if(!req.user.id) throw new Error('Invalid user id');
        const { songId,comment } = req.body;
        if(!songId) throw new Error('Invalid song id');
        const song = await Songs.findOne({
            where:{
                id:songId
            }
        });
        if(!song) throw new Error('Song not found');
        const band = await Band.findOne({
            where:{
                id:song.bandId
            }
        });
        if(!band) throw new Error('Band not found');
        const songReport = await Reports.findOne({
            where:{
                userId:req.user.id,
                referenceId : songId,
                type:'SONG'
            }
        });
        if(songReport) throw new Error('You already reported song');
        const songReportCreate = await Reports.create({
            userId:req.user.id,
            referenceId:song.id,
            type:'SONG',
            comment
        });
        const songReportCount = await Reports.findAll({
            where:{
                referenceId : songId,
                type:'SONG',
            }
        });
        if(songReportCount.length >= 6){
            const uploadedBy = song.uploadedBy;
            const user = await User.findOne({
                where: {
                    id:uploadedBy
                }
            }).toJSON(); 
            user.songName = song.title;
            let users = {};
            users.songName = song.title;
            users.bandName = band.title;
            users.userName = req.user.userName;
            users.comment = songReportCreate.comment;
            await song.update({live:false});
            await song.save();
            await sendMailToAdmin(users);
            await sendMailToArtist(user);
        }
        //sendMailToAdmin(`${user.firstName} ${user.lastName} has reported a song`,`${user.firstName} ${user.lastName} has reported a song.`);
        res.json({data:songReport});
    }
    catch(error){
        res.status(400).json({error:error.message});
    }
}
);


module.exports = Router;
