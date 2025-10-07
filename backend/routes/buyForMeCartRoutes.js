// routes/buyForMeCartRoutes.js
import express from 'express';
import { body, param, query } from 'express-validator';
import {
  getUserCartItems,
  createCartItem,
  updateCartItem,
  deleteCartItem,
  getCartItem,
  submitCartForPurchase,
  getCartStats
} from '../controllers/buyForMeCartController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Validation middleware
const validateProductCreation = [
  body('productName')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Product name is required and must be less than 200 characters'),
  body('productLink')
    .isURL()
    .withMessage('Valid product URL is required'),
  body('images')
    .optional()
    .isArray()
    .withMessage('Images must be an array'),
  body('images.*')
    .optional()
    .isURL()
    .withMessage('Each image must be a valid URL'),
  body('colors')
    .optional()
    .isArray()
    .withMessage('Colors must be an array'),
  body('sizes')
    .optional()
    .isArray()
    .withMessage('Sizes must be an array'),
  body('quantity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Quantity must be a positive integer'),
  body('estimatedPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Estimated price must be a positive number'),
  body('currency')
    .optional()
    .isIn(['USD', 'EUR', 'GBP', 'TRY', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR', 'BRL', 'MXN', 'KRW', 'SGD', 'HKD', 'NZD', 'SEK', 'NOK', 'DKK', 'PLN', 'CZK', 'HUF', 'RUB', 'ZAR', 'AED', 'SAR', 'EGP', 'ILS', 'THB', 'MYR', 'IDR', 'PHP', 'VND'])
    .withMessage('Invalid currency'),
  body('notes')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Notes must be less than 1000 characters'),
];

const validateProductUpdate = [
  param('productId')
    .isMongoId()
    .withMessage('Invalid product ID format'),
  body('productName')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Product name must be less than 200 characters'),
  body('productLink')
    .optional()
    .isURL()
    .withMessage('Valid product URL is required'),
  body('images')
    .optional()
    .isArray()
    .withMessage('Images must be an array'),
  body('images.*')
    .optional()
    .isURL()
    .withMessage('Each image must be a valid URL'),
  body('colors')
    .optional()
    .isArray()
    .withMessage('Colors must be an array'),
  body('sizes')
    .optional()
    .isArray()
    .withMessage('Sizes must be an array'),
  body('quantity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Quantity must be a positive integer'),
  body('estimatedPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Estimated price must be a positive number'),
  body('currency')
    .optional()
    .isIn(['USD', 'EUR', 'GBP', 'TRY', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR', 'BRL', 'MXN', 'KRW', 'SGD', 'HKD', 'NZD', 'SEK', 'NOK', 'DKK', 'PLN', 'CZK', 'HUF', 'RUB', 'ZAR', 'AED', 'SAR', 'EGP', 'ILS', 'THB', 'MYR', 'IDR', 'PHP', 'VND'])
    .withMessage('Invalid currency'),
  body('notes')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Notes must be less than 1000 characters'),
];

const validateProductId = [
  param('productId')
    .isMongoId()
    .withMessage('Invalid product ID format')
];


const validateSubmitProducts = [
  body('productIds')
    .isArray({ min: 1 })
    .withMessage('Product IDs array is required'),
  body('productIds.*')
    .isMongoId()
    .withMessage('Invalid product ID format')
];

// Routes

// GET /api/buyforme-cart - Get user's BuyForMe cart items
router.get('/', getUserCartItems);

// GET /api/buyforme-cart/stats - Get BuyForMe cart statistics
router.get('/stats', getCartStats);

// GET /api/buyforme-cart/:productId - Get single BuyForMe cart item
router.get('/:productId', validateProductId, getCartItem);

// POST /api/buyforme-cart - Create new BuyForMe cart item
router.post('/', validateProductCreation, createCartItem);

// PUT /api/buyforme-cart/:productId - Update BuyForMe cart item
router.put('/:productId', validateProductUpdate, updateCartItem);

// DELETE /api/buyforme-cart/:productId - Delete BuyForMe cart item
router.delete('/:productId', validateProductId, deleteCartItem);

// POST /api/buyforme-cart/submit - Submit BuyForMe cart for purchase
router.post('/submit', validateSubmitProducts, submitCartForPurchase);

export default router;
