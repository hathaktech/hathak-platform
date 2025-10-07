// middleware/security.js - Enhanced Security Middleware
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import Admin from '../models/Admin.js';
import User from '../models/User.js';

// Rate limiting configurations
export const createRateLimit = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      error: {
        type: 'rate_limit',
        message: message || 'Too many requests, please try again later',
        statusCode: 429
      }
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json({
        success: false,
        error: {
          type: 'rate_limit',
          message: message || 'Too many requests, please try again later',
          statusCode: 429,
          retryAfter: Math.round(windowMs / 1000)
        }
      });
    }
  });
};

// Specific rate limiters
export const authLimiter = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  5, // 5 attempts
  'Too many authentication attempts, please try again later'
);

export const requestLimiter = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  10, // 10 requests
  'Too many requests, please try again later'
);

export const adminLimiter = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  100, // 100 requests
  'Too many admin requests, please try again later'
);

export const strictLimiter = createRateLimit(
  5 * 60 * 1000, // 5 minutes
  3, // 3 requests
  'Too many requests, please slow down'
);

// Security headers middleware
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: []
    }
  },
  crossOriginEmbedderPolicy: false,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
});

// Enhanced JWT token generation
export const generateSecureToken = (payload, secret, expiresIn) => {
  const token = jwt.sign(payload, secret, {
    expiresIn,
    issuer: 'hathak-platform',
    audience: 'hathak-users'
  });
  
  return token;
};

// Token verification with enhanced security
export const verifyToken = (token, secret) => {
  try {
    const decoded = jwt.verify(token, secret, {
      issuer: 'hathak-platform',
      audience: 'hathak-users'
    });
    return decoded;
  } catch (error) {
    // Preserve the original JWT error for proper handling
    throw error;
  }
};

// Enhanced authentication middleware
export const enhancedAuthMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: {
          type: 'authentication',
          message: 'No token provided',
          statusCode: 401
        }
      });
    }

    const token = authHeader.split(' ')[1];
    
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

    const decoded = verifyToken(token, process.env.JWT_SECRET);
    
    // Check token type
    if (decoded.type === 'admin') {
      const admin = await Admin.findById(decoded.id).select('-password');
      
      if (!admin) {
        return res.status(401).json({
          success: false,
          error: {
            type: 'authentication',
            message: 'Admin not found',
            statusCode: 401
          }
        });
      }

      if (!admin.isActive) {
        return res.status(403).json({
          success: false,
          error: {
            type: 'authorization',
            message: 'Admin account is deactivated',
            statusCode: 403
          }
        });
      }

      req.admin = admin;
      req.user = {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        permissions: admin.permissions,
        type: 'admin'
      };
    } else {
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return res.status(401).json({
          success: false,
          error: {
            type: 'authentication',
            message: 'User not found',
            statusCode: 401
          }
        });
      }

      if (!user.isActive) {
        return res.status(403).json({
          success: false,
          error: {
            type: 'authorization',
            message: 'User account is deactivated',
            statusCode: 403
          }
        });
      }

      req.user = {
        ...user.toObject(),
        type: 'user'
      };
    }

    // Add security context
    req.securityContext = {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      timestamp: new Date(),
      tokenId: decoded.jti || crypto.randomUUID()
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: {
          type: 'authentication',
          message: 'Token expired, please login again',
          statusCode: 401,
          code: 'TOKEN_EXPIRED'
        }
      });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: {
          type: 'authentication',
          message: 'Invalid token, please login again',
          statusCode: 401,
          code: 'INVALID_TOKEN'
        }
      });
    } else if (error.name === 'NotBeforeError') {
      return res.status(401).json({
        success: false,
        error: {
          type: 'authentication',
          message: 'Token not active yet',
          statusCode: 401,
          code: 'TOKEN_NOT_ACTIVE'
        }
      });
    }

    // Log the specific error for debugging
    console.error('Unexpected authentication error:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });

    return res.status(401).json({
      success: false,
      error: {
        type: 'authentication',
        message: `Authentication failed: ${error.message}`,
        statusCode: 401
      }
    });
  }
};

// User authentication middleware
export const requireUser = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: {
        type: 'authentication',
        message: 'User authentication required',
        statusCode: 401
      }
    });
  }
  next();
};

// Admin-only middleware
export const requireAdmin = (req, res, next) => {
  if (!req.admin) {
    return res.status(403).json({
      success: false,
      error: {
        type: 'authorization',
        message: 'Admin access required',
        statusCode: 403
      }
    });
  }
  next();
};

