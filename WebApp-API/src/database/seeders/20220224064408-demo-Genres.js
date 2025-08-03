'use strict';

module.exports = {
    up: async(queryInterface) => {
        const genres = [
            {name:'Blues',thumbnail:'https://ur-stage.s3.amazonaws.com/genres/Group+36019.png'},
            {name:'Rock Music',thumbnail:'https://ur-stage.s3.amazonaws.com/genres/Group+36020.png'},
            {name:'Pop',thumbnail:'https://ur-stage.s3.amazonaws.com/genres/Group+36021.png'},
            {name:'Jazz',thumbnail:'https://ur-stage.s3.amazonaws.com/genres/Group+36022.png'},
            {name:'Classical',thumbnail:'https://ur-stage.s3.amazonaws.com/genres/Group+36023.png'},
            {name:'Country',thumbnail:'https://ur-stage.s3.amazonaws.com/genres/Group+36024.png'},
            {name:'Dubstep',thumbnail:'https://ur-stage.s3.amazonaws.com/genres/Group+36025.png'},
            {name:'Electronic',thumbnail:'https://ur-stage.s3.amazonaws.com/genres/Group+36026.png'},
            {name:'Rock',thumbnail:'https://ur-stage.s3.amazonaws.com/genres/Group+36027.png'},
            {name:'Techno',thumbnail:'https://ur-stage.s3.amazonaws.com/genres/Group+36028.png'},
            {name:'Industrial',thumbnail:'https://ur-stage.s3.amazonaws.com/genres/Group+36029.png'},
            {name:'Hip Hop',thumbnail:'https://ur-stage.s3.amazonaws.com/genres/Group+36030.png'},
            {name:'Down Tempo',thumbnail:'https://ur-stage.s3.amazonaws.com/genres/Group+36031.png'},
            {name:'Wave',thumbnail:'https://ur-stage.s3.amazonaws.com/genres/Group+36032.png'},
            {name:'HardCore',thumbnail:'https://ur-stage.s3.amazonaws.com/genres/Group+36033.png'},
            {name:'BreakBeat',thumbnail:'https://ur-stage.s3.amazonaws.com/genres/Group+36020.png'},
            {name:'Open Mic',thumbnail:'https://ur-stage.s3.amazonaws.com/genres/Group+36021.png'},
            {name:'Trance',thumbnail:'https://ur-stage.s3.amazonaws.com/genres/Group+36022.png'},
            {name:'Rap',thumbnail:'https://ur-stage.s3.amazonaws.com/genres/Group+36023.png'},
            {name:'R&B',thumbnail:'https://ur-stage.s3.amazonaws.com/genres/Group+36024.png'},
            {name:'Punk',thumbnail:'https://ur-stage.s3.amazonaws.com/genres/Group+36025.png'},
            {name:'Contemporary',thumbnail:'https://ur-stage.s3.amazonaws.com/genres/Group+36026.png'},
            {name:'Drum and Bass',thumbnail:'https://ur-stage.s3.amazonaws.com/genres/Group+36027.png'}].map((genre,i) => ({
            id: i+1,
            name:genre.name,
            thumbnail:genre.thumbnail,
            createdAt: new Date(),
            updatedAt: new Date(),

        }));
        await queryInterface.bulkInsert('Genres', genres, {ignoreDuplicates: ['name','updatedAt']}); 
    },
    down: async(queryInterface) => {
        await queryInterface.bulkDelete('Genres', null, {});
   
    }
};

