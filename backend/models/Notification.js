// models/Notification.js - Enhanced Notification System
import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  // Core identification
  id: {
    type: String,
    unique: true,
    required: true
  },
  
  // Notification type
  type: {
    type: String,
    enum: [
      'request_submitted',        // User submitted request
      'request_approved',         // Request approved by admin
      'request_rejected',         // Request rejected by admin
      'changes_requested',        // Admin requested changes
      'changes_submitted',        // User submitted changes
      'changes_approved',         // Changes approved by admin
      'changes_rejected',         // Changes rejected by admin
      'payment_required',         // Payment required
      'payment_received',         // Payment received
      'payment_failed',           // Payment failed
      'items_purchased',          // Items purchased
      'items_arrived',            // Items arrived at warehouse
      'inspection_required',      // Inspection required
      'inspection_completed',     // Inspection completed
      'packaging_options',        // Packaging options available
      'packaging_selected',       // User selected packaging
      'items_shipped',            // Items shipped
      'delivery_confirmed',       // Delivery confirmed
      'deadline_reminder',        // Deadline reminder
      'status_update',           // General status update
      'system_alert',            // System alert
      'admin_notification'       // Admin notification
    ],
    required: true
  },
  
  // Related request
  requestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BuyForMeRequest',
    required: true
  },
  
  // Recipients
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  recipientType: {
    type: String,
    enum: ['user', 'admin', 'internal'],
    required: true
  },
  
  // Notification content
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  
  // Priority and urgency
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  
  // Delivery channels
  channels: [{
    type: String,
    enum: ['in_app', 'email', 'sms', 'push'],
    required: true
  }],
  
  // Status tracking
  read: {
    type: Boolean,
    default: false
  },
  readAt: Date,
  
  // Delivery tracking
  delivered: {
    type: Boolean,
    default: false
  },
  deliveredAt: Date,
  
  // Scheduling
  scheduledFor: Date,
  sentAt: Date,
  
  // Metadata
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  
  // Action buttons (for interactive notifications)
  actions: [{
    label: String,
    action: String,
    url: String,
    style: {
      type: String,
      enum: ['primary', 'secondary', 'success', 'warning', 'danger'],
      default: 'primary'
    }
  }],
  
  // Expiration
  expiresAt: Date,
  
  // Template information
  templateId: String,
  templateData: mongoose.Schema.Types.Mixed
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
notificationSchema.index({ recipientId: 1, recipientType: 1, read: 1 });
notificationSchema.index({ requestId: 1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ scheduledFor: 1 });
notificationSchema.index({ expiresAt: 1 });

// Virtual for notification age
notificationSchema.virtual('age').get(function() {
  return Date.now() - this.createdAt.getTime();
});

// Virtual for urgency level
notificationSchema.virtual('urgencyLevel').get(function() {
  const age = this.age;
  const priority = this.priority;
  
  if (priority === 'urgent' && age > 300000) return 'critical'; // 5 minutes
  if (priority === 'high' && age > 900000) return 'urgent'; // 15 minutes
  if (priority === 'medium' && age > 3600000) return 'high'; // 1 hour
  if (priority === 'low' && age > 86400000) return 'medium'; // 24 hours
  
  return priority;
});

// Pre-save middleware to generate ID
notificationSchema.pre('save', function(next) {
  if (!this.id) {
    this.id = `NOTIF_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  next();
});

// Static methods
notificationSchema.statics.createNotification = function(data) {
  return this.create({
    ...data,
    delivered: false,
    read: false
  });
};

notificationSchema.statics.getUnreadCount = function(recipientId, recipientType) {
  return this.countDocuments({
    recipientId,
    recipientType,
    read: false,
    expiresAt: { $gt: new Date() }
  });
};

notificationSchema.statics.markAsRead = function(notificationId, recipientId) {
  return this.findOneAndUpdate(
    { _id: notificationId, recipientId },
    { read: true, readAt: new Date() },
    { new: true }
  );
};

notificationSchema.statics.markAllAsRead = function(recipientId, recipientType) {
  return this.updateMany(
    { recipientId, recipientType, read: false },
    { read: true, readAt: new Date() }
  );
};

notificationSchema.statics.getNotifications = function(recipientId, recipientType, options = {}) {
  const {
    limit = 50,
    skip = 0,
    unreadOnly = false,
    type = null,
    priority = null
  } = options;
  
  const query = {
    recipientId,
    recipientType,
    expiresAt: { $gt: new Date() }
  };
  
  if (unreadOnly) query.read = false;
  if (type) query.type = type;
  if (priority) query.priority = priority;
  
  return this.find(query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .populate('requestId', 'requestNumber customerName status');
};

// Instance methods
notificationSchema.methods.markAsRead = function() {
  this.read = true;
  this.readAt = new Date();
  return this.save();
};

notificationSchema.methods.markAsDelivered = function() {
  this.delivered = true;
  this.deliveredAt = new Date();
  return this.save();
};

notificationSchema.methods.isExpired = function() {
  return this.expiresAt && this.expiresAt < new Date();
};

notificationSchema.methods.canBeRead = function() {
  return !this.read && !this.isExpired();
};

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;