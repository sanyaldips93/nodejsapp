// Imports
const express = require('express');
const router = express.Router();

// Controller import
const publicController = require('../controller/ctrl.public');

// Middleware
const ensureAuth = require('../middleware/ensureAuth');

router.get('/', publicController.getHome);

router.get('/news', ensureAuth.checkCookieVerify, publicController.getNews);

module.exports = router;
