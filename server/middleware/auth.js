const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { errorResponse } = require('../utils/apiResponse');

const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return errorResponse(res, 'Not authorized, please log in', 401);
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'super_secret_mehndi_zone_jwt_token_key_2026_secure'
    );
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return errorResponse(res, 'User no longer exists', 401);
    }
    req.user = user;
    next();
  } catch (error) {
    return errorResponse(res, 'Invalid or expired token', 401);
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'ADMIN') {
    next();
  } else {
    return errorResponse(res, 'Access denied. Administrator privileges required.', 403);
  }
};

const optionalAuth = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'super_secret_mehndi_zone_jwt_token_key_2026_secure'
    );
    req.user = await User.findById(decoded.id).select('-password');
  } catch (err) {
    // If token is invalid, continue as unauthenticated guest
    req.user = null;
  }
  next();
};

module.exports = {
  protect,
  adminOnly,
  optionalAuth,
};
