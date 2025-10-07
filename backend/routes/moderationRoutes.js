import express from 'express';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware.js';
import {
  // Moderation Management
  createModerationCase,
  getModerationQueue,
  getModerationById,
  assignModeration,
  resolveModeration,
  escalateModeration,
  
  // Appeal Management
  submitAppeal,
  reviewAppeal,
  
  // Analytics
  getModerationStats,
  getModerationTrends,
  
  // AI Moderation
  processAIModeration
} from '../controllers/moderationController.js';

const router = express.Router();

// Moderation management routes
router.route('/')
  .post(authMiddleware, createModerationCase)
  .get(authMiddleware, adminMiddleware, getModerationQueue);

router.route('/:id')
  .get(authMiddleware, getModerationById);

router.route('/:id/assign')
  .post(authMiddleware, adminMiddleware, assignModeration);

router.route('/:id/resolve')
  .post(authMiddleware, adminMiddleware, resolveModeration);

router.route('/:id/escalate')
  .post(authMiddleware, adminMiddleware, escalateModeration);

// Appeal routes
router.route('/:id/appeal')
  .post(authMiddleware, submitAppeal);

router.route('/:id/appeal/review')
  .post(authMiddleware, adminMiddleware, reviewAppeal);

// Analytics routes
router.route('/stats')
  .get(authMiddleware, adminMiddleware, getModerationStats);

router.route('/trends')
  .get(authMiddleware, adminMiddleware, getModerationTrends);

// AI moderation routes
router.route('/ai/process')
  .post(authMiddleware, adminMiddleware, processAIModeration);

export default router;
