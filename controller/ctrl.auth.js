// Imports
const { validationResult } = require('express-validator');

// Helper
const helperFunc = require('../helper/helper');

// JWT Helper
const jwtHelperFunc = require('../helper/jwthelper');

// Model
const UserModel = require('../models/User');
const TokenModel = require('../models/Token');

// Redis
const redisClient = require('../config/redis');

// Registration Controller
exports.postRegister = async (req, res, next) => {
    // Check for Form field errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
    }
    // Check if email exists
    UserModel.findOne({ email: req.body.email })
        .then(user => {
                if(user === null) {
                    // Hash password
                    req.body.password = helperFunc.hashPassword(req.body.password);
                    // Create a new user
                    helperFunc.createUser(req, res);
                }
                else {
                    res.status(409).json({ message: 'User already exists!' });
                }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: 'Server Error..' });
        });
};

// Profile Verification
exports.postVerify = (req, res, next) => {
    // Find a matching token
    TokenModel.findOne({
        token: req.body.token
        }, (err, token) => {
        console.log(token);
        if (!token) return res.status(400).send({
            type: 'not-verified',
            msg: 'We were unable to find a valid token. Your token may have expired.'
        });

        // If we found a token, find a matching user
        UserModel.findOne({ _id: token._userId}, function (err, user) {
            if (!user) return res.status(400).send({
                msg: 'We were unable to find a user for this token.'
            });
            if (user.active) return res.status(400).send({
                type: 'already-verified', msg: 'This user has already been verified.'
            });

            // Verify and save the user
            user.active = true;
            user.save(function (err) {
                if (err) {
                    return res.status(500).send({
                        msg: err.message
                    });
                }
                res.status(200).send("The account has been verified. Please log in.");
            });
        });
    });
}

// Login Controller
exports.postLogin = (req, res, next) => {

    // Check for Form field errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    UserModel.findOne({ email: req.body.email })
        .then(user => {
            if(user !== null && user.active) {
                // Compare password
                const result = helperFunc.comparePassword(user, req.body.password);
                if(result) {
                    const token = jwtHelperFunc.createJWT(user);
                    res.cookie('auth-token', token, {
                        expires: new Date(Date.now() + 900),
                        secure: false,
                        httpOnly: true
                    });
                    res.json({
                        message: 'You have successfully logged in!',
                        token: token,
                        expiresIn: 3600
                    });

                } else {
                    res.json({ message: 'Password is incorrect.' });
                }
            } else {
                res.json({ message: 'You do not have an account yet. Please register.' });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: 'Server Error..' });
        });
};

exports.postLogout = (req, res, next) => {
    const token = req.cookies['auth-token'];
    redisClient.hmset(token, {
        'email' : req.email
    }, (err, result) => {
        if(err) {
            console.log(err);
            return res.json({ message: 'Server error..'});
        }
        console.log(result);
        res.json({ message: 'You are logged out!' });
    });
}
