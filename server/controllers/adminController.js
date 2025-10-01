const userService = require('../data/users');
const itemService = require('../data/foundItems');
const lostItemService = require('../data/lostItems');
const adminMiddleware = require('../middleware/adminMiddleware');

const adminController = {
  // Admin login
  adminLogin: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required'
        });
      }

      const user = await userService.findByEmail(email);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      if (user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Access denied. Admin privileges required.'
        });
      }

      if (user.status === 'blocked') {
        return res.status(403).json({
          success: false,
          message: 'Account is blocked.'
        });
      }

      const isValidPassword = await user.comparePassword(password);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      const token = adminMiddleware.generateAdminToken(user);

      res.json({
        success: true,
        message: 'Admin login successful',
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Admin login error:', error);
      res.status(500).json({
        success: false,
        message: 'Error during admin login'
      });
    }
  },

  // Get dashboard stats
  getDashboardStats: async (req, res) => {
    try {
      const totalUsers = await userService.count();
      const blockedUsers = await userService.countByStatus('blocked');
      const activeUsers = await userService.countByStatus('active');
      const totalFoundItems = await itemService.count();
      const totalLostItems = await lostItemService.count();
      
      // Get recent activity (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const recentFoundItems = await itemService.countByDate(sevenDaysAgo);
      const recentLostItems = await lostItemService.countByDate(sevenDaysAgo);

      res.json({
        success: true,
        stats: {
          totalUsers,
          blockedUsers,
          activeUsers,
          totalFoundItems,
          totalLostItems,
          recentFoundItems,
          recentLostItems
        }
      });
    } catch (error) {
      console.error('Get dashboard stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching dashboard stats'
      });
    }
  },

  // Get all users with pagination and search
  getAllUsers: async (req, res) => {
    try {
      const { page = 1, limit = 10, search = '', status = '' } = req.query;
      const skip = (page - 1) * limit;

      const users = await userService.findAllWithPagination({
        skip: parseInt(skip),
        limit: parseInt(limit),
        search,
        status
      });

      const totalUsers = await userService.countWithFilters({ search, status });

      res.json({
        success: true,
        users,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalUsers / limit),
          totalUsers,
          limit: parseInt(limit)
        }
      });
    } catch (error) {
      console.error('Get all users error:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching users'
      });
    }
  },

  // Toggle user status (block/unblock)
  toggleUserStatus: async (req, res) => {
    try {
      const { userId } = req.params;
      const { status } = req.body;

      if (!['active', 'blocked'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status. Must be "active" or "blocked"'
        });
      }

      const user = await userService.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      if (user.role === 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Cannot modify admin accounts'
        });
      }

      const updatedUser = await userService.update(userId, { status });

      res.json({
        success: true,
        message: `User ${status === 'blocked' ? 'blocked' : 'unblocked'} successfully`,
        user: {
          id: updatedUser._id,
          email: updatedUser.email,
          name: updatedUser.name,
          status: updatedUser.status
        }
      });
    } catch (error) {
      console.error('Toggle user status error:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating user status'
      });
    }
  },

  // Get all items (found and lost)
  getAllItems: async (req, res) => {
    try {
      const { page = 1, limit = 10, type = 'all', search = '' } = req.query;
      const skip = (page - 1) * limit;

      let items = [];
      let totalItems = 0;

      if (type === 'found' || type === 'all') {
        const foundItems = await itemService.findAllWithPagination({
          skip: parseInt(skip),
          limit: parseInt(limit),
          search
        });
        items = [...items, ...foundItems.map(item => ({ ...item.toObject(), type: 'found' }))];
        totalItems += await itemService.countWithFilters({ search });
      }

      if (type === 'lost' || type === 'all') {
        const lostItems = await lostItemService.findAllWithPagination({
          skip: parseInt(skip),
          limit: parseInt(limit),
          search
        });
        items = [...items, ...lostItems.map(item => ({ ...item.toObject(), type: 'lost' }))];
        totalItems += await lostItemService.countWithFilters({ search });
      }

      res.json({
        success: true,
        items,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalItems / limit),
          totalItems,
          limit: parseInt(limit)
        }
      });
    } catch (error) {
      console.error('Get all items error:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching items'
      });
    }
  },

  // Delete item
  deleteItem: async (req, res) => {
    try {
      const { itemId, type } = req.params;

      if (!['found', 'lost'].includes(type)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid item type. Must be "found" or "lost"'
        });
      }

      let deletedItem;
      if (type === 'found') {
        deletedItem = await itemService.deleteById(itemId);
      } else {
        deletedItem = await lostItemService.deleteById(itemId);
      }

      if (!deletedItem) {
        return res.status(404).json({
          success: false,
          message: 'Item not found'
        });
      }

      res.json({
        success: true,
        message: 'Item deleted successfully',
        deletedItem: {
          id: deletedItem._id,
          title: deletedItem.title,
          type
        }
      });
    } catch (error) {
      console.error('Delete item error:', error);
      res.status(500).json({
        success: false,
        message: 'Error deleting item'
      });
    }
  },

  // Get user details
  getUserDetails: async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await userService.findById(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Get user's items
      const foundItems = await itemService.findByUserId(userId);
      const lostItems = await lostItemService.findByUserId(userId);

      const { password, ...userProfile } = user.toObject();

      res.json({
        success: true,
        user: {
          ...userProfile,
          foundItems: foundItems.length,
          lostItems: lostItems.length
        }
      });
    } catch (error) {
      console.error('Get user details error:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching user details'
      });
    }
  }
};

module.exports = adminController;
