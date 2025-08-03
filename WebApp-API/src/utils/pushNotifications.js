const admin = require('firebase-admin');
const logger = require('./logger');
const { Band, Songs,User,Events,SongBlast} = require('../database/models');
const { notificationTypes } = require('./types/notificationTypes');



require('dotenv').config();


const stringifiedServiceAccount = process.env.PUSH_NOTIFICATIONS_SERVICE_ACCOUNT;
let serviceAccount;

if (stringifiedServiceAccount) {
    try {
        serviceAccount = JSON.parse(stringifiedServiceAccount);
        serviceAccount.privateKey = serviceAccount.private_key.replace(/\\n/g, '\n');
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
    } catch (error) {
        console.log('Firebase admin initialization failed:', error.message);
    }
} else {
    console.log('PUSH_NOTIFICATIONS_SERVICE_ACCOUNT not configured - push notifications disabled');
}

const sendPushNotification = async (userIds, notification) => {
    try {
        if (!Array.isArray(userIds)) {
            throw new Error(`sendPushNotification: userIds is not an array, tokens: ${userIds} ${JSON.stringify(notification)}`);
        }
        if (userIds.length === 0) {
            throw new Error(`sendPushNotification: userIds is empty ${JSON.stringify(notification)}`);
        }
        if (!notification) {
            throw new Error(`sendPushNotification: notification is empty ${JSON.stringify(notification)}`);
        }
        if (!notification.type) {
            throw new Error(`sendPushNotification: notification type is empty ${JSON.stringify(notification)}`);
        }
        if (!notification.referenceId) {
            throw new Error(`sendPushNotification: notification referenceId is empty ${JSON.stringify(notification)}`);
        }
        const users = await User.findAll({
            where: {
                id: userIds,
            },
        });
        if (users.length === 0) {
            throw new Error(`sendPushNotification: users are empty ${JSON.stringify(notification)}`);
        }
        const fcmTokens = users.map(user => user.fcmToken).filter(Boolean);

        if (fcmTokens.length === 0) {
            throw new Error(`sendPushNotification: fcmtokens is empty ${JSON.stringify(notification)}`);       
        }

    
        if (notification.type === notificationTypes.UPLOAD_SONG) {
            const song = await Songs.findOne({
                where: {
                    id: notification.referenceId,
                },
            });
            if (!song) {
                throw new Error(`sendPushNotification: song not found ${JSON.stringify(notification)}`);
            }
            const band = await Band.findOne({
                where: {
                    id: song.bandId,
                },
            });
            if (!band) throw new Error(`sendPushNotification: band not found ${JSON.stringify(notification)}`);
            const notificationBody = {
                title: `${band.title} uploaded a new song`,
                body: `${band.title} uploaded a new song ${song.title}`,
                imageUrl: song.thumbnail || undefined
            };
            const data = {
                song: JSON.stringify(song),
                band : JSON.stringify(band),
            };
            sendBatchNotifications(fcmTokens, { notification: notificationBody, data });
        }
        if(notification.type === notificationTypes.ADD_EVENT){
            const event = await Events.findOne({
                where: {
                    id: notification.referenceId,   
                },
            });
            if (!event) {
                throw new Error(`sendPushNotification: event not found ${JSON.stringify(notification)}`);
            }
            const band = await Band.findOne({
                where: {
                    id: event.bandId,
                },
            });
            if (!band) throw new Error(`sendPushNotification: band not found ${JSON.stringify(notification)}`);
            const notificationBody = {
                title: `${band.title} added a new event`,
                body: `${band.title} added a new event ${event.eventName}`,
                imageUrl: event.thumbnail || undefined,
            };
            const data = {
                event: JSON.stringify(event),
                band : JSON.stringify(band),
            };
            sendBatchNotifications(fcmTokens, { notification: notificationBody, data });
        }
        if(notification.type === notificationTypes.BLAST_SONG){
            const blast = await SongBlast.findOne({
                where: {
                    id: notification.referenceId,
                },
            });
            if (!blast) {
                throw new Error(`sendPushNotification: blast not found ${JSON.stringify(notification)}`);
            }
            const song = await Songs.findOne({
                where: {
                    id: blast.songId,   
                },
            });
            if (!song) {
                throw new Error(`sendPushNotification: song not found ${JSON.stringify(notification)}`);
            }
            const band = await Band.findOne({
                where: {
                    id: song.bandId,
                },
            });
            if (!band) throw new Error(`sendPushNotification: band not found ${JSON.stringify(notification)}`);
            const notificationBody = {
                title: `${band.title} blasted a new song`,
                body: `${band.title} blasted a new song ${song.title}`,
                imageUrl: song.thumbnail || undefined,
            };
            const data = {
                blast: JSON.stringify(blast),
                song: JSON.stringify(song),
                band : JSON.stringify(band),
            };
            sendBatchNotifications(fcmTokens, { notification: notificationBody, data });
        }

   
        // process the notification and generate title, body, imageURL
        

    } catch (error) {
        logger.error(error.message);
    }
};

const generatePushNotification = async (userIds,eventId) => {
    try {
        if (!userIds) throw new Error('userIds is empty');
        if (!Array.isArray(userIds)) {
            throw new Error(`genereatePushNotification: userIds is not an array, tokens: ${userIds}`);
        }
        if (userIds.length === 0) {
            throw new Error('genereatePushNotification: userIds is empty');
        }
        if (!eventId) throw new Error('eventId is empty');
        const users = await User.findAll({
            where: {
                id: userIds,
            },
        });
        if (users.length === 0) {
            throw new Error('genereatePushNotification: users are empty');
        }
        const fcmTokens = users.map(user => user.fcmToken).filter(Boolean);
        if (fcmTokens.length === 0) {
            throw new Error('genereatePushNotification: fcmtokens is empty');
        }
        const event = await Events.findOne({
            where: {
                id: eventId,
            },
        });
        if (!event) {
            throw new Error('genereatePushNotification: event not found');
        }
        const band = await Band.findOne({
            where: {
                id: event.bandId,
            },
        });
        if (!band) throw new Error('genereatePushNotification: band not found');
        const notificationBody = {
            title: `${band.title} added a calendar event`,
            body: `${band.title} added a calender event ${event.eventName}`,
            imageUrl: event.thumbnail || undefined,
        };
        const data = {
            event: JSON.stringify(event),
            band : JSON.stringify(band),
        };
        sendBatchNotifications(fcmTokens, { notification: notificationBody, data });
    } catch (error) {
        logger.error(error.message);
    }
};

        

const sendBatchNotifications = async (tokens, { notification, data }) => {

    try {
        logger.info(`sendBatchNotifications: tokens: ${tokens} notification: ${JSON.stringify(notification)} data: ${JSON.stringify(data)}`);
        // send notifications by batches of 500 tokens
        for(let i = 0; i < tokens.length; i += 500) {
            const currentTokensBatch = tokens.slice(i, i + 500);
            const response = await admin.messaging().sendMulticast({
                tokens: currentTokensBatch,
                notification,
                data,
            });
            logger.info(`sentBatchNotifications: ${JSON.stringify(response.successCount)}`);
        }
    } catch (error) {
        logger.error(error.message);
    }
};




module.exports = {
    sendPushNotification,
    generatePushNotification,
};


/*
messaging().sendMulticast({
    tokens: tokens,
    notification: {},
    data: {}
});

messsaging().sendToDevice(message);



*/