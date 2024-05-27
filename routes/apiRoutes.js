const express = require('express');
const catchAsync = require('../utils/catchAsync');
const router = express.Router();
const contactController = require('../controllers/contactController')
const {isLoggedIn} = require('../utils/middleware');

router.route('/contact')
    .post(isLoggedIn,catchAsync(contactController.createNewContact))
    .get(isLoggedIn, catchAsync(contactController.getAllContact))

router.route('/contact/:id')
    .delete(isLoggedIn, catchAsync(contactController.deleteContactById))
    .put(isLoggedIn, catchAsync(contactController.editKontak))

module.exports = router;