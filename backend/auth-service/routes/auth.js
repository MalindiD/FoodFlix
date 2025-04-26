// routes/auth.js
const express = require('express');
const router = express.Router();
const { 
  register, 
  login, 
  logout, 
  getMe,
  updateDetails,
  updatePassword,
  deleteAccount,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  verifyUser
} = require('../controllers/auth');

const { protect, authorize } = require('../middleware/auth');
const User = require('../models/User');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);

// Protected routes for all users
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateDetails);
router.put('/updatepassword', protect, updatePassword);
router.delete('/deleteaccount', protect, deleteAccount);

// Admin only routes
router.get('/users', protect, authorize('admin'), getUsers);
// router.get('/users/:id', protect, authorize('admin', 'system'), getUser);
router.get('/users/:id', protect, (req, res, next) => {
  // ✅ Allow service accounts to fetch any user
  if (req.user.service && req.user.role === 'system') {
    return User.findById(req.params.id)
      .then(user => {
        if (!user) return next(new ErrorResponse('User not found', 404));
        res.status(200).json({ success: true, data: user });
      })
      .catch(next);
  }
  
  // Existing authorization check
  authorize('admin', 'system')(req, res, next);
 }, getUser);


router.put('/users/:id', protect, authorize('admin'), updateUser);
router.delete('/users/:id', protect, authorize('admin'), deleteUser);
router.put('/users/:id/verify', protect, authorize('admin'), verifyUser);

module.exports = router;