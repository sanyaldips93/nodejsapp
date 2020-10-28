// JWT Helper
const jwtHelper = require('../helper/jwthelper');

// Redis
const redisClient = require('../config/redis');

// Middleware to verify JWT on register and login
exports.checkCookieLogReg = (req, res, next) => {
    const token = req.cookies['auth-token'] || '';

    if(!token) {
        next();
    }
    else {
        jwtHelper.verifyJWT(token)
           .then(result => {
                // Check token in blacklist
                redisClient.hgetall(token, (err, obj) => {
                    console.log(obj);
                    if(obj) {
                       next();
                    } else {
                        return res.json({ message: 'You are already logged in!' });
                    }
                })
           })
           .catch(err => {
                console.log(err);
                next();
           });
    }
};

// Middleware to verify JWT on logout
exports.checkCookieLogout = (req, res, next) => {
    const token = req.cookies['auth-token'] || '';

    if(!token) {
        return res.json({ message: 'You need to be logged in to be logged out!'});
    }
    else {
        jwtHelper.verifyJWT(token)
            .then(result => {
                // Check token in blacklist
                redisClient.hgetall(token, (err, obj) => {
                    if(obj) return res.json({ message: 'You have been logged already!' });
                    req.email = result.email;
                    next();
                })
            })
            .catch(err => {
                console.log(err);
                return res.json({ message: 'Session expired, please log in..'});
            });
    }
};


// Middleware to verify JWT on public routes
exports.checkCookieVerify = (req, res, next) => {
    const token = req.cookies['auth-token'] || '';

    if(!token) {
        return res.json({ message: 'You have to be logged in to view this!' });
    }
    else {
        jwtHelper.verifyJWT(token)
            .then(result => {
                // Check token in blacklist
                redisClient.hgetall(token, (err, obj) => {
                    console.log(obj);
                    if(obj) {
                        console.log('It reaches here!');
                        return res.status(403).json({ message: 'token is blackListed, pls log in!' });
                    }
                    console.log(err);
                    req.user = {
                        email: result.email,
                        name: result.name
                    };
                    next();
                })
            })
            .catch(err => {
                console.log(err);
                res.json({ message: 'jwt could not be verified!' })
            });
    }
};
