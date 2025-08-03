const Router = require('express').Router();
const upload = require('multer')();
const _ = require('lodash');
// const ThumbnailGenerator = require('video-thumbnail-generator').default;
const { User,Roles, Band,BandMembers,BandInvitation,BandGallery,Album,Songs,SongGenres} = require('../database/models/index');
const { handleFileUpload,get_url_extension, bufferHandler} = require('../utils/fileUpload');
const {canDoBandOperations} = require('../middlewares/auth');
const fs = require('fs');
const { generateThumbnail } = require('../utils/mediaHandler');
const { runQuery } = require('../utils/dbquery');
const { QueryTypes } = require('sequelize');
const { Op } = require('sequelize');





// DEPRECATED: Replaced by ArtistProfile logic in /user route
Router.post('/create',upload.single('logo'),async(req,res)=>{
    try{
        const bandDetails =req.body;
        bandDetails.logo = req.file;

        const bandData = _.pick(bandDetails,['title','logo','facebook','instagram','youtube','twitter']);
        if(bandDetails.logo)
        {
            const file = await handleFileUpload(bandData.logo,'Band-logos');
            bandData.logo = file.Location;
        }
        bandData.createdBy = req.user.role.id;
        const createBand = await Band.create(bandData);

        await BandMembers.create({bandId:createBand.id,userId:createBand.createdBy});
        
        res.json({message:'Band has been created successfull',data:createBand});
    }
    catch(err){
        res.status(400).json({error:err.message});
    }
});


// DEPRECATED: Replaced by ArtistProfile logic in /user route
Router.put('/edit_band',upload.single('logo'),canDoBandOperations,async(req,res) => {
    try{
        let { title, description = '',bandId, logo } = req.body;
        if(!bandId) throw new Error('Invalid band id');
        const band = await Band.findOne({
            where:{
                id:bandId
            },
            attributes:['id','title','description','logo']
        });
        if(!band) throw new Error('Invalid band id');
        const bandDetails = {};
        if(title){
            bandDetails.title = title.trim();
        }
        description = description && description.replace(/(\r\n)/gm, '\n'); 
        if(description.length > 255) throw new Error('allow only 255 characters');
        bandDetails.description = description.replace(/(\r\n)/gm, '\n');
        const logoFile = req.file;
        if (!logo) {
            bandDetails.logo = null;
        }
        if(logoFile){
            const file = await handleFileUpload(logoFile,'Band-logos');
            bandDetails.logo = file.Location;
        }
        await Band.update(bandDetails,{where:{id:band.id}});
        const updatedBand = await Band.findOne({
            where:{
                id:band.id
            }
        });
        if(band.logo !== updatedBand.logo){
            return res.json({message:'Band icon has been updated',data:band});
        }
        return res.json({message:'Band has been updated',data:band});
     
    }
    catch(error){
        res.status(400).json({error:error.message});
    }
});



// DEPRECATED: Replaced by ArtistProfile logic in /user route
Router.get('/band_details',async(req,res) => {
    try{
        if(!req.query.bandId || req.query.bandId === 'undefined' || req.query.bandId === 'null') throw new Error('Invalid band id');
        const band = await Band.findOne({
            where:{
                id:req.query.bandId
            },
            attributes:['id','title','description','createdAt','logo'],
        });
        if(!band) throw new Error('Band not found');
        
        // Get songs for this band
        const songs = await runQuery(`
            select s.id,s.title,s.song,s.thumbnail,s.duration,
                   s."cityName",s."stateName",s.country,s.live,s."createdAt",
                   s.latitude,s.longitude,s."promotedSong",s."airedOn",
                   s."promotedToStateDate",s."promotedToNationalDate"
            from "Songs" s
            where s."bandId" = :bandId and s."deletedAt" is null
            order by s.live desc, s."createdAt" desc
        `, { type: QueryTypes.SELECT, replacements: { bandId: band.id } });
        
        const bandData = band.toJSON();
        bandData.songs = songs;
        
        res.json({data: bandData});
    }
    catch(error){ 
        res.status(400).json({error:error.message});
    }
});

