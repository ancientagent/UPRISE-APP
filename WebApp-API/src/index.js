// Load environment variables FIRST - before any other imports
require('dotenv').config({ path: require('path').resolve(__dirname, '..', '.env') });

const express = require('express');
const Router = require('./routes/index');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const config = require('./config/index');
const path = require('path');
const cors = require('cors');
const logger = require('./utils/logger');
const schedule = require('node-schedule');
const { sendEventPushNotification} = require('./crons/index');
const { promotedSongToState } = require('./crons/songPromotionsToState');
const { updateSongPriorities, cleanupPriorityRecords, initializePriorityRecords } = require('./crons/songPriorityUpdate');
//const { promotedSongToNational } = require('./crons/songPromotedToNational');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cors());

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}, ${JSON.stringify(req.body)}`);
    next();
});

const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'Uprise_Radiyo Swagger',
            description: 'API Documentation',
            license: {
                name: 'Apache 2.0',
                url: 'https://www.apache.org/licenses/LICENSE-2.0.html',
            },
        },
        servers: ['http://localhost:3000'],
        basePath: '/',
    },
    apis: [path.resolve(__dirname, 'routes', '*.js')],
};
const swaggerDocs = swaggerJSDoc(swaggerOptions);

app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(Router);

/**
 * @swagger
 *
 * /ping/:
 *  get:
 *    description: Testing get request
 *    responses:
 *      '200':
 *         description: Returns pong
 */

// Schedule cron jobs
schedule.scheduleJob('0 * * * *', async () => {
    sendEventPushNotification();
});

// Update song priorities every hour
schedule.scheduleJob('0 * * * *', async () => {
    updateSongPriorities();
});

// Clean up priority records daily at 2 AM
schedule.scheduleJob('0 2 * * *', async () => {
    cleanupPriorityRecords();
});

// Initialize priority records for new songs daily at 3 AM
schedule.scheduleJob('0 3 * * *', async () => {
    initializePriorityRecords();
});

schedule.scheduleJob('* * * * *', async () => {
    // promotedSongToState();
    // promotedSongToNational();
    // sendEventPushNotification();
});
const PORT = config.app.PORT || 3000;

// ORM INTERROGATION - TEMPORARY DIAGNOSTIC
const db = require('./database/models');
console.log('--- ORM INTERROGATION ---');
console.log('Sequelize is configured to use this table name:', db.SongPriority.tableName);
console.log('--- END INTERROGATION ---');

app.listen(PORT, '0.0.0.0', () => {
    console.log(`server running at PORT: ${PORT}`);
});
