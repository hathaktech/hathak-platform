// services/notificationService.js - Enhanced Notification Service
import Notification from '../models/Notification.js';
import BuyForMeRequest from '../models/BuyForMeRequest.js';
import User from '../models/User.js';
import Admin from '../models/Admin.js';

class NotificationService {
  
  // Create notification for request status changes
  async createRequestNotification(requestId, type, metadata = {}) {
    try {
      const request = await BuyForMeRequest.findById(requestId)
        .populate('customerId', 'name email')
        .populate('lastModifiedByAdmin', 'name email');
      
      if (!request) {
        throw new Error('Request not found');
      }
      
      const notifications = [];
      
      // Determine notification details based on type
      const notificationConfig = this.getNotificationConfig(type, request, metadata);
      
      // Create notification for user
      if (notificationConfig.userNotification) {
        const userNotification = await Notification.createNotification({
          type,
          requestId,
          recipientId: request.customerId._id,
          recipientType: 'user',
          title: notificationConfig.userNotification.title,
          message: notificationConfig.userNotification.message,
          priority: notificationConfig.userNotification.priority,
          channels: notificationConfig.userNotification.channels,
          actions: notificationConfig.userNotification.actions,
          metadata: {
            requestNumber: request.requestNumber,
            customerName: request.customerName,
            ...metadata
          }
        });
        notifications.push(userNotification);
      }
      
      // Create notification for admin (if applicable)
      if (notificationConfig.adminNotification) {
        const admins = await Admin.find({ isActive: true });
        
        for (const admin of admins) {
          const adminNotification = await Notification.createNotification({
            type,
            requestId,
            recipientId: admin._id,
            recipientType: 'admin',
            title: notificationConfig.adminNotification.title,
            message: notificationConfig.adminNotification.message,
            priority: notificationConfig.adminNotification.priority,
            channels: notificationConfig.adminNotification.channels,
            actions: notificationConfig.adminNotification.actions,
            metadata: {
              requestNumber: request.requestNumber,
              customerName: request.customerName,
              ...metadata
            }
          });
          notifications.push(adminNotification);
        }
      }
      
      return notifications;
    } catch (error) {
      console.error('Error creating request notification:', error);
      throw error;
    }
  }
  
