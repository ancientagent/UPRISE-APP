const { google } = require('googleapis');
const readline = require('readline');
const fs = require('fs');
const _ = require ('lodash');
const path = require('path');
require('dotenv').config();

const { User } = require('../database/models/');

// Provide the required configuration
const CREDENTIALS = process.env.CREDENTIALS ? JSON.parse(process.env.CREDENTIALS) : { web: { client_id: '', client_secret: '', redirect_uris: [''] } };
const calendarId = process.env.CALENDAR_ID || 'test';

// Google calendar API settings
const SCOPES = 'https://www.googleapis.com/auth/calendar';
const calendar = google.calendar({version : 'v3'});


const TOKEN_PATH = path.join(__dirname,'..','config','google_calender.json');
const { client_secret, client_id, redirect_uris } = CREDENTIALS.web;
const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
);

const getAccessToken = async (oAuthClient) => {
    const authUrl = oAuthClient.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
        prompt: 'consent'
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuthClient.getToken(code, (err, token) => {
            if (err) return console.error('Error retrieving access token', err);
            oAuthClient.setCredentials(token);
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (error) => {
                if (error) return console.error(error);
            });
            return oAuthClient;
        });
    });
};
const authorize = async () => {
    try {
        const token = fs.readFileSync(TOKEN_PATH);
        oAuth2Client.setCredentials(JSON.parse(token));
        return oAuth2Client;
    } catch (error) {
        console.log(`Error at authorize --> ${error}`);
        return getAccessToken(oAuth2Client);
    }
};


// Your TIMEOFFSET Offset
// const TIMEOFFSET = '+05:30';

// // Get date-time string for calender
// const dateTimeForCalander = () => {

//     let date = new Date();

//     let year = date.getFullYear();
//     let month = date.getMonth() + 1;
//     if (month < 10) {
//         month = `0${month}`;
//     }
//     let day = date.getDate();
//     if (day < 10) {
//         day = `0${day}`;
//     }
//     let hour = date.getHours();
//     if (hour < 10) {
//         hour = `0${hour}`;
//     }
//     let minute = date.getMinutes();
//     if (minute < 10) {
//         minute = `0${minute}`;
//     }

//     let newDateTime = `${year}-${month}-${day}T${hour}:${minute}:00.000${TIMEOFFSET}`;

//     let event = new Date(Date.parse(newDateTime));

//     let startDate = event;
//     // Delay in end time is 1
//     let endDate = new Date(new Date(startDate).setHours(startDate.getHours()+1));

//     return {
//         'start': startDate,
//         'end': endDate
//     };
// };
// console.log('date calender',dateTimeForCalander());
//getAccessToken(oAuth2Client);

//Insert new event to Google Calendar
const insertEvent = async (event) => {
    try {
        const auth= await authorize();
        if(!auth) throw new Error('Authorization failed');
        let response = await calendar.events.insert({
            auth,
            calendarId: calendarId,
            resource: {
                ...event,
                guestsCanSeeOtherGuests:false,
                guestsCanInviteOthers:false
            },
            
        });
       
        if (response['status'] == 200 && response['statusText'] === 'OK') {
            return response.data;
        }
        else{
            throw new Error(response['statusText']);
        }
    } catch (error) {
        console.log(`Error at insertEvent --> ${error}`);
        return 0;
    }
};

//let dateTime = dateTimeForCalander();

// Get all the events between two dates
// const getEvents = async (dateTimeStart, dateTimeEnd) => {

//     try {
//         const auth= await  authorize();
//         if(!auth) throw new Error('Authorization failed');
//         let response = await calendar.events.list({
//             auth,
//             calendarId: calendarId,
//             timeMin: dateTimeStart,
//             timeMax: dateTimeEnd,
//             timeZone: 'Asia/Kolkata'
//         });
    
//         let items = response['data']['items'];
//         return items;
//     } catch (error) {
//         console.log(`Error at getEvents --> ${error}`);
//         return 0;
//     }
// };
// let start = '2022-07-18T09:15:00.000Z';
// let end = '2022-07-18T10:15:00.000Z';

