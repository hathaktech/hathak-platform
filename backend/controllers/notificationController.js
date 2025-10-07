// controllers/notificationController.js - Notification Controller
import Notification from '../models/Notification.js';
import { asyncHandler, NotFoundError, ValidationError } from '../middleware/errorHandler.js';

// Get user notifications
export const getUserNotifications = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const {
    page = 1,
    limit = 20,
    unreadOnly = false,
    type = null,
    priority = null
  } = req.query;

  const options = {
    limit: parseInt(limit),
    skip: (parseInt(page) - 1) * parseInt(limit),
    unreadOnly: unreadOnly === 'true',
    type,
    priority
  };

  const notifications = await Notification.getNotifications(userId, 'user', options);
  const totalCount = await Notification.countDocuments({
    recipientId: userId,
    recipientType: 'user',
    expiresAt: { $gt: new Date() }
  });

  res.json({
    success: true,
    data: {
      notifications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount,
        pages: Math.ceil(totalCount / parseInt(limit))
      }
    }
  });
});

// Get admin notifications
export const getAdminNotifications = asyncHandler(async (req, res) => {
  const adminId = req.admin._id;
  const {
    page = 1,
    limit = 20,
    unreadOnly = false,
    type = null,
    priority = null
  } = req.query;

  const options = {
    limit: parseInt(limit),
    skip: (parseInt(page) - 1) * parseInt(limit),
    unreadOnly: unreadOnly === 'true',
    type,
    priority
  };

  const notifications = await Notification.getNotifications(adminId, 'admin', options);
  const totalCount = await Notification.countDocuments({
    recipientId: adminId,
    recipientType: 'admin',
    expiresAt: { $gt: new Date() }
  });

  res.json({
    success: true,
    data: {
      notifications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount,
        pages: Math.ceil(totalCount / parseInt(limit))
      }
    }
  });
});

// Get unread count
export const getUnreadCount = asyncHandler(async (req, res) => {
  const userId = req.user?._id || req.admin?._id;
  const userType = req.user ? 'user' : 'admin';

  const count = await Notification.getUnreadCount(userId, userType);

  res.json({
    success: true,
    data: { count }
  });
});

// Mark notification as read
export const markAsRead = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user?._id || req.admin?._id;

  const notification = await Notification.markAsRead(id, userId);
  
  if (!notification) {
    throw new NotFoundError('Notification not found');
  }

  res.json({
    success: true,
    data: notification,
    message: 'Notification marked as read'
  });
});

// Mark all notifications as read
export const markAllAsRead = asyncHandler(async (req, res) => {
  const userId = req.user?._id || req.admin?._id;
  const userType = req.user ? 'user' : 'admin';

  await Notification.markAllAsRead(userId, userType);

  res.json({
    success: true,
    message: 'All notifications marked as read'
  });
});

// Delete notification
export const deleteNotification = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user?._id || req.admin?._id;

  const notification = await Notification.findOneAndDelete({
    _id: id,
    recipientId: userId
  });

  if (!notification) {
    throw new NotFoundError('Notification not found');
  }

  res.json({
    success: true,
    message: 'Notification deleted successfully'
  });
});

// Get notification preferences (placeholder for future implementation)
export const getNotificationPreferences = asyncHandler(async (req, res) => {
  const userId = req.user?._id || req.admin?._id;
  const userType = req.user ? 'user' : 'admin';

  // This would typically fetch from a UserPreferences model
  const preferences = {
    channels: {
      in_app: true,
      email: true,
      sms: userType === 'user', // Only users get SMS
      push: true
    },
    types: {
      request_submitted: true,
      request_approved: true,
      request_rejected: true,
      changes_requested: true,
      payment_required: true,
      payment_received: true,
      items_shipped: true,
      delivery_confirmed: true,
      deadline_reminder: true
    },
    frequency: {
      email: 'immediate',
      sms: 'urgent_only',
      push: 'immediate'
    }
  };

  res.json({
    success: true,
    data: preferences
  });
});

// Update notification preferences (placeholder for future implementation)
export const updateNotificationPreferences = asyncHandler(async (req, res) => {
  const userId = req.user?._id || req.admin?._id;
  const userType = req.user ? 'user' : 'admin';
  const { preferences } = req.body;

  // This would typically update a UserPreferences model
  // For now, just return success
  console.log(`Updating notification preferences for ${userType} ${userId}:`, preferences);

  res.json({
    success: true,
    message: 'Notification preferences updated successfully'
  });
});