  // Get notification configuration based on type
  getNotificationConfig(type, request, metadata) {
    const configs = {
      request_submitted: {
        adminNotification: {
          title: 'New Request Submitted',
          message: `Request #${request.requestNumber} has been submitted by ${request.customerName}`,
          priority: 'medium',
          channels: ['in_app', 'email'],
          actions: [
            { label: 'Review Request', action: 'review', url: `/admin/buyme?tab=review_queue&subtab=pending` }
          ]
        }
      },
      
      request_approved: {
        userNotification: {
          title: 'Request Approved!',
          message: `Your request #${request.requestNumber} has been approved. Please complete payment to proceed.`,
          priority: 'high',
          channels: ['in_app', 'email', 'sms'],
          actions: [
            { label: 'Make Payment', action: 'payment', url: `/User/ControlPanel/BuyForMe/BuyForMeRequests` }
          ]
        }
      },
      
      request_rejected: {
        userNotification: {
          title: 'Request Rejected',
          message: `Your request #${request.requestNumber} has been rejected. ${metadata.reason || 'Please review and resubmit.'}`,
          priority: 'medium',
          channels: ['in_app', 'email'],
          actions: [
            { label: 'View Details', action: 'view', url: `/User/ControlPanel/BuyForMe/BuyForMeRequests` }
          ]
        }
      },
      
      changes_requested: {
        userNotification: {
          title: 'Changes Required',
          message: `Your request #${request.requestNumber} requires changes. Please review the requirements and submit updated information.`,
          priority: 'high',
          channels: ['in_app', 'email', 'sms'],
          actions: [
            { label: 'View Changes', action: 'changes', url: `/User/ControlPanel/BuyForMe/BuyForMeRequests` }
          ]
        }
      },
      
      changes_submitted: {
        adminNotification: {
          title: 'Changes Submitted',
          message: `User has submitted changes for request #${request.requestNumber}`,
          priority: 'medium',
          channels: ['in_app', 'email'],
          actions: [
            { label: 'Review Changes', action: 'review_changes', url: `/admin/buyme?tab=review_queue&subtab=changes_submitted` }
          ]
        }
      },
      
      changes_approved: {
        userNotification: {
          title: 'Changes Approved',
          message: `Your changes for request #${request.requestNumber} have been approved. Your request is now being processed.`,
          priority: 'medium',
          channels: ['in_app', 'email'],
          actions: [
            { label: 'View Request', action: 'view', url: `/User/ControlPanel/BuyForMe/BuyForMeRequests` }
          ]
        }
      },
      
      changes_rejected: {
        userNotification: {
          title: 'Changes Rejected',
          message: `Your changes for request #${request.requestNumber} have been rejected. Please review the feedback and resubmit.`,
          priority: 'high',
          channels: ['in_app', 'email'],
          actions: [
            { label: 'View Feedback', action: 'view', url: `/User/ControlPanel/BuyForMe/BuyForMeRequests` }
          ]
        }
      },
      
      payment_required: {
        userNotification: {
          title: 'Payment Required',
          message: `Payment is required for request #${request.requestNumber}. Please complete payment to continue processing.`,
          priority: 'high',
          channels: ['in_app', 'email', 'sms'],
          actions: [
            { label: 'Make Payment', action: 'payment', url: `/User/ControlPanel/BuyForMe/BuyForMeRequests` }
          ]
        }
      },
      
      payment_received: {
        adminNotification: {
          title: 'Payment Received',
          message: `Payment received for request #${request.requestNumber}. Processing can now begin.`,
          priority: 'medium',
          channels: ['in_app', 'email'],
          actions: [
            { label: 'View Request', action: 'view', url: `/admin/buyme?tab=work_in_progress` }
          ]
        },
        userNotification: {
          title: 'Payment Confirmed',
          message: `Payment confirmed for request #${request.requestNumber}. We are now processing your order.`,
          priority: 'medium',
          channels: ['in_app', 'email'],
          actions: [
            { label: 'Track Progress', action: 'track', url: `/User/ControlPanel/BuyForMe/BuyForMeRequests` }
          ]
        }
      },
      
      payment_failed: {
        userNotification: {
          title: 'Payment Failed',
          message: `Payment failed for request #${request.requestNumber}. Please try again or contact support.`,
          priority: 'high',
          channels: ['in_app', 'email', 'sms'],
          actions: [
            { label: 'Retry Payment', action: 'retry_payment', url: `/User/ControlPanel/BuyForMe/BuyForMeRequests` }
          ]
        }
      },
      
      items_purchased: {
        userNotification: {
          title: 'Items Purchased',
          message: `Items for request #${request.requestNumber} have been purchased successfully. They will be shipped to our warehouse soon.`,
          priority: 'medium',
          channels: ['in_app', 'email'],
          actions: [
            { label: 'Track Progress', action: 'track', url: `/User/ControlPanel/BuyForMe/BuyForMeRequests` }
          ]
        }
      },
      
      items_arrived: {
        adminNotification: {
          title: 'Items Arrived',
          message: `Items for request #${request.requestNumber} have arrived at the warehouse and are ready for inspection.`,
          priority: 'medium',
          channels: ['in_app', 'email'],
          actions: [
            { label: 'Start Inspection', action: 'inspect', url: `/admin/buyme?tab=inspection&subtab=pending_inspection` }
          ]
        }
      },
      
      inspection_required: {
        adminNotification: {
          title: 'Inspection Required',
          message: `Inspection is required for request #${request.requestNumber}. Items are ready for quality check.`,
          priority: 'medium',
          channels: ['in_app', 'email'],
          actions: [
            { label: 'Start Inspection', action: 'inspect', url: `/admin/buyme?tab=inspection&subtab=pending_inspection` }
          ]
        }
      },
      
      inspection_completed: {
        userNotification: {
          title: 'Inspection Completed',
          message: `Inspection completed for request #${request.requestNumber}. ${metadata.passed ? 'Items passed inspection and are ready for packaging.' : 'Items failed inspection. Please contact support.'}`,
          priority: 'medium',
          channels: ['in_app', 'email'],
          actions: [
            { label: 'View Results', action: 'view', url: `/User/ControlPanel/BuyForMe/BuyForMeRequests` }
          ]
        }
      },
      
      packaging_options: {
        userNotification: {
          title: 'Packaging Options Available',
          message: `Packaging options are now available for request #${request.requestNumber}. Please select your preferred packaging method.`,
          priority: 'medium',
          channels: ['in_app', 'email'],
          actions: [
            { label: 'Select Packaging', action: 'packaging', url: `/User/ControlPanel/BuyForMe/BuyForMeRequests` }
          ]
        }
      },
      
      packaging_selected: {
        adminNotification: {
          title: 'Packaging Selected',
          message: `User has selected packaging options for request #${request.requestNumber}. Ready for packaging.`,
          priority: 'medium',
          channels: ['in_app', 'email'],
          actions: [
            { label: 'View Options', action: 'view', url: `/admin/buyme?tab=packaging_shipping&subtab=packaging` }
          ]
        }
      },
      
      items_shipped: {
        userNotification: {
          title: 'Items Shipped!',
          message: `Your items for request #${request.requestNumber} have been shipped. Tracking number: ${metadata.trackingNumber || 'N/A'}`,
          priority: 'high',
          channels: ['in_app', 'email', 'sms'],
          actions: [
            { label: 'Track Shipment', action: 'track', url: `/User/ControlPanel/BuyForMe/BuyForMeRequests` }
          ]
        }
      },
      
      delivery_confirmed: {
        adminNotification: {
          title: 'Delivery Confirmed',
          message: `Delivery confirmed for request #${request.requestNumber}. Order completed successfully.`,
          priority: 'low',
          channels: ['in_app'],
          actions: [
            { label: 'View Request', action: 'view', url: `/admin/buyme?tab=delivered` }
          ]
        }
      },
      
      deadline_reminder: {
        userNotification: {
          title: 'Deadline Reminder',
          message: `Reminder: ${metadata.message || 'You have a pending deadline for request #' + request.requestNumber}`,
          priority: metadata.urgent ? 'urgent' : 'high',
          channels: ['in_app', 'email', 'sms'],
          actions: [
            { label: 'Take Action', action: 'action', url: `/User/ControlPanel/BuyForMe/BuyForMeRequests` }
          ]
        }
      }
    };
    
    return configs[type] || {};
  }
  