// getEvents(start, end)
//     .then((res) => {
//         console.log(res);
//     })
//     .catch((err) => {
//         console.log(err);
//     });

// Delete an event from eventID
const deleteEvent = async (eventId) => {

    try {
        const auth = await authorize();
        if(!auth) throw new Error('Authorization failed');
        let response = await calendar.events.delete({
            auth: auth,
            calendarId: calendarId,
            eventId: eventId
        });
        
        if (response.data === '') {
            return 1;
        } else {
            return 0;
        }
    } catch (error) {
        console.log(`Error at deleteEvent --> ${error}`);
        return 0;
    }
};



//update an event
const updateEvent = async (eventId, event) => {
    
    try {
        const auth = await authorize();
        if(!auth) throw new Error('Authorization failed');
        let response = await calendar.events.patch({
            auth,
            calendarId: calendarId,
            eventId: eventId,
            resource: event
        });
        if (response['status'] == 200 && response['statusText'] === 'OK') {
            return response.data;
        }
        else{
            throw new Error(response['statusText']);
        }
    } catch (error) {
        console.log(`Error at updateEvent --> ${error}`);
        return 0;
    }
};

    

  


//     export const eventUpdate = async (eventId, location, title, startTime, endTime, notes, timeZone, attendees) => {
//         try {
//           const event = {
//             summary: title,
//             location,
//             description: notes,
//             start: {
//               dateTime: startTime,
//               timeZone,
//             },
//             end: {
//               dateTime: endTime,
//               timeZone,
//             },
//             attendees,
//           };
//           const auth = await authorize();
//           if (auth) {
//             const response = await calendar.events.update({
//               auth,
//               calendarId,
//               eventId,
//               resource: event,
//               sendUpdates: 'all',
//             });
//             if (response.status === 200 && response.statusText === 'OK') {
//               return 1;
//             }
//           }
//         } catch (error) {
//           console.log(`Error at updateEvent --> ${error}`);
//         }
//       };
      


// update attendences of an event
const updateAttendences = async (eventId, attendees) => {
    try {
        const auth = await authorize();
        if (!auth) throw new Error('Authorization failed'); 
        const event = {
            attendees: attendees
        };
        let response = await calendar.events.patch({
            auth,
            calendarId: calendarId,
            eventId: eventId,
            resource: event,
            sendUpdates: 'all'
        });
        if (response['status'] == 200 && response['statusText'] === 'OK') {
            return response.data;
        }
        else{
            throw new Error(response['statusText']);
        }
    } catch (error) {
        console.log(`Error at updateAttendences --> ${error}`);
        return 0;
    }
};


const addingUserAsAttandees = async (eventId, id) =>{
    const eventDeatils = await eventGet(eventId);
    const attendees = (eventDeatils && eventDeatils.data.attendees) ? eventDeatils.data.attendees : [];
    const user = await User.findOne({
        where: { id },
        attributes: ['firstName', 'lastName', 'email','userName'],
    });
    if (user) {
        attendees.push({
            displayName: `${user.userName}`,
            email: user.email,
            responseStatus: 'accepted',
        });
    }
    await updateAttendences(eventId, attendees);
    return 1;
};

const eventGet = async (eventId) => {
    try {
        const auth = await authorize();
        if (auth) {
            const response = await calendar.events.get({
                auth,
                calendarId,
                eventId,
            });
            return response;
        }
    } catch (error) {
        console.log(`Error at eventGet --> ${error}`);
        return 0;
    }
};

const RemoveUserFromAttandees = async (id, eventId) => {
    const eventDeatils = await eventGet(eventId);
    let attendees = eventDeatils.data.attendees || [];
    const user = await User.findOne({
        where: { id },
        attributes: ['firstName', 'lastName', 'email','userName'],
    });
    if (attendees.length > 0) {
        attendees = _.filter(attendees, (member) => member.email !== user.email);
    }
    await  updateAttendences (eventId, attendees);
    return 1;
};
module.exports = {
    authorize,
    insertEvent,
    updateEvent,
    deleteEvent,
    updateAttendences,
    addingUserAsAttandees,
    eventGet,
    RemoveUserFromAttandees

};
