const { Events,UserCalenderEvent} = require('../database/models');
const { generatePushNotification } = require('../utils/pushNotifications');


const moment = require('moment-timezone');
const { Op } = require('sequelize');


const sendEventPushNotification = async (req,res) => {
    try{
        const events = await Events.findAll({
            where:{
                startTime: { 
                    [Op.gt]: moment().toDate(),
                    [Op.lt]: moment().add(1, 'hours').format()
                },
            },
        });
        const eventIds = events.map(event=> { return event.id; });
        console.log('generATE',eventIds);
        const UserCalenderEvents = await UserCalenderEvent.findAll({
            where:{
                eventId: {
                    [Op.in]: eventIds
                },
                    
            },
        });
        const userIds = UserCalenderEvents.map(event=> { return event.userId; });
        //push-notifications
        for await (const eventId of eventIds) { 
            await generatePushNotification(userIds,eventId);
        }
       
                
    
    }
    catch(error){
        return  res.status(400).json({ error: error.message });
    }
    
};
module.exports = { sendEventPushNotification};