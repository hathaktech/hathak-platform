// middleware/errorHandler.js - Enhanced Error Handling System
import { validationResult } from 'express-validator';

// Custom error classes
export class AppError extends Error {
  constructor(message, statusCode, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message, field = null) {
    super(message, 400);
    this.field = field;
    this.type = 'validation';
  }
}

export class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed') {
    super(message, 401);
    this.type = 'authentication';
  }
}

export class AuthorizationError extends AppError {
  constructor(message = 'Insufficient permissions') {
    super(message, 403);
    this.type = 'authorization';
  }
}

export class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 404);
    this.type = 'not_found';
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Resource conflict') {
    super(message, 409);
    this.type = 'conflict';
  }
}

export class RateLimitError extends AppError {
  constructor(message = 'Too many requests') {
    super(message, 429);
    this.type = 'rate_limit';
  }
}

// Error response formatter
const formatErrorResponse = (error, req) => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  const baseResponse = {
    success: false,
    error: {
      type: error.type || 'unknown',
      message: error.message,
      statusCode: error.statusCode || 500,
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
      method: req.method
    }
  };

  // Add additional details in development
  if (isDevelopment) {
    baseResponse.error.stack = error.stack;
    baseResponse.error.details = {
      userAgent: req.get('User-Agent'),
      ip: req.ip,
      userId: req.user?.id || req.admin?.id
    };
  }

  // Add validation errors if present
  if (error.errors) {
    baseResponse.error.validation = error.errors;
  }

  // Add field-specific errors
  if (error.field) {
    baseResponse.error.field = error.field;
  }

  return baseResponse;
};

// Main error handler middleware
export const errorHandler = (error, req, res, next) => {
  let err = { ...error };
  err.message = error.message;

  // Log error for monitoring
  console.error('Error occurred:', {
    message: error.message,
    stack: error.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: req.user?.id || req.admin?.id,
    timestamp: new Date().toISOString()
  });

  // Mongoose validation error
  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map(err => ({
      field: err.path,
      message: err.message,
      value: err.value
    }));
    
    err = new ValidationError('Validation failed', errors);
  }

  // Mongoose duplicate key error
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    err = new ConflictError(`${field} already exists`);
  }

  // Mongoose cast error
  if (error.name === 'CastError') {
    err = new ValidationError(`Invalid ${error.path}: ${error.value}`);
  }

  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    err = new AuthenticationError('Invalid token');
  }

  if (error.name === 'TokenExpiredError') {
    err = new AuthenticationError('Token expired');
  }

  // Default to 500 server error
  if (!err.statusCode) {
    err = new AppError('Internal server error', 500, false);
  }

  // Send error response
  const errorResponse = formatErrorResponse(err, req);
  res.status(err.statusCode).json(errorResponse);
};

// Async error wrapper
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Validation error handler
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(error => ({
      field: error.param,
      message: error.msg,
      value: error.value,
      location: error.location
    }));
    
    return next(new ValidationError('Validation failed', formattedErrors));
  }
  
  next();
};

// Not found handler
export const notFoundHandler = (req, res, next) => {
  const error = new NotFoundError(`Route ${req.originalUrl} not found`);
  next(error);
};

// Rate limiting error handler
export const rateLimitHandler = (req, res, next) => {
  const error = new RateLimitError('Too many requests, please try again later');
  next(error);
};

// Database connection error handler
export const dbErrorHandler = (error) => {
  console.error('Database error:', error);
  
  if (error.name === 'MongoNetworkError') {
    console.error('MongoDB network error - check connection');
  } else if (error.name === 'MongoServerError') {
    console.error('MongoDB server error:', error.message);
  } else if (error.name === 'MongoParseError') {
    console.error('MongoDB parse error:', error.message);
  }
};

// Process error handlers
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

export default {
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  RateLimitError,
  errorHandler,
  asyncHandler,
  handleValidationErrors,
  notFoundHandler,
  rateLimitHandler,
  dbErrorHandler
};