//band-members list
Router.get('/bandmembers_list',async(req,res) => {
    try{
        if(!req.query.bandId) throw new Error('Invalid band id');
        const band = await Band.findOne({
            where:{
                id:req.query.bandId
            }
        });
        if(!band) throw new Error('band not found');
        // eslint-disable-next-line quotes
        const bandMember = await runQuery(`
        select case when uf."followeeId" is not null then true else false end as "amiFollowing",
               u.id,u."userName" ,u.email ,u.avatar,bm."bandId",
               bm."bandRoleId",jsonb_build_object('id',r.id,'name',r."name")as role  
               from "BandMembers" bm 
               left join "Users" u 
               on bm."userId" = u.id 
               left join "Roles" r on r.id =u."roleId"
               left join "UserFollows" uf on uf."followeeId" = u.id and uf."followerId"=${req.user.id}  
         where bm."bandId" = :bandId and u.status ='ACTIVE'   
         order by "bandRoleId" asc  ;
        `,{ type:QueryTypes.SELECT, replacements: { bandId: band.id} });    
        res.json({data:bandMember});  
    }
    catch(error){
        res.status(400).json({error:error.message});
    }

});

//band-members remove
Router.delete('/:bandId/bandmember/:id',async(req,res) => {
    try{
        if(!req.params.bandId) throw new Error('Invalid band id');
        if(!req.params.id) throw new Error('Invalid band member');
        const band = await Band.findOne({
            where:{
                id:req.params.bandId
            }
        });
        if(!band) throw new Error('Band not found');
        let role = await Roles.findOne({
            where:{
                name:'band_member'
            }
        });
        if(!role) throw new Error('Invalid role member');
        const verifyBandMember = await BandMembers.findOne({
            where:{
                userId:req.params.id,
                bandRoleId:role.id
            }
        }); 
        if(!verifyBandMember) throw new Error('BandMember not found');
        const user = await User.findOne({
            where:{
                id:req.params.id
            }
        });
        if(!user) throw new Error('Band member not found');
        role = await Roles.findOne({
            where:{
                name:'band_owner'
            }
        });
        if(!role) throw new Error('Invalid role member');
        const bandOwner = await BandMembers.findOne({
            where:{
                bandId:band.id,
                bandRoleId:role.id
            }
        });
        // eslint-disable-next-line quotes
        if(!bandOwner) throw new Error(`You can't perform an action`);
        await BandMembers.destroy({
            where:{
                bandId:band.id,
                userId:req.params.id,
                bandRoleId:6
            }
        }); 
        await BandInvitation.destroy({
            where:{
                bandId:band.id,
                email:user.email
            }
        });
        res.json({message:'Band member has been removed'});
    }
    catch(error){
        res.status(400).json({error:error.message});
    }
});

Router.get('/members',async(req,res) => {
    try{
        const bandmembers = await runQuery(`select u.id ,u."userName" ,u.email ,u.avatar,u."roleId" 
         from "Users" u 
         where u."roleId"= 3 and u.status = 'ACTIVE' and
         ("userName" like :search or 
          u.email like :search);`,
        { type:QueryTypes.SELECT, 
            replacements: { search:'%'+ req.query.search + '%'} }); 
        res.json({data:bandmembers});
    }
    catch(error){
        res.status(400).json({error:error.message});
    }
});

Router.get('/members_username',async(req,res) => {
    try{
        if(!req.query.bandId) throw new Error('Invalid band id');
        const band = await Band.findOne({
            where:{
                id:req.query.bandId
            }
        });
        if(!band) throw new Error('Band not found');
        // eslint-disable-next-line quotes
        const bandMembers = await runQuery(`
        SELECT 
            u."id" id,
            u."userName" userName,
            u."avatar" avatar,
            u."email" email,
            bi."status" status
        FROM "BandInvitations" bi
        LEFT JOIN "Users" u  
        ON bi.email = u.email 
        WHERE 
            bi."bandId" = :bandId 
            and bi.status='ACCEPTED'
            and lower("userName") like lower(:userName);
        `,{ type:QueryTypes.SELECT, replacements: { bandId: band.id, userName:'%' + req.query.search + '%'} });    
        res.json({data:bandMembers});
    }
    catch(error){
        res.status(400).json({error:error.message});
    }
});

