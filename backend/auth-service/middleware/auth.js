// middleware/auth.js
const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User'); // Optional: only if you're querying MongoDB for user

// ✅ Middleware to protect routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  // Extract token from Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  // If token missing, throw error
  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  try {
    // ✅ Log the token and secret used for debugging
    console.log('[🔐 JWT TOKEN]', token);
    console.log('[🔐 JWT SECRET USED]', process.env.JWT_SECRET);

    // ✅ Verify and decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('[✅ JWT DECODED]', decoded);

    // Optionally fetch user from DB
    req.user = await User.findById(decoded.id);

    next();
  } catch (err) {
    console.error('[❌ JWT ERROR]', err.message);
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
});

// ✅ Role-based access control
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role ${req.user.role} is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};
