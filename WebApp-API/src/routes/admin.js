const Router = require('express').Router();
const bcrypt = require('bcrypt');

const { User,Roles,Band,Locations,Events,SongAlbums,SongFavorite,UserSongListens,Votes,SongBlast,Notifications,UserBandFollows,
    UserFollows,UserCityPrefrences,UserGenrePrefrences,UserCalenderEvent,Album,Songs,SongGenres,BandMembers,BandInvitation,
    BandGallery,sequelize,avatars,AdsManagement } = require('../database/models/');
const { getUserById } = require('../datastore/index');
const { isValidEmail,isvalidPassword,isValidUserName} = require('../utils/');
const { handleFileUpload,get_url_extension, bufferHandler} = require('../utils/fileUpload');
const upload = require('multer')();
const fs = require('fs');
const { generateThumbnail } = require('../utils/mediaHandler');
const { runQuery } = require('../utils/dbquery');
const { QueryTypes,Op} = require('sequelize');



/**
 * @swagger
 *
 * /admin/user/id/:
 *  delete:
 *    description: To delete users  by id
 *    responses:
 *      '200':
 *         description: deleted user details Success response
 */

Router.delete('/user/:id/', async (req,res) => {
    const transaction = await sequelize.transaction();
    try{
        // create transaction
        if(!req.params.id) throw new Error('Invalid user id');
        const userData = await User.findOne({
            where:{
                id:req.params.id
            }
        });
        if(!userData){
            throw new Error('user not found');
        }
        //admin can't delete himself roleId:1
        if(userData.roleId === 1){
            throw new Error('you cant delete your profile');
        }
        if(userData.roleId === 2){
            const band = await Band.findOne({
                where:{
                    createdBy:req.params.id
                }
            });
            const songs = await Songs.findAll({
                where:{
                    bandId:band.id
                }
            });
            const songIds = songs.map(song => song.id);
        
            const events = await Events.findAll({
                where:{
                    bandId:band.id
                }
            });
            const eventIds = events.map(event => event.id);

            if(songIds.length > 0){
                await SongGenres.destroy({where:{
                    songId:songIds
                }},{transaction});
            }
            await SongAlbums.destroy({where:{bandId:band.id}},{transaction});

            if(songIds.length > 0){
                await SongBlast.destroy({where:{songId:songIds}},{transaction});
            }
            if(songIds.length > 0){
                await SongFavorite.destroy({where:{songId:songIds}},{transaction});
            }
            if(songIds.length > 0){
                await UserSongListens.destroy({where:{songId:songIds}},{transaction});
            }
            if(songIds.length > 0){
                await Votes.destroy({where:{songId:songIds}},{transaction});
            }
           
            await Album.destroy({where:{bandId:band.id},force:true},{transaction});
            await Songs.destroy({where:{bandId:band.id},force:true},{transaction});

            await BandGallery.destroy({where:{bandId: ''+band.id}},{transaction});
            await BandMembers.destroy({where:{bandId:band.id}},{transaction});
            await BandInvitation.destroy({where:{bandId:band.id}},{transaction});
            await UserBandFollows.destroy({where:{bandId:band.id}},{transaction});

            
            if(eventIds.length > 0){
                await UserCalenderEvent.destroy({where:{eventId:eventIds}},{transaction});
            }
            await Events.destroy({where:{bandId:band.id},force:true},{transaction});
            await band.destroy({where:{id:band.id}},{transaction});
        } 
        await BandMembers.destroy({where:{userId:req.params.id}},{transaction});
        const bandInvitation = await BandInvitation.findOne({
            where:{
                email:userData.email
            }
        });
        if(bandInvitation){
            await BandInvitation.destroy({where:{
                email:userData.email
            }},{transaction});
        }
        await UserBandFollows.destroy({where:{userId:req.params.id}},{transaction});
    
        await SongBlast.destroy({where:{userId:req.params.id}},{transaction});
        await SongFavorite.destroy({where:{userId:req.params.id}},{transaction});
        await UserSongListens.destroy({where:{userId:req.params.id}},{transaction});
        await Votes.destroy({where:{userId:req.params.id}},{transaction});
        await UserCalenderEvent.destroy({where:{userId:req.params.id}},{transaction});
        await Notifications.destroy({where:{initiatorId:req.params.id}},{transaction});
        await UserFollows.destroy({where:
            {
                [Op.or]:[{followeeId:req.params.id},{followerId:req.params.id}]
            },},{transaction});
        await UserGenrePrefrences.destroy({where:{userId:req.params.id}}, {transaction});
        await Locations.destroy({where:{userId:req.params.id}},{transaction});
        await UserCityPrefrences.destroy({where:{userId:req.params.id}},{transaction});
        await userData.destroy( {transaction});
        //const user = await getUserById(userData.id);
        await transaction.commit();
        res.json({message:'User has been deleted',data:userData});
       


    }catch(err){
        await transaction.rollback();
        res.status(400).json({error:err.message});
    }
});

