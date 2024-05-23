const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController')

router.route('/login')
  .get(authController.renderLoginForm)
  
router.route('/register')
  .get(authController.renderRegisterForm)

router.get('/', (req, res) => {
  res.render('index');
});

module.exports = router;