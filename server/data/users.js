const User = require('../models/User');

const userService = {
  // Find user by ID
  findById: async (id) => {
    try {
      return await User.findById(id);
    } catch (error) {
      console.error('Error finding user by ID:', error);
      throw error;
    }
  },

  // Find user by email
  findByEmail: async (email) => {
    try {
      return await User.findOne({ email: email.toLowerCase() });
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  },

  // Find user by roll number
  findByRollNumber: async (rollNumber) => {
    try {
      return await User.findOne({ rollNumber });
    } catch (error) {
      console.error('Error finding user by roll number:', error);
      throw error;
    }
  },

  // Create new user
  create: async (userData) => {
    try {
      const user = new User(userData);
      return await user.save();
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  // Update user
  update: async (id, updateData) => {
    try {
      return await User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  // Update active claims
  updateActiveClaims: async (id, activeClaims) => {
    try {
      return await User.findByIdAndUpdate(id, { activeClaims }, { new: true });
    } catch (error) {
      console.error('Error updating active claims:', error);
      throw error;
    }
  },

  // Delete user
  delete: async (id) => {
    try {
      return await User.findByIdAndDelete(id);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  // Count all users
  count: async () => {
    try {
      return await User.countDocuments();
    } catch (error) {
      console.error('Error counting users:', error);
      throw error;
    }
  },

  // Count users by status
  countByStatus: async (status) => {
    try {
      return await User.countDocuments({ status });
    } catch (error) {
      console.error('Error counting users by status:', error);
      throw error;
    }
  },

  // Find all users with pagination and filters
  findAllWithPagination: async ({ skip = 0, limit = 10, search = '', status = '' }) => {
    try {
      let query = {};
      
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { rollNumber: { $regex: search, $options: 'i' } }
        ];
      }
      
      if (status) {
        query.status = status;
      }

      return await User.find(query)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
    } catch (error) {
      console.error('Error finding users with pagination:', error);
      throw error;
    }
  },

  // Count users with filters
  countWithFilters: async ({ search = '', status = '' }) => {
    try {
      let query = {};
      
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { rollNumber: { $regex: search, $options: 'i' } }
        ];
      }
      
      if (status) {
        query.status = status;
      }

      return await User.countDocuments(query);
    } catch (error) {
      console.error('Error counting users with filters:', error);
      throw error;
    }
  }
};

module.exports = userService; 