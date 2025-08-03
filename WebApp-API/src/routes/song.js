/* eslint-disable no-undef */
const Router = require('express').Router();
//const upload = require('multer')();

const { User,Band, Songs, SongGenres, Genres,Album,SongAlbums,Notifications,UserRadioQueue} = require('../database/models');
const { handleFileUpload, customUpload } = require('../utils/fileUpload');
const { getAudioMetaData } = require('../utils/mediaHandler');
const { generateNotification } = require('../utils/notificationService');
const { notificationTypes } = require('../utils/types/notificationTypes');
const { bandFollowersUsers } = require('../utils/userInfo');
const config = require('../config/index');
const { states } = require('../utils/states');
const { runQuery } = require('../utils/dbquery');
const { QueryTypes } = require('sequelize');
const { Op } = require('sequelize');
const { sendPushNotification } = require('../utils/pushNotifications');


Router.post('/upload',customUpload.fields([{name:'song',maxCount:1},{name:'thumbnail',maxCount:1}]),async(req,res)=>{
    try{
        let { title = '', genres = [],albumId,country,userId,bandId,latitude,longitude } = req.body;
        if(!bandId) throw new Error('Invalid band id');
        if(!userId) throw new Error('Invalid user id');
        if(!genres) throw new Error('Invalid genres');
        if(albumId){
            const existingAlbumId = await Album.findOne({
                where:{
                    id:albumId,
                }
            });
            if(!existingAlbumId) throw new Error('invalid album id');
        }
        const user = await User.findOne({
            where:{
                id:userId
            }
        });
        if(!user) throw new Error('Invalid user id');
        const band = await Band.findOne({
            where:{
                id:bandId
            }
        });
        if(!band) throw new Error('Band not found');
        if (title.trim() === '') throw new Error('title is required');
        if (typeof genres === 'string') {
            genres = [genres];
        }
        if (!Array.isArray(genres)) throw new Error('invalid genres format');
        const genresData = [...new Set(genres)];
        if(genresData.length > 3) throw new Error('Genres should not be more than 3');
        req.files.song = req.files.song || [];
        if(req.files && req.files.song && req.files.song.length === 0) {
            throw new Error('A song should be upload');
        }
        
        // Automatically inherit location from the band's home scene
        const cityName = band.cityName;
        const stateName = band.stateName;
        
        if(!cityName || !stateName) {
            throw new Error('Band must have a home scene location set before uploading songs');
        }

        const songData = {
            title:title.trim(),
            cityName:cityName, // Inherited from band
            stateName:stateName, // Inherited from band
            country:country.trim(),
            bandId:band.id,
            uploadedBy : req.user.id,
            song:req.files.song[0],
            hashValue:req.files.song[0].hash,
            latitude,
            longitude,
            promotedSong: 'CITY'
        };
        const song = await Songs.findAll({
            where:{
                hashValue:songData.hashValue
            }
        });
        if(song.length > 0) throw new Error('Song has been already exists');
        const mimetypes = ['audio/mpeg' ,'audio/mp3','audio/m4r','audio/wav'];
        if(!mimetypes.includes(songData.song.mimetype)) throw new Error('file type must have mp3,mpeg and m4r only');
        const songFile = await handleFileUpload(songData.song,'songs');
        songData.song  = songFile.Location;


        if(req.files && req.files.thumbnail && req.files.thumbnail.length > 0) {
            const thumbnail= req.files.thumbnail[0];
            console.time('thumbanil upload');
            const thumbnailFile = await handleFileUpload(thumbnail,'song-thumbnails');
            console.timeEnd('thumbanil upload');
            songData.thumbnail  = thumbnailFile.Location;
        }
        console.time('duration upload');
        const duration = await getAudioMetaData(songData.song);
        console.timeEnd('duration upload');
        songData.duration = duration.format.duration;

        const newSong = await Songs.create(songData);
        //create song albums
        if(albumId){

            const existingAlbumId = await Album.findOne({
                where:{
                    id:albumId,
                }
            });
            if(!existingAlbumId) throw new Error('invalid album id');
            newSong.albumId = existingAlbumId.id;
            await newSong.save();

            await SongAlbums.create({
                albumId:existingAlbumId.id,
                songId:newSong.id,
                bandId:band.id
            });
    
        }
        // const genresData = [...new Set(genres)];
        for await(const genre of genresData) {
            let [_genre] = await Genres.findAll({
                where:{
                    name:genre
                }
            });
            if (!_genre) {
                _genre = await Genres.create({
                    name: genre
                });
            }
            const songGenre = {
                songId: newSong.id, 
                genreId: _genre.id,
            };
            await SongGenres.create(songGenre);
        }
        const uploadSong= await runQuery(`
        select s.id song_id,s.title,s.song ,s.thumbnail ,
               s.duration ,s.live,s."cityName" ,s."stateName" ,s."createdAt",
               s.latitude,s.longitude,
        case when(
         json_strip_nulls(json_agg(json_build_object(
           'id', g.id,
           'genre_name', g.name
        ))))::json::text != '[{}]'::json::text then(
         jsonb_strip_nulls(jsonb_agg(jsonb_build_object(
          'id', g.id,
          'genre_name', g.name
       ))))else null end as genres
        from "Songs" s
        left join "SongGenres" sg on sg."songId" = s.id
        left join  "Genres" g on sg."genreId" = g.id where s.id =:songId
        group by s.id;`, { type:QueryTypes.SELECT, replacements: { songId: newSong.id} });
               
        res.json({message:'Song has been uploaded',data:uploadSong});
    }
    catch(err){
        res.status(400).json({error:err.message});
    }
});

