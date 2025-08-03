const jwt = require('jsonwebtoken');
const config = require('../config/index');

const generateAccessToken = (payload) => {
    return jwt.sign(payload, config.jwt.ACCESS_TOKEN, {
        expiresIn: config.jwt.ACCESS_TOKEN_EXPIRES_IN || undefined,
    });
};

const generateRefreshToken = (payload) => {
    return jwt.sign(payload, config.jwt.REFRESH_TOKEN, {
        expiresIn: config.jwt.REFRESH_TOKEN_EXPIRES_IN,
    });
};
module.exports = {
    generateAccessToken,
    generateRefreshToken,
};
