import express from 'express';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware.js';
import {
  // Payment Processing
  createPayment,
  getPayments,
  getPaymentById,
  updatePaymentStatus,
  
  // Refund Processing
  processRefund,
  
  // Settlement Management
  generateSettlement,
  getSettlements,
  updateSettlementStatus,
  scheduleSettlementPayment,
  
  // Analytics
  getPaymentAnalytics
} from '../controllers/paymentController.js';

const router = express.Router();

// Payment routes
router.route('/')
  .post(authMiddleware, createPayment)
  .get(authMiddleware, getPayments);

router.route('/:id')
  .get(authMiddleware, getPaymentById);

router.route('/:id/status')
  .put(authMiddleware, updatePaymentStatus);

router.route('/:id/refund')
  .post(authMiddleware, processRefund);

// Settlement routes
router.route('/settlements')
  .post(authMiddleware, adminMiddleware, generateSettlement)
  .get(authMiddleware, getSettlements);

router.route('/settlements/:id/status')
  .put(authMiddleware, adminMiddleware, updateSettlementStatus);

router.route('/settlements/:id/schedule-payment')
  .post(authMiddleware, adminMiddleware, scheduleSettlementPayment);

// Analytics routes
router.route('/analytics')
  .get(authMiddleware, getPaymentAnalytics);

export default router;
