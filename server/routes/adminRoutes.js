const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const adminMiddleware = require('../middleware/adminMiddleware');

// Admin login (no auth required)
router.post('/login', adminController.adminLogin);

// All other routes require admin authentication
router.use(adminMiddleware.verifyAdmin);

// Dashboard
router.get('/dashboard', adminController.getDashboardStats);

// User management
router.get('/users', adminController.getAllUsers);
router.get('/users/:userId', adminController.getUserDetails);
router.patch('/users/:userId/status', adminController.toggleUserStatus);

// Item management
router.get('/items', adminController.getAllItems);
router.delete('/items/:type/:itemId', adminController.deleteItem);

module.exports = router;
