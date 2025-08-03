const jwt = require('jsonwebtoken');

const config = require('../config/index');
const { User,Roles ,BandMembers,} = require('../database/models/');

const authenticate = async (req, res, next) => {
    try {
        const authorizationHeader = req.headers['authorization'] ||'';
        const token = authorizationHeader && authorizationHeader.split(' ')[1];
        if (!token) {
            throw new Error('Access token is not valid');
        }
        const data = jwt.verify(token, config.jwt.ACCESS_TOKEN);
        if (!data) {
            throw new Error('you dont have access');
        }
        const user = await User.findOne({
            where: {
                id: data.id,
            },
            include: [
                {
                    model: Roles,
                    as: 'role',
                    attributes: ['id', 'name'],
                },
            ],
        });
        if (!user) throw new Error('you dont have access');
        req.user = user;
        next();
    } catch (error) {
        res.status(401).send({ error: 'you dont have Access token' });
    }
};



const clientAuth = (req, res, next) => {
    try {
        const clientId = req.headers['client-id'] || '';
        const clientSecret = req.headers['client-secret'] || '';

        if (!clientId || !clientSecret) {
            throw new Error('you dont have access');
        }
        if (
            config.client.CLIENT_ID !== clientId ||
            config.client.CLIENT_SECRET !== clientSecret
        ) {
            throw new Error('you dont have access');
        }
        next();
    } catch (error) {
        res.status(400).json({ error: 'you dont have access' });
    }
};


const authorize = (roles) => {
    return async (req, res, next) => {
        try {
            const { role,status} = req.user;
            if(status === 'BLOCKED'){
                return  res.status(403).json({message:'You have been blocked'});
            }
            if (roles.length && !roles.includes(role.name)) {
                return res.status(403).json({ message: 'You dont have access to perform an action' });
            }
            next();
        } catch (error) {
            res.status(401).json({error:error.message});
        }
    };
};

const findAndAttachBand = async (req, res, next) => {
    try {
        const band = await BandMembers.findOne({
            where:{
                userId:req.user.id
            }
        });
        if(!band) throw new Error('band not found');
        req.band = band;
        next();
    } catch (error) {
        res.status(400).json({error:error.message});
    }
};

const canDoBandOperations = async(req,res,next) => {
    try{
        const { bandId } = req.body || req.params;
        if (!bandId) throw new Error('band id is required');
        const role = req.user.role.name;

        if (role === 'admin') {
            const bandMember = await BandMembers.findOne({
                where:{
                    bandId:bandId,
                }
            });
            if(!bandMember) throw new Error('band not found');
            req.bandMember = bandMember;
            return next();
        } 

        const bandMember = await BandMembers.findOne({
            where:{
                userId:req.user.id,
                bandId:bandId
            }
        });
        if(!bandMember) throw new Error('Invalid band member');
        req.bandMember = bandMember;
        return next();
    }
    catch(error){
        return res.status(400).json({error:error.message});
    }
};

const parseBody = (req,next) => {
    // trim every key on req.body
    Object.keys(req.body).forEach(key => {
        req.body[key] = req.body[key].trim();
    });
    next();
};


 
module.exports = {
    authenticate,
    authorize,
    clientAuth,
    findAndAttachBand,
    canDoBandOperations,
    parseBody
};
