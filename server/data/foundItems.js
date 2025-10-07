const FoundItem = require('../models/FoundItem');

const foundItemsService = {
  // Get all found items
  getAll: async (filters = {}) => {
    try {
      let query = {};
      
      if (filters.category) {
        query.category = filters.category;
      }
      
      if (filters.placeFound) {
        query.placeFound = { $regex: filters.placeFound, $options: 'i' };
      }
      
      if (filters.dateFrom || filters.dateTo) {
        query.dateFound = {};
        if (filters.dateFrom) {
          query.dateFound.$gte = new Date(filters.dateFrom);
        }
        if (filters.dateTo) {
          query.dateFound.$lte = new Date(filters.dateTo);
        }
      }
      
      if (filters.status) {
        query.status = filters.status;
      }

      // Always filter by isVisible: true to hide approved items
      query.isVisible = true;

      const items = await FoundItem.find(query)
        .populate('userId', 'name email rollNumber branch')
        .populate('claimedBy', 'name email rollNumber')
        .sort({ createdAt: -1 });

      return items;
    } catch (error) {
      console.error('Error getting found items:', error);
      throw error;
    }
  },

  // Get found item by ID
  getById: async (id) => {
    try {
      return await FoundItem.findById(id)
        .populate('userId', 'name email rollNumber branch')
        .populate('claimedBy', 'name email rollNumber');
    } catch (error) {
      console.error('Error getting found item by ID:', error);
      throw error;
    }
  },

  // Get found items by user ID
  getByUserId: async (userId) => {
    try {
      return await FoundItem.find({ userId })
        .populate('claimedBy', 'name email rollNumber')
        .sort({ createdAt: -1 });
    } catch (error) {
      console.error('Error getting found items by user ID:', error);
      throw error;
    }
  },

  // Create new found item
  create: async (itemData) => {
    try {
      const item = new FoundItem(itemData);
      return await item.save();
    } catch (error) {
      console.error('Error creating found item:', error);
      throw error;
    }
  },

  // Update found item
  update: async (id, updateData) => {
    try {
      return await FoundItem.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    } catch (error) {
      console.error('Error updating found item:', error);
      throw error;
    }
  },

  // Delete found item
  delete: async (id) => {
    try {
      return await FoundItem.findByIdAndDelete(id);
    } catch (error) {
      console.error('Error deleting found item:', error);
      throw error;
    }
  },

  // Mark item as claimed
  markAsClaimed: async (id, claimedBy) => {
    try {
      return await FoundItem.findByIdAndUpdate(id, {
        status: 'claimed',
        claimedBy,
        claimedAt: new Date()
      }, { new: true });
    } catch (error) {
      console.error('Error marking found item as claimed:', error);
      throw error;
    }
  },

  // Mark item as resolved
  markAsResolved: async (id) => {
    try {
      return await FoundItem.findByIdAndUpdate(id, { status: 'resolved' }, { new: true });
    } catch (error) {
      console.error('Error marking found item as resolved:', error);
      throw error;
    }
  },

  // Get items by category
  getByCategory: async (category) => {
    try {
      return await FoundItem.find({ category, status: 'active' })
        .populate('userId', 'name email rollNumber branch')
        .sort({ createdAt: -1 });
    } catch (error) {
      console.error('Error getting found items by category:', error);
      throw error;
    }
  },

  // Search items by keyword
  search: async (keyword) => {
    try {
      return await FoundItem.find({
        $text: { $search: keyword },
        status: 'active',
        isVisible: true
      })
        .populate('userId', 'name email rollNumber branch')
        .sort({ createdAt: -1 });
    } catch (error) {
      console.error('Error searching found items:', error);
      throw error;
    }
  },

  // Count all found items
  count: async () => {
    try {
      return await FoundItem.countDocuments();
    } catch (error) {
      console.error('Error counting found items:', error);
      throw error;
    }
  },

  // Count found items by date
  countByDate: async (date) => {
    try {
      return await FoundItem.countDocuments({
        createdAt: { $gte: date }
      });
    } catch (error) {
      console.error('Error counting found items by date:', error);
      throw error;
    }
  },

  // Find all found items with pagination and filters
  findAllWithPagination: async ({ skip = 0, limit = 10, search = '' }) => {
    try {
      let query = { isVisible: true };
      
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { category: { $regex: search, $options: 'i' } },
          { placeFound: { $regex: search, $options: 'i' } }
        ];
      }

      return await FoundItem.find(query)
        .populate('userId', 'name email rollNumber branch')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
    } catch (error) {
      console.error('Error finding found items with pagination:', error);
      throw error;
    }
  },

  // Count found items with filters
  countWithFilters: async ({ search = '' }) => {
    try {
      let query = { isVisible: true };
      
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { category: { $regex: search, $options: 'i' } },
          { placeFound: { $regex: search, $options: 'i' } }
        ];
      }

      return await FoundItem.countDocuments(query);
    } catch (error) {
      console.error('Error counting found items with filters:', error);
      throw error;
    }
  },

  // Find found items by user ID
  findByUserId: async (userId) => {
    try {
      return await FoundItem.find({ userId })
        .sort({ createdAt: -1 });
    } catch (error) {
      console.error('Error finding found items by user ID:', error);
      throw error;
    }
  },

  // Delete found item by ID
  deleteById: async (id) => {
    try {
      return await FoundItem.findByIdAndDelete(id);
    } catch (error) {
      console.error('Error deleting found item by ID:', error);
      throw error;
    }
  }
};

module.exports = foundItemsService; 