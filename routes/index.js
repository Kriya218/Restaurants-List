const express = require('express');
const router = express.Router();

const root = require('./root');
const oauth = require('./oauth')

const restaurants = require('./restaurants');
const users = require('./users')
const authHandler = require('../middlewares/auth-handler')

router.use('/', root);
router.use('/oauth', oauth)
router.use('/users', users);
router.use('/restaurants', authHandler, restaurants);

module.exports = router