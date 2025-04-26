const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/async');
const ErrorResponse = require('../utils/errorResponse'); // ✅ Add this


exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log('[JWT DECODED]', decoded); // ✅ add this


    req.user = {
      id: decoded.id,
      role: decoded.role
    };

    // console.log('[TOKEN VERIFIED] User:', req.user); // 👈 Add this

    next();
  } catch (err) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
});


// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    console.log('🔐 [authorize] Required roles:', roles);
    console.log('👤 [authorize] User role from token:', req.user?.role);

    if (!roles.includes(req.user?.role)) {
      return next(
        new ErrorResponse(
          `User role '${req.user?.role}' is not authorized to access this route`,
          403
        )
      );
    }

    next();
  };
};
