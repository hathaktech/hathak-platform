// middleware/hybridAuthMiddleware.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Admin from '../models/Admin.js';

// ------------------ HYBRID AUTH MIDDLEWARE ------------------
// This middleware can handle both regular user tokens and admin tokens
export const hybridAuthMiddleware = async (req, res, next) => {
  let token;

  // Check for Bearer token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Check if this is an admin token
      if (decoded.type === 'admin') {
        // Handle admin token
        req.admin = await Admin.findById(decoded.id).select('-password');
        if (!req.admin) {
          return res.status(401).json({ message: 'Admin not found' });
        }
        if (!req.admin.isActive) {
          return res.status(403).json({ message: 'Admin account is deactivated' });
        }
        // Set user for compatibility with existing code
        req.user = {
          _id: req.admin._id,
          name: req.admin.name,
          email: req.admin.email,
          role: req.admin.role,
          permissions: req.admin.permissions
        };
      } else {
        // Handle regular user token
        req.user = await User.findById(decoded.id).select('-password');
        if (!req.user) {
          return res.status(401).json({ message: 'User not found' });
        }
      }

      next();
    } catch (error) {
      console.error('Hybrid auth error:', error);
      
      // Handle specific JWT errors
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          message: 'Token expired, please login again',
          code: 'TOKEN_EXPIRED'
        });
      } else if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ 
          message: 'Invalid token, please login again',
          code: 'INVALID_TOKEN'
        });
      } else if (error.name === 'NotBeforeError') {
        return res.status(401).json({ 
          message: 'Token not active yet',
          code: 'TOKEN_NOT_ACTIVE'
        });
      }
      
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  // If no token
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// ------------------ ADMIN ROLE CHECK ------------------
export const requireAdminRole = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  // Check if user has admin role (either from User model or Admin model)
  if (req.user.role === 'admin') {
    return next();
  }

  return res.status(403).json({ message: 'Forbidden: Admin role required' });
};

export default hybridAuthMiddleware;
