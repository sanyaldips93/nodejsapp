// Imports
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

// Controller import
const authController = require('../controller/ctrl.auth');

// Middleware
const ensureAuth = require('../middleware/ensureAuth')

router.post('/register', ensureAuth.checkCookieLogReg, [
    body('firstName')
        .isLength({min: 3})
        .withMessage('Please enter full name!'),
    body('email')
        .isEmail()
        .withMessage('Please enter valid email!'),
    body('password')
        .isLength({min: 6})
        .withMessage('Please enter password of length more than 6!'),
    body('confirmPassword')
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Passwords have to match!');
        }
        return true;
      })
    ],
    authController.postRegister);

router.post('/verifyEmail', ensureAuth.checkCookieLogReg, [
        body('token')
        .not().isEmpty()
        .withMessage('There must be a token to validate.')
    ],
    authController.postVerify);

router.post('/login', ensureAuth.checkCookieLogReg, [
        body('email')
        .isEmail()
        .withMessage('Please enter valid email!'),
    body('password')
        .isLength({min: 6})
        .withMessage('Please enter valid password')
    ],
     authController.postLogin);

router.post('/logout', ensureAuth.checkCookieLogout, authController.postLogout);

module.exports = router;