//admin active user
Router.put('/active-user/:id',async(req,res) => {
    try{
        const { id } = req.params;
        if(!id) throw new Error('Invalid user id');
        const user = await User.findOne({
            paranoid: false, 
            where: 
            { 
                id
            } 
        });
        if(!user) throw new Error('user not found');
        await user.restore();
        res.json({message:'User has been activated',data:user});
    }catch(err){
        res.status(400).json({error:err.message});
    }
});

Router.get('/users/list',async(req,res) => {
    try{
        const {currentPage = 1, perPage = 20 } = req.query;
        let search = (req.query.search || '').toLowerCase();
        const users = await runQuery(`
        select count(*) over() "totalCount",
        u.id,u."userName",u.email,u.mobile,u.avatar,u.status,u."deletedAt",u."createdAt",  a.id as "avatarId",
        jsonb_build_object(
                 'id',r.id,
                'name',r."name")as role,
                case when (
           json_strip_nulls(json_build_object(
                'id',b.id,
                'title',b.title,
                'promosEnabled',b."promosEnabled"
               ))
           )::json::text != '{}'::json::text then (
                   json_build_object(
                 'id',b.id,
                'title',b.title,
                'promosEnabled',b."promosEnabled"
               )
           ) else null end as band  
   from "Users" u left join "Roles" r 
        on u."roleId" = r.id
        left join avatars a on a.url =u.avatar
        left join "Bands" b on b."createdBy"=u.id
        where u."deletedAt" is null and (lower(u."userName") like lower('%${search}%')
             or lower(u.email) like lower('%${search}%') or 
             lower(r.name) like lower('%${search}%')) order by u."createdAt" desc 
             offset ${(currentPage-1)*perPage} limit ${perPage} ;`,
        { type:QueryTypes.SELECT});
        const totalPages = users.length > 0 ? Math.ceil(users[0].totalCount/perPage) : 0;
        const response = {
            data: users,
            metadata: {
                currentPage: parseInt(currentPage),
                perPage: parseInt(perPage),
                totalPages,
            }
        };

        res.json({ data:response  });
        
    }
    catch(err){
        res.status(400).json({error:err.message});
    }
});

