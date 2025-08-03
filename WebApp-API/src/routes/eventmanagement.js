/* eslint-disable quotes */
const Router = require('express').Router();
const moment = require('moment-timezone');


const { Events,Band,Notifications,UserCalenderEvent } = require('../database/models/');
const { handleFileUpload} = require('../utils/fileUpload');
const {canDoBandOperations} = require('../middlewares/auth');
const upload = require('multer')();
const { generateNotification } = require('../utils/notificationService');
const { notificationTypes } = require('../utils/types/notificationTypes');
const { bandFollowersUsers } = require('../utils/userInfo');
const { getFormatAddress } = require('../utils/address');
const { insertEvent,deleteEvent,updateEvent } = require('../utils/calender');
const { sendPushNotification } = require('../utils/pushNotifications');
const { states } = require('../utils/states');
const { runQuery } = require('../utils/dbquery');
const { QueryTypes } = require('sequelize');
const { Op } = require('sequelize');

Router.post('/create-event',upload.single('thumbnail'),canDoBandOperations,async(req,res) =>{
    try{
        const { eventName = '',description,latitude,longitude,location,startTime,endTime,bandId } = req.body;
        if(!eventName){
            throw new Error('Invalid event name');
        }
        if(!location || location.trim() === ''){
            throw new Error('Invalid location');
        }
        const getAddress = getFormatAddress(location);
        if(!getAddress.country) throw new Error('Invalid city');
        if(!getAddress.state) throw new Error('Invalid state');
        
        if(moment(startTime).isValid() === false) throw new Error('Invalid start time');
        if(moment(endTime).isValid() === false) throw new Error('Invalid end time');
        if(!bandId) throw new Error('Invalid band id');
        if(moment(endTime) <= moment(startTime)) throw new Error('Invalid time range');
        const minutes = moment.duration(moment(endTime).diff(moment(startTime))).as('minutes');
        // eslint-disable-next-line use-isnan
        if(parseInt(minutes) === NaN) throw new Error('Invalid time range');
        if(minutes <= 45) throw new Error(`you can't create event with less than 45 minutes`);
        const checkEvents = await Events.findAll({
            where:{
                createdBy:req.user.id,
                location
            },
            order: [['startTime', 'desc']],
        });
        for await(const checkEvent of checkEvents){
            if(checkEvent){
                const utcTimeFormats = moment(startTime).format();
                const verifyStartTime =  moment(checkEvent.startTime).format();
                const verifyEndTime =  moment(checkEvent.endTime).format();
                const verifyEvent = await runQuery(` 
                            select * from "Events" e 
                            where '${utcTimeFormats}' 
                              between '${verifyStartTime}' and '${verifyEndTime}' ;`,
                { type:QueryTypes.SELECT,});

                if(verifyEvent.length > 0) throw new Error(`You already created an Event`);
            }
        }
        const eventData = {
            eventName,
            description,
            location,
            latitude,
            longitude,
            cityName:getAddress.city,
            stateName:states[getAddress.state.slice(0,2)],
            country:getAddress.country,
            startTime,
            endTime,
            bandId:bandId,
            createdBy:req.bandMember.userId
        };
        const thumbnail = req.file;
        if (thumbnail){
            const file = await handleFileUpload(thumbnail,'event-thumbnails');
            eventData.thumbnail = file.Location;
        }
        const  newEvent = await Events.create(eventData);
        const calenderEvent = {
            'summary':newEvent.eventName,
            'description': newEvent.description,
            'start': {
                'dateTime': newEvent.startTime
            },
            'end': {
                'dateTime': newEvent.endTime
            }
        };
        const googleEvent = await insertEvent(calenderEvent);
        newEvent.googleEventId = googleEvent.id; 
        await newEvent.save();

      
        const event = await Events.findOne({
            where:{
                id:newEvent.id
            },
            attributes:['id','thumbnail','eventName','description','location','startTime','endTime'],
            include: [
                {
                    model: Band,
                    as: 'band', 
                    attributes: ['id', 'title']
                }
            ]
        });
        const users  = await bandFollowersUsers({bandId});
        if(users.length > 0){
            const userIds = users.map( id => id.userId);
            for await (const userId of userIds){
                await generateNotification(
                    { 
                        type: notificationTypes.ADD_EVENT,
                        receiverId:userId,
                        initiatorId:req.user.id,
                        referenceId:event.id

                    });
            }
            await sendPushNotification(userIds,{
                type: notificationTypes.ADD_EVENT,
                referenceId:event.id,
            });
        }
        
        res.json({message:'Event has been created',data:event});
        
    }
    catch(error){
        res.status(400).json({error:error.message});
    }

});

