// middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// ------------------ PROTECT ROUTES ------------------
export const authMiddleware = async (req, res, next) => {
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

      // Attach user to request, excluding password
      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      console.error('Auth error:', error);
      
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

// ------------------ ADMIN ROUTE PROTECTION ------------------
export const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: 'Forbidden: Admins only' });
  }
};

export default authMiddleware;
