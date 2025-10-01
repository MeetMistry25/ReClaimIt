const lostItemsService = require('../data/lostItems');
const foundItemsService = require('../data/foundItems');
const categoryClassifier = require('../utils/categoryClassifier');
const cloudinary = require('../config/cloudinary');

const itemController = {
  // Lost Items Controllers
  // Create lost item
  createLostItem: async (req, res) => {
    try {
      const {
        itemName,
        description,
        category,
        placeLost,
        dateLost,
        verificationQuestion,
        verificationAnswer
      } = req.body;

      // Validation
      if (!itemName || !description || !category || !placeLost || !dateLost) {
        return res.status(400).json({
          success: false,
          message: 'All required fields must be provided'
        });
      }

      // Validate category
      if (!categoryClassifier.isValidCategory(category)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid category'
        });
      }

      const baseUrl = process.env.PUBLIC_SERVER_URL || `${req.protocol}://${req.get('host')}`;
      const itemData = {
        userId: req.user.id,
        itemName,
        description,
        category,
        placeLost,
        dateLost,
        imageUrl: req.file ? `${baseUrl}/uploads/${req.file.filename}` : null,
        verificationQuestion: verificationQuestion || 'What is the color of the item?',
        verificationAnswer: verificationAnswer || 'unknown',
        contactInfo: req.currentUser.email
      };

      const newItem = await lostItemsService.create(itemData);

      res.status(201).json({
        success: true,
        message: 'Lost item reported successfully',
        item: newItem
      });
    } catch (error) {
      console.error('Create lost item error:', error);
      res.status(500).json({
        success: false,
        message: 'Error creating lost item'
      });
    }
  },

  // Get all lost items
  getLostItems: async (req, res) => {
    try {
      const filters = {
        category: req.query.category,
        placeLost: req.query.placeLost,
        dateFrom: req.query.dateFrom,
        dateTo: req.query.dateTo,
        status: req.query.status
      };

      const items = await lostItemsService.getAll(filters);

      res.json({
        success: true,
        items,
        count: items.length
      });
    } catch (error) {
      console.error('Get lost items error:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching lost items'
      });
    }
  },

  // Get lost item by ID
  getLostItem: async (req, res) => {
    try {
      const item = await lostItemsService.getById(req.params.id);
      if (!item) {
        return res.status(404).json({
          success: false,
          message: 'Lost item not found'
        });
      }

      res.json({
        success: true,
        item
      });
    } catch (error) {
      console.error('Get lost item error:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching lost item'
      });
    }
  },

  // Update lost item
  updateLostItem: async (req, res) => {
    try {
      const item = await lostItemsService.getById(req.params.id);
      if (!item) {
        return res.status(404).json({
          success: false,
          message: 'Lost item not found'
        });
      }

      // Check if user owns the item
      if (item.userId._id.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this item'
        });
      }

      const updatedItem = await lostItemsService.update(req.params.id, req.body);

      res.json({
        success: true,
        message: 'Lost item updated successfully',
        item: updatedItem
      });
    } catch (error) {
      console.error('Update lost item error:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating lost item'
      });
    }
  },

  // Delete lost item
  deleteLostItem: async (req, res) => {
    try {
      const item = await lostItemsService.getById(req.params.id);
      if (!item) {
        return res.status(404).json({
          success: false,
          message: 'Lost item not found'
        });
      }

      // Check if user owns the item
      if (item.userId._id.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to delete this item'
        });
      }

      await lostItemsService.delete(req.params.id);

      res.json({
        success: true,
        message: 'Lost item deleted successfully'
      });
    } catch (error) {
      console.error('Delete lost item error:', error);
      res.status(500).json({
        success: false,
        message: 'Error deleting lost item'
      });
    }
  },

  // Found Items Controllers
  // Create found item
  createFoundItem: async (req, res) => {
    try {
      const {
        itemName,
        description,
        category,
        placeFound,
        dateFound,
        pickupLocation
      } = req.body;

      // Validation
      if (!itemName || !description || !category || !placeFound || !dateFound) {
        return res.status(400).json({
          success: false,
          message: 'All required fields must be provided'
        });
      }

      // Validate category
      if (!categoryClassifier.isValidCategory(category)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid category'
        });
      }

      const baseUrl = process.env.PUBLIC_SERVER_URL || `${req.protocol}://${req.get('host')}`;
      const itemData = {
        userId: req.user.id,
        itemName,
        description,
        category,
        placeFound,
        dateFound,
        imageUrl: req.file ? `${baseUrl}/uploads/${req.file.filename}` : null,
        contactInfo: req.currentUser.email,
        pickupLocation: pickupLocation || 'Student Center - Lost & Found Office'
      };

      const newItem = await foundItemsService.create(itemData);

      res.status(201).json({
        success: true,
        message: 'Found item reported successfully',
        item: newItem
      });
    } catch (error) {
      console.error('Create found item error:', error);
      res.status(500).json({
        success: false,
        message: 'Error creating found item'
      });
    }
  },

  // Get all found items
  getFoundItems: async (req, res) => {
    try {
      const filters = {
        category: req.query.category,
        placeFound: req.query.placeFound,
        dateFrom: req.query.dateFrom,
        dateTo: req.query.dateTo,
        status: req.query.status
      };

      const items = await foundItemsService.getAll(filters);

      res.json({
        success: true,
        items,
        count: items.length
      });
    } catch (error) {
      console.error('Get found items error:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching found items'
      });
    }
  },

  // Get found item by ID
  getFoundItem: async (req, res) => {
    try {
      const item = await foundItemsService.getById(req.params.id);
      if (!item) {
        return res.status(404).json({
          success: false,
          message: 'Found item not found'
        });
      }

      res.json({
        success: true,
        item
      });
    } catch (error) {
      console.error('Get found item error:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching found item'
      });
    }
  },

  // Update found item
  updateFoundItem: async (req, res) => {
    try {
      const item = await foundItemsService.getById(req.params.id);
      if (!item) {
        return res.status(404).json({
          success: false,
          message: 'Found item not found'
        });
      }

      // Check if user owns the item
      if (item.userId._id.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this item'
        });
      }

      const updatedItem = await foundItemsService.update(req.params.id, req.body);

      res.json({
        success: true,
        message: 'Found item updated successfully',
        item: updatedItem
      });
    } catch (error) {
      console.error('Update found item error:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating found item'
      });
    }
  },

  // Delete found item
  deleteFoundItem: async (req, res) => {
    try {
      const item = await foundItemsService.getById(req.params.id);
      if (!item) {
        return res.status(404).json({
          success: false,
          message: 'Found item not found'
        });
      }

      // Check if user owns the item
      if (item.userId._id.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to delete this item'
        });
      }

      await foundItemsService.delete(req.params.id);

      res.json({
        success: true,
        message: 'Found item deleted successfully'
      });
    } catch (error) {
      console.error('Delete found item error:', error);
      res.status(500).json({
        success: false,
        message: 'Error deleting found item'
      });
    }
  },

  // Matching Controllers
  // Claim Controllers

  // Claim Controllers
  // Claim a found item
  claimFoundItem: async (req, res) => {
    try {
      const { verificationAnswer } = req.body;
      const foundItem = await foundItemsService.getById(req.params.id);

      if (!foundItem) {
        return res.status(404).json({
          success: false,
          message: 'Found item not found'
        });
      }

      if (foundItem.status !== 'active') {
        return res.status(400).json({
          success: false,
          message: 'Item is not available for claiming'
        });
      }

      // Check user's active claims limit
      const user = await userService.findById(req.user.id);
      if (user.activeClaims >= 2) {
        return res.status(403).json({
          success: false,
          message: 'You have reached the maximum limit of 2 active claims'
        });
      }

      // Verify the answer (simplified - in real app, you'd match against lost item)
      if (!verificationAnswer) {
        return res.status(400).json({
          success: false,
          message: 'Verification answer is required'
        });
      }

      // Mark item as claimed
      await foundItemsService.markAsClaimed(req.params.id, req.user.id);

      // Update user's active claims
      await userService.updateActiveClaims(req.user.id, user.activeClaims + 1);

      res.json({
        success: true,
        message: 'Item claimed successfully. Please contact the finder to arrange pickup.',
        item: await foundItemsService.getById(req.params.id)
      });
    } catch (error) {
      console.error('Claim item error:', error);
      res.status(500).json({
        success: false,
        message: 'Error claiming item'
      });
    }
  },

  // Resolve a claim
  resolveClaim: async (req, res) => {
    try {
      const { itemType, itemId } = req.body;
      
      if (itemType === 'lost') {
        const item = await lostItemsService.getById(itemId);
        if (!item || item.userId._id.toString() !== req.user.id) {
          return res.status(403).json({
            success: false,
            message: 'Not authorized to resolve this claim'
          });
        }
        await lostItemsService.markAsResolved(itemId);
      } else {
        const item = await foundItemsService.getById(itemId);
        if (!item || item.userId._id.toString() !== req.user.id) {
          return res.status(403).json({
            success: false,
            message: 'Not authorized to resolve this claim'
          });
        }
        await foundItemsService.markAsResolved(itemId);
      }

      // Update user's active claims
      const user = await userService.findById(req.user.id);
      if (user.activeClaims > 0) {
        await userService.updateActiveClaims(req.user.id, user.activeClaims - 1);
      }

      res.json({
        success: true,
        message: 'Claim resolved successfully'
      });
    } catch (error) {
      console.error('Resolve claim error:', error);
      res.status(500).json({
        success: false,
        message: 'Error resolving claim'
      });
    }
  },

  // Category Controllers
  // Get all categories
  getCategories: async (req, res) => {
    try {
      const categories = categoryClassifier.getAllCategories();
      const stats = await categoryClassifier.getCategoryStats();

      res.json({
        success: true,
        categories,
        stats
      });
    } catch (error) {
      console.error('Get categories error:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching categories'
      });
    }
  },

  // Suggest category
  suggestCategory: async (req, res) => {
    try {
      const { itemName, description } = req.body;
      
      if (!itemName) {
        return res.status(400).json({
          success: false,
          message: 'Item name is required'
        });
      }

      const suggestion = categoryClassifier.suggestCategory(itemName, description || '');

      res.json({
        success: true,
        suggestion
      });
    } catch (error) {
      console.error('Suggest category error:', error);
      res.status(500).json({
        success: false,
        message: 'Error suggesting category'
      });
    }
  },

  // Search items
  searchItems: async (req, res) => {
    try {
      const { keyword, type = 'both' } = req.query;
      
      if (!keyword) {
        return res.status(400).json({
          success: false,
          message: 'Search keyword is required'
        });
      }

      let results = {};

      if (type === 'lost' || type === 'both') {
        results.lostItems = await lostItemsService.search(keyword);
      }

      if (type === 'found' || type === 'both') {
        results.foundItems = await foundItemsService.search(keyword);
      }

      res.json({
        success: true,
        results,
        totalCount: (results.lostItems?.length || 0) + (results.foundItems?.length || 0)
      });
    } catch (error) {
      console.error('Search items error:', error);
      res.status(500).json({
        success: false,
        message: 'Error searching items'
      });
    }
  }
};

module.exports = itemController;