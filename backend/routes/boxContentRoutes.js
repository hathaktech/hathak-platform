import express from 'express';
import {
  getAllBoxContents,
  getUserBoxContents,
  getBoxContent,
  createBoxContent,
  updateBoxContentStatus,
  updatePackingInfo,
  updateShippingInfo,
  requestPacking,
  confirmPacking,
  getBoxContentsStats,
  deleteBoxContent
} from '../controllers/boxContentController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { adminMiddleware } from '../middleware/adminMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Admin routes
router.get('/admin/all', adminMiddleware, getAllBoxContents);
router.get('/admin/stats', adminMiddleware, getBoxContentsStats);
router.post('/admin/create', adminMiddleware, createBoxContent);
router.put('/admin/:id/status', adminMiddleware, updateBoxContentStatus);
router.put('/admin/:id/packing', adminMiddleware, updatePackingInfo);
router.put('/admin/:id/shipping', adminMiddleware, updateShippingInfo);
router.delete('/admin/:id', adminMiddleware, deleteBoxContent);

// User routes
router.get('/user/my-contents', getUserBoxContents);
router.get('/user/:id', getBoxContent);
router.put('/user/:id/request-packing', requestPacking);
router.put('/user/:id/confirm-packing', confirmPacking);

// General routes (accessible by both admin and user for their own content)
router.get('/:id', getBoxContent);

export default router;