Router.put(
    '/edit/:songId',
    customUpload.fields([{ name: 'song', maxCount: 1 }, { name: 'thumbnail', maxCount: 1 }]),
    async (req,res)=>{
        try {
            const { songId } = req.params;
            if (!songId) throw new Error('Song id is required'); 
            let { title = '',userId,albumId,bandId,thumbnail,latitude,longitude} = req.body;
            let { genres = [] ,} = req.body;
            if(!userId) throw new Error('Invalid user id');
            if(!bandId) throw new Error('Invalid band id');
            const user = await User.findOne({
                where:{
                    id:userId
                }
            });
            if(!user) throw new Error('User not found');
            const band = await Band.findOne({
                where:{
                    id:bandId
                }
            });
            if(!band) throw new Error('Band not found');
            // eslint-disable-next-line no-extra-boolean-cast
            if (!!!title.trim()) throw new Error('Title is required');
            if (typeof genres === 'string') {
                genres = [genres];
            }
            if (!Array.isArray(genres)) throw new Error('Invalid genres format');
            const genresData = [...new Set(genres)];
            if(genresData.length > 3) throw new Error('Genres should not be more than 3');
            const existingSong = await Songs.findOne({
                where:{
                    id: songId,
                },
                include:[{
                    model:SongGenres,
                    as:'songGenres',
                    attributes: ['songId', 'genreId'],
                    include:  {
                        model:Genres,
                        as:'genres',
                        attributes:['id','name'],
                    },
                }]
            });
            if (!existingSong) throw new Error('song not found');
            // eslint-disable-next-line quotes
            //if(existingSong.uploadedBy !== req.user.id ) throw new Error(`you can't perform this action`);
            existingSong.title = title;
            existingSong.cityName = req.body.cityName;
            existingSong.stateName = states[req.body.stateName.slice(0,2)],
            existingSong.country = req.body.country,
            existingSong.hashValue = '';
            existingSong.latitude = latitude;
            existingSong.longitude = longitude;
            let { song = [null] } = req.files;
            const thumbnailFile = req.files.thumbnail || [null];

            if(!thumbnail){
                existingSong.thumbnail = null;
            }
         
            
            const [songFile] = song;
            const [thumbnailPoster] = thumbnailFile;
            
            if(songFile) {
                existingSong.hashValue = songFile.hash;
                const songs = await Songs.findAll({
                    where:{
                        hashValue:existingSong.hashValue
                    }
                });
                if(songs.length > 0) throw new Error('Song has been already exists');
                const mimetypes = ['audio/mpeg' ,'audio/mp3','audio/m4r'];
                if(!mimetypes.includes(songFile.mimetype)) throw new Error('file type must have mp3 and mpeg only');
                const uploadedSongFile = await handleFileUpload(songFile,'songs');
                existingSong.song = uploadedSongFile.Location;
                console.time('duration upload');
                const duration = await getAudioMetaData(existingSong.song);
                console.timeEnd('duration upload');
                existingSong.duration = duration.format.duration;
            }
            if (thumbnailPoster) {
                const uploadedThumbnailFile = await handleFileUpload(thumbnailPoster,'song-thumbnails');
                existingSong.thumbnail = uploadedThumbnailFile.Location;
            }
            //create song albums
            if(!albumId){
                existingSong.albumId = null;
            }
            if(albumId){
                const existingAlbumId = await Album.findOne({
                    where:{
                        id:albumId,
                    }
                });
                if(!existingAlbumId) throw new Error('invalid album id');
                existingSong.albumId = existingAlbumId.id;

                await SongAlbums.create({
                    albumId:existingAlbumId.id,
                    songId:existingSong.id,
                    bandId:existingSong.bandId
                });
    
            }
            await existingSong.save();
            // handling genres
            const existingSongGenres = await SongGenres.findAll({
                where: {
                    songId,
                }
            });
            const existingGenresIds = existingSongGenres.map(({ genreId }) => genreId);

            const incomingGenreIds = [];
            for await (const genre of genres) {
                const [_genre] = await Genres.findOrCreate({
                    where: {
                        name: genre
                    }
                });
                incomingGenreIds.push(_genre.id);
            }
            const commonGenreIds = [];
            for (const genreId of incomingGenreIds) {
                if (existingGenresIds.includes(genreId)) {
                    commonGenreIds.push(genreId);
                }
            }
            const toDeleteGenreIds = [];
            for (const genreId of existingGenresIds) {
                if (!commonGenreIds.includes(genreId)) {
                    toDeleteGenreIds.push(genreId);
                }
            }
            const toInsertGenreIds = [];
            for (const genreId of incomingGenreIds) {
                if (!commonGenreIds.includes(genreId)) {
                    toInsertGenreIds.push(genreId);
                }
            }
            if (toDeleteGenreIds.length > 0) {
                await SongGenres.destroy({
                    where: {
                        songId,
                        genreId: toDeleteGenreIds
                    }
                });
            }
            if (toInsertGenreIds.length > 0) {
                const genresToInsert = toInsertGenreIds.map(genreId => ({
                    songId,
                    genreId
                }));
                await SongGenres.bulkCreate(genresToInsert);
            }
            await existingSong.reload();
            const updatedSong = existingSong.get({ plain:true });
            updatedSong.songGenres = existingSong.songGenres.map(songGenre=>{
                return songGenre.genres;
            }); 
            return res.json({
                message: 'Song has been updated',
                data: updatedSong
            });

        } catch (error) {
            return res.status(400).json({error:error.message});
        }
    });


