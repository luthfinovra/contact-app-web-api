const ExpressError = require('../utils/ExpressError');
const jwt = require('jsonwebtoken');

const isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){ 
        req.session.returnTo = req.originalUrl; 
        req.flash('error', 'Please login');
        return res.redirect('/login');
    }
    next();
}

const storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

const authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Access Denied' });
    }
  
    try {
      const decoded = jwt.verify(token, 'your_jwt_secret');
      req.user = decoded;
      next();
    } catch (error) {
      res.status(400).json({ message: 'Invalid Token' });
    }
  };

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
          return res.status(401).json({ message: info.message });
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
    handleAuthFailure,
    authenticateJWT,
}