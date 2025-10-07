const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Register
router.post('/register', authController.register);
// Login
router.post('/login', authController.login);
// Get profile
router.get('/profile', authMiddleware.verifyToken, authController.getProfile);
// Update profile
router.put('/profile', authMiddleware.verifyToken, authController.updateProfile);
// Change password
router.put('/change-password', authMiddleware.verifyToken, authController.changePassword);
// Logout (client-side only)
router.post('/logout', authController.logout);
// Verify token
router.get('/verify', authMiddleware.verifyToken, authController.verifyToken);
// Demo credentials
router.get('/demo', authController.getDemoCredentials);
// Refresh token
router.get('/refresh', authMiddleware.verifyToken, authMiddleware.refreshToken);

module.exports = router; 