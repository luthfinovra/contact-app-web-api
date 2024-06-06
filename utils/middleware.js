const ExpressError = require('../utils/ExpressError');
const jwt = require('jsonwebtoken');

const isLoggedIn = (req, res, next) => {
  //authenticate using session
  if (req.isAuthenticated()) {
    return next();
  }
  
  //authenticate JWT
  if (req.headers['authorization'] && req.headers['authorization'].startsWith('Bearer ')) {
    const token = req.headers['authorization'].split(' ')[1];
    //console.log(token);
    try {
        const decoded = jwt.verify(token, 'your_jwt_secret' || process.env.JWT_SECRET);
        req.user = decoded;
        return next();
    } catch (error) {
        return res.status(401).json({error: true, message: 'Invalid token' });
    }
  }

  req.session.returnTo = req.originalUrl;
  req.flash('error', 'Please login');
  if(req.accepts('html')){
    return res.redirect('/login');
  }

  return res.status(401).json({error:true, message: 'Please Login!'})
}

const storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

const handleAuthFailure = (req, res, next) => {
  return (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      if (req.accepts('html')) {
        req.flash('error', info.message);
        return res.redirect('/login');
      } else if (req.accepts('json')) {
        return res.status(401).json({error:true, message: info.message });
      }
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      next();
    });
  };
};


module.exports = {
    isLoggedIn,
    storeReturnTo,
    handleAuthFailure
}