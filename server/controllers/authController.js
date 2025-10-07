const userService = require('../data/users');
const authMiddleware = require('../middleware/authMiddleware');

const authController = {
  // User registration
  register: async (req, res) => {
    try {
      const { email, password, name, rollNumber, branch, contactInfo } = req.body;

      // Validation
      if (!email || !password || !name || !rollNumber || !branch || !contactInfo) {
        return res.status(400).json({
          success: false,
          message: 'All fields are required'
        });
      }

      // Check if user already exists
      const existingUser = await userService.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User with this email already exists'
        });
      }

      // Check if roll number already exists
      const existingRollNumber = await userService.findByRollNumber(rollNumber);
      if (existingRollNumber) {
        return res.status(400).json({
          success: false,
          message: 'User with this roll number already exists'
        });
      }

      // Create new user
      const newUser = await userService.create({
        email,
        password,
        name,
        rollNumber,
        branch,
        contactInfo
      });

      // Generate token
      const token = authMiddleware.generateToken(newUser);

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        token,
        user: {
          id: newUser._id,
          email: newUser.email,
          name: newUser.name,
          rollNumber: newUser.rollNumber,
          branch: newUser.branch,
          contactInfo: newUser.contactInfo
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        success: false,
        message: 'Error registering user'
      });
    }
  },

  // User login
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Validation
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required'
        });
      }

      // Find user
      const user = await userService.findByEmail(email);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      // Validate password
      const isValidPassword = await user.comparePassword(password);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      // Generate token
      const token = authMiddleware.generateToken(user);

      res.json({
        success: true,
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          rollNumber: user.rollNumber,
          branch: user.branch,
          contactInfo: user.contactInfo,
          activeClaims: user.activeClaims
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Error during login'
      });
    }
  },

  // Get user profile
  getProfile: async (req, res) => {
    try {
      const user = await userService.findById(req.user.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Remove password from response
      const { password, ...userProfile } = user.toObject();

      res.json({
        success: true,
        user: userProfile
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching profile'
      });
    }
  },

  // Update user profile
  updateProfile: async (req, res) => {
    try {
      const { name, branch, contactInfo } = req.body;
      const user = await userService.findById(req.user.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Update user data
      const updateData = {};
      if (name) updateData.name = name;
      if (branch) updateData.branch = branch;
      if (contactInfo) updateData.contactInfo = contactInfo;

      const updatedUser = await userService.update(req.user.id, updateData);

      // Remove password from response
      const { password, ...userProfile } = updatedUser.toObject();

      res.json({
        success: true,
        message: 'Profile updated successfully',
        user: userProfile
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating profile'
      });
    }
  },

  // Logout (client-side token removal)
  logout: (req, res) => {
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  },

  // Verify token
  verifyToken: async (req, res) => {
    try {
      const user = await userService.findById(req.user.id);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid token'
        });
      }

      // Remove password from response
      const { password, ...userProfile } = user.toObject();

      res.json({
        success: true,
        user: userProfile
      });
    } catch (error) {
      console.error('Token verification error:', error);
      res.status(500).json({
        success: false,
        message: 'Error verifying token'
      });
    }
  },

  // Change password
  changePassword: async (req, res) => {
    try {
      const user = await userService.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      
      const { oldPassword, newPassword } = req.body;
      if (!oldPassword || !newPassword) {
        return res.status(400).json({ success: false, message: 'Both old and new passwords are required' });
      }
      
      const isValid = await user.comparePassword(oldPassword);
      if (!isValid) {
        return res.status(401).json({ success: false, message: 'Old password is incorrect' });
      }
      
      await userService.update(req.user.id, { password: newPassword });
      res.json({ success: true, message: 'Password changed successfully' });
    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({ success: false, message: 'Error changing password' });
    }
  },

  // Get demo credentials
  getDemoCredentials: (req, res) => {
    res.json({
      success: true,
      demoAccounts: [
        {
          email: 'john.doe@university.edu',
          password: 'password',
          name: 'John Doe',
          branch: 'Computer Science',
          rollNumber: 'CS001',
          contactInfo: 'john.doe@university.edu'
        },
        {
          email: 'jane.smith@university.edu',
          password: 'password',
          name: 'Jane Smith',
          branch: 'Engineering',
          rollNumber: 'EN001',
          contactInfo: 'jane.smith@university.edu'
        }
      ]
    });
  }
};

module.exports = authController; 