Router.post('/upload_images',upload.array('uploadedImages', 20),async(req,res) => {
    try{
        const { bandId } = req.body;
        if(!bandId || bandId === 'undefined' || bandId === 'null') throw new Error('Invalid band id');
        const images =  req.files;
        // eslint-disable-next-line quotes
        if(images.length > 10) throw new Error(`Can't upload more than 10 media items`);
        const bandGallery = {
            bandId,
        };

      
        for await (const image of images) {
            const file = await handleFileUpload(image,'band-gallery');
            const media  = get_url_extension(file.Location);
            if(media ==='jpg' || media ==='png' || media ==='jpeg'){
                bandGallery.mediaURL = file.Location;
                bandGallery.mediaType = 'Photo';
            }
            else if(media ==='mp4' || media ==='avi' || media ==='mov'){
               
                const videoThumbnail = await generateThumbnail(file.Location);
                const result = videoThumbnail.pathToFile.split('/tmp/')[1];
                const image = fs.readFileSync(`/tmp/${result}`);

                //const base64 = new Buffer(image).toString('base64');
                const thumbUpload = await bufferHandler(image,'band-gallery',result);
                
                console.log('viddoe thumnbnaniak',thumbUpload);

                fs.unlink(`/tmp/${result}`, (fsErr) => {
                    if (fsErr) throw fsErr;
                });
                bandGallery.mediaURL = file.Location;
                bandGallery.mediaType = 'Video';
            }
            else{
                throw new Error('Invalid media type');
            }
            await BandGallery.create(bandGallery);
        }
        res.json({message:'Images has been uploaded'});
    }  
    catch(error){
        res.status(400).json({error:error.message});
    }
});

Router.get('/band_images', async(req,res) => {
    try{
        const { bandId } = req.query;
        if(!bandId || bandId === 'undefined' || bandId === 'null') throw new Error('Invalid band id');
        const bandGallery = await BandGallery.findAll({
            where:{
                bandId
            },
            order: [['createdAt', 'DESC']],
            attributes:['id','mediaURL','mediaType','createdAt']
        });
        if(!bandGallery) throw new Error('Band not found');
        res.json({data:{bandGallery}});
    }
    catch(error){
        res.status(400).json({error:error.message});
    }
});
Router.put('/update_images/:id',upload.single('uploadedImages'),async(req,res) => {
    try{
        const { id } = req.params;
        if(!id || id === 'undefined' || id === 'null') throw new Error('Invalid band id');
        const bandGallery = await BandGallery.findOne({
            where:{
                id
            },
            attributes:['id','mediaURL','mediaType']
        });
        if(!bandGallery) throw new Error('Image not found');
        const  images = req.file;
        const file = await handleFileUpload(images,'band-gallery');
        bandGallery.mediaURL = file.Location;
        await bandGallery.save();
        res.json({message:'Images has been updated', data:bandGallery});

    }
    catch(error){
        res.status(400).json({error:error.message});
    }
});

Router.delete('/delete_images',async(req,res) => {
    try{
        const { imagesId } = req.body;
        if(!req.query.bandId || req.query.bandId === 'undefined' || req.query.bandId === 'null') throw new Error('Invalid band id');
        if(!imagesId || imagesId.length === 0) throw new Error('Invalid  gallery id');
        for await(const id of imagesId){
            const bandGallery = await BandGallery.findOne({
                where:{
                    id:id,
                    bandId : req.query.bandId
                }
            });
            // eslint-disable-next-line quotes
            if(!bandGallery) throw new Error(`you can't perform this operation`);
            await bandGallery.destroy(); 
        }
        res.json({message: 'Images has been deleted'}); 
        
    }
    catch(error){
        res.status(400).json({error:error.message});   
    }
});

