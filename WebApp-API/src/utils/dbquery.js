const db = require('../database/models/index');

const runQuery = async (query, config) => {
    return await db.sequelize.query(query, config);
};

module.exports ={ runQuery };