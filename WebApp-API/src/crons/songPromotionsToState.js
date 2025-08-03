/* eslint-disable quotes */
const { Songs } = require('../database/models');
const { Op } = require('sequelize');
const { runQuery } = require('../utils/dbquery');
const fairPlayAlgorithm = require('../utils/fairPlayAlgorithm');
const timeout = parseInt(process.env.UPLOAD_ASSEST_LIBRARY || (6 * 24 * 60 * 60 * 1000), 10);

const promotedSongToState = async () => {
    try {
        console.log('Starting Fair Play tier progression processing...');
        
        // Use the new Fair Play algorithm for tier progression
        await fairPlayAlgorithm.processTierProgression();
        
        console.log('Fair Play tier progression processing completed.');
    }
    catch(error){
        console.log(`error at message`, error);
    }
};

module.exports = { promotedSongToState };
