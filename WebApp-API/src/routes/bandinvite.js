const Router = require('express').Router();
const uuid = require('uuid');
//const { nanoid }= require('nanoid');
//const crypto = require('crypto');
//const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
//const { handleFileUpload} = require('../utils/fileUpload');
//const { QueryTypes } = require('sequelize');
//const db = require('../models/index');

const { User,Roles,Band,BandMembers,BandInvitation } = require('../database/models/');
const { sendBandInvitationEmail} = require('../utils/sendgrid');
const { isValidEmail} = require('../utils/');
const {canDoBandOperations} = require('../middlewares/auth');
//const { getUserById } = require('../datastore/index');
//const upload = require('multer')();



Router.post('/invite',canDoBandOperations,async(req,res)=>{
    try{
        const { bandId,email } = req.body;
        if(!bandId) throw new Error('Invalid band id');
        if(!email) throw new Error('Invalid email');
        if(!isValidEmail(email)) throw new Error('Bad email address');
        const band = await Band.findOne({
            where:{
                id:bandId
            }
        });
        if(!band) throw new Error('Invalid band id');
        const user = await User.findOne({
            where:{
                email,
            }
        });
        if(user && user.status === 'BLOCKED') throw new Error('User is blocked');
        if(user && user.roleId === 2) throw new Error('You cannot invite an Artist');
        if(user) {
            const existingBandMember = await BandMembers.findOne({ 
                where:{
                    userId:user.id,
                    bandId:bandId
                }
            });
            if(existingBandMember){
                // eslint-disable-next-line quotes
                throw new Error(`you already invited this user`);
            }
        }
                            
        const existingBandInvitaion = await BandInvitation.findOne({
            where:{
                bandId,
                email,
            }
        });
        if(existingBandInvitaion) {
            if(existingBandInvitaion.status === 'ACCEPTED' || existingBandInvitaion.status === 'PENDING' ) { 
                throw new Error('user has been already invited to this band');
            }
            if(existingBandInvitaion.status === 'REJECTED' || existingBandInvitaion.status === 'CANCELLED') {
                await existingBandInvitaion.update(
                    { 
                        invitationToken:uuid.v4(),
                        status: 'PENDING' ,
                        updatedAt: new Date()
                    });
                existingBandInvitaion.title = band.title;
                sendBandInvitationEmail(existingBandInvitaion);
                res.status(200).json({message:'Invitation email has been sent'});
            
            }
        }
        else {
            const bandInvitation = await BandInvitation.create({
                bandId,
                email,
                invitationToken:uuid.v4(),
                status:'PENDING'
            });
            bandInvitation.title = band.title;
            sendBandInvitationEmail(bandInvitation);
            res.status(200).json({message:'Invitation email has been sent'});
        }
    }
        
    catch(err){
        res.status(400).json({error:err.message});
    }
});



Router.post('/verify_bandmember',async(req,res) => {
    try{ 
        const { token } = req.body;
        if(!token || token === 'null' || token.trim() ==='') throw new Error('Invalid token');
        const bandMember = await BandInvitation.findOne({
            where:{
                invitationToken:token
            },
            attributes:['id','email','status']
        });
        if(!bandMember) throw new Error('Invalid band member');
        if (bandMember) {
            const existingUser = await User.findOne({
                where:{
                    email:bandMember.email
                }
            });
            if(existingUser.roleId === 2) throw new Error('you already login has an Artist');
            if(existingUser) {
                res.json({data:bandMember,newUser:false});
            }
            else{
                res.json({data:bandMember,newUser:true});
            }
        }
    }
    catch(err){
        res.status(400).json({error:err.message});
    }
});


























































// Router.post('/invite',canDoBandOperations,async(req,res) => {
//     try{
//         const {
//             email,
//             bandId
//         } = req.body;
//         if(!email) throw new Error('Invalid email');
//         if(!bandId || bandId === 'undefined' || bandId === 'null') throw new Error('Invalid band id');
//         if (!isValidEmail(email)) {
//             throw new Error('Invalid email');
//         }
//         let user = await User.findOne({
//             where:{
//                 email,
//             }
//         });
//         if(user){
//             const existingBandMember = await BandMembers.findOne({ 
//                 where:{
//                     userId:user.id,
//                     bandId:bandId
//                 }
//             });
//             if(existingBandMember){
//                 throw new Error('user has already existied in this band');
//             }
            
//             const bandRole = await Roles.findOne({
//                 where: {
//                     name: 'band_member',
//                 },
//             });
//             const bandData = {
//                 userId: user.id,
//                 bandId: bandId,
//                 bandRoleId: bandRole.id,
//                 invitationToken:uuid.v4()
//             };
//             const bandMember = await BandMembers.create(bandData);
//             user.bandInvitationToken = bandMember.invitationToken;
    
//             sendBandInvitationEmail(user);
//             user = await getUserById(user.id);
//             res.json({message:'Invitation email has been sent successfull'});
//         }
//         if(!user){
//             const existingRole = await Roles.findOne({
//                 where: {
//                     name: 'listener',
//                 },
//             });
//             const randomPassword = crypto.randomBytes(16).toString('hex');
//             const userData = {
//                 email,
//                 userName : 'USER'+ nanoid(),
//                 password: randomPassword,
//                 roleId: existingRole.id,
//                 status: 'INACTIVE',
//             };
//             const createUser = await User.create(userData);
           
//             const bandRole = await Roles.findOne({
//                 where: {
//                     name: 'band_member',
//                 },
//             });
//             const createBand = await BandMembers.create({
//                 userId:createUser.id,
//                 bandId:bandId,
//                 bandRoleId:bandRole.id,
//                 invitationToken:uuid.v4()
//             });
//             createUser.bandInvitationToken = createBand.invitationToken;
//             sendBandInvitationEmail(createUser);
//             res.json({message:'Invitation email has been sent'});
//         }
//     }
//     catch(error){
//         res.status(400).json({error:error.message});
//     }

// });


Router.get('/list',async(req,res) => {
    try{
        if(!req.query.bandId || req.query.bandId === 'undefined' || req.query.bandId === 'null') throw new Error('Invalid band id');
        const bandMembers = await BandMembers.findAll({
            where:{
                bandId:req.query.bandId
            }
        });
        if(!bandMembers) throw new Error('band id is not found');

        const userId = bandMembers.map(bandMember =>{
            return bandMember.userId;
        }).filter(user => user !== req.user.id);
        
        if(!userId) throw new Error('user not found');

        const users = await User.findAll({
            where:{
                id: userId
            },
            attributes:['id','userName','email','avatar','status'],
        });
        
        res.json({data:users});
    }
    catch(error){
        res.status(400).json({error:error.message});
    }

});

Router.get('/getuser',canDoBandOperations,async(req,res) => {
    try{
        if(!req.query.search || req.query.search === 'undefined' || req.query.search === 'null') throw new Error('Invalid user name');

        // const users = await db.sequelize.query(
        //     'SELECT * FROM User WHERE name LIKE :req.query.search',
        // );
    
        const user = await User.findAll({
            where:{
                userName : { [Op.like]: `%${req.query.search}%` }
            },
            attributes: [
                'id',
                'firstName',
                'lastName',
                'userName',
                'email',
                'mobile',
                'gender',
                'avatar',
                'status'
            ],
            include: [
                {
                    model: Roles,
                    as: 'role',
                    attributes: ['id', 'name'],
                },
            ],
        });
        res.json({data:user});
    }
    catch(error){
        res.status(400).json({error:error.message});
    }
});

// Router.post('/onboarding_user',async(req,res) => {
//     try{
//         const { token } = req.body;
//         if(!token || token.trim() === '' || token === 'null') throw new Error('Invalid token');
//         const bandMember = await BandMembers.findOne({
//             where:{
//                 invitationToken:token
//             }   
//         });
//         // eslint-disable-next-line quotes
//         if(!bandMember) throw new Error(`token shouldn't  match to this user`);
//         const user = await User.findOne({
//             where:{
//                 id:bandMember.userId
//             },
//             attributes:['id','email','onboarded']
//         }); 
//         res.json({data:user});
//     }
//     catch(error){
//         res.status(400).json({error:error.message});
//     }
// });

// Router.put('/invite-bandmember',upload.single('avatar'),async(req,res) => {
//     try{
//         const { token,userName,password } = req.body;
//         if(!token || token === 'null' || token.trim() ==='') throw new Error('Invalid token');
//         if(!userName) throw new Error('Invalid user name');
//         if(!password) throw new Error('Invalid password');
//         const bandMember = await BandMembers.findOne({
//             where:{
//                 invitationToken:token
//             }
//         });
//         // eslint-disable-next-line quotes
//         if(!bandMember) throw new Error(`token shouldn't  match to this user`);
//         let user = await User.findOne({
//             where:{
//                 userName
//             }
//         });
//         if(user) throw new Error('user name is already exist');
//         if (!isvalidPassword(password)) {
//             throw new Error(
//                 'password must have atleast 8 characters consists of atleast one lowercase letter, one uppercase letter, one number and a special character'
//             );
//         } 
//         const salt = await bcrypt.genSalt();
//         const hashedPassword = await bcrypt.hash(password, salt);
//         const userData = {
//             userName,
//             password: hashedPassword,
//             status: 'ACTIVE',
//             onboarded:true
//         };
//         const avatar = req.file;
//         if (avatar){
//             const file = await handleFileUpload(avatar,'profile-pics');
//             userData.avatar = file.Location;
//         }
//         await user.update(userData);
//         await BandMembers.update({invitationToken:null,invitationStatus:'ACCEPTED'},{where:{userId:user.id}});

//         const accessToken = user.generateAccessToken();
//         const refreshToken = user.generateRefreshToken();
//         user.refreshToken = refreshToken;
//         await user.save();
       
//         user = await getUserById(user.id);
//         res.json({message:'signup successfull',data:user,accessToken,refreshToken}); 
//     }
//     catch(error){
//         res.status(400).json({error:error.message});
//     }
// });



module.exports = Router;