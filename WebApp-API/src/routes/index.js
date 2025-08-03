const Router = require('express').Router();
const axios = require('axios').default;
require('dotenv').config();

const authRouter = require('./auth');
const userRouter = require('./user');
const adminRouter = require('./admin');
const bandRouter = require('./band');
const songsRouter = require('./song');
const bandInviteRouter = require('./bandinvite');
const eventManagementRouter = require('./eventmanagement');
const bannerRouter =  require('./banner');
const votesRouter = require('./votes');
const radioRouter = require('./radio');
const homeRouter = require('./home');
const statisticRouter = require('./statistics');
const discoveryRouter = require('./discovery');
const songLikesRouter = require('./songLikes');
const onboardingRouter = require('./onboarding');
const communitiesRouter = require('./communities');
const { authenticate, clientAuth ,authorize,} = require('../middlewares/auth');

Router.use('/auth', clientAuth,authRouter);
Router.use('/onboarding', clientAuth, onboardingRouter);
Router.use('/communities', clientAuth, authenticate, communitiesRouter);
Router.use('/user',clientAuth, authenticate, userRouter);
Router.use('/admin',clientAuth,authenticate,authorize(['admin']), adminRouter);
Router.use('/band',clientAuth,authenticate,authorize(['admin','artist','listener']),bandRouter);
Router.use('/song',clientAuth,authenticate,authorize(['admin','artist','listener']),songsRouter);
Router.use('/bandmember',clientAuth,authenticate,authorize(['admin','artist']),bandInviteRouter);
Router.use('/eventmanagement',clientAuth,authenticate,authorize(['admin','artist','listener']),eventManagementRouter);
Router.use('/votes',clientAuth,authenticate,authorize(['admin','listener','artist']),votesRouter);
Router.use('/radio',clientAuth,authenticate,authorize(['admin','listener','artist']),radioRouter);
Router.use('/home',clientAuth,authenticate,authorize(['listener','artist']),homeRouter);
Router.use('/popular',clientAuth,authenticate,authorize(['listener','artist']),statisticRouter);
Router.use('/discovery',clientAuth,authenticate,authorize(['listener','artist']),discoveryRouter);
Router.use('/banner',clientAuth,authenticate,authorize(['artist']),bannerRouter);
Router.use('/song-likes',clientAuth,authenticate,authorize(['admin','listener','artist']),songLikesRouter);

Router.get('/places', async (req, res) => {
    try {
        const pathUrl = req.url.split('?')[1];
        const endpoint = 'https://maps.googleapis.com/maps/api/place/autocomplete/json';
        const finalEndpoint = `${endpoint}?${pathUrl.toString()}`;
        // eslint-disable-next-line
        const { data } = await axios.get(finalEndpoint);
        res.json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * @swagger
 *
 * /ping:
 *  get:
 *    description: Testing get request
 *    responses:
 *      '200':
 *         description: Returns pong
 */
Router.get('/ping', async (req, res) => {
    res.send('pong');
});

Router.use((req, res) => {
    res.status(404).json({ error: 'Not Found' });
});

module.exports = Router;
