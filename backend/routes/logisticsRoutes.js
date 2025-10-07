import express from 'express';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware.js';
import {
  // Fulfillment Centers
  createFulfillmentCenter,
  getFulfillmentCenters,
  getFulfillmentCenterById,
  
  // Inventory Management
  getInventory,
  updateInventory,
  
  // Order Fulfillment
  createOrderFulfillment,
  getOrderFulfillments,
  updateFulfillmentStatus,
  
  // Workflow
  generatePickList,
  generateShippingLabel,
  
  // Analytics
  getFulfillmentAnalytics
} from '../controllers/logisticsController.js';

const router = express.Router();

// Fulfillment Center routes
router.route('/fulfillment-centers')
  .post(authMiddleware, adminMiddleware, createFulfillmentCenter)
  .get(authMiddleware, getFulfillmentCenters);

router.route('/fulfillment-centers/:id')
  .get(authMiddleware, getFulfillmentCenterById);

// Inventory routes
router.route('/inventory')
  .get(authMiddleware, getInventory);

router.route('/inventory/:id')
  .put(authMiddleware, updateInventory);

// Order Fulfillment routes
router.route('/fulfillments')
  .post(authMiddleware, createOrderFulfillment)
  .get(authMiddleware, getOrderFulfillments);

router.route('/fulfillments/:id/status')
  .put(authMiddleware, updateFulfillmentStatus);

// Workflow routes
router.route('/fulfillments/:id/pick-list')
  .post(authMiddleware, generatePickList);

router.route('/fulfillments/:id/shipping-label')
  .post(authMiddleware, generateShippingLabel);

// Analytics routes
router.route('/analytics')
  .get(authMiddleware, getFulfillmentAnalytics);

export default router;
