/*
 this folder will contain application routes and their definitions.
*/
const Router = require('express').Router();
const { User, Roles,Band,BandMembers,BandInvitation,Genres,avatars, Instruments, Locations, UserGenrePrefrences, UserStationPrefrence, ArtistProfile } = require('../database/models/');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { authenticate } = require('../middlewares/auth');

const config = require('../config/index');
const { isValidEmail, isValidMobile, isvalidPassword,isValidUserName } = require('../utils/');
const {
    sendUserVerificationEmail,
    sendResetPasswordEmail,
} = require('../utils/sendgrid');
const { getUserLocation,getUserGenres, getUserStationType } = require('../utils/userInfo');
const uuid = require('uuid');
const { getUserById } = require('../datastore/index');
const { states } = require('../utils/states');
const { handleFileUpload} = require('../utils/fileUpload');
const { runQuery } = require('../utils/dbquery');
const { QueryTypes,Op } = require('sequelize');
const upload = require('multer')();




/**
 * @swagger
 *
 * /signup:
 *   post:
 *     description: Signup to the application
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: firstName
 *         description: firstName of the user to signup.
 *         in: formData
 *         required: true
 *         type: string
 *       - name: lastName
 *         description: lastName of the user to signup.
 *         in: formData
 *         required: false
 *         type: string
 *       - name: email
 *         description: email of the user to signup.
 *         in: formData
 *         required: true
 *         type: string
 *       - name: password
 *         description: password of the user to signup-'password must have atlease 8 characters consists of atleast one lowercase letter, one uppercase letter, one number and a special character'
 *         in: formData
 *         required: true
 *         type: string
 *       - name: mobile
 *         description: mobile of the user to signup.
 *         in: formData
 *         required: true
 *         type: integer
 *       - name: gender
 *         description: gender of the user to signup- value should be either male or female or others.
 *         in: formData
 *         required: true
 *         type: string
 *       - name: role
 *         description: Role of the user to signup - value should be either artist or listener.
 *         in: formData
 *         required: true
 *         type: string
 *       - name: avatar
 *         description: avatar of the user to signup .
 *         in: formData
 *         required: true
 *         type: string
 *     tags:
 *       - Registration and Authentication
 *     responses:
 *       '200':
 *          description: Success response
 */