  // Create deadline reminder notifications
  async createDeadlineReminder(requestId, deadlineType, daysUntilDeadline) {
    const request = await BuyForMeRequest.findById(requestId);
    if (!request) return;
    
    const urgency = daysUntilDeadline <= 1 ? 'urgent' : daysUntilDeadline <= 3 ? 'high' : 'medium';
    const message = daysUntilDeadline === 0 
      ? `Deadline is today! Please take action on request #${request.requestNumber}`
      : `Deadline in ${daysUntilDeadline} day(s) for request #${request.requestNumber}`;
    
    return this.createRequestNotification(requestId, 'deadline_reminder', {
      message,
      urgent: urgency === 'urgent',
      deadlineType
    });
  }
  
  // Get user notifications
  async getUserNotifications(userId, options = {}) {
    return Notification.getNotifications(userId, 'user', options);
  }
  
  // Get admin notifications
  async getAdminNotifications(adminId, options = {}) {
    return Notification.getNotifications(adminId, 'admin', options);
  }
  
  // Mark notification as read
  async markAsRead(notificationId, userId) {
    return Notification.markAsRead(notificationId, userId);
  }
  
  // Mark all notifications as read
  async markAllAsRead(userId, userType) {
    return Notification.markAllAsRead(userId, userType);
  }
  
  // Get unread count
  async getUnreadCount(userId, userType) {
    return Notification.getUnreadCount(userId, userType);
  }
  
  // Clean up expired notifications
  async cleanupExpiredNotifications() {
    return Notification.deleteMany({
      expiresAt: { $lt: new Date() }
    });
  }
  
  // Send scheduled notifications
  async sendScheduledNotifications() {
    const now = new Date();
    const notifications = await Notification.find({
      scheduledFor: { $lte: now },
      delivered: false,
      expiresAt: { $gt: now }
    });
    
    for (const notification of notifications) {
      try {
        // Here you would integrate with actual delivery services
        // (email service, SMS service, push notification service)
        await notification.markAsDelivered();
        console.log(`Notification ${notification.id} delivered`);
      } catch (error) {
        console.error(`Failed to deliver notification ${notification.id}:`, error);
      }
    }
    
    return notifications.length;
  }
}

export default new NotificationService();
