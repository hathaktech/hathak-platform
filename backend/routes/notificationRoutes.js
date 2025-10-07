// routes/notificationRoutes.js - Notification Routes
import express from 'express';
import {
  getUserNotifications,
  getAdminNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getNotificationPreferences,
  updateNotificationPreferences
} from '../controllers/notificationController.js';
import { enhancedAuthMiddleware, requireAdmin, requireUser } from '../middleware/security.js';

const router = express.Router();

// User notification routes
const userRouter = express.Router();
userRouter.use(enhancedAuthMiddleware);
userRouter.use(requireUser);

userRouter.get('/', getUserNotifications);
userRouter.get('/unread-count', getUnreadCount);
userRouter.patch('/:id/read', markAsRead);
userRouter.patch('/mark-all-read', markAllAsRead);
userRouter.delete('/:id', deleteNotification);
userRouter.get('/preferences', getNotificationPreferences);
userRouter.put('/preferences', updateNotificationPreferences);

// Admin notification routes
const adminRouter = express.Router();
adminRouter.use(enhancedAuthMiddleware);
adminRouter.use(requireAdmin);

adminRouter.get('/', getAdminNotifications);
adminRouter.get('/unread-count', getUnreadCount);
adminRouter.patch('/:id/read', markAsRead);
adminRouter.patch('/mark-all-read', markAllAsRead);
adminRouter.delete('/:id', deleteNotification);
adminRouter.get('/preferences', getNotificationPreferences);
adminRouter.put('/preferences', updateNotificationPreferences);

// Mount routers
router.use('/user', userRouter);
router.use('/admin', adminRouter);

export default router;