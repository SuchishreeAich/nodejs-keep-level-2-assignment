const jwt = require('jsonwebtoken');
const {authConfig}  = require('../../../config').appConfig;

const signToken = (payload, secret, expireIn, callback) => {
    const expiresIn = {expiresIn:expireIn};
    jwt.sign(payload, secret, expiresIn, callback);
}

const verifyToken = (token, secret, callback) => {
    //jwt.verify(token, secret, callback);

    jwt.verify(token, secret, (error, decoded) => {
        let errMsg;
        if(error) {
            //res.status(403).send('invalid token');
            errMsg = 'invalid token';
        } 
            
        callback(errMsg, decoded);
        
    });
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
                if(err.name === 'TokenExpiredError'){
                    res.status(403).send('Expired Token');
                }
                else if(err.message.includes('invalid')){

                    res.status(403).send('invalid token');
                }
                else if(err.message){
                    res.status(403).send(err.message);
                } else {
                    res.status(403).send(err);
                }          
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