Router.put('/update_user/:id',upload.single('avatar'),async(req,res)=> {
    try{
        if(!req.params.id) throw new Error('Invalid user id');
        let { userName ='',email ='',mobile='',password,gender,avatar,status,avatarId } = req.body;
        if(!status) throw new Error('Invalid status');
        if(typeof(status) !== 'string') throw new Error('Invalid status format');
        
        status = status.toUpperCase();
        const checkStatus = ['ACTIVE','INACTIVE','BLOCKED'];
        if(!checkStatus.includes(status)) throw new Error('Status not found');
       
        var user = await User.findOne({
            where:{
                id:req.params.id
            }
        });
        if(!user) throw new Error('user not found');
        const userData = {};
        if(gender){
            var verifyGender = gender.toUpperCase();
            if(verifyGender === 'MALE' || verifyGender === 'FEMALE' || verifyGender === 'PREFER NOT TO SAY'){
                userData.gender = verifyGender;
            }
            else{
                throw new Error('Invalid gender');
            }
        }
        if(!userName) throw new Error('user name is mandatory');
        if(userName){
            if(!isValidUserName(userName)){
                throw new Error('you must contain valid username');
            }
            userData.userName = userName.trim();
        }
        if(email){
            if (!isValidEmail(email)) {
                throw new Error('Invalid email');
            }else{
                userData.email = email;
            }
        }
        if(!mobile) {
            userData.mobile = null;
        }
        if(mobile){
            //if (isValidMobile(mobile)) {
            const existingMobileNumber = await User.findOne({
                where: {
                    mobile: mobile.toString(),
                    id: {
                        [Op.not]: user.id,
                    },
                },
            });
            if (existingMobileNumber) {
                throw new Error('mobile number is already taken by another user');
            }
            else{
                userData.mobile = mobile.toString();
            }
            //}
            // else {
            //     throw new Error('Invalid mobile number');
            // }
        }
        if(password){
            if (!isvalidPassword(password)) {
                throw new Error(
                    'password must have atleast 8 characters consists of atleast one lowercase letter, one uppercase letter, one number and a special character'
                );
            } else{
                const salt = await bcrypt.genSalt();
                const hashedPassword = await bcrypt.hash(password, salt);
                userData.password = hashedPassword;
            }
        }
        if(!avatar){
            userData.avatar = null;
        }
        if(parseInt(avatarId)){
            const avatar = await avatars.findOne({
                where:{
                    id:avatarId
                }
            });
            if(!avatar) throw new Error('avatar not found');
            userData.avatar = avatar.url;
        }
        const avatarFile = req.file;
        if (avatarFile){
            const file = await handleFileUpload(avatarFile,'profile-pics');
            userData.avatar = file.Location;
        }  
        const band = await Band.findOne({
            where:{
                createdBy:user.id
            }
        });
        userData.status = status;
        if(band){
            await band.update({status:status});
        }
        await user.update(userData);
       
        user = await getUserById(user.id);
        user.status === 'BLOCKED' ?res.json({message:'User has been blocked',data:user}): res.json({message:'User has been updated',data:user});
    }
    catch(error){
        res.status(400).json({error:error.message});
    }
});


//admin get all songs 
Router.get('/songs-list',async(req,res)=>{
    const {currentPage = 1, perPage = 20 } = req.query;
    let search = (req.query.search || '').toLowerCase();
    try{    
        const songsList= await runQuery(`  
         select count(*) over() "totalCount",s.id,s.title,s.song ,s.thumbnail ,
               s.duration ,
               s."cityName" ,s."stateName" ,s.country,s."createdAt",s.live,s."deletedAt",
               s.latitude,s.longitude,
               case when (
                json_strip_nulls(json_build_object(
                     'id',a.id,
                     'title',a.title
                    ))
                )::json::text != '{}'::json::text then (
                        json_build_object(
                     'id',a.id,
                     'title',a.title
                    )
                ) else null end as album,
                case when(
                    json_strip_nulls(json_agg(json_build_object(
                      'id', g.id,
                      'genre_name', g.name
                   ))))::json::text != '[{}]'::json::text then(
                    jsonb_strip_nulls(jsonb_agg(jsonb_build_object(
                     'id', g.id,
                     'genre_name', g.name
                  ))))else null end as genres,
                  jsonb_build_object('id',b.id,'title',b.title,'logo',b.logo) as band
       from "Songs" s left join "Albums" a on s."albumId" = a.id
       left join "SongGenres" sg on sg."songId" = s.id
       left join  "Genres" g on sg."genreId" = g.id 
       left join "Bands" b on b.id =s."bandId" 
       where s."deletedAt" is null and b.status = 'ACTIVE' and
       (lower(s.title) like lower('%${search}%') or 
              lower(s."cityName") like lower('%${search}%') or 
              lower(s."stateName") like lower('%${search}%') or lower(a.title) like lower('%${search}%'))
       group by a.id,s.id,b.id order by s."createdAt" desc offset ${(currentPage-1)*perPage} limit ${perPage}`,
        { type:QueryTypes.SELECT}); 
        const totalPages = songsList.length > 0 ? Math.ceil(songsList[0].totalCount/perPage) : 0;
        const response = {
            data: songsList,
            metadata: {
                currentPage: parseInt(currentPage),
                perPage: parseInt(perPage),
                totalPages,
            }
        };
        res.json({data:response});
    }
    catch(error){
        res.status(400).json({error:error.message});
    }
});

