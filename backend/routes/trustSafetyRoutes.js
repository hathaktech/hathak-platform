import express from 'express';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware.js';
import {
  // Review Management
  createReview,
  getReviews,
  voteReviewHelpful,
  reportReview,
  
  // Anti-Fraud Detection
  detectFraud,
  getFraudAnalytics,
  
  // Content Moderation
  moderateContent,
  
  // Trust & Safety Dashboard
  getTrustSafetyStats
} from '../controllers/trustSafetyController.js';

const router = express.Router();

// Review routes
router.route('/reviews')
  .post(authMiddleware, createReview)
  .get(authMiddleware, getReviews);

router.route('/reviews/:id/helpful')
  .post(authMiddleware, voteReviewHelpful);

router.route('/reviews/:id/report')
  .post(authMiddleware, reportReview);

// Anti-fraud routes
router.route('/fraud/detect')
  .post(authMiddleware, detectFraud);

router.route('/fraud/analytics')
  .get(authMiddleware, adminMiddleware, getFraudAnalytics);

// Content moderation routes
router.route('/moderate')
  .post(authMiddleware, adminMiddleware, moderateContent);

// Trust & Safety dashboard routes
router.route('/stats')
  .get(authMiddleware, adminMiddleware, getTrustSafetyStats);

export default router;
