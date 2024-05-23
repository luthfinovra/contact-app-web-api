const express = require('express');
const catchAsync = require('../utils/catchAsync');
const router = express.Router();
const contactController = require('../controllers/contactController')

router.route('/contact')
    .post(catchAsync(contactController.createNewContact))

module.exports = router;