Router.post('/signup',upload.single('avatar'),async (req, res) => {
    try {
        let {
            firstName = '',
            lastName = '',
            userName = '',
            email,
            password,
            mobile = '', 
            gender,
            role = '',
            title='',
            avatarId,
            street,city,state,country,zipcode,latitude,longitude,
        } = req.body;
        if(!userName){
            throw new Error('Invalid user name');
        }
        if(!isValidUserName(userName)){
            throw new Error('you must contain valid username');
        }
        if(!email){
            throw new Error('email is Invalid');
        }
        if (!isValidEmail(email)) {
            throw new Error('Invalid email');
        }
        // Add debugging for email check
        console.log('=== EMAIL VALIDATION DEBUG ===');
        console.log('Checking email:', email);
        console.log('Email type:', typeof email);
        console.log('Email length:', email ? email.length : 'null/undefined');
        
        // const existingUser = await runQuery(`
        // select * from "Users" u where u.email ='${email}'`,{ type:QueryTypes.SELECT});
        const existingUser = await User.findOne({
            where: {
                email: email,
            },
          
        });
        
        console.log('Existing user found:', !!existingUser);
        if (existingUser) {
            console.log('Existing user email:', existingUser.email);
            console.log('Existing user status:', existingUser.status);
        }
        console.log('=== END EMAIL VALIDATION DEBUG ===');
        
        if(existingUser && existingUser.status === 'BLOCKED'){
            // eslint-disable-next-line quotes
            throw new Error(`You can't have access`);
        }
        if(existingUser){
            throw new Error('Email is already exists');
        } 
        const existingUserName = await User.findOne({
            where: {
                userName: userName
            },
        });
        if(existingUserName) throw new Error('User name is already existed');
        if (!isvalidPassword(password)) {
            throw new Error(
                'password must have atleast 8 characters consists of atleast one lowercase letter, one uppercase letter, one number and a special character'
            );
        }       
        const existingRole = await Roles.findOne({
            where: {
                name: role,
            },
        });
        if (!existingRole) {
            throw new Error('Invalid role');
        }
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
    
        const userData = {
            firstName,
            lastName,
            userName:userName.trim(),
            email,
            password: hashedPassword,
            mobile: mobile.toString(),
            gender,
            roleId: existingRole.id,
            onBoardingStatus: 0,
            emailVerificationToken:uuid.v4(),
        };
        // Add logging for verification token
        console.log('=== VERIFICATION TOKEN FOR USER ===');
        console.log('Email:', email);
        console.log('Token:', userData.emailVerificationToken);
        console.log('=== END VERIFICATION TOKEN ===');
        if(gender){
            var verifyGender = gender.toUpperCase();
            if(verifyGender === 'MALE' || verifyGender === 'FEMALE' || verifyGender === 'PREFER NOT TO SAY'){
                userData.gender = verifyGender;
            }
            else{
                throw new Error('Invalid gender');
            }
        }
        if (isValidMobile(mobile)) {
            const existingMobileNumber = await User.findOne({
                where: {
                    mobile: mobile.toString(),
                },
            });
            if (existingMobileNumber) {
                throw new Error('mobile number is already taken');
            }
            userData.mobile = mobile.toString();
        }
        if(parseInt(avatarId)){
            let avatar = await avatars.findOne({
                where: {
                    id:avatarId
                },
            });
            if(!avatar) throw new Error('Invalid avatar');
            userData.avatar = avatar.url;
        }

        const avatar = req.file;
        if (avatar){
            const file = await handleFileUpload(avatar,'profile-pics');
            userData.avatar = file.Location;
        }
        let newUser = await User.create(userData);
        const accessToken = newUser.generateAccessToken();
        const refreshToken = newUser.generateRefreshToken();

        newUser.refreshToken = refreshToken;
        newUser.status = 'ACTIVE';
        await newUser.save();
        newUser.roleName = 'Listener';
        
        // Save location data for ALL users (both listeners and artists)
        if (city && state && country) {
            let keys = Object.keys(states);
            if(keys.includes(state)){ 
                state = states[state.slice(0,2)];  
            }
            await Locations.create({
                street: street || null,
                city,
                state,
                country,
                zipcode: zipcode || null,
                latitude: latitude || null,
                longitude: longitude || null,
                userId: newUser.id, 
            });
        }
        
        if(role === 'artist'){
          
            if(title.trim() === '') throw new Error('Artist/Band name is required');
           
            // Create new ArtistProfile using the unified model
            const newArtistProfile = await ArtistProfile.create({
                title: title.trim(),
                cityName: city || null,
                stateName: state || null,
                userId: newUser.id,
                status: 'ACTIVE',
                promosEnabled: false,
            });
            
            // ALSO create a Band record for frontend compatibility
            const newBand = await Band.create({
                title: title.trim(),
                cityName: city || null,
                stateName: state || null,
                description: '',
                createdBy: newUser.id,
                status: 'ACTIVE',
                promosEnabled: false,
            });
            
            // Create BandMembers record linking user to the Band (not ArtistProfile)
            const bandRole = await Roles.findOne({
                where: {
                    name: 'band_owner',
                },
            });
            await BandMembers.create({
                bandId: newBand.id, // Use Band ID for BandMembers
                userId: newUser.id,
                bandRoleId: bandRole.id,
            });
            
            // Set the band property on the user object for frontend compatibility
            newUser.band = newBand;
            newUser.roleName = 'ARTIST';
        }
        
        await sendUserVerificationEmail(newUser);
        const user = await getUserById(newUser.id);
        res.json({
            message: 'Signup successfull',
            data: {
                user,
                accessToken,
                refreshToken
            },
        });          
        
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


Router.post('/status', async (req, res) => {
    try{
        const { token } = req.body;

        if(!token){
            throw new Error('Invalid token');
        }

        const user= await User.findOne({
            where: {
                emailVerificationToken: token,
            },
            attributes: ['id','emailVerificationToken','status'],
        });

        if(!user) throw new Error('We were unable to find a user for this verification. Please SignUp!');

        if(user.status === 'ACTIVE') throw new Error('User has been already verified. Please Login');

        user.status = 'ACTIVE';
        user.emailVerificationToken = null;
        
        // Check if user has location data to determine onboarding status
        const userLocation = await Locations.findOne({
            where: {
                userId: user.id,
            },
        });
        
        // If user has location data, they can proceed to genre selection (status 1)
        // If no location data, they need to set location first (status 0)
        user.onBoardingStatus = userLocation ? 1 : 0;
        
        await user.save();
        const userData= await getUserById(user.id);
        res.json({data : userData});
    } 
    catch(error){
        res.status(401).json({message:error.message});
    }
});

/**
 * @swagger
 *
 * /update-onboarding-status:
 *   post:
 *     description: Update user onboarding status
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: email
 *         description: User email to update onboarding status
 *         in: body
 *         required: true
 *         type: string
 *       - name: onBoardingStatus
 *         description: New onboarding status (0=location, 1=genres, 2=complete)
 *         in: body
 *         required: true
 *         type: integer
 *     tags:
 *       - Registration and Authentication
 *     responses:
 *       '200':
 *          description: Success response
 */

Router.post('/update-onboarding-status', authenticate, async (req, res) => {
    try {
        const { email, onBoardingStatus } = req.body;
        
        console.log('=== UPDATE ONBOARDING STATUS REQUEST ===');
        console.log('Email:', email);
        console.log('Onboarding Status:', onBoardingStatus);
        console.log('=== END REQUEST ===');

        if (!email) {
            throw new Error('Email is required');
        }

        if (onBoardingStatus === undefined || ![0, 1, 2, 'completed'].includes(onBoardingStatus)) {
            throw new Error('Invalid onboarding status. Must be 0, 1, 2, or "completed".');
        }

        const user = await User.findOne({
            where: { email: email }
        });
        
        if (!user) {
            throw new Error('User not found');
        }

        // Convert 'completed' to 2 for database storage
        const statusValue = onBoardingStatus === 'completed' ? 2 : onBoardingStatus;
        
        user.onBoardingStatus = statusValue;
        await user.save();

        console.log('=== ONBOARDING STATUS UPDATED ===');
        console.log('User ID:', user.id);
        console.log('Email:', user.email);
        console.log('New Status:', user.onBoardingStatus);
        console.log('=== END UPDATE ===');

        res.json({
            message: 'Onboarding status updated successfully',
            data: {
                id: user.id,
                email: user.email,
                onBoardingStatus: user.onBoardingStatus
            }
        });
    } catch (error) {
        console.error('=== ONBOARDING STATUS UPDATE ERROR ===');
        console.error('Error:', error.message);
        console.error('=== END ERROR ===');
        res.status(400).json({ error: error.message });
    }
});


/**
 * @swagger
 *
 * /login:
 *   post:
 *     description: Login to the application
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: email
 *         description: email of the user to signup.
 *         in: formData
 *         required: true
 *         type: string
 *       - name: password
 *         description: password of the user to signup-'password must have atlease 8 characters consists of atleast one lowercase letter, one uppercase letter, one number and a special character'
 *         in: formData
 *         required: true
 *         type: string
 *     tags:
 *       - Registration and Authentication
 *     responses:
 *       '200':
 *          description: Success response
 */


Router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const userData = await User.findOne({
            where: { 
                [Op.or]: [{userName:email }, { email:email }],
            },
            paranoid: false
        });
        if (!userData) {
            throw new Error('Invalid email address or password. Please try again later.');
        }
        if(userData.deletedAt !== null){
            // eslint-disable-next-line quotes
            throw new Error(`User doesn't exist`);
        }
        // eslint-disable-next-line quotes
        if(userData.status === 'BLOCKED') throw new Error(`You have been blocked`);
        // Temporarily comment out the INACTIVE check for development
        // if(userData.status === 'INACTIVE') {
        //     if(userData.roleId === 3){
        //         userData.roleName = 'LISTENER';
        //     } 
        //     if(userData.roleId === 2){
        //         userData.roleName = 'ARTIST';
        //     }
        //     await sendUserVerificationEmail(userData);
        //     throw new Error('Please confirm your email');
        // }
        const passwordMatch = await bcrypt.compare(password, userData.password);
        if (!passwordMatch) {
            throw new Error('Invalid credentials');
        } 
        const bands = await runQuery(`
                           select b.id,b.title,b.logo,b."promosEnabled",bm."bandRoleId"  from "BandMembers" bm
                           left join "Bands" b on b.id = bm."bandId"
                           where bm."userId" = :userId`,
        { type:QueryTypes.SELECT, replacements: { userId: userData.id} });      
        const accessToken = userData.generateAccessToken();
        const refreshToken = userData.generateRefreshToken();

        userData.refreshToken = refreshToken;
        await userData.save();
        let user = await getUserById(userData.id);
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
        user.radioPrefrence = {};
        user.radioPrefrence.location = await getUserLocation({userId:user.id});
        user.radioPrefrence.stationType = await getUserStationType({userId:user.id});
        user.radioPrefrence.genres = await getUserGenres({userId:user.id});
        user.bands = bands;
        res.status(200).send({
            message: 'Logged in Successfully',
            data: {
                user,
                accessToken,
                refreshToken,
            },
        });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

/**
 * @swagger
 *
 * /generate-tokens:
 *   post:
 *     description: genearate-tokens to the application
 *     produces:
 *       - application/json
 *     tags:
 *       - Registration and Authentication
 *     responses:
 *       '200':
 *          description: Success response
 */

Router.post('/generate-tokens', async (req, res) => {
    try {
        const refreshToken = req.headers['x-refresh-token'] || '';
        if (!refreshToken) {
            throw new Error('refresh token is not valid');
        }
        const user = await User.findOne({
            where: {
                refreshToken,
            },
        });
        if (!user) {
            throw new Error('user not found');
        }
        const decodedRefreshToken = await jwt.verify(
            refreshToken,
            config.jwt.REFRESH_TOKEN
        );

        if (!decodedRefreshToken) {
            throw new Error('refresh token is not valid');
        }

        const accessToken = user.generateAccessToken();
        const newRefreshToken = user.generateRefreshToken();
        user.refreshToken = newRefreshToken;
        await user.save();

        res.json({ accessToken: accessToken, refreshToken: newRefreshToken });
    } catch (error) {
        res.status(403).send({ error: error.message });
    }
});

/**
 * @swagger
 *
 * /request-reset-password/:
 *  post:
 *    description: To post users email 
 *    responses:
 *      '200':
 *         description: response sent mail
 */

Router.post('/request-reset-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({
            where: {
                email,
            },
        });
        if (!user) {
            throw new Error('Email address not found');
        }
        if(user.passwordResetToken){
            sendResetPasswordEmail(user); 
            return res.json({ message: 'Email has been sent' });
        }else {
            user.passwordResetToken = uuid.v4();
            await user.save();
            sendResetPasswordEmail(user); 
            return res.json({ message: 'Email has been sent' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

Router.post('/reset-password', async (req, res) => {
    try {
        let { password, token } = req.body;
        if(!token || token === 'null' || token.trim() ==='') throw new Error('Invalid token');
        const existingUser = await User.findOne({
            where: {
                passwordResetToken: token,
            },
            attributes: ['id','password' ,'passwordResetToken'],
        });
        if(!existingUser) throw new Error('Your password has been already set');
        const passwordMatch = await bcrypt.compare(password, existingUser.password);
        if(passwordMatch) throw new Error('New password should be different from current password');
        if (!existingUser) throw new Error('token is expired');
        if (!isvalidPassword(password)) {
            throw new Error(
                'password must have atlease 8 characters consists of atleast one lowercase letter, one uppercase letter, one number and a special character'
            );
        }
        const salt = await bcrypt.genSalt();
        existingUser.password = await bcrypt.hash(password, salt);
        existingUser.passwordResetToken = null;
        await existingUser.save();
        const user = await getUserById(existingUser.id);
        res.json({
            message: 'Password has been changed',
            data: {
                user,
            },
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

Router.post('/verify-user',async(req,res) => {
    try{
        const { email } = req.body;
        if(!email) throw new Error('Email is required');
        let user = await User.findAll({
            where:{
                email
            },
        });   
        if(user && user.length > 0){
            user = await getUserById(user[0].id);
            user.newUser = false;
            res.json({user}); 
            
        }
        else{
            res.json({onBoardingStatus:3,newUser:true});
        }
    }
    catch(error){
        res.status(400).json({error:error.message});
    }

});


Router.post('/verify_username',async(req,res) => {
    try{
        const { userName } = req.body;
        if(!userName) throw new Error('Invalid user name');
        if(!isValidUserName(userName)){
            throw new Error('you must contain valid username');
        }
        const existingUserName = await User.findOne({
            where:{
                userName
            }
        });
        if(existingUserName){
            res.json({message:'User name is existed',newUserName:false});
            
        }
        else{
            res.json({newUserName:true});
        }
    }
    catch(error){
        res.status(400).json({error:error.message});
    }

});

/**
 * @swagger
 *
 * /sso/:
 *  post:
 *    description: Create a user with sso
 *    responses:
 *      '200':
 *         description:Returns user data
 */

Router.post('/sso', async (req, res) => {
    try {
        let { user: { firstName, lastName, email, avatar, userName ='',role}} = req.body;
        if(!email) throw new Error('Invalid Email');
        let user = await User.findOne({
            where: {
                email,
            },
        });
        if (user) {
            // eslint-disable-next-line quotes
            if(user.status === 'BLOCKED') throw new Error(`you can't have access`);
            if(user.status === 'INACTIVE') throw new Error('Please confirm your email');
        }
        if (!user) {
            if (!isValidEmail(email)) {
                throw new Error('Invalid email');
            }
            if(!userName) throw new Error('Invalid username');
            const existingUserName = await User.findOne({
                where: {
                    userName: userName
                },
            });
            if(existingUserName) throw new Error('User name is already taken by another user');

            if (!role) {
                throw new Error('you must select a role');
            }
            const existingRole = await Roles.findOne({
                where: {
                    name: role,
                },
            });
            if (!existingRole) {
                throw new Error('Invalid role');
            }
            const randomPassword = crypto.randomBytes(16).toString('hex');
            if(avatar){
                avatar = null;
            }
            user = await User.create({
                firstName,
                lastName,
                userName,
                email,
                avatar,
                password: randomPassword,
                roleId: existingRole.id,
                onBoardingStatus:3,
                emailVerificationToken:uuid.v4(),
                status :'INACTIVE'
            }); 
        }
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save();
        const bands = await runQuery(`
            select b.id,b.title,b.logo,bm."bandRoleId"  from "BandMembers" bm
            left join "Bands" b on b.id = bm."bandId"
            where bm."userId" = :userId`,
        { type:QueryTypes.SELECT, replacements: { userId: user.id} });
        user = await getUserById(user.id);
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
        if(user.status === 'INACTIVE'){
            user.roleName = 'Listener';
            await sendUserVerificationEmail(user);
        }
        user.radioPrefrence = {};
        user.radioPrefrence.location = await getUserLocation({userId:user.id});
        user.radioPrefrence.stationType = await getUserStationType({userId:user.id});
        user.radioPrefrence.genres = await getUserGenres({userId:user.id});
        user.bands = bands;
        res.json({
            message: 'Signin successfull',
            data: {
                user,
                accessToken,
                refreshToken,
            },
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


Router.post('/band_details', async (req, res) => {
    try {
        const { token } = req.body;
        if(!token) throw new Error('Invalid token');
        const verifyToken = await BandInvitation.findOne({
            where: {
                invitationToken: token,
            },
        });
        if(!verifyToken) throw new Error('Invalid token');
        const band = await Band.findOne({
            where: {
                id: verifyToken.bandId,
            },
        });
        if(!band) throw new Error('Invalid band');
        const bandDetails = await runQuery(`
        select b.id bandId,u."userName",b.title
         from "Bands" b 
         left join "Users" u 
         on b."createdBy" = u.id 
         where b.id = :bandId
        `,{ type:QueryTypes.SELECT, replacements: { bandId: band.id,} });
        res.json({data:bandDetails});

    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});



Router.post('/verify_bandmember',async(req,res) => {
    try{ 
        const { token,status } = req.body;
        if(!token || token.trim() ==='') throw new Error('Invalid token');
        if(!status) throw new Error('Invalid status');
        let bandMember = await BandInvitation.findOne({
            where:{
                invitationToken:token
            },
            attributes:['email','bandId']
        });
        if( bandMember === null || !bandMember) throw new Error('Invalid band member');
        bandMember = bandMember.toJSON();
       

        const existingUser = await User.findOne({
            where:{
                email:bandMember.email
            }
        });
       
        if(!existingUser){
            bandMember.newUser = true;
            res.json({data:bandMember});
        }

        if(existingUser) {
            if(existingUser.roleId === 2) throw new Error('you already login has an Artist');
            bandMember.newUser = false;
            var verifyStatus = status.toUpperCase();
            if(bandMember.status === 'ACCEPTED') throw new Error('Band member is already ACCEPTED');
            const updateDetails = {
                status:verifyStatus,
                invitationToken:null,
                updatedAt:new Date()
            };
            await BandInvitation.update(updateDetails,{where:{email:bandMember.email}});
            const bandRole = await Roles.findOne({
                where: {
                    name: 'band_member',
                },
            });
            await BandMembers.create({
                bandId: bandMember.bandId,
                userId: existingUser.id,
                bandRoleId: bandRole.id,
            });
        
            res.json({data:'Band member has been verified'});
        }
        
    }
    
    catch(error){
        res.status(400).json({error:error.message});
    }
});

Router.post('/bandmember_reject',async(req,res) => {
    try{
        const { token,status } = req.body;
        if(!token || token.trim() ==='') throw new Error('Invalid token');
        if(!status) throw new Error('Invalid status');
        const bandMember = await BandInvitation.findOne({
            where:{
                invitationToken:token
            },
        });
        if(!bandMember) throw new Error('Invalid band member');

        var verifyStatus = status.toUpperCase();
        if(bandMember.status === 'REJECTED') throw new Error('Band member is already rejected');
        await bandMember.update({ 
            status:verifyStatus,
            invitationToken:null,
            updatedAt:new Date()
        });
        res.json({message:'Band member status has been updated'});
    }
    catch(error){
        res.status(400).json({error:error.message});
    }
});

Router.post('/bandmember_signup',upload.single('avatar'),async(req,res) => {
    try{

        // trim every key on req.body
        // Object.keys(req.body).forEach(key => {
        //     req.body[key] = req.body[key].trim();
        // });
        // nextTick()


        const { token,userName,email,password,avatarId } = req.body;
        if(!token || token.trim() ==='') throw new Error('Invalid token');
        if(!userName || userName.trim() ==='') throw new Error ('Invalid username');
        if(!isValidUserName(userName)){
            throw new Error('you must contain valid username');
        }
        if(!email || email.trim() ==='') throw new Error('Invalid email');
        if(!password || password.trim() ==='') throw new Error ('Invalid password');
        const bandMember = await BandInvitation.findOne({
            where: {
                invitationToken:token,
                email
            }
        });
        if(!bandMember) throw new Error('Invalid band member');
        const existingUserName = await User.findOne({
            where: {
                userName: userName.trim()
            },
        });
        if(existingUserName) throw new Error('User name is already existed');
        const existingUser = await User.findOne({
            where: {
                email,
            },
        });
        if (existingUser) {
            throw new Error('email is already taken');
        }
        if (!isValidEmail(email)) {
            throw new Error('Invalid email');
        }
        if (!isvalidPassword(password)) {
            throw new Error(
                'password must have atleast 8 characters consists of atleast one lowercase letter, one uppercase letter, one number and a special character'
            );
        } 
        const existingRole = await Roles.findOne({
            where: {
                name:'listener',
            },
        });
        if (!existingRole) {
            throw new Error('Invalid role');
        }
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
    
        const userData = {
            userName:userName.trim(),
            email,
            password: hashedPassword,
            roleId: existingRole.id,
        }; 
        if(parseInt(avatarId)){
            const avatar = await avatars.findOne({
                where: {
                    id: avatarId,
                },
            });
            if(!avatar) throw new Error('Invalid avatar');
            userData.avatar = avatar.url;
        }
        const avatar = req.file;
        if (avatar){
            const file = await handleFileUpload(avatar,'profile-pics');
            userData.avatar = file.Location;
        }

        const newUser = await User.create(userData); 
        await bandMember.update({
            invitationToken:null,
            status:'ACCEPTED',
            updatedAt:new Date()
        });
        const bandRole = await Roles.findOne({
            where: {
                name: 'band_member',
            },
        });

        await BandMembers.create({
            bandId: bandMember.bandId,
            userId: newUser.id,
            bandRoleId: bandRole.id,
        });
        
        const user = await getUserById(newUser.id);
        
        res.json({message:'Signup successfull',data : user});
    }
    catch(error){
        res.status(400).json({error:error.message});
    }

});

//get list of genres
Router.get('/genres',async(req,res) => {
    try{
        const genres = await Genres.findAll({
            attributes:['id','name']
        });
        res.json({data:genres});
    }
    catch(error){
        res.status(400).json({error:error.message});
    }
}
);


//get avatars
Router.get('/avatars',async(req,res) => {
    try{
        const avatar = await avatars.findAll({
            attributes:['id','url']
        });
        res.json({data:avatar});
    }
    catch(error){
        res.status(400).json({error:error.message});
    }
}
);

//get instruments
Router.get('/instruments', async(req,res) => { 
    try {
        const instruments = await Instruments.findAll({
            attributes:['id','url','name']
        });
        res.json({data: instruments});
    }
    catch(error){
        res.status(400).json({error:error.message});
    }
});

/**
 * @swagger
 *
 * /test-verify-user:
 *   post:
 *     description: Test endpoint to verify user by email (for testing without SendGrid)
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: email
 *         description: User email to verify
 *         in: body
 *         required: true
 *         type: string
 *     tags:
 *       - Registration and Authentication
 *     responses:
 *       '200':
 *          description: Success response
 */

Router.post('/test-verify-user', async (req, res) => {
    try {
        const { email } = req.body;
        
        console.log('=== TEST VERIFY USER ===');
        console.log('Email:', email);
        
        if (!email) {
            throw new Error('Email is required');
        }

        const user = await User.findOne({
            where: { email },
            attributes: ['id', 'email', 'status', 'onBoardingStatus'],
        });

        console.log('User found:', user);

        if (!user) {
            throw new Error('User not found');
        }

        if (user.status === 'ACTIVE') {
            return res.json({ message: 'User already verified', user });
        }

        // Check if user has location data
        const userLocation = await Locations.findOne({
            where: { userId: user.id }
        });

        console.log('User location found:', userLocation);

        // Set onboarding status based on location data
        if (userLocation) {
            user.onBoardingStatus = 1; // Go to genre selection
        } else {
            user.onBoardingStatus = 0; // Go to location screen
        }

        user.status = 'ACTIVE';
        user.emailVerificationToken = null;
        await user.save();

        console.log('User updated successfully:', {
            id: user.id,
            email: user.email,
            status: user.status,
            onBoardingStatus: user.onBoardingStatus
        });

        res.json({
            message: 'User verified successfully',
            user: {
                id: user.id,
                email: user.email,
                status: user.status,
                onBoardingStatus: user.onBoardingStatus
            }
        });
    } catch (error) {
        console.log('Error in test-verify-user:', error.message);
        res.status(400).json({ message: error.message });
    }
});

/**
 * @swagger
 *
 * /check-user:
 *   post:
 *     description: Check if user exists by email
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: email
 *         description: User email to check
 *         in: body
 *         required: true
 *         type: string
 *     tags:
 *       - Registration and Authentication
 *     responses:
 *       '200':
 *          description: Success response
 */

Router.post('/check-user', async (req, res) => {
    try {
        const { email } = req.body;
        
        console.log('=== CHECK USER ===');
        console.log('Email:', email);
        
        if (!email) {
            throw new Error('Email is required');
        }

        const user = await User.findOne({
            where: { email },
            attributes: ['id', 'email', 'status', 'onBoardingStatus'],
        });

        console.log('User found:', user);

        if (!user) {
            return res.json({ 
                exists: false, 
                message: 'User not found' 
            });
        }

        res.json({
            exists: true,
            user: {
                id: user.id,
                email: user.email,
                status: user.status,
                onBoardingStatus: user.onBoardingStatus
            }
        });
    } catch (error) {
        console.log('Error in check-user:', error.message);
        res.status(400).json({ message: error.message });
    }
});

/**
 * @swagger
 *
 * /list-users:
 *   get:
 *     description: List all users in database (for debugging)
 *     produces:
 *       - application/json
 *     tags:
 *       - Registration and Authentication
 *     responses:
 *       '200':
 *          description: Success response
 */

Router.get('/list-users', async (req, res) => {
    try {
        console.log('=== LIST ALL USERS ===');
        
        const users = await User.findAll({
            attributes: ['id', 'firstName', 'lastName', 'userName', 'email', 'status', 'onBoardingStatus', 'createdAt'],
            order: [['createdAt', 'DESC']]
        });

        console.log('Total users found:', users.length);
        users.forEach(user => {
            console.log(`User: ${user.userName} (${user.email}) - Status: ${user.status} - Onboarding: ${user.onBoardingStatus}`);
        });

        res.json({
            totalUsers: users.length,
            users: users.map(user => ({
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                userName: user.userName,
                email: user.email,
                status: user.status,
                onBoardingStatus: user.onBoardingStatus,
                createdAt: user.createdAt
            }))
        });
    } catch (error) {
        console.log('Error in list-users:', error.message);
        res.status(400).json({ message: error.message });
    }
});

/**
 * @swagger
 *
 * /test:
 *   get:
 *     description: Simple test endpoint
 *     produces:
 *       - application/json
 *     tags:
 *       - Registration and Authentication
 *     responses:
 *       '200':
 *          description: Success response
 */

Router.get('/test', (req, res) => {
    console.log('=== TEST ENDPOINT HIT ===');
    res.json({ 
        message: 'Test endpoint working!',
        timestamp: new Date().toISOString(),
        method: req.method,
        path: req.path
    });
});

/**
 * @swagger
 *
 * /check-config:
 *   get:
 *     description: Check what client credentials are in config
 *     produces:
 *       - application/json
 *     tags:
 *       - Registration and Authentication
 *     responses:
 *       '200':
 *          description: Success response
 */

Router.get('/check-config', (req, res) => {
    console.log('=== CHECK CONFIG ===');
    const config = require('../config/index');
    console.log('Config client ID:', config.client.CLIENT_ID);
    console.log('Config client secret:', config.client.CLIENT_SECRET);
    console.log('Expected client ID: 437920819fa89d19abe380073d28839c');
    console.log('Expected client secret: 28649120bdf32812f433f428b15ab1a1');
    
    res.json({ 
        configClientId: config.client.CLIENT_ID,
        configClientSecret: config.client.CLIENT_SECRET,
        expectedClientId: '437920819fa89d19abe380073d28839c',
        expectedClientSecret: '28649120bdf32812f433f428b15ab1a1',
        match: config.client.CLIENT_ID === '437920819fa89d19abe380073d28839c' && 
               config.client.CLIENT_SECRET === '28649120bdf32812f433f428b15ab1a1'
    });
});

Router.post('/user-location', authenticate, async (req, res) => {
    try {
        console.log('=== USER LOCATION ENDPOINT ===');
        const {
            city,
            state,
            country,
            zipcode,
            latitude,
            longitude,
            genreIds,
            userId,
        } = req.body;

        console.log('Request body:', { city, state, country, genreIds, userId });

        if (!userId) {
            throw new Error('User ID is required');
        }

        // 1. Save Location
        console.log('1. Saving location...');
        const location = await Locations.create({
            city,
            state,
            country,
            zipcode: zipcode === "" ? null : zipcode,  // Convert empty string to null
            latitude,
            longitude,
            userId,
        });
        console.log('Location saved:', location.id);

        // 2. Save Genre Preferences
        console.log('2. Saving genre preferences...');
        if (genreIds && genreIds.length > 0) {
            console.log('Genre IDs to save:', genreIds);
            const genrePromises = genreIds.map(genreId => {
                console.log('Creating genre preference for genreId:', genreId);
                return UserGenrePrefrences.create({
                    userId,
                    genreId,
                });
            });
            const savedGenres = await Promise.all(genrePromises);
            console.log('Genre preferences saved:', savedGenres.length);
        } else {
            console.log('No genres to save');
        }

        // 3. Create Default Station Preference
        console.log('3. Creating default station preference...');
        
        // Get the primary genre name for the community identifier
        let primaryGenreName = 'Music'; // Default fallback
        if (genreIds && genreIds.length > 0) {
            const primaryGenre = await Genres.findByPk(genreIds[0]);
            if (primaryGenre) {
                primaryGenreName = primaryGenre.name;
            }
        }
        
        // Create the full community identifier: "[City] [State] [Genre] Uprise"
        const communityIdentifier = `${city} ${state} ${primaryGenreName} Uprise`;
        
        const defaultStationPref = await UserStationPrefrence.create({
            userId,
            stationPrefrence: communityIdentifier, // Full community identifier
            stationType: '1',  // '1' = CITYWIDE, '2' = STATEWIDE, '3' = NATIONAL
            active: true,
        });
        console.log('Default station preference created:', defaultStationPref.id, 'with preference:', communityIdentifier);

        // 4. Update onBoardingStatus
        console.log('4. Updating onBoarding status...');
        const user = await User.findOne({ where: { id: userId } });
        if (user) {
            console.log('Current onBoardingStatus:', user.onBoardingStatus);
            user.onBoardingStatus = 2; // Completed
            await user.save();
            console.log('Updated onBoardingStatus to:', user.onBoardingStatus);
        }

        console.log('=== USER LOCATION COMPLETE ===');
        res.json({ message: 'User location, genres, and station preference saved successfully' });

    } catch (error) {
        console.error('=== USER LOCATION ERROR ===', error);
        res.status(400).json({ error: error.message });
    }
});

module.exports = Router;
