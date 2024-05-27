const express = require('express');
const catchAsync = require('../utils/catchAsync');
const router = express.Router();
const contactController = require('../controllers/contactController')

router.route('/contact')
    .post(catchAsync(contactController.createNewContact))
    .get(catchAsync(contactController.getAllContact))

router.route('/contact/:id')
    .delete(catchAsync(contactController.deleteContactById))
    .put(catchAsync(contactController.editKontak))

module.exports = router;