//albums
Router.post('/:bandId/album',upload.single('thumbnail'),async(req,res) => {
    try{
        const { title } = req.body;
        if(!req.params.bandId) throw new Error('Invalid band id');
        const band = await Band.findOne({
            where:{
                id:req.params.bandId,
            }
        });
        if(!band) throw new Error('Band not found');
        const verifyTitle = await Album.findOne({
            where:{
                bandId:band.id,
                title
            }
        });
        if(verifyTitle) throw new Error('you already created album');
        const albumData = {
            title,
            bandId:band.id,
        };
        const thumbnail = req.file;
        if(thumbnail){
            const file = await handleFileUpload(thumbnail,'song-album');
            albumData.thumbnail = file.Location;
        }
        const album = await Album.create(albumData);
        res.json({message:'Album has been created', data:album});
    }
    catch(error){
        res.status(400).json({error:error.message});
    }
});
//web api
Router.get('/:bandId/list_albums',async(req,res)=>{
    try{
        const { bandId } = req.params;
        if(!bandId) throw new Error('Invalid band id');
        let {currentPage = 1, perPage = 20 } = req.query;
        let search = (req.query.search || '').toLowerCase();
        const albums = await Album.findAll({
            where:{
                bandId
            },
        });
        if(!albums) throw new Error('Album not found');

        let albumsList = await runQuery(`with "albumGenres"  as (
            select
                 distinct g.id genre_id,
                     a.id,
                     g.name as genre_name
                  from "Albums" a
                  left join "Songs" s 
                  on s."albumId"= a.id and s."deletedAt" is null
                  left join "SongGenres" sg 
                  on sg."songId" = s.id  
                  left join "Genres" g 
                  on g.id = sg."genreId"
                  where a."bandId" = :bandId 
                  )
                 select count(*) over() "totalCount",a.id "albumId" , a.title title ,
                        a.thumbnail thumbnail ,a."createdAt",a.live live,
                 case when(
                   jsonb_strip_nulls(jsonb_agg(jsonb_build_object(
                     'id', ag."genre_id",
                     'genre_name', ag."genre_name"
                  ))) 
                  ) ::json::text != '[{}]'::json::text then(
                    jsonb_strip_nulls(jsonb_agg(jsonb_build_object(
                     'id', ag."genre_id",
                     'genre_name', ag."genre_name"
                  ))))else null end as genres
                  from "Albums" a
                  left join "albumGenres" ag
                  on ag.id = a.id
                  where a."bandId" =:bandId and a."deletedAt" is null
                  and (lower(a.title) like '%${search}%')
                  group by a.id order by a."createdAt" desc
                  offset ${perPage === 'all' ? 0:`${(currentPage-1)*perPage}`} limit ${perPage} `,
        { type:QueryTypes.SELECT, replacements: {bandId:req.params.bandId} });    
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
});
//mobile api
Router.get('/:bandId/albums',async(req,res) => {
    try{
        const { bandId } = req.params;
        if(!bandId) throw new Error('Invalid band id');
        const album = await Album.findAll({
            where:{
                bandId
            },
        });
        if(!album) throw new Error('Album not found');
        const albums = await runQuery(`
        with "albumGenres"  as (
            select
                 distinct g.id genre_id,
                     a.id,
                     g.name as genre_name
                  from "Albums" a
                  left join "Songs" s 
                  on s."albumId"= a.id and s."deletedAt" is null
                  left join "SongGenres" sg 
                  on sg."songId" = s.id  
                  left join "Genres" g 
                  on g.id = sg."genreId"
                  where a."bandId" = :bandId 
                  )
                 select count(*) over() "totalCount",a.id "albumId" , a.title title ,
                        a.thumbnail thumbnail ,a."createdAt",a.live live,
                 case when(
                   jsonb_strip_nulls(jsonb_agg(jsonb_build_object(
                     'id', ag."genre_id",
                     'genre_name', ag."genre_name"
                  ))) 
                  ) ::json::text != '[{}]'::json::text then(
                    jsonb_strip_nulls(jsonb_agg(jsonb_build_object(
                     'id', ag."genre_id",
                     'genre_name', ag."genre_name"
                  ))))else null end as genres
                  from "Albums" a
                  left join "albumGenres" ag
                  on ag.id = a.id
                  where a."bandId" =:bandId and a."deletedAt" is null and a.live = true
                  group by a.id order by a."createdAt" desc`,
        { type:QueryTypes.SELECT, replacements: {bandId:req.params.bandId} });

        res.json({data:albums});
    }
    catch(error){
        res.status(400).json({error:error.message});
    }
});
Router.put('/live_album/:albumId',async(req,res) => {
    try{
        const { albumId } = req.params;
        const { live } = req.body;
        //if(!bandId) throw new Error('Invalid band id');
        if(!albumId) throw new Error('Invalid album id');
        let album = await Album.findOne({
            where:{
                id:albumId,
            }
        });
        if(!album) throw new Error('Invalid album'); 
        album.update({ live});
        await Songs.update({ live},{
            where:{
                albumId:album.id
            }
        });
        
        res.json({data:album});
    }
    catch(error){
        res.status(400).json({error:error.message});
    }
});


Router.put('/:bandId/update_album/:albumId',upload.single('thumbnail'),async(req,res) => {
    try{
        const { bandId,albumId} = req.params;
        const { title,thumbnail } = req.body;
        if(!bandId) throw new Error('Invalid band id');
        if(!albumId) throw new Error('Invalid album id');
        const band = await Band.findOne({
            where:{
                id:bandId
            }
        });
        if(!band) throw new Error('Invalid band id');
        let album = await Album.findOne({
            where:{
                id:albumId,
                bandId:bandId
            }
        });
        if(!album) throw new Error('Invalid album'); 
        const verifyTitle = await Album.findOne({
            where:{
                bandId:band.id,
                title,
                id:{
                    [Op.not]:albumId
                }
            }
        });
        if(verifyTitle) throw new Error('you already created album');
        const updateAlbum = {
            title,
        };

        if(!thumbnail){
            updateAlbum.thumbnail = null;
        }
        const thumbnailFile = req.file;
        if(thumbnailFile){
            const file = await handleFileUpload(thumbnailFile,'song-album');
            updateAlbum.thumbnail = file.Location;
        }
        album = await album.update(updateAlbum,{
            where:{
                id:albumId,
                bandId:bandId
            }
        });
        res.json({message:'Album has been updated', data:album});
    }
    catch(error){
        res.status(400).json({error:error.message});
    }
});


Router.delete('/:bandId/delete_album/:albumId',async(req,res) => {
    try{
        const { bandId, albumId } = req.params;
        if(!bandId) throw new Error('Invalid band id');
        if(!albumId) throw new Error('Invalid album id');
      
        const band = await Band.findOne({
            where:{
                id:bandId
            }
        });
        if(!band) throw new Error('Invalid band id');
        const album = await Album.findOne({
            where:{
                id:albumId,
                bandId:bandId
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
        res.json({message:'Album has been deleted'});
    }
    catch(error){
        res.status(400).json({error:error.message});
    }
});


//user get album and bandDetails --mobile api
Router.get('/:bandId/album/:id',async(req,res) => {
    try{
        
        if(!req.params.bandId) throw new Error('Invalid band id');
        if(!req.params.id) throw new Error('Invalid band id');
        const band = await Band.findOne({
            where:{
                id:req.params.bandId
            }
        });
        if(!band) throw new Error('Band not found');
        let album = await runQuery(`
                  select a.id ,a.title ,a.thumbnail ,
                  jsonb_build_object('id',b.id,'title',b.title) as band
                  from "Albums" a left join "Bands" b on b.id = a."bandId" 
                  where a.id = :albumId`,
        {type:QueryTypes.SELECT, replacements: {albumId:req.params.id}});
        if(album.length > 0){
            album = album[0];
        }
        res.json({data:album});
        
    }
    catch(error){
        res.status(400).json({error:error.message}); 
    }

});


//get all songs by band
Router.get('/:bandId/songs',async(req,res) => {
    try{
        const { bandId } = req.params;
        if(!bandId) throw new Error('Invalid band id');
        const band = await Band.findOne({
            where: {
                id: bandId
            }
        });
        if(!band) throw new Error('Band not found');
        const songs = await runQuery(`
                 select s.id,s.title ,s.song ,s.thumbnail,s.duration,s."cityName",s."stateName",s."bandId",s.live,
                        jsonb_build_object('id',b.id,'title',b.title) as band
                        from "Bands" b left join "Songs" s on s."bandId" = b.id  
                        where b.id = ${bandId} and b.status = 'ACTIVE'`,
        { type:QueryTypes.SELECT}); 
        res.json({songs});
    }
    catch(error){
        res.status(400).json({error:error.message}); 

    }
});



module.exports =Router;