Router.put('/live',async(req,res)=>{
    try{
        const { songId,live} = req.body;
        if(!songId) throw new Error('Invalid song id');
        const song = await Songs.findOne({
            where:{
                id:songId
            }
        });
        if(!song){
            throw new Error('Song not found');
        }

        //genrate notifications
        if(live === true) {
            const promotedSongs = await Songs.findAll({
                where: {
                    promotedSong: 'CITY',
                    live:true,
                    bandId:song.bandId
                }
            });
            if(req.user.role.name === 'artist'){
                if(promotedSongs.length >= 3) throw new Error('Only 3 songs can be live');
            }
            const users  = await bandFollowersUsers({bandId:song.bandId});
            if(users.length > 0){
                const userIds = users.map( user => user.userId);
                for await (const userId of userIds){
                    await generateNotification(
                        { 
                            type: notificationTypes.UPLOAD_SONG,
                            receiverId:userId,
                            initiatorId:req.user.id,
                            referenceId:songId

                        });
                }
                // push-notifications
                await sendPushNotification(userIds,{
                    type: notificationTypes.UPLOAD_SONG,
                    referenceId:songId,
                });      
            }
        }
        if(live === false){
            await Notifications.destroy({
                where:{
                    type:notificationTypes.UPLOAD_SONG,
                    referenceId:songId
                }});
            await UserRadioQueue.destroy({
                where:{
                    songId
                }
            });
            await song.update({live,airedOn:null});
        }
        if(live === true) { 
            await song.update({live,airedOn:Date.now()});
        }

        //verify album live
        if(song.albumId){
            const songs = await Songs.findAll({
                where:{
                    albumId:song.albumId,
                }
            });
            const songLiveStatuses = songs.map(song => song.live);
            const uniqueSongLiveStatuses = [...new Set(songLiveStatuses)];
            // if there are true and false in set, there is mix of songs live statuses
            if(uniqueSongLiveStatuses.length == 1){
                const albumStatus = uniqueSongLiveStatuses[0];
                await Album.update({ live: albumStatus},{
                    where:{
                        id:song.albumId
                    }
                });
            }
        }
        res.json({data:song});
    }
    catch(error){
        res.status(400).json({error:error.message});
    }
});