//admin get all albums
Router.get('/albums-list',async(req,res) => {
    let {currentPage = 1, perPage = 20 } = req.query;
    let search = (req.query.search || '').toLowerCase();
    try{    
        let albumsList = await runQuery(`with "albumGenres"  as (
            select
                 distinct g.id genre_id,
                     a.id,
                     g.name as genre_name
                  from "Albums" a
                  left join "Songs" s 
                  on s."albumId"= a.id
                  left join "SongGenres" sg 
                  on sg."songId" = s.id and s."deletedAt" is null
                  left join "Genres" g 
                  on g.id = sg."genreId"
                  )
                 select count(*) over() "totalCount",a.id "albumId" , a.title title ,
                        a.thumbnail thumbnail ,a."createdAt",a.live live,a."deletedAt",
                 case when(
                   jsonb_strip_nulls(jsonb_agg(jsonb_build_object(
                     'id', ag."genre_id",
                     'genre_name', ag."genre_name"
                  ))) 
                  ) ::json::text != '[{}]'::json::text then(
                    jsonb_strip_nulls(jsonb_agg(jsonb_build_object(
                     'id', ag."genre_id",
                     'genre_name', ag."genre_name"
                  ))))else null end as genres,
                  jsonb_build_object('id',b.id,'title',b.title,'logo',b.logo) as band
                  from "Albums" a
                  left join "albumGenres" ag on ag.id = a.id
                  left join "Bands" b on b.id = a."bandId"
                 where a."deletedAt" is null and b.status ='ACTIVE' and lower(a.title) like lower('%${search}%')
                  group by a.id,b.id  order by a."createdAt" desc 
                  offset ${perPage === 'all' ? 0:`${(currentPage-1)*perPage}`} limit ${perPage}  
         `,
        { type:QueryTypes.SELECT}); 

        albumsList = albumsList.map(a => {
            if(a.genres !== null ){
                a.genres = a.genres.filter(g => Object.keys(g).length);
            }
            return a;
            
        });
        const data = {
            albumsList
        };
        if(albumsList.length > 0){
            perPage === 'all'?perPage = albumsList[0].totalCount:perPage;
            const totalPages = albumsList.length > 0 ? Math.ceil(albumsList[0].totalCount/perPage) : 0;
            data.metadata = {
                currentPage: parseInt(currentPage),
                perPage: parseInt(perPage),
                totalPages,
            };
        }
        else{
            data.metadata = {
                currentPage: parseInt(currentPage),
                perPage: parseInt(perPage),
                totalPages:0,
            }; 
        }
        res.json({data});
    }
    catch(error){
        res.status(400).json({error:error.message});
    }
}
);

