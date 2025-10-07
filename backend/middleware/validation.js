// middleware/validation.js - Comprehensive Input Validation
import { body, param, query, validationResult } from 'express-validator';
import { ValidationError } from './errorHandler.js';

// Common validation rules
export const commonValidations = {
  // ObjectId validation
  mongoId: (field = 'id') => 
    param(field)
      .isMongoId()
      .withMessage(`Invalid ${field} format`),

  // Email validation
  email: (field = 'email', required = true) => {
    const validator = body(field)
      .trim()
      .toLowerCase()
      .isEmail()
      .withMessage('Must be a valid email address')
      .normalizeEmail();
    
    return required ? validator.notEmpty().withMessage('Email is required') : validator.optional();
  },

  // URL validation
  url: (field = 'url', required = true) => {
    const validator = body(field)
      .trim()
      .isURL({
        protocols: ['http', 'https'],
        require_protocol: true
      })
      .withMessage('Must be a valid URL starting with http:// or https://');
    
    return required ? validator.notEmpty().withMessage('URL is required') : validator.optional();
  },

  // Price validation
  price: (field = 'price', required = true) => {
    const validator = body(field)
      .isFloat({ min: 0 })
      .withMessage('Must be a positive number')
      .toFloat();
    
    return required ? validator.notEmpty().withMessage('Price is required') : validator.optional();
  },

  // Quantity validation
  quantity: (field = 'quantity', required = true) => {
    const validator = body(field)
      .isInt({ min: 1, max: 100 })
      .withMessage('Must be between 1 and 100')
      .toInt();
    
    return required ? validator.notEmpty().withMessage('Quantity is required') : validator.optional();
  },

  // String validation with length limits
  string: (field, minLength = 1, maxLength = 1000, required = true) => {
    const validator = body(field)
      .trim()
      .isLength({ min: minLength, max: maxLength })
      .withMessage(`Must be between ${minLength} and ${maxLength} characters`)
      .escape();
    
    return required ? validator.notEmpty().withMessage(`${field} is required`) : validator.optional();
  },

  // Phone number validation
  phone: (field = 'phone', required = false) => {
    const validator = body(field)
      .trim()
      .matches(/^[\+]?[1-9][\d]{0,15}$/)
      .withMessage('Must be a valid phone number')
      .isLength({ min: 10, max: 20 })
      .withMessage('Phone number must be between 10 and 20 characters');
    
    return required ? validator.notEmpty().withMessage('Phone number is required') : validator.optional();
  },

  // Currency validation
  currency: (field = 'currency', required = false) => {
    const currencies = [
      'USD', 'EUR', 'GBP', 'TRY', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR',
      'BRL', 'MXN', 'KRW', 'SGD', 'HKD', 'NZD', 'SEK', 'NOK', 'DKK', 'PLN',
      'CZK', 'HUF', 'RUB', 'ZAR', 'AED', 'SAR', 'EGP', 'ILS', 'THB', 'MYR',
      'IDR', 'PHP', 'VND'
    ];
    
    const validator = body(field)
      .isIn(currencies)
      .withMessage(`Must be one of: ${currencies.join(', ')}`);
    
    return required ? validator.notEmpty().withMessage('Currency is required') : validator.optional();
  },

  // Status validation
  status: (field = 'status', allowedStatuses, required = true) => {
    const validator = body(field)
      .isIn(allowedStatuses)
      .withMessage(`Must be one of: ${allowedStatuses.join(', ')}`);
    
    return required ? validator.notEmpty().withMessage('Status is required') : validator.optional();
  },

  // Priority validation
  priority: (field = 'priority', required = false) => {
    const validator = body(field)
      .isIn(['low', 'medium', 'high'])
      .withMessage('Must be low, medium, or high');
    
    return required ? validator.notEmpty().withMessage('Priority is required') : validator.optional();
  },

  // Array validation
  array: (field, minLength = 1, maxLength = 100, required = true) => {
    const validator = body(field)
      .isArray({ min: minLength, max: maxLength })
      .withMessage(`Must be an array with ${minLength} to ${maxLength} items`);
    
    return required ? validator.notEmpty().withMessage(`${field} is required`) : validator.optional();
  },

  // Image URL validation
  imageUrl: (field = 'imageUrl', required = false) => {
    const validator = body(field)
      .trim()
      .isURL()
      .withMessage('Must be a valid URL')
      .matches(/\.(jpg|jpeg|png|gif|webp)$/i)
      .withMessage('Must be a valid image URL');
    
    return required ? validator.notEmpty().withMessage('Image URL is required') : validator.optional();
  }
};

