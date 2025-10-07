// routes/unifiedBuyForMeRoutes.js - Unified BuyForMe Routes
import express from 'express';
import {
  getAllRequests,
  getRequestById,
  createRequest,
  updateRequestStatus,
  reviewRequest,
  processPayment,
  markAsPurchased,
  updateShippingStatus,
  adminControl,
  customerReview,
  packingChoice,
  handleReturnReplacement,
  deleteRequest,
  getStatistics,
  getUserRequests,
  getUserRequestById
} from '../controllers/unifiedBuyForMeController.js';

import { 
  enhancedAuthMiddleware, 
  requireAdmin, 
  requireUser 
} from '../middleware/security.js';

const router = express.Router();

// Admin routes
const adminRouter = express.Router();
adminRouter.use(enhancedAuthMiddleware);
adminRouter.use(requireAdmin);

// GET /api/admin/buyforme-requests - Get all requests
adminRouter.get('/', getAllRequests);

// GET /api/admin/buyforme-requests/statistics - Get statistics
adminRouter.get('/statistics', getStatistics);

// GET /api/admin/buyforme-requests/:id - Get single request
adminRouter.get('/:id', getRequestById);

// POST /api/admin/buyforme-requests - Create request
adminRouter.post('/', createRequest);

// PATCH /api/admin/buyforme-requests/:id/status - Update status
adminRouter.patch('/:id/status', updateRequestStatus);

// POST /api/admin/buyforme-requests/:id/review - Review request
adminRouter.post('/:id/review', reviewRequest);

// POST /api/admin/buyforme-requests/:id/payment - Process payment
adminRouter.post('/:id/payment', processPayment);

// POST /api/admin/buyforme-requests/:id/purchase - Mark as purchased
adminRouter.post('/:id/purchase', markAsPurchased);

// PATCH /api/admin/buyforme-requests/:id/shipping - Update shipping
adminRouter.patch('/:id/shipping', updateShippingStatus);

// POST /api/admin/buyforme-requests/:id/control - Admin control
adminRouter.post('/:id/control', adminControl);

// POST /api/admin/buyforme-requests/:id/customer-review - Customer review
adminRouter.post('/:id/customer-review', customerReview);

// POST /api/admin/buyforme-requests/:id/packing - Packing choice
adminRouter.post('/:id/packing', packingChoice);

// POST /api/admin/buyforme-requests/:id/return-replacement - Handle return/replacement
adminRouter.post('/:id/return-replacement', handleReturnReplacement);

// DELETE /api/admin/buyforme-requests/:id - Delete request
adminRouter.delete('/:id', deleteRequest);

// User routes
const userRouter = express.Router();
userRouter.use(enhancedAuthMiddleware);
userRouter.use(requireUser);

// GET /api/user/buyforme-requests - Get user's requests
userRouter.get('/', getUserRequests);

// GET /api/user/buyforme-requests/:id - Get single user request
userRouter.get('/:id', getUserRequestById);

// POST /api/user/buyforme-requests - Create request
userRouter.post('/', createRequest);

// POST /api/user/buyforme-requests/:id/customer-review - Customer review
userRouter.post('/:id/customer-review', customerReview);

// POST /api/user/buyforme-requests/:id/packing - Packing choice
userRouter.post('/:id/packing', packingChoice);

// Mount routers
router.use('/admin/buyforme-requests', adminRouter);
router.use('/user/buyforme-requests', userRouter);

export default router;