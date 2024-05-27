const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const contactController = require('../controllers/contactController');
const contactService = require('../utils/services');

router.route('/login')
  .get(authController.renderLoginForm)
  
router.route('/register')
  .get(authController.renderRegisterForm)

router.get('/', async (req, res) => {
  const contacts = await contactService.getContacts(req.user._id);
  //console.log(contacts)
  res.render('index', {contacts});
});

router.route('/kontak/:id')
  .get(contactController.renderEditContactForm);

module.exports = router;