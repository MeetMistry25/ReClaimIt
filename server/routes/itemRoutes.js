const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname.replace(/\s+/g, '_'));
  }
});
const upload = multer({ storage });

// Lost Items
router.post('/lost', authMiddleware.verifyToken, authMiddleware.verifyUser, upload.single('image'), itemController.createLostItem);
router.get('/lost', itemController.getLostItems);
router.get('/lost/:id', itemController.getLostItem);
router.put('/lost/:id', authMiddleware.verifyToken, authMiddleware.verifyUser, itemController.updateLostItem);
router.delete('/lost/:id', authMiddleware.verifyToken, authMiddleware.verifyUser, itemController.deleteLostItem);

// Found Items
router.post('/found', authMiddleware.verifyToken, authMiddleware.verifyUser, upload.single('image'), itemController.createFoundItem);
router.get('/found', itemController.getFoundItems);
router.get('/found/:id', itemController.getFoundItem);
router.put('/found/:id', authMiddleware.verifyToken, authMiddleware.verifyUser, itemController.updateFoundItem);
router.delete('/found/:id', authMiddleware.verifyToken, authMiddleware.verifyUser, itemController.deleteFoundItem);

// Matching


// Claiming
router.post('/found/:id/claim', authMiddleware.verifyToken, authMiddleware.verifyUser, authMiddleware.checkClaimsLimit, itemController.claimFoundItem);
router.post('/claim/resolve', authMiddleware.verifyToken, authMiddleware.verifyUser, itemController.resolveClaim);

// Categories
router.get('/categories', itemController.getCategories);
router.post('/categories/suggest', itemController.suggestCategory);

// Search
router.get('/search', itemController.searchItems);

module.exports = router;