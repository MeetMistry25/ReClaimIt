const express = require('express');
const router = express.Router();
const claimController = require('../controllers/claimController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// User routes
router.post('/submit', authMiddleware.verifyToken, authMiddleware.verifyUser, claimController.submitClaim);
router.get('/user', authMiddleware.verifyToken, authMiddleware.verifyUser, claimController.getUserClaims);

// Admin routes
router.get('/all', authMiddleware.verifyToken, adminMiddleware.verifyAdmin, claimController.getAllClaims);
router.get('/status/:status', authMiddleware.verifyToken, adminMiddleware.verifyAdmin, claimController.getClaimsByStatus);
router.delete('/:claimId', authMiddleware.verifyToken, adminMiddleware.verifyAdmin, claimController.deleteClaim);
router.get('/:claimId', authMiddleware.verifyToken, authMiddleware.verifyUser, claimController.getClaimDetails);
router.put('/approve/:claimId', authMiddleware.verifyToken, adminMiddleware.verifyAdmin, claimController.approveClaim);
router.put('/decline/:claimId', authMiddleware.verifyToken, adminMiddleware.verifyAdmin, claimController.declineClaim);

module.exports = router;