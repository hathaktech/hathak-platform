import express from 'express';
import { body, param } from 'express-validator';
import {
  getAllRequests,
  getRequestById,
  createRequest,
  updateRequestStatus,
  deleteRequest
} from '../controllers/unifiedBuyForMeController.js';
import validateRequest from '../middleware/validateRequest.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import authorizeRoles from '../middleware/roleMiddleware.js';

const router = express.Router();

// Apply authMiddleware middleware to all BuyForMe routes
router.use(authMiddleware);

// GET all BuyForMe requests (admin only)
router.get('/', authorizeRoles('admin'), getAllRequests);

// GET single BuyForMe request by ID (admin or owner, checked in controller)
router.get(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid BuyForMe ID')],
  validateRequest,
  getRequestById
);

// POST a new BuyForMe request (authenticated user)
router.post(
  '/',
  [
    body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
    body('items.*.productName').notEmpty().withMessage('Product name is required'),
    body('items.*.productLink').notEmpty().isURL().withMessage('Must be a valid URL'),
    body('notes').optional().isString().withMessage('Notes must be a string')
  ],
  validateRequest,
  createRequest
);

// PUT update BuyForMe request (admin or owner, checked in controller)
router.put(
  '/:id',
  [
    param('id').isMongoId().withMessage('Invalid BuyForMe ID'),
    body('status').optional().isIn(['pending','approved','purchased','shipped','delivered','cancelled']),
    body('items').optional().isArray({ min: 1 }),
    body('notes').optional().isString()
  ],
  validateRequest,
  updateRequestStatus
);

// DELETE BuyForMe request (admin or owner, checked in controller)
router.delete(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid BuyForMe ID')],
  validateRequest,
  deleteRequest
);

export default router;