Router.get('/events-list',async(req,res) => {
    try{
        if(!req.query.bandId) throw new Error('Invalid band id');
        const {currentPage = 1, perPage = 20 } = req.query;
        let search = (req.query.search || '').toLowerCase();
        
        let events = await runQuery(`
        select count(*) over() "totalCount",e.id ,e.thumbnail,
        e."eventName",e.description,e."startTime",e."endTime",e."location",e."deletedAt",e.latitude,e.longitude,
        case when(
               jsonb_strip_nulls(jsonb_build_object(
                 'id', b.id,
                 'title', b.title
              )) 
              ) ::json::text != '{}'::json::text then(
                jsonb_strip_nulls(jsonb_build_object(
                 'id', b.id ,
                 'title', b.title
              )))else null end as band from "Events" e 
                 left join "Bands" b on e."bandId" =b.id 
                 where e."bandId" =:bandId and e."deletedAt" is null 
                 and
                 (lower(e."eventName") like lower('%${search}%') or 
                   lower(e."location")  like lower('%${search}%') or 
                   lower(b.title)  like lower('%${search}%'))` ,
        { type:QueryTypes.SELECT, 
            replacements: { bandId:req.query.bandId} });

        var now = new Date();
        let utcCurrentDate  = moment(now).format();
        let futureEvents = [];
        let pastEvents = [];
        for await(const event of events){
            if(moment(event.startTime) >= moment(utcCurrentDate)){
                futureEvents.push(event);
            }
        }
        for await(const event of events){
            if(moment(event.startTime) < moment(utcCurrentDate)){
                pastEvents.push(event);
            }
        }
        if(futureEvents.length > 0){
            futureEvents = futureEvents.sort(
                (objA, objB) => Number(objA.startTime) - Number(objB.startTime),
            );
        }
        events = [...futureEvents,...pastEvents];
        const paginate = (array, page_size, page_number) => {
            return array.slice((page_number - 1) * page_size, page_number * page_size);
        };
        const totalPages = events.length > 0 ? Math.ceil(events[0].totalCount/perPage) : 0;
    
        events = paginate(events,perPage ,currentPage); 
        const response = {
            data: events,
            metadata: {
                currentPage: parseInt(currentPage),
                perPage: parseInt(perPage),
                totalPages,
            }
        };

        res.json(response);

    }
    catch(error){
        res.status(400).json({error:error.message});
    }

});

Router.put('/update-event/:id',upload.single('thumbnail'),canDoBandOperations,async(req,res) =>{
    try{
        const { eventName,description,location,startTime,endTime,bandId,thumbnail, latitude,
            longitude } = req.body;
    
        if(!req.params.id) throw new Error('Inavalid event id');
        const existingEvent = await Events.findOne({
            where:{
                id:req.params.id,
                bandId:bandId
            }
        });
    
        if(!existingEvent) throw new Error('event is not found');

        if(moment(startTime).isValid() === false) throw new Error('Invalid start time');
        if(moment(endTime).isValid() === false) throw new Error('Invalid end time');
        if(!bandId) throw new Error('Invalid band id');
        if(!moment(startTime).isBefore(moment(endTime))) throw new Error('Invalid time range');
        const minutes = moment.duration(moment(endTime).diff(moment(startTime))).as('minutes');
        // eslint-disable-next-line use-isnan
        if(parseInt(minutes) === NaN) throw new Error('Invalid time range');
        if(minutes <= 45) throw new Error(`you can't create event with less than 45 minutes`);
        const getAddress = getFormatAddress(location);
        let eventData = {
            startTime :startTime,
            endTime :endTime,
            eventName :eventName,
            description:description,
            location:location,
            cityName:getAddress.city,
            stateName:states[getAddress.state.slice(0,2)],
            country:getAddress.country,
            latitude,
            longitude,

        };
        if(!thumbnail){
            eventData.thumbnail = null;
        }
        const checkEvents = await Events.findAll({
            where:{
                createdBy:req.user.id,
                location,
                id:{
                    [Op.not]:req.params.id
                }
            },
            order: [['startTime', 'desc']],
        });
        for await(const checkEvent of checkEvents){
            if(checkEvent){
                const utcTimeFormats = moment(startTime).format();
                const verifyStartTime =  moment(checkEvent.startTime).format();
                const verifyEndTime =  moment(checkEvent.endTime).format();
                const verifyEvent = await runQuery(` 
                            select * from "Events" e 
                            where '${utcTimeFormats}' 
                              between '${verifyStartTime}' and '${verifyEndTime}' ;`,
                { type:QueryTypes.SELECT,});
        
                if(verifyEvent.length > 0) throw new Error(`You already created an Event`);
            }
        }
        const thumbnailFile = req.file;
        if (thumbnailFile){
            const file = await handleFileUpload(thumbnailFile,'event-thumbnails');
            eventData.thumbnail = file.Location;
        }
        const updateEvents = await existingEvent.update(eventData);

        let googleEvent = {
            'summary': updateEvents.eventName,
            'description': updateEvents.description,
            'start': {
                'dateTime': updateEvents.startTime
            },
            'end': {
                'dateTime': updateEvents.endTime
            }
        };
        const updateGoogleEvent= updateEvent(updateEvents.googleEventId, googleEvent);
        updateEvents.googleEventId = updateGoogleEvent.id;
        await updateEvents.save();
          

        const event = await Events.findOne({
            where:{
                id:updateEvents.id
            },
            attributes:['id','thumbnail','eventName','description','location','startTime','endTime'],
            include: [
                {
                    model: Band,
                    as: 'band',
                    attributes: ['id', 'title']
                }
            ]
        });
        res.json({message :'Event has been updated',data:event});         

    }
    catch(error){
        res.status(400).json({error:error.message});
    }

});

