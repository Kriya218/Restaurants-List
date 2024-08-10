const express = require('express');
const router = express.Router();

const passport = require('passport');
const LocalStrategy = require('passport-local');

const db = require('../models');
const User = db.User

const root = require('./root');
const restaurants = require('./restaurants');
const users = require('./users')

router.use('/', root);
router.use('/users', users);
router.use('/restaurants', restaurants);

module.exports = router