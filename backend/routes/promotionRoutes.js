import express from 'express';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware.js';
import {
  // Promotion Management
  createPromotion,
  getPromotions,
  getPromotionById,
  updatePromotion,
  deletePromotion,
  
  // Promotion Application
  validatePromotion,
  applyPromotion,
  
  // Analytics
  getPromotionAnalytics,
  
  // A/B Testing
  createABTest,
  getABTestResults
} from '../controllers/promotionController.js';

const router = express.Router();

// Promotion management routes
router.route('/')
  .post(authMiddleware, adminMiddleware, createPromotion)
  .get(authMiddleware, getPromotions);

router.route('/:id')
  .get(authMiddleware, getPromotionById)
  .put(authMiddleware, adminMiddleware, updatePromotion)
  .delete(authMiddleware, adminMiddleware, deletePromotion);

// Promotion application routes
router.route('/validate')
  .post(authMiddleware, validatePromotion);

router.route('/apply')
  .post(authMiddleware, applyPromotion);

// Analytics routes
router.route('/analytics')
  .get(authMiddleware, getPromotionAnalytics);

// A/B Testing routes
router.route('/ab-test')
  .post(authMiddleware, adminMiddleware, createABTest);

router.route('/ab-test/:testId/results')
  .get(authMiddleware, adminMiddleware, getABTestResults);

export default router;
