const express = require('express');
const router = express.Router();

const passport = require('../config/passport')
const authHandler = require('../middlewares/auth-handler')

const root = require('./root');
const restaurants = require('./restaurants');
const users = require('./users')

router.use('/', root);
router.use('/users', users);
router.use('/restaurants', authHandler, restaurants);

module.exports = router