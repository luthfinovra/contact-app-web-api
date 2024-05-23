const User = require('../models/user');
const jwt = require('jsonwebtoken');

const generateToken = user => {
    return jwt.sign({ id: user._id, username: user.username }, 'your_jwt_secret', { expiresIn: '1h' });
};

module.exports.renderLoginForm = (req, res) => {
    res.render('auth/loginView')
  }
  
module.exports.renderRegisterForm = (req, res) => {
    res.render('auth/registerView')
}

module.exports.registerUser = async (req, res) => {
    try{
        const {email, username, password} = req.body;
        const user = new User({email, username});
        const registredUser = await User.register(user, password);
        req.login(registredUser, err =>{
            if(err) return next(err);
            const token = generateToken(registeredUser);

            if (req.accepts('html')) {
                req.flash('success', 'Successfully Registered!');
                res.redirect('/');
            } else if (req.accepts('json')) {
                res.json({ message: 'Successfully Registered!', token });
            }
        })
    }catch(err){
        if (req.accepts('html')) {
            req.flash('error', err.message);
            res.redirect('/register');
        } else if (req.accepts('json')) {
            res.status(400).json({ error: err.message });
        }
    }
}

module.exports.loginUser = async (req, res) => {
    const token = generateToken(req.user);

    if (req.accepts('html')) {
      req.flash('success', 'Welcome back!');
      const redirectUrl = req.session.returnTo || '/';
      delete req.session.returnTo;
      res.redirect(redirectUrl);
    } else if (req.accepts('json')) {
      res.json({ message: 'Welcome back!', token });
    }
}

module.exports.logoutUser = (req, res) => {
    req.logout(function(err) {
        if (err) {
          return next(err);
        }
        if (req.accepts('html')) {
          req.flash('success', 'Goodbye');
          res.redirect('/login');
        } else if (req.accepts('json')) {
          res.json({ message: 'Logged out successfully' });
        } else {
          res.status(400).send('Unsupported request type');
        }
      });
}