//admin get album by id
Router.get('/album-songs',async(req,res)=> {
    try{
        if(!req.query.albumId) throw new Error('albumId is required');
        const {currentPage = 1, perPage = 20 } = req.query;
        let search = (req.query.search || '').toLowerCase();
        const album = await Album.findOne({
            where:{
                id:req.query.albumId,
            }
        });
        if(!album) throw new Error('Invalid album');
        const songsList = await runQuery(`  
        select count(*) over() "totalCount",s.id,s.title,s.song ,s.thumbnail ,
        s.duration ,
        s."cityName" ,s."stateName" ,s."createdAt",s.live,s."deletedAt",
        s.latitude,s.longitude,
        case when (
         json_strip_nulls(json_build_object(
              'id',a.id,
              'title',a.title
             ))
         )::json::text != '{}'::json::text then (
                 json_build_object(
              'id',a.id,
              'title',a.title
             )
         ) else null end as album,
         case when(
             json_strip_nulls(json_agg(json_build_object(
               'id', g.id,
               'genre_name', g.name
            ))))::json::text != '[{}]'::json::text then(
             jsonb_strip_nulls(jsonb_agg(jsonb_build_object(
              'id', g.id,
              'genre_name', g.name
           ))))else null end as genres
from "Songs" s left join "Albums" a on s."albumId" = a.id
left join "SongGenres" sg on sg."songId" = s.id
left join "Bands" b on b.id= s."bandId"  
left join  "Genres" g on sg."genreId" = g.id where s."deletedAt" is null
and b.status ='ACTIVE' and
(lower(s.title) like lower('%${search}%') or 
       lower(s."cityName") like lower('%${search}%') or 
       lower(s."stateName") like lower('%${search}%') or lower(a.title) like lower('${search}%'))
       and s."albumId" = ${req.query.albumId}
group by a.id,s.id order by s."createdAt" desc offset ${(currentPage-1)*perPage} limit ${perPage}`,
        { type:QueryTypes.SELECT }) ;
        const totalPages = songsList.length > 0 ? Math.ceil(songsList[0].totalCount/perPage) : 0;
        const response = {
            data: songsList,
            metadata: {
                currentPage: parseInt(currentPage),
                perPage: parseInt(perPage),
                totalPages,
            }
        };
        res.json({data:response});
    }
    catch(error){
        res.status(400).json({error:error.message});
    }
}
);

//admin can delete album
Router.delete('/album/:id',async(req,res) => {
    try{
        if(!req.params.id) throw new Error('albumId is required');
        const album = await Album.findOne({
            where:{
                id:req.params.id,
            }
        });
        if(!album) throw new Error('Invalid album');
        const songs = await Songs.findAll({
            where:{
                albumId:album.id
            }
        });
        const songIds = songs.map(song => song.id);      
        await SongGenres.destroy({
            where:{
                songId:songIds
            },
            force:true
        });
        await Songs.destroy({
            where:{
                albumId:album.id
            },
            force:true
        });
        await album.destroy({force:true});
       
        res.json({message:'Album has been deleted',data:album});
    }
    catch(error){
        res.status(400).json({error:error.message});
    }
}
);

//admin can delete  song
Router.delete('/song/:id',async(req,res) => {
    const transaction = await sequelize.transaction();
    try{
        if(!req.params.id) throw new Error('songId is required');
        const song = await Songs.findOne({
            where:{
                id:req.params.id,
            }
        });
        if(!song) throw new Error('Invalid song');
        if(song.albumId !== null){
            const album = await Album.findOne({
                where:{
                    id:song.albumId
                }
            });
            if(album){
                await SongAlbums.destroy({
                    where:{
                        songId:song.id
                    },
                    
                },{transaction});

                const songs = await Songs.findAll({
                    where:{
                        albumId:album.id,
                        id:{
                            [Op.not]:song.id
                        }
                    }
                });
                if(songs.length === 0){
                    await album.update({live:false},{
                        where:{
                            id:album.id
                        }
                    });
                }
            }
        }
        await SongBlast.destroy({where:{songId:song.id}},{transaction});
        await SongFavorite.destroy({where:{songId:song.id}},{transaction});
        await UserSongListens.destroy({where:{songId:song.id}},{transaction});
        await Votes.destroy({where:{songId:song.id}},{transaction});
        await Notifications.destroy({where:{type:['UPVOTE_SONG','UPLOAD_SONG','BLAST_SONG'],referenceId:song.id}},{transaction});
        await SongGenres.destroy({
            where:{
                songId:song.id
            },
            force:true
        },{transaction});
        await song.destroy({force:true},{transaction});
        await transaction.commit();
        res.json({message:'Song has been deleted',data:song});
    }
    catch(error){
        await transaction.rollback();
        res.status(400).json({error:error.message});
    }
}
);


