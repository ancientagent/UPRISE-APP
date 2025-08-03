const Router = require('express').Router();

const { AdsManagement } = require('../database/models/');

const { handleFileUpload,get_url_extension, bufferHandler} = require('../utils/fileUpload');
const upload = require('multer')();
const fs = require('fs');
const { states } = require('../utils/states');
const { generateThumbnail } = require('../utils/mediaHandler');
const { runQuery } = require('../utils/dbquery');
const { QueryTypes} = require('sequelize');



//ads Managemnent
Router.post('/create_banner',upload.single('banner'), async (req, res) => {
    try{
        let {title,description,link,city,state,country,latitude,longitude,bandId }= req.body;
        const banner = req.file;
        if(!req.user.id) throw new Error('User not found');
        if(!bandId) throw new Error('Band Id is required');
        if(!title) throw new Error('Title is required');
        if(!city) throw new Error('City is required');
        if(!state) throw new Error('State is required');
        if(!country) throw new Error('Country is required');
        let keys = Object.keys(states);
        if(keys.includes(state)){ 
            state = states[state.slice(0,2)];  
        }
        const bannerData = {
            title,
            link,
            city,
            state,
            country,
            latitude,
            longitude,
            bandId,
            createdBy:req.user.id,
        };
        bannerData.description = description && description.replace(/(\r\n)/gm, '\n');
        if(banner){
            const file = await handleFileUpload(banner,'banners');
            bannerData.banner = file.Location;
            const media  = get_url_extension(bannerData.banner);
            //if(['mp4,avi,mov'].includes(media))
            if(media === 'mp4' || media === 'avi' || media === 'mov'){  
                const videoThumbnail = await generateThumbnail(bannerData.banner);
                const result = videoThumbnail.pathToFile.split('/tmp/')[1];
                const image = fs.readFileSync(`/tmp/${result}`);
                const thumbUpload = await bufferHandler(image,'banners-thumbnail',result);
                fs.unlink(`/tmp/${result}`, (fsErr) => {
                    if (fsErr) throw fsErr;
                });
                bannerData.thumbnail = thumbUpload.Location;
            }
        }
        const adsManagement = await AdsManagement.create(bannerData);
        res.status(200).json({
            message: 'Banner has been created',
            data: adsManagement
        });
    }catch(error){
        res.status(400).json({error: error.message});
    }
   
});



// live
Router.put('/live',async(req,res) => {
    try{
        const { bannerId,live} = req.body;
        if(!bannerId) throw new Error('Invalid banner id');
        const banners = await AdsManagement.findOne({
            where:{
                id:bannerId
            }
        });
        await banners.update({live});
        res.json({data:banners});
    }
    catch(error){
        res.status(400).json({error:error.message});
    }
});





//get all banners
Router.get('/list_banners',async(req,res) => {
    try{
        if(!req.query.bandId) throw new Error('Invalid band id');
        const {currentPage = 1, perPage = 20 } = req.query;
        let search = (req.query.search || '');
        const banners = await runQuery(`
        select count(*) over() "totalCount", * from "AdsManagements" am 
          where am."bandId"=${req.query.bandId} and 
          ( lower(am.title) like lower('%${search}%') 
          or lower(am.city) like lower('%${search}%')  
          or lower(am.state) like lower('%${search}%'))
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
});

//delete banner
Router.delete('/:bannerId',async(req,res) => {
    try{
        if(!req.params.bannerId) throw new Error('Invalid banner id');
        const banner = await AdsManagement.findOne({
            where:{
                id:req.params.bannerId
            }
        });
        if(!banner) throw new Error('Invalid banner');
        await banner.destroy({force:true});
        res.json({message:'Banner has been deleted',data:banner});
    }
    catch(error){
        res.status(400).json({error:error.message});
    }
});


//update banner
Router.put('/:bannerId',upload.single('banner'), async (req, res) => {
    try{
        let {title,description,link,city,state,country,latitude,longitude,bandId,banner}= req.body;
        banner = req.file;
        if(!req.params.bannerId) throw new Error('Invalid banner id');
        if(!bandId) throw new Error('Band Id is required');

        const verifyBanner = await AdsManagement.findOne({
            where:{
                id:req.params.bannerId,
                bandId
            }
        });
        if(!verifyBanner) throw new Error('Invalid banner');
        let keys = Object.keys(states);
        if(keys.includes(state)){ 
            state = states[state.slice(0,2)];  
        }
        const bannerData = {
            title,
            link,
            city,
            state,
            country,
            latitude,
            longitude,
            bandId

        };
        bannerData.description = description && description.replace(/(\r\n)/gm, '\n');
        if(banner){
            const file = await handleFileUpload(banner,'banners');
            bannerData.banner = file.Location;
            const media  = get_url_extension(bannerData.banner);
            if(['mp4','avi','mov'].includes(media)){  
                const videoThumbnail = await generateThumbnail(bannerData.banner);
                const result = videoThumbnail.pathToFile.split('/tmp/')[1];
                const image = fs.readFileSync(`/tmp/${result}`);
                const thumbUpload = await bufferHandler(image,'banners-thumbnail',result);
           
                fs.unlink(`/tmp/${result}`, (fsErr) => {
                    if (fsErr) throw fsErr;
                });
                bannerData.thumbnail = thumbUpload.Location;
            }
        }
        if(!banner){
            bannerData.banner = null;
        }
        const adsManagement = await verifyBanner.update(bannerData);
        res.status(200).json({ 
            message: 'Banner has been updated',
            data: adsManagement
        });
    }
    catch(error){
        res.status(400).json({error:error.message});
    }
});

module.exports = Router;