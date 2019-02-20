const jwt = require('jsonwebtoken');
const authConfig  = require('../../../config').appConfig;

const signToken = (payload, secret, expireIn, callback) => {
    const expiresIn = {expiresIn:expireIn};
    jwt.sign(payload, secret, expiresIn, callback);
}

const verifyToken = (token, secret, callback) => {
    console.log('verifytoken 1');
    jwt.verify(token, secret, callback);
}

const isAuthenticatedUser = (req, res, next) => {

    console.log('isAuthenticatedUser 1');

    const authorizationHeader = req.get('Authorization');
    console.log('isAuthenticatedUser 2' , authorizationHeader);
    if(!authorizationHeader) {
        console.log('isAuthenticatedUser 3');
        res.status(403).send('Not authenticated');
    }
    else{
        const token = authorizationHeader.replace('Bearer ', '');
        console.log('isAuthenticatedUser 4 ',token);
        verifyToken(token,authConfig.jwtSecret, (err, decoded) => {
            if(err) 
            {
                console.log('isAuthenticatedUser 5 ');
                res.status(403).send(err.message);
            } 
            else {
                console.log('isAuthenticatedUser 6 ');
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