// Permission-based middleware
export const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.admin) {
      return res.status(403).json({
        success: false,
        error: {
          type: 'authorization',
          message: 'Admin access required',
          statusCode: 403
        }
      });
    }

    if (!req.admin.permissions || !req.admin.permissions[permission]) {
      return res.status(403).json({
        success: false,
        error: {
          type: 'authorization',
          message: `Permission '${permission}' required`,
          statusCode: 403
        }
      });
    }

    next();
  };
};

// Role-based middleware
export const requireRole = (roles) => {
  const allowedRoles = Array.isArray(roles) ? roles : [roles];
  
  return (req, res, next) => {
    if (!req.admin) {
      return res.status(403).json({
        success: false,
        error: {
          type: 'authorization',
          message: 'Admin access required',
          statusCode: 403
        }
      });
    }

    if (!allowedRoles.includes(req.admin.role)) {
      return res.status(403).json({
        success: false,
        error: {
          type: 'authorization',
          message: `Role '${req.admin.role}' not authorized`,
          statusCode: 403
        }
      });
    }

    next();
  };
};

// Request logging middleware
export const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      userId: req.user?.id || req.admin?.id,
      userType: req.user?.type || req.admin?.type,
      timestamp: new Date().toISOString()
    };

    // Log based on status code
    if (res.statusCode >= 400) {
      console.error('Request Error:', logData);
    } else if (duration > 1000) {
      console.warn('Slow Request:', logData);
    } else {
      console.log('Request:', logData);
    }
  });

  next();
};

// IP whitelist middleware
export const ipWhitelist = (allowedIPs) => {
  return (req, res, next) => {
    const clientIP = req.ip || req.connection.remoteAddress;
    
    if (!allowedIPs.includes(clientIP)) {
      return res.status(403).json({
        success: false,
        error: {
          type: 'authorization',
          message: 'IP address not allowed',
          statusCode: 403
        }
      });
    }

    next();
  };
};

// CSRF protection middleware
export const csrfProtection = (req, res, next) => {
  // Skip CSRF for GET requests
  if (req.method === 'GET') {
    return next();
  }

  const token = req.headers['x-csrf-token'];
  const sessionToken = req.session?.csrfToken;

  if (!token || !sessionToken || token !== sessionToken) {
    return res.status(403).json({
      success: false,
      error: {
        type: 'authorization',
        message: 'CSRF token mismatch',
        statusCode: 403
      }
    });
  }

  next();
};

// Data sanitization middleware
export const sanitizeData = (req, res, next) => {
  const sanitizeString = (str) => {
    if (typeof str !== 'string') return str;
    return str
      .trim()
      .replace(/[<>]/g, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+=/gi, '');
  };

  const sanitizeObject = (obj) => {
    if (Array.isArray(obj)) {
      return obj.map(sanitizeObject);
    } else if (obj && typeof obj === 'object') {
      const sanitized = {};
      for (const [key, value] of Object.entries(obj)) {
        sanitized[key] = sanitizeObject(value);
      }
      return sanitized;
    } else if (typeof obj === 'string') {
      return sanitizeString(obj);
    }
    return obj;
  };

  if (req.body) {
    req.body = sanitizeObject(req.body);
  }

  if (req.query) {
    req.query = sanitizeObject(req.query);
  }

  next();
};

// Security audit middleware
export const securityAudit = (req, res, next) => {
  const suspiciousPatterns = [
    /script/i,
    /javascript:/i,
    /on\w+=/i,
    /<iframe/i,
    /<object/i,
    /<embed/i,
    /eval\(/i,
    /expression\(/i
  ];

  const checkSuspiciousContent = (data) => {
    const str = JSON.stringify(data);
    return suspiciousPatterns.some(pattern => pattern.test(str));
  };

  if (checkSuspiciousContent(req.body) || checkSuspiciousContent(req.query)) {
    console.warn('Suspicious content detected:', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      url: req.originalUrl,
      method: req.method,
      timestamp: new Date().toISOString()
    });

    return res.status(400).json({
      success: false,
      error: {
        type: 'validation',
        message: 'Suspicious content detected',
        statusCode: 400
      }
    });
  }

  next();
};

export default {
  createRateLimit,
  authLimiter,
  requestLimiter,
  adminLimiter,
  strictLimiter,
  securityHeaders,
  generateSecureToken,
  verifyToken,
  enhancedAuthMiddleware,
  requireAdmin,
  requirePermission,
  requireRole,
  requestLogger,
  ipWhitelist,
  csrfProtection,
  sanitizeData,
  securityAudit
};