// get all songs and albumId with songs
Router.get('/songs-list/',async(req,res)=>{
    if(!req.query.bandId) throw new Error('Invalid band id');
    const {currentPage = 1, perPage = 20 } = req.query;
    let search = (req.query.search || '').toLowerCase();
    try{
        const band = await Band.findOne({
            where:{
                id:req.query.bandId
            }
        });
        
        if(!band) throw new Error('Invalid band');
        
        if(req.query.albumId){
            const album = await Album.findOne({
                where:{
                    id:req.query.albumId,
                    bandId:req.query.bandId
                }
            });
            if(!album) throw new Error('Invalid album');
        }
    
        const songsList = await runQuery(`  
         select count(*) over() "totalCount",
         case when sf."userId"  is not null then true else false end as "isSongFavorite",
              s.id,s.title,s.song ,s.thumbnail ,s.duration ,
               s."cityName" ,s."stateName" ,s.country,s."createdAt",s.live,s."deletedAt",
               s.latitude,s.longitude,
               jsonb_build_object('id',b.id,'title',b.title) as band,
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
       left join  "Genres" g on sg."genreId" = g.id 
       left join "Bands" b on b.id = s."bandId"
       left join "SongFavorites" sf on s.id = sf."songId" and sf."userId"= :userId
       where s."bandId" =:bandId and s."deletedAt" is null
       and
       (lower(s.title) like lower('%${search}%') or 
              lower(s."stateName") like lower('%${search}%') or lower(a.title) like lower('${search}%'))
              ${req.query.albumId ? `and s."albumId" = ${req.query.albumId}` : ''}
       group by a.id,s.id,b.id,sf."userId" 
     order by s.live is true desc,s."createdAt" desc offset ${(currentPage-1)*perPage} limit ${perPage}`,
        { type:QueryTypes.SELECT, replacements: { bandId: band.id,userId:req.user.id}
        }) ; 
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

Router.delete('/:songId',async(req,res)=>{
    try{
        const { songId } = req.params;
        if(!songId) throw new Error('Song id is required');
        const song = await Songs.findOne({
            where:{
                id: songId
            }
        });
        if(!song) throw new Error('Song does not exist');
        if(song.albumId !== null){
            const album = await Album.findOne({
                where:{
                    id:song.albumId
                }
            });
            if(album){
                const songs = await Songs.findAll({
                    where:{
                        albumId:album.id,
                        id:{
                            [Op.not]:songId
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
        await SongGenres.destroy({
            where:{
                songId:songId
            },
            force:true
        });
        await song.destroy({ force: true });
        res.json({message:'Song has been deleted',data:song});
       
    }
    catch(error){
        res.status(400).json({error:error.message});
    }
});

//mobile api for getting songs by album id and band id
Router.get('/songs-list/album',async(req,res)=>{
    try{
        const {albumId,bandId} = req.query;
        if(!albumId) throw new Error('Album id is required');
        if(!bandId) throw new Error('Band id is required');
        const songs = await runQuery(` 
        select  jsonb_build_object('isSongFavorite',case when sf."userId"  is not null then true else false end,
        'id',s.id,'title',s.title,'song',replace(s.song,
            '${config.songUrl.AWS_S3_ENDPOINT}',
            '${config.songUrl.CLOUD_FRONT_ENDPOINT}'),'thumbanil',s.thumbnail,'duration',s.duration,'cityName',s."cityName",
        'stateName',s."stateName",'bandId',s."bandId",'live',s.live,'albumId',s."albumId" ) as song,
         jsonb_build_object('id',b.id,'title',b.title)as band,
         jsonb_build_object('id',a.id,'title',a.title)as album
         from "Songs" s 
         left join "Albums" a on a.id =s."albumId"
         left join "Bands" b on b.id=s."bandId"
         left join "SongFavorites" sf on s.id = sf."songId" and sf."userId"=:userId
         where a.id =${albumId} and b.id=${bandId} and s.live is true `,
        { type:QueryTypes.SELECT, replacements: { userId:req.user.id}
        });
        res.json({data:songs});
    }
    catch(error){
        res.status(400).json({error:error.message});
    }
}
);


module.exports=Router;