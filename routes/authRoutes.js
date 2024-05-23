const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require('../utils/catchAsync');
const authController = require('../controllers/authController')
const passport = require('passport');
const {storeReturnTo, handleAuthFailure} = require('../utils/middleware')



router.route('/login')
    .get(authController.renderLoginForm)
    .post(storeReturnTo, (req, res, next) => {
        passport.authenticate('local', handleAuthFailure(req, res, next))(req, res, next);
    }, authController.loginUser);

router.route('/register')
    .get(authController.loginUser)
    .post(catchAsync(authController.registerUser))

router.route('/logout')
    .get(authController.logoutUser)

module.exports = router;