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
router.get('/users/:id', protect, authorize('admin'), getUser);
router.put('/users/:id', protect, authorize('admin'), updateUser);
router.delete('/users/:id', protect, authorize('admin'), deleteUser);
router.put('/users/:id/verify', protect, authorize('admin'), verifyUser);

module.exports = router;