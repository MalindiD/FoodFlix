// controllers/auth.js
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/async');
const jwt = require('jsonwebtoken');
const admin = require('../config/firebase');



// @desc    Firebase Login
// @route   POST /api/auth/firebase-login
// @access  Public
exports.firebaseLogin = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  // 1. Verify Firebase token
  const decoded = await admin.auth().verifyIdToken(token);
  const { email, name, uid } = decoded;

  // 2. Check if user exists in MongoDB
  let user = await User.findOne({ email });

  if (!user) {
    // If not found, create a new user with Firebase info
    user = await User.create({
      name: name || "New User",
      email,
      password: Math.random().toString(36).slice(-8), // dummy password
      role: "customer",
      isVerified: true
    });
  }

  // 3. Generate JWT from backend
  sendTokenResponse(user, 200, res);
});


// @desc    Register user with Firebase
// @route   POST /api/auth/firebase-register
// @access  Public
exports.firebaseRegister = asyncHandler(async (req, res, next) => {
  const { name, email, role, phone, address, provider } = req.body;

  // Verify if user already exists
  let user = await User.findOne({ email });

  if (user) {
    // If user exists, return the user info
    return res.status(200).json({
      success: true,
      data: user
    });
  }

  // Create user if doesn't exist
  user = await User.create({
    name,
    email,
    password: Math.random().toString(36).slice(-8), // Random password as Firebase handles auth
    role,
    phone,
    address,
    isVerified: true // Firebase users are pre-verified
  });
  
  // Create token
  sendTokenResponse(user, 201, res);
});

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role, phone, address } = req.body;

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role,
    phone,
    address
  });

  // Let the user know if they need approval
  const needsApproval = user.role === 'delivery' || user.role === 'restaurant';
  
  // Create token
  sendTokenResponse(user, 200, res, needsApproval);
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email & password
  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400));
  }

  // Check for user
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  // Check if user is verified (for delivery and restaurant roles)
  if ((user.role === 'delivery' || user.role === 'restaurant') && !user.isVerified) {
    return next(new ErrorResponse('Your account is pending approval by admin', 401));
  }

  sendTokenResponse(user, 200, res);
});

// @desc    Log user out / clear cookie
// @route   GET /api/auth/logout
// @access  Private
exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Update user details
// @route   PUT /api/auth/updatedetails
// @access  Private
exports.updateDetails = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone
  };
  
  // If address is provided, update it
  if (req.body.address) {
    fieldsToUpdate.address = req.body.address;
  }

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  // Check current password
  if (!(await user.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse('Password is incorrect', 401));
  }

  user.password = req.body.newPassword;
  await user.save();

  sendTokenResponse(user, 200, res);
});

// @desc    Delete user account
// @route   DELETE /api/auth/deleteaccount
// @access  Private
exports.deleteAccount = asyncHandler(async (req, res, next) => {
  await User.findByIdAndDelete(req.user.id);

  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Admin - Get all users
// @route   GET /api/auth/users
// @access  Private/Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
  let query;
  
  // If role query param is provided, filter by role
  if (req.query.role) {
    query = User.find({ role: req.query.role });
  } else {
    // By default, get users that need verification
    query = User.find({ role: { $in: ['delivery', 'restaurant'] } });
  }
  
  const users = await query;

  res.status(200).json({
    success: true,
    count: users.length,
    data: users
  });
});

// @desc    Admin - Get single user
// @route   GET /api/auth/users/:id
// @access  Private/Admin
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorResponse(`No user found with id ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Admin - Update user
// @route   PUT /api/auth/users/:id
// @access  Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  let user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorResponse(`No user found with id ${req.params.id}`, 404));
  }

  user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Admin - Delete user
// @route   DELETE /api/auth/users/:id
// @access  Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorResponse(`No user found with id ${req.params.id}`, 404));
  }

  await User.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Admin - Approve/Reject user
// @route   PUT /api/auth/users/:id/verify
// @access  Private/Admin
exports.verifyUser = asyncHandler(async (req, res, next) => {
  const { isVerified } = req.body;
  
  // Make sure user is either restaurant or delivery
  const user = await User.findById(req.params.id);
  
  if (!user) {
    return next(new ErrorResponse(`No user found with id ${req.params.id}`, 404));
  }
  
  if (user.role !== 'delivery' && user.role !== 'restaurant') {
    return next(new ErrorResponse(`Only delivery and restaurant accounts need verification`, 400));
  }
  
  user.isVerified = isVerified;
  await user.save();
  
  res.status(200).json({
    success: true,
    data: user
  });
});

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res, needsApproval = false) => {
  // Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(Date.now() + (process.env.JWT_COOKIE_EXPIRE || 30) * 24 * 60 * 60 * 1000),
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified
      },
      message: needsApproval ? 'Your account requires admin approval before you can log in' : null
    });
};