Router.delete('/event/:id',canDoBandOperations,async(req,res) => {
    try{
        if(!req.params.id) throw new Error('Invalid event id');
        const event = await Events.findOne({
            where:{
                id: req.params.id,                
            }
        });
        if(!event) throw new Error('Invalid event');
       
        await Notifications.destroy({
            where:{
                type:notificationTypes.ADD_EVENT,
                referenceId:event.id
            }});
        await UserCalenderEvent.destroy({where:{eventId:event.id}});
        await deleteEvent(event.googleEventId);
    
        await event.destroy({force:true});
        res.json({message:'Event has been deleted',data:event});

    }
    catch(error){
        res.status(400).json({error:error.message});
    }

});

//admin get users events
Router.get('/admin/events-list',async(req,res) => {
    try{
        const {currentPage = 1, perPage = 20 } = req.query;
        let search = (req.query.search || '').toLowerCase();
        let events = await runQuery(`  select count(*) over() "totalCount",e.id ,e.thumbnail,e."eventName",
        e.description,e."startTime",e."endTime",e."location",e."deletedAt",e.latitude,e.longitude,
        case when(
               jsonb_strip_nulls(jsonb_build_object(
                 'id', b.id,
                 'title', b.title
              )) 
              ) ::json::text != '{}'::json::text then(
                jsonb_strip_nulls(jsonb_build_object(
                 'id', b.id ,
                 'title', b.title
              )))else null end as band from "Events" e left join "Bands" b on e."bandId" =b.id
               where e."deletedAt" is  null and (lower(e."eventName") like lower('%${search}%') or 
                    lower(e."location")  like lower('%${search}%') or 
                    lower(b.title)  like lower('%${search}%'))` ,
        { type:QueryTypes.SELECT});
        var now = new Date();
        let utcCurrentDate  = moment(now).format();
        let futureEvents = [];
        let pastEvents = [];

        if(events.length > 0){
            for await(const event of events){
                if(moment(event.startTime) >= moment(utcCurrentDate)){
                    futureEvents.push(event);
                }
            }
        }
        for await(const event of events){
            if(moment(event.startTime) < moment(utcCurrentDate)){
                pastEvents.push(event);
            }
        }
        if(futureEvents.length > 0){
            futureEvents = futureEvents.sort(
                (objA, objB) => Number(objA.startTime) - Number(objB.startTime),
            );
        }
        events = [...futureEvents,...pastEvents];
        const paginate = (array, page_size, page_number) => {
            return array.slice((page_number - 1) * page_size, page_number * page_size);
        };
        const totalPages = events.length > 0 ? Math.ceil(events[0].totalCount/perPage) : 0;
    
        events = paginate(events,perPage ,currentPage); 
        
        const response = {
            data: events,
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

module.exports = Router;


