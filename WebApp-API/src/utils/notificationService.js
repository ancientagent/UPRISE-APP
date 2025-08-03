const { Notifications } = require('../database/models/');
const { notificationTypes } = require('./types/notificationTypes');
const generateNotification = async ({type,initiatorId,referenceId, receiverId, }) => {
    if (!notificationTypes[type]) throw new Error('Invalid type');
    const createnotification  = await Notifications.create({
        type:type,
        receiverId,
        initiatorId,
        referenceId

    });
    return createnotification;

};


/*

generateNotif({
    type: notificationTypes.upload_song,

})
*/

module.exports = { generateNotification };