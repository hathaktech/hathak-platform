// routes/productRoutes.js
import express from 'express';
import { body, param } from 'express-validator';
import validateRequest from '../middleware/validateRequest.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import authorizeRoles from '../middleware/roleMiddleware.js';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';

const router = express.Router();

// Public routes
router.get('/', getAllProducts);
router.get('/:id', [param('id').isMongoId().withMessage('Invalid product ID')], validateRequest, getProductById);

// Protected routes (admin only)
router.post(
  '/',
  authMiddleware,
  authorizeRoles('admin'),
  [
    body('name').notEmpty().withMessage('Product name is required'),
    body('price').isNumeric().withMessage('Price must be a number'),
    body('type').optional().isIn(['retail', 'wholesale']).withMessage('Type must be retail or wholesale'),
  ],
  validateRequest,
  createProduct
);

router.put(
  '/:id',
  authMiddleware,
  authorizeRoles('admin'),
  [param('id').isMongoId().withMessage('Invalid product ID')],
  validateRequest,
  updateProduct
);

router.delete(
  '/:id',
  authMiddleware,
  authorizeRoles('admin'),
  [param('id').isMongoId().withMessage('Invalid product ID')],
  validateRequest,
  deleteProduct
);

export default router;
