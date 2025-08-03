/* eslint-disable quotes */
'use strict';

module.exports = { 
    up:async(queryInterface)=> {
        const instrumentRecords = [
            { name:'Guitar',url:'https://ur-stage.s3.amazonaws.com/instruments/Instrument_1.png'},
            { name:'Saxophone',url:'https://ur-stage.s3.amazonaws.com/instruments/Instrument_2.png'},
            { name:'Drums', url:'https://ur-stage.s3.amazonaws.com/instruments/Instrument_3.png'},
            { name:'Maracas',url:'https://ur-stage.s3.amazonaws.com/instruments/Instrument_4.png'},
            { name:'Trumpet',url:'https://ur-stage.s3.amazonaws.com/instruments/Instrument_5.png'},
            { name:'Keyboard',url:'https://ur-stage.s3.amazonaws.com/instruments/Instrument_6.png'},
            { name:'Harp',url:'https://ur-stage.s3.amazonaws.com/instruments/Instrument_7.png'},
            { name:'Violin',url:'https://ur-stage.s3.amazonaws.com/instruments/Instrument_8.png'},
            { name:'Mike',url:'https://ur-stage.s3.amazonaws.com/instruments/Instrument_9.png'},
            { name:'Acoustic Guitar',url:'https://ur-stage.s3.amazonaws.com/instruments/Instrument_10.png'},
            { name:'Flute',url:'https://ur-stage.s3.amazonaws.com/instruments/Instrument_11.png'},
            { name:'Xylophone',url:'https://ur-stage.s3.amazonaws.com/instruments/Instrument_12.png'},
            { name:'Piano',url:'https://ur-stage.s3.amazonaws.com/instruments/Instrument_13.png'},
            { name:'Clarinet',url:'https://ur-stage.s3.amazonaws.com/instruments/Instrument_14.png'},
            { name:'Electric Car',url:'https://ur-stage.s3.amazonaws.com/instruments/Instrument_15.png'},
            { name:'Cymbal',url:'https://ur-stage.s3.amazonaws.com/instruments/Instrument_16.png'},
            { name:'Tambourine',url:'https://ur-stage.s3.amazonaws.com/instruments/Instrument_17.png'},
            { name:'Harmonica',url:'https://ur-stage.s3.amazonaws.com/instruments/Instrument_18.png'},
            { name:'Congo',url:'https://ur-stage.s3.amazonaws.com/instruments/Instrument_19.png'},
            { name:'French Horn',url:'https://ur-stage.s3.amazonaws.com/instruments/Instrument_20.png'},
            { name:'Banjo',url:'https://ur-stage.s3.amazonaws.com/instruments/Instrument_21.png'},
            { name:'Drum',url:'https://ur-stage.s3.amazonaws.com/instruments/Instrument_22.png'},
            { name:'Tuba',url:'https://ur-stage.s3.amazonaws.com/instruments/Instrument_23.png'},
            { name:'Accordion',url:'https://ur-stage.s3.amazonaws.com/instruments/Instrument_24.png'},
            { name:'Bongo',url:'https://ur-stage.s3.amazonaws.com/instruments/Instrument_25.png'},
            { name:'Triangle',url:'https://ur-stage.s3.amazonaws.com/instruments/Instrument_26.png'},
            { name:'OUD',url:'https://ur-stage.s3.amazonaws.com/instruments/Instrument_27.png'},
            { name:'Clavicle',url:'https://ur-stage.s3.amazonaws.com/instruments/Instrument_28.png'},
            { name:'Tubular Chimes',url:'https://ur-stage.s3.amazonaws.com/instruments/Instrument_29.png'},
            { name:'Metronome',url:'https://ur-stage.s3.amazonaws.com/instruments/Instrument_30.png'}
        ].map((instrumentRecord,i) => {
            return `(${i+1}, '${instrumentRecord.url}', now(), now(), '${instrumentRecord.name}')`;
        }).join(',');
        const query = ` insert into "Instruments" values ${instrumentRecords}
        on conflict(id) 
        do update 
        set (url,name,"updatedAt") = (EXCLUDED.url,EXCLUDED.name,EXCLUDED."updatedAt"); 
        `;
        await queryInterface.sequelize.query(query);
    },
  
    down: async (queryInterface) => {
        await queryInterface.bulkDelete('Instruments', null, {});
    },
};
 