import express from 'express';
import { body, param } from 'express-validator';
import validateRequest from '../middleware/validateRequest.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import authorizeRoles from '../middleware/roleMiddleware.js';
import {
  getAllOrders,
  getMyOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
} from '../controllers/orderController.js';

const router = express.Router();

// All routes are authMiddlewareed
router.use(authMiddleware);

// GET all orders (admin only)
router.get('/', authorizeRoles('admin'), getAllOrders);

// GET my orders
router.get('/my', getMyOrders);

// GET single order by ID
router.get(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid order ID')],
  validateRequest,
  getOrderById
);

// CREATE order (single-product or multi-product)
router.post(
  '/',
  [
    body('products').optional().isArray({ min: 1 }).withMessage('Products array must have at least one item'),
    body('products.*.productId').optional().isMongoId().withMessage('Valid productId is required'),
    body('products.*.quantity').optional().isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    body('productId').optional().isMongoId().withMessage('Invalid single productId'),
    body('quantity').optional().isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    body('buyMeId').optional().isMongoId().withMessage('Invalid BuyMe ID'),
  ],
  validateRequest,
  createOrder
);

// UPDATE order (admin only)
router.put(
  '/:id',
  authorizeRoles('admin'),
  [
    param('id').isMongoId().withMessage('Invalid order ID'),
    body('status')
      .optional()
      .isIn(['pending', 'approved', 'purchased', 'shipped', 'delivered', 'cancelled']),
    body('notes').optional().isString(),
  ],
  validateRequest,
  updateOrder
);

// DELETE order (admin only)
router.delete(
  '/:id',
  authorizeRoles('admin'),
  [param('id').isMongoId().withMessage('Invalid order ID')],
  validateRequest,
  deleteOrder
);

export default router;