// BuyForMe specific validations
export const buyForMeValidations = {
  // Create request validation
  createRequest: [
    body('customerId')
      .isMongoId()
      .withMessage('Valid customer ID is required'),
    
    body('items')
      .isArray({ min: 1 })
      .withMessage('At least one item is required'),
    
    body('items.*.name')
      .trim()
      .isLength({ min: 1, max: 200 })
      .withMessage('Item name must be between 1 and 200 characters')
      .escape(),
    
    body('items.*.url')
      .trim()
      .isURL({ protocols: ['http', 'https'] })
      .withMessage('Must be a valid URL'),
    
    body('items.*.quantity')
      .isInt({ min: 1, max: 100 })
      .withMessage('Quantity must be between 1 and 100')
      .toInt(),
    
    body('items.*.price')
      .isFloat({ min: 0 })
      .withMessage('Price must be a positive number')
      .toFloat(),
    
    body('items.*.currency')
      .optional()
      .isIn(['USD', 'EUR', 'GBP', 'TRY', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR', 'BRL', 'MXN', 'KRW', 'SGD', 'HKD', 'NZD', 'SEK', 'NOK', 'DKK', 'PLN', 'CZK', 'HUF', 'RUB', 'ZAR', 'AED', 'SAR', 'EGP', 'ILS', 'THB', 'MYR', 'IDR', 'PHP', 'VND'])
      .withMessage('Invalid currency'),
    
    body('items.*.description')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Description must be less than 1000 characters')
      .escape(),
    
    body('items.*.sizes')
      .optional()
      .isArray()
      .withMessage('Sizes must be an array'),
    
    body('items.*.colors')
      .optional()
      .isArray()
      .withMessage('Colors must be an array'),
    
    body('items.*.images')
      .optional()
      .isArray()
      .withMessage('Images must be an array'),
    
    body('items.*.images.*')
      .optional()
      .isURL()
      .withMessage('Each image must be a valid URL'),
    
    body('shippingAddress.name')
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('Name must be between 1 and 100 characters')
      .escape(),
    
    body('shippingAddress.street')
      .trim()
      .isLength({ min: 5, max: 200 })
      .withMessage('Street address must be between 5 and 200 characters')
      .escape(),
    
    body('shippingAddress.city')
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('City must be between 2 and 100 characters')
      .escape(),
    
    body('shippingAddress.country')
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Country must be between 2 and 100 characters')
      .escape(),
    
    body('shippingAddress.postalCode')
      .trim()
      .isLength({ min: 3, max: 20 })
      .withMessage('Postal code must be between 3 and 20 characters')
      .escape(),
    
    body('shippingAddress.phone')
      .optional()
      .trim()
      .matches(/^[\+]?[1-9][\d]{0,15}$/)
      .withMessage('Must be a valid phone number'),
    
    body('notes')
      .optional()
      .trim()
      .isLength({ max: 2000 })
      .withMessage('Notes must be less than 2000 characters')
      .escape(),
    
    body('priority')
      .optional()
      .isIn(['low', 'medium', 'high'])
      .withMessage('Priority must be low, medium, or high')
  ],

  // Update request validation
  updateRequest: [
    param('id')
      .isMongoId()
      .withMessage('Invalid request ID'),
    
    body('status')
      .optional()
      .isIn([
        'pending', 'approved', 'in_progress', 'shipped', 'delivered', 'cancelled'
      ])
      .withMessage('Invalid status'),
    
    body('subStatus')
      .optional()
      .isIn([
        'under_review', 'payment_pending', 'payment_completed', 'purchased',
        'to_be_shipped_to_box', 'arrived_to_box', 'admin_control',
        'customer_review', 'customer_approved', 'customer_rejected',
        'packing_choice', 'packed', 'return_requested', 'replacement_requested'
      ])
      .withMessage('Invalid sub-status'),
    
    body('priority')
      .optional()
      .isIn(['low', 'medium', 'high'])
      .withMessage('Priority must be low, medium, or high'),
    
    body('notes')
      .optional()
      .trim()
      .isLength({ max: 2000 })
      .withMessage('Notes must be less than 2000 characters')
      .escape(),
    
    body('adminNotes')
      .optional()
      .trim()
      .isLength({ max: 2000 })
      .withMessage('Admin notes must be less than 2000 characters')
      .escape(),
    
    body('trackingNumber')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Tracking number must be less than 100 characters')
      .escape(),
    
    body('packagingChoice')
      .optional()
      .isIn(['original', 'grouped', 'mixed'])
      .withMessage('Packaging choice must be original, grouped, or mixed')
  ],

  // Query parameters validation
  queryParams: [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer')
      .toInt(),
    
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100')
      .toInt(),
    
    query('status')
      .optional()
      .isIn([
        'pending', 'approved', 'in_progress', 'shipped', 'delivered', 'cancelled'
      ])
      .withMessage('Invalid status'),
    
    query('priority')
      .optional()
      .isIn(['low', 'medium', 'high'])
      .withMessage('Invalid priority'),
    
    query('search')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Search term must be less than 100 characters')
      .escape(),
    
    query('sortBy')
      .optional()
      .isIn(['createdAt', 'updatedAt', 'totalAmount', 'priority', 'status'])
      .withMessage('Invalid sort field'),
    
    query('sortOrder')
      .optional()
      .isIn(['asc', 'desc'])
      .withMessage('Sort order must be asc or desc'),
    
    query('startDate')
      .optional()
      .isISO8601()
      .withMessage('Start date must be a valid ISO date'),
    
    query('endDate')
      .optional()
      .isISO8601()
      .withMessage('End date must be a valid ISO date')
  ],

  // Review request validation
  reviewRequest: [
    param('id')
      .isMongoId()
      .withMessage('Invalid request ID'),
    
    body('reviewStatus')
      .isIn(['approved', 'rejected', 'needs_modification'])
      .withMessage('Review status must be approved, rejected, or needs_modification'),
    
    body('reviewComments')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Review comments must be less than 1000 characters')
      .escape(),
    
    body('estimatedPrice')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Estimated price must be a positive number')
      .toFloat(),
    
    body('estimatedShipping')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Estimated shipping must be a positive number')
      .toFloat()
  ],

  // Process payment validation
  processPayment: [
    param('id')
      .isMongoId()
      .withMessage('Invalid request ID'),
    
    body('paymentMethod')
      .isIn(['credit_card', 'debit_card', 'paypal', 'bank_transfer', 'crypto'])
      .withMessage('Invalid payment method'),
    
    body('paymentAmount')
      .isFloat({ min: 0 })
      .withMessage('Payment amount must be a positive number')
      .toFloat(),
    
    body('currency')
      .isIn(['USD', 'EUR', 'GBP', 'TRY', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR', 'BRL', 'MXN', 'KRW', 'SGD', 'HKD', 'NZD', 'SEK', 'NOK', 'DKK', 'PLN', 'CZK', 'HUF', 'RUB', 'ZAR', 'AED', 'SAR', 'EGP', 'ILS', 'THB', 'MYR', 'IDR', 'PHP', 'VND'])
      .withMessage('Invalid currency'),
    
    body('transactionId')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Transaction ID must be less than 100 characters')
      .escape()
  ],

  // Mark as purchased validation
  markAsPurchased: [
    param('id')
      .isMongoId()
      .withMessage('Invalid request ID'),
    
    body('supplier')
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('Supplier must be between 1 and 100 characters')
      .escape(),
    
    body('purchaseOrderNumber')
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage('Purchase order number must be between 1 and 50 characters')
      .escape(),
    
    body('estimatedDelivery')
      .optional()
      .isISO8601()
      .withMessage('Estimated delivery must be a valid date'),
    
    body('notes')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Notes must be less than 500 characters')
      .escape()
  ],

  // Update shipping status validation
  updateShippingStatus: [
    param('id')
      .isMongoId()
      .withMessage('Invalid request ID'),
    
    body('status')
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage('Status must be between 1 and 50 characters')
      .escape(),
    
    body('trackingNumber')
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('Tracking number must be between 1 and 100 characters')
      .escape(),
    
    body('carrier')
      .optional()
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('Carrier must be between 1 and 100 characters')
      .escape(),
    
    body('estimatedArrival')
      .optional()
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage('Estimated arrival must be between 1 and 50 characters')
      .escape()
  ],

  // Admin control validation
  adminControl: [
    param('id')
      .isMongoId()
      .withMessage('Invalid request ID'),
    
    body('controlType')
      .isIn(['quality_check', 'packaging', 'shipping_prep', 'final_inspection'])
      .withMessage('Invalid control type'),
    
    body('notes')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Notes must be less than 1000 characters')
      .escape()
  ],

  // Customer review validation
  customerReview: [
    param('id')
      .isMongoId()
      .withMessage('Invalid request ID'),
    
    body('customerDecision')
      .isIn(['approved', 'rejected', 'needs_modification'])
      .withMessage('Customer decision must be approved, rejected, or needs_modification'),
    
    body('customerComments')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Customer comments must be less than 1000 characters')
      .escape()
  ],

  // Packing choice validation
  packingChoice: [
    param('id')
      .isMongoId()
      .withMessage('Invalid request ID'),
    
    body('packagingChoice')
      .isIn(['original', 'grouped', 'mixed'])
      .withMessage('Packaging choice must be original, grouped, or mixed'),
    
    body('notes')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Notes must be less than 500 characters')
      .escape()
  ],

  // Handle return/replacement validation
  handleReturnReplacement: [
    param('id')
      .isMongoId()
      .withMessage('Invalid request ID'),
    
    body('action')
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage('Action must be between 1 and 50 characters')
      .escape(),
    
    body('items')
      .optional()
      .isArray({ min: 1, max: 100 })
      .withMessage('Items must be an array with 1 to 100 items'),
    
    body('reason')
      .optional()
      .trim()
      .isLength({ min: 1, max: 500 })
      .withMessage('Reason must be between 1 and 500 characters')
      .escape()
  ]
};

// User BuyForMe validations
export const userBuyForMeValidations = {
  // Get user requests validation
  queryParams: [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer')
      .toInt(),
    
    query('limit')
      .optional()
      .isInt({ min: 1, max: 50 })
      .withMessage('Limit must be between 1 and 50')
      .toInt(),
    
    query('status')
      .optional()
      .isIn(['pending', 'approved', 'in_progress', 'shipped', 'delivered', 'cancelled'])
      .withMessage('Invalid status'),
    
    query('search')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Search term must be less than 100 characters')
      .escape(),
    
    query('sortBy')
      .optional()
      .isIn(['createdAt', 'updatedAt', 'totalAmount', 'status'])
      .withMessage('Invalid sort field'),
    
    query('sortOrder')
      .optional()
      .isIn(['asc', 'desc'])
      .withMessage('Sort order must be asc or desc')
  ],

  // Create request validation (user version)
  createRequest: [
    body('items')
      .isArray({ min: 1 })
      .withMessage('At least one item is required'),
    
    body('items.*.name')
      .trim()
      .isLength({ min: 1, max: 200 })
      .withMessage('Item name must be between 1 and 200 characters')
      .escape(),
    
    body('items.*.url')
      .trim()
      .isURL({ protocols: ['http', 'https'] })
      .withMessage('Must be a valid URL'),
    
    body('items.*.quantity')
      .isInt({ min: 1, max: 100 })
      .withMessage('Quantity must be between 1 and 100')
      .toInt(),
    
    body('items.*.price')
      .isFloat({ min: 0 })
      .withMessage('Price must be a positive number')
      .toFloat(),
    
    body('items.*.currency')
      .optional()
      .isIn(['USD', 'EUR', 'GBP', 'TRY', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR', 'BRL', 'MXN', 'KRW', 'SGD', 'HKD', 'NZD', 'SEK', 'NOK', 'DKK', 'PLN', 'CZK', 'HUF', 'RUB', 'ZAR', 'AED', 'SAR', 'EGP', 'ILS', 'THB', 'MYR', 'IDR', 'PHP', 'VND'])
      .withMessage('Invalid currency'),
    
    body('items.*.description')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Description must be less than 1000 characters')
      .escape(),
    
    body('shippingAddress.name')
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('Name must be between 1 and 100 characters')
      .escape(),
    
    body('shippingAddress.street')
      .trim()
      .isLength({ min: 5, max: 200 })
      .withMessage('Street address must be between 5 and 200 characters')
      .escape(),
    
    body('shippingAddress.city')
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('City must be between 2 and 100 characters')
      .escape(),
    
    body('shippingAddress.country')
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Country must be between 2 and 100 characters')
      .escape(),
    
    body('shippingAddress.postalCode')
      .trim()
      .isLength({ min: 3, max: 20 })
      .withMessage('Postal code must be between 3 and 20 characters')
      .escape(),
    
    body('shippingAddress.phone')
      .optional()
      .trim()
      .matches(/^[\+]?[1-9][\d]{0,15}$/)
      .withMessage('Must be a valid phone number'),
    
    body('notes')
      .optional()
      .trim()
      .isLength({ max: 2000 })
      .withMessage('Notes must be less than 2000 characters')
      .escape()
  ],

  // Update request validation (user version)
  updateRequest: [
    param('id')
      .isMongoId()
      .withMessage('Invalid request ID'),
    
    body('items')
      .optional()
      .isArray({ min: 1 })
      .withMessage('At least one item is required'),
    
    body('items.*.name')
      .optional()
      .trim()
      .isLength({ min: 1, max: 200 })
      .withMessage('Item name must be between 1 and 200 characters')
      .escape(),
    
    body('items.*.url')
      .optional()
      .trim()
      .isURL({ protocols: ['http', 'https'] })
      .withMessage('Must be a valid URL'),
    
    body('items.*.quantity')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Quantity must be between 1 and 100')
      .toInt(),
    
    body('items.*.price')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Price must be a positive number')
      .toFloat(),
    
    body('notes')
      .optional()
      .trim()
      .isLength({ max: 2000 })
      .withMessage('Notes must be less than 2000 characters')
      .escape(),
    
    body('shippingAddress')
      .optional()
      .isObject()
      .withMessage('Shipping address must be an object'),
    
    body('shippingAddress.name')
      .optional()
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('Name must be between 1 and 100 characters')
      .escape(),
    
    body('shippingAddress.street')
      .optional()
      .trim()
      .isLength({ min: 5, max: 200 })
      .withMessage('Street address must be between 5 and 200 characters')
      .escape(),
    
    body('shippingAddress.city')
      .optional()
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('City must be between 2 and 100 characters')
      .escape(),
    
    body('shippingAddress.country')
      .optional()
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Country must be between 2 and 100 characters')
      .escape(),
    
    body('shippingAddress.postalCode')
      .optional()
      .trim()
      .isLength({ min: 3, max: 20 })
      .withMessage('Postal code must be between 3 and 20 characters')
      .escape()
  ]
};

// Sanitization middleware
export const sanitizeInput = (req, res, next) => {
  // Sanitize string fields
  const sanitizeString = (str) => {
    if (typeof str !== 'string') return str;
    return str.trim().replace(/[<>]/g, '');
  };

  // Recursively sanitize object
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

  // Sanitize request body
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }

  // Sanitize query parameters
  if (req.query) {
    req.query = sanitizeObject(req.query);
  }

  next();
};

// Validation result handler
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

export default {
  commonValidations,
  buyForMeValidations,
  userBuyForMeValidations,
  sanitizeInput,
  handleValidationErrors
};