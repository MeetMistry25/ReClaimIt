const LostItem = require('../models/LostItem');

const lostItemsService = {
  // Get all lost items
  getAll: async (filters = {}) => {
    try {
      let query = {};
      
      if (filters.category) {
        query.category = filters.category;
      }
      
      if (filters.placeLost) {
        query.placeLost = { $regex: filters.placeLost, $options: 'i' };
      }
      
      if (filters.dateFrom || filters.dateTo) {
        query.dateLost = {};
        if (filters.dateFrom) {
          query.dateLost.$gte = new Date(filters.dateFrom);
        }
        if (filters.dateTo) {
          query.dateLost.$lte = new Date(filters.dateTo);
        }
      }
      
      if (filters.status) {
        query.status = filters.status;
      }

      // Always filter by isVisible: true to hide approved items
      query.isVisible = true;

      const items = await LostItem.find(query)
        .populate('userId', 'name email rollNumber branch')
        .populate('claimedBy', 'name email rollNumber')
        .sort({ createdAt: -1 });

      return items;
    } catch (error) {
      console.error('Error getting lost items:', error);
      throw error;
    }
  },

  // Get lost item by ID
  getById: async (id) => {
    try {
      return await LostItem.findById(id)
        .populate('userId', 'name email rollNumber branch')
        .populate('claimedBy', 'name email rollNumber');
    } catch (error) {
      console.error('Error getting lost item by ID:', error);
      throw error;
    }
  },

  // Get lost items by user ID
  getByUserId: async (userId) => {
    try {
      return await LostItem.find({ userId })
        .populate('claimedBy', 'name email rollNumber')
        .sort({ createdAt: -1 });
    } catch (error) {
      console.error('Error getting lost items by user ID:', error);
      throw error;
    }
  },

  // Create new lost item
  create: async (itemData) => {
    try {
      const item = new LostItem(itemData);
      return await item.save();
    } catch (error) {
      console.error('Error creating lost item:', error);
      throw error;
    }
  },

  // Update lost item
  update: async (id, updateData) => {
    try {
      return await LostItem.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    } catch (error) {
      console.error('Error updating lost item:', error);
      throw error;
    }
  },

  // Delete lost item
  delete: async (id) => {
    try {
      return await LostItem.findByIdAndDelete(id);
    } catch (error) {
      console.error('Error deleting lost item:', error);
      throw error;
    }
  },

  // Mark item as claimed
  markAsClaimed: async (id, claimedBy) => {
    try {
      return await LostItem.findByIdAndUpdate(id, {
        status: 'claimed',
        claimedBy,
        claimedAt: new Date()
      }, { new: true });
    } catch (error) {
      console.error('Error marking lost item as claimed:', error);
      throw error;
    }
  },

  // Mark item as resolved
  markAsResolved: async (id) => {
    try {
      return await LostItem.findByIdAndUpdate(id, { status: 'resolved' }, { new: true });
    } catch (error) {
      console.error('Error marking lost item as resolved:', error);
      throw error;
    }
  },

  // Get items by category
  getByCategory: async (category) => {
    try {
      return await LostItem.find({ category, status: 'active' })
        .populate('userId', 'name email rollNumber branch')
        .sort({ createdAt: -1 });
    } catch (error) {
      console.error('Error getting lost items by category:', error);
      throw error;
    }
  },

  // Search items by keyword
  search: async (keyword) => {
    try {
      return await LostItem.find({
        $text: { $search: keyword },
        status: 'active',
        isVisible: true
      })
        .populate('userId', 'name email rollNumber branch')
        .sort({ createdAt: -1 });
    } catch (error) {
      console.error('Error searching lost items:', error);
      throw error;
    }
  },

  // Count all lost items
  count: async () => {
    try {
      return await LostItem.countDocuments();
    } catch (error) {
      console.error('Error counting lost items:', error);
      throw error;
    }
  },

  // Count lost items by date
  countByDate: async (date) => {
    try {
      return await LostItem.countDocuments({
        createdAt: { $gte: date }
      });
    } catch (error) {
      console.error('Error counting lost items by date:', error);
      throw error;
    }
  },

  // Find all lost items with pagination and filters
  findAllWithPagination: async ({ skip = 0, limit = 10, search = '' }) => {
    try {
      let query = { isVisible: true };
      
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { category: { $regex: search, $options: 'i' } },
          { placeLost: { $regex: search, $options: 'i' } }
        ];
      }

      return await LostItem.find(query)
        .populate('userId', 'name email rollNumber branch')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
    } catch (error) {
      console.error('Error finding lost items with pagination:', error);
      throw error;
    }
  },

  // Count lost items with filters
  countWithFilters: async ({ search = '' }) => {
    try {
      let query = { isVisible: true };
      
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { placeLost: { $regex: search, $options: 'i' } }
        ];
      }

      return await LostItem.countDocuments(query);
    } catch (error) {
      console.error('Error counting lost items with filters:', error);
      throw error;
    }
  },

  // Find lost items by user ID
  findByUserId: async (userId) => {
    try {
      return await LostItem.find({ userId })
        .sort({ createdAt: -1 });
    } catch (error) {
      console.error('Error finding lost items by user ID:', error);
      throw error;
    }
  },

  // Delete lost item by ID
  deleteById: async (id) => {
    try {
      return await LostItem.findByIdAndDelete(id);
    } catch (error) {
      console.error('Error deleting lost item by ID:', error);
      throw error;
    }
  }
};

module.exports = lostItemsService; 