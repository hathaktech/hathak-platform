// middleware/adminAuthMiddleware.js
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

// ------------------ PROTECT ADMIN ROUTES ------------------
export const adminAuthMiddleware = async (req, res, next) => {
  let token;

  // Check for Bearer token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token with enhanced options
      const decoded = jwt.verify(token, process.env.JWT_SECRET, {
        issuer: 'hathak-platform',
        audience: 'hathak-users'
      });

      // Check if this is an admin token
      if (decoded.type !== 'admin') {
        return res.status(401).json({ 
          success: false,
          error: {
            type: 'authentication',
            message: 'Not authorized, admin token required',
            statusCode: 401
          }
        });
      }

      // Attach admin to request, excluding password
      req.admin = await Admin.findById(decoded.id).select('-password');

      if (!req.admin) {
        return res.status(401).json({ 
          success: false,
          error: {
            type: 'authentication',
            message: 'Admin not found',
            statusCode: 401
          }
        });
      }

      // Check if admin is active
      if (!req.admin.isActive) {
        return res.status(403).json({ 
          success: false,
          error: {
            type: 'authorization',
            message: 'Admin account is deactivated',
            statusCode: 403
          }
        });
      }

      next();
    } catch (error) {
      console.error('Admin auth error:', error);
      return res.status(401).json({ 
        success: false,
        error: {
          type: 'authentication',
          message: 'Invalid token, please login again',
          statusCode: 401,
          code: 'INVALID_TOKEN'
        }
      });
    }
  }

  // If no token
  if (!token) {
    return res.status(401).json({ 
      success: false,
      error: {
        type: 'authentication',
        message: 'No token provided',
        statusCode: 401
      }
    });
  }
};

// ------------------ ADMIN ROLE PROTECTION ------------------
export const requireAdminRole = (req, res, next) => {
  if (req.admin && req.admin.role === 'admin') {
    return next();
  }
  return res.status(403).json({ message: 'Forbidden: Admin role required' });
};

// ------------------ PERMISSION-BASED MIDDLEWARE ------------------
export const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.admin) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    if (!req.admin.hasPermission(permission)) {
      return res.status(403).json({ 
        message: `Forbidden: ${permission} permission required` 
      });
    }

    next();
  };
};

// ------------------ ROLE-BASED MIDDLEWARE ------------------
export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.admin) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    if (!allowedRoles.includes(req.admin.role)) {
      return res.status(403).json({ 
        message: `Forbidden: ${allowedRoles.join(' or ')} role required` 
      });
    }

    next();
  };
};

// ------------------ CAN MANAGE ADMINS ------------------
export const canManageAdmins = (req, res, next) => {
  if (!req.admin) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  if (!req.admin.canManageAdmins()) {
    return res.status(403).json({ 
      message: 'Forbidden: Cannot manage admin accounts' 
    });
  }

  next();
};

export default adminAuthMiddleware;
