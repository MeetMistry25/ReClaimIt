const jwt = require('jsonwebtoken');
const userService = require('../data/users');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

const adminMiddleware = {
  // Verify admin token and role
  verifyAdmin: async (req, res, next) => {
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
      
      // Check if user exists and is admin
      const user = await userService.findById(req.user.id);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found.'
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

      req.currentUser = user;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.'
      });
    }
  },

  // Generate admin JWT token
  generateAdminToken: (user) => {
    return jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        name: user.name,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
  }
};

module.exports = adminMiddleware;
