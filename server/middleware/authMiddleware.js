const jwt = require('jsonwebtoken');
const userService = require('../data/users');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

const authMiddleware = {
  // Verify JWT token
  verifyToken: (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1] || 
                  req.cookies?.token || 
                  req.query.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.'
      });
    }
  },

  // Optional token verification (doesn't fail if no token)
  optionalAuth: (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1] || 
                  req.cookies?.token || 
                  req.query.token;

    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
      } catch (error) {
        // Token is invalid but we don't fail the request
        req.user = null;
      }
    } else {
      req.user = null;
    }
    next();
  },

  // Check if user exists in database
  verifyUser: async (req, res, next) => {
    try {
      const user = await userService.findById(req.user.id);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found.'
        });
      }
      req.currentUser = user;
      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Error verifying user.'
      });
    }
  },

  // Check if user has active claims limit
  checkClaimsLimit: async (req, res, next) => {
    try {
      const user = await userService.findById(req.user.id);
      if (user && user.activeClaims >= 2) {
        return res.status(403).json({
          success: false,
          message: 'You have reached the maximum limit of 2 active claims.'
        });
      }
      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Error checking claims limit.'
      });
    }
  },

  // Generate JWT token
  generateToken: (user) => {
    return jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        name: user.name 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
  },

  // Refresh token
  refreshToken: (req, res) => {
    try {
      const user = userService.findById(req.user.id);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found.'
        });
      }

      const newToken = authMiddleware.generateToken(user);
      res.json({
        success: true,
        token: newToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          studentId: user.studentId,
          department: user.department
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error refreshing token.'
      });
    }
  }
};

module.exports = authMiddleware; 