//get  all band list
Router.get('/band_list',async(req,res) => {
    try{
        let search = (req.query.search || '').toLowerCase();
        const bands = await runQuery(`
              select b.id,b.title,b.logo,
                     jsonb_build_object('id',u.id,'userName',u."userName") as user 
                     from "Bands" b left join "Users" u 
                     on b."createdBy" = u.id  
                 where b.status ='ACTIVE' and lower(b.title) like lower('%${search}%')
        `,{ type:QueryTypes.SELECT });
        res.json({data:bands});
    }
    catch(error){
        res.status(400).json({error:error.message});
    }
});

//ads Managemnent
Router.post('/create_banner',upload.single('banner'), async (req, res) => {
    try{
        const {title,description,link,city,state,country,latitude,longitude }= req.body;
        const banner = req.file;
        if(!banner) throw new Error('Banner is required');
        if(!title) throw new Error('Title is required');
        if(!description) throw new Error('Description is required');
        if(!city) throw new Error('City is required');
        if(!state) throw new Error('State is required');
        if(!country) throw new Error('Country is required');
        if(!latitude) throw new Error('Latitude is required');
        if(!longitude) throw new Error('Longitude is required');
        
        const bannerData = {
            title,
            link,
            city,
            state,
            country,
            latitude,
            longitude,
        };
        bannerData.description = description && description.replace(/(\r\n)/gm, '\n');
        const file = await handleFileUpload(banner,'banners');
        bannerData.banner = file.Location;
        const media  = get_url_extension(bannerData.banner);
        if(['mp4,avi,mov'].includes(media)){  
            const videoThumbnail = await generateThumbnail(bannerData.banner);
            const result = videoThumbnail.pathToFile.split('/tmp/')[1];
            const image = fs.readFileSync(`/tmp/${result}`);
            const thumbUpload = await bufferHandler(image,'banners-thumbnail',result);
           
            fs.unlink(`/tmp/${result}`, (fsErr) => {
                if (fsErr) throw fsErr;
            });
            bannerData.thumbnail = thumbUpload.Location;
        }
        const adsManagement = await AdsManagement.create(bannerData);
        res.status(200).json({
            message: 'Ad has been created',
            data: adsManagement
        });
    }catch(error){
        res.status(400).json({error: error.message});
    }
   
}
);
 

// live
Router.put('/banner_live',async(req,res) => {
    try{
        const { adId,live} = req.body;
        if(!adId) throw new Error('Invalid ad id');
        const banners = await AdsManagement.findOne({
            where:{
                id:adId
            }
        });
        await banners.update({live});
        res.json({data:banners});
    }
    catch(error){
        res.status(400).json({error:error.message});
    }
});

//delete banner
Router.delete('/banner/:id',async(req,res) => {
    try{
        if(!req.params.id) throw new Error('Invalid banner id');
        const banner = await AdsManagement.findOne({
            where:{
                id:req.params.id
            }
        });
        if(!banner) throw new Error('Invalid banner');
        await banner.destroy({force:true});
        res.json({message:'Ad has been deleted',data:banner});
    }
    catch(error){
        res.status(400).json({error:error.message});
    }
}
);


