const jwt = require('jsonwebtoken');
const {authConfig}  = require('../../../config').appConfig;

const signToken = (payload, secret, expireIn, callback) => {
    const expiresIn = {expiresIn:expireIn};
    jwt.sign(payload, secret, expiresIn, callback);
}

const verifyToken = (token, secret, callback) => {
    jwt.verify(token, secret, callback);
}

const isAuthenticatedUser = (req, res, next) => {

    const authorizationHeader = req.get('Authorization');
    if(!authorizationHeader) {
        res.status(403).send('Not authenticated');
    }
    else{
        const token = authorizationHeader.replace('Bearer ', '');
        verifyToken(token,authConfig.jwtSecret, (err, decoded) => {
            if(err) 
            {
                res.status(403).send(err.message);
            } 
            else {
                req.userId = decoded.userId;
                next();
            }
        });
    }
}

module.exports= {
    signToken,
    verifyToken,
    isAuthenticatedUser
}