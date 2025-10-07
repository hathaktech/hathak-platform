import express from 'express';
import {
  registerSeller,
  loginSeller,
  getSellerProfile,
  updateSellerProfile,
  getSellerDashboard,
  getSellerProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getSellerOrders,
  updateOrderStatus,
  getSellerAnalytics,
  uploadDocuments
} from '../controllers/sellerController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public seller routes
router.post('/register', registerSeller);
router.post('/login', loginSeller);

// Protected seller routes
router.use(authMiddleware); // All routes below require authentication

router.get('/profile', getSellerProfile);
router.put('/profile', updateSellerProfile);
router.get('/dashboard', getSellerDashboard);
router.get('/products', getSellerProducts);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);
router.get('/orders', getSellerOrders);
router.put('/orders/:id/status', updateOrderStatus);
router.get('/analytics', getSellerAnalytics);
router.post('/documents', uploadDocuments);

export default router;