//update banner
Router.put('/banner/:id',upload.single('banner'), async (req, res) => {
    try{
        const {title,description,link,city,state,country,latitude,longitude }= req.body;
        const banner = req.file;
        if(!req.params.id) throw new Error('Invalid banner id');
      
        const bannerData = {
            title,
            link,
            city,
            state,
            country,
            latitude,
            longitude,
        };
        bannerData.description = description && description.replace(/(\r\n)/gm, '\n');
        if(banner){
            const file = await handleFileUpload(banner,'banners');
            bannerData.banner = file.Location;
        }
        const media  = get_url_extension(bannerData.banner);
        if(['mp4,avi,mov'].includes(media)){  
            const videoThumbnail = await generateThumbnail(bannerData.banner);
            const result = videoThumbnail.pathToFile.split('/tmp/')[1];
            const image = fs.readFileSync(`/tmp/${result}`);
            const thumbUpload = await bufferHandler(image,'banners-thumbnail',result);
           
            fs.unlink(`/tmp/${result}`, (fsErr) => {
                if (fsErr) throw fsErr;
            });
            bannerData.thumbnail = thumbUpload.Location;
        }
        const adsManagement = await AdsManagement.update(bannerData,{
            where:{
                id:req.params.id
            }
        });
        res.status(200).json({ 
            message: 'Ad has been updated',
            data: adsManagement
        });
    }
    catch(error){
        res.status(400).json({error:error.message});
    }
});

//admin get give permissions to user for ads
Router.put('/band/promos-enabled',async(req,res) => {
    try{
        const { userId,enabled } = req.body;
        if(!userId) throw new Error('Invalid user id');
        const user = await User.findOne({
            where:{
                id:userId
            }
        });
        if(!user) throw new Error('Invalid user');
        const exisitingRole= await Roles.findOne({
            where:{
                id:user.roleId
            }
        });
        if(!exisitingRole) throw new Error('Invalid role');
        if(exisitingRole.name !== 'artist') throw new Error('Admin cannot have this permission');
        const band = await Band.findOne({
            where:{
                createdBy:userId
            },
            attributes:['id','promosEnabled']
        });
        if(!band) throw new Error('Band not found');
        const promosEnabledBand = await band.update({promosEnabled:enabled});
        const promosData = {
            userId:user.id,
            bandId:promosEnabledBand.id,
            enabled:promosEnabledBand.promosEnabled
        };
        
        res.json({data:promosData});
    }
    catch(error){
        res.status(400).json({error:error.message});
    }
});


//get all banners
Router.get('/banners',async(req,res) => {
    try{
        const {currentPage = 1, perPage = 20 } = req.query;
        let search = (req.query.search || '');
        const banners = await runQuery(`
        select count(*) over() "totalCount", * from "AdsManagements" am 
          where  (lower(am.title) like lower('%${search}%') 
            or lower(am.city) like lower('%${search}%')  
          or lower(am.state) like lower('%${search}%'))
        ${req.query.bands ? ` and am."bandId" in (${req.query.bands})` : ''}
         order by am."createdAt" desc offset ${(currentPage-1)*perPage} limit ${perPage}`,
        { type:QueryTypes.SELECT });
        const totalPages = banners.length > 0 ? Math.ceil(banners[0].totalCount/perPage) : 0;
        const response = {
            data: banners,
            metadata: {
                currentPage: parseInt(currentPage),
                perPage: parseInt(perPage),
                totalPages,
            }
        };
        res.json({data:response});
    }
    catch(error){
        res.status(400).json({error:error.message});
    }
}
);


//blocked
Router.put('/banners/blocked',async(req,res) => {
    try{
        const { bannerId,blocked} = req.body;
        if(!bannerId) throw new Error('Invalid banner id');
        const banners = await AdsManagement.findOne({
            where:{
                id:bannerId
            }
        });
        if(!banners) throw new Error('Invalid banner');
        await banners.update({blocked});
        res.json({data:banners});
    }
    catch(error){
        res.status(400).json({error:error.message});
    }
}
);

//get bands for banners
Router.get('/banner/bands',async(req,res) => {
    try{
        let search = (req.query.search || '').toLowerCase();
        const bands =  await runQuery(`
        select distinct b.id,b.title,b.logo from "AdsManagements" am 
        left join "Bands" b  on am."bandId" = b.id 
        where b.status ='ACTIVE' and lower(b.title) like lower('%${search}%')`,
        { type:QueryTypes.SELECT });
        res.json({data:bands});
    }
    catch(error){
        res.status(400).json({error:error.message});
    }
});



//statistics 
Router.get('/statistics/songs',async(req,res) => {
    try{
        let {  currentPage = 1, perPage = 20, upvotes} = req.query;
        let upvotesQuery;
        let downvotesQuery;
        let blastsQuery;
        if(upvotes){
            if(upvotes === 'ASC'){
                upvotesQuery = 'order by sai.upvotes asc';
            }
            if(upvotes === 'DESC'){
                upvotesQuery = 'order by sai.upvotes desc';
            }
        }
        else{
            upvotesQuery ='';
        }
        if(req.query.downvotes){
            if(req.query.downvotes === 'ASC'){
                downvotesQuery = 'order by sai.downvotes asc';
            }
            if(req.query.downvotes === 'DESC'){
                downvotesQuery = 'order by sai.downvotes desc';
            }
        }
        else{
            downvotesQuery ='';
        }
        if(req.query.blasts){
            if(req.query.blasts === 'ASC'){
                blastsQuery = 'order by sai.blasts asc';
            }
            if(req.query.blasts === 'DESC'){
                blastsQuery = 'order by sai.blasts desc';
            }
        }
        else{
            blastsQuery ='';
        }
        const songs = await runQuery(`
 with "upvotes" as (
                            select count(v."songId") as upvote,v."songId"  from "Votes" v 
                            where v."type" ='UPVOTE' group by v."songId"
                          ),
        "downvotes" as (
                            select count(v."songId") as downvote,v."songId"  from "Votes" v 
                            where v."type" ='DOWNVOTE' group by v."songId"
                          ),
        "blasts" as ( 
                           select count(sb."songId")as blast,sb."songId"  from  "SongBlasts" sb 
                           group by sb."songId"
                         ),       
        "songsWithAlbumInfo" as (
                           select s.*,
                          coalesce(upv.upvote,0) as upvotes,coalesce(dwv.downvote,0) as downvotes,coalesce (bs.blast,0) as blasts
                          from "Songs" s 
                          left join "upvotes" upv on upv."songId" = s.id 
                          left join "blasts" bs on bs."songId"=s.id
                          left join "downvotes" dwv on dwv."songId" =s.id
                          left join "Bands" b on b.id = s."bandId"
                          left join  "Albums" a on a.id = s."albumId"
                          where s."deletedAt" is null and b.status ='ACTIVE' 
                          ${req.query.bandId ? `and b.id = ${req.query.bandId}` : ''}                        
                          )
    select count(*) over() "totalCount",sai.* from "songsWithAlbumInfo" sai 
    ${ upvotesQuery}${ downvotesQuery}${ blastsQuery}
    offset ${perPage === 'all' ? 0:`${(currentPage-1)*perPage}`} limit ${perPage} `,
        { type:QueryTypes.SELECT});
        const data = {
            songs,
        };
        if(songs.length > 0){
            perPage === 'all'?perPage = songs[0].totalCount:perPage;
            const totalPages = songs.length > 0 ? Math.ceil(songs[0].totalCount/perPage) : 0;
            data.metadata = {
                currentPage: parseInt(currentPage),
                perPage: parseInt(perPage),
                totalPages,
            };
        }
        else{
            data.metadata = {
                currentPage: parseInt(currentPage),
                perPage: parseInt(perPage),
                totalPages:0,
            }; 
        }
        res.json({data});
    }
    catch(error){
        res.status(400).json({error:error.message});
    }
});
module.exports = Router;