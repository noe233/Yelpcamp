const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const users = require('../controllers/users');


router.route('/register')
    .get(users.renderRegisForm)
    .post(catchAsync(users.createNewUser))

router.route('/login')
    .get(users.renderLogIn)
    .post(passport.authenticate('local', {failureFlash: true, failureRedirect:'/login'}),  users.logIn)

router.get('/logout', users.logOut)

module.exports = router;
