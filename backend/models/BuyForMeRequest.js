// models/BuyForMeRequest.js - Unified BuyForMe Request Model
import mongoose from 'mongoose';

// Item schema for individual products
const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  url: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^https?:\/\/.+/.test(v);
      },
      message: 'Must be a valid URL'
    }
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    max: 100
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'USD',
    enum: ['USD', 'EUR', 'GBP', 'TRY', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR', 'BRL', 'MXN', 'KRW', 'SGD', 'HKD', 'NZD', 'SEK', 'NOK', 'DKK', 'PLN', 'CZK', 'HUF', 'RUB', 'ZAR', 'AED', 'SAR', 'EGP', 'ILS', 'THB', 'MYR', 'IDR', 'PHP', 'VND']
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  sizes: [{
    type: String,
    trim: true
  }],
  colors: [{
    type: String,
    trim: true
  }],
  images: [{
    type: String,
    validate: {
      validator: function(v) {
        return /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(v);
      },
      message: 'Must be a valid image URL'
    }
  }],
  received: {
    type: Boolean,
    default: false
  },
  receivedAt: Date,
  condition: {
    type: String,
    enum: ['excellent', 'good', 'fair', 'damaged', 'defective'],
    default: 'excellent'
  },
  notes: {
    type: String,
    trim: true,
    maxlength: 500
  }
}, { _id: true });

// Shipping address schema
const shippingAddressSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  street: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  city: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  state: {
    type: String,
    trim: true,
    maxlength: 100
  },
  country: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  postalCode: {
    type: String,
    required: true,
    trim: true,
    maxlength: 20
  },
  phone: {
    type: String,
    trim: true,
    maxlength: 20
  }
});

// Order details schema
const orderDetailsSchema = new mongoose.Schema({
  purchaseDate: Date,
  purchasedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  supplier: {
    type: String,
    trim: true,
    maxlength: 100
  },
  purchaseOrderNumber: {
    type: String,
    trim: true,
    maxlength: 50
  },
  estimatedDelivery: Date,
  actualDelivery: Date,
  trackingNumber: {
    type: String,
    trim: true,
    maxlength: 100
  },
  notes: {
    type: String,
    trim: true,
    maxlength: 500
  },
  purchaseAmount: {
    type: Number,
    min: 0
  },
  paymentMethod: {
    type: String,
    trim: true,
    maxlength: 100
  },
  currency: {
    type: String,
    trim: true,
    maxlength: 10
  },
  shippingAddress: {
    type: String,
    trim: true,
    maxlength: 500
  }
});

// Control details schema
const controlDetailsSchema = new mongoose.Schema({
  controlledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  controlDate: Date,
  controlNotes: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  photos: [{
    type: String,
    validate: {
      validator: function(v) {
        return /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(v);
      },
      message: 'Must be a valid image URL'
    }
  }],
  itemConditions: [{
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    condition: {
      type: String,
      enum: ['excellent', 'good', 'fair', 'damaged', 'defective'],
      required: true
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 500
    },
    photos: [{
      type: String,
      validate: {
        validator: function(v) {
          return /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(v);
        },
        message: 'Must be a valid image URL'
      }
    }]
  }]
});

// Customer review schema
const customerReviewSchema = new mongoose.Schema({
  reviewedAt: Date,
  customerDecision: {
    type: String,
    enum: ['approved', 'rejected', 'needs_replacement'],
    required: true
  },
  customerNotes: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  rejectedItems: [{
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    reason: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500
    },
    action: {
      type: String,
      enum: ['return', 'replace', 'refund'],
      required: true
    }
  }]
});

// Packing choice schema
const packingChoiceSchema = new mongoose.Schema({
  choice: {
    type: String,
    enum: ['pack_now', 'wait_in_box'],
    required: true
  },
  chosenAt: Date,
  customerNotes: {
    type: String,
    trim: true,
    maxlength: 500
  }
});

// Review comment schema
const reviewCommentSchema = new mongoose.Schema({
  comment: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  adminName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  isInternal: {
    type: Boolean,
    default: false
  }
});

// Main BuyForMe Request schema
const buyForMeRequestSchema = new mongoose.Schema({
  // Core identification
  requestNumber: {
    type: String,
    unique: true,
    uppercase: true,
    match: /^BFM\d{8}$/
  },
  
  
  // Customer information
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  customerName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  customerEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'Must be a valid email address'
    }
  },
  
  // Request items
  items: {
    type: [itemSchema],
    required: true,
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: 'At least one item is required'
    }
  },
  
  // Financial information
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'USD',
    enum: ['USD', 'EUR', 'GBP', 'TRY', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR', 'BRL', 'MXN', 'KRW', 'SGD', 'HKD', 'NZD', 'SEK', 'NOK', 'DKK', 'PLN', 'CZK', 'HUF', 'RUB', 'ZAR', 'AED', 'SAR', 'EGP', 'ILS', 'THB', 'MYR', 'IDR', 'PHP', 'VND']
  },
  
  // Enhanced Status management system
  status: {
    type: String,
    enum: [
      'pending',              // Initial request, awaiting admin review
      'approved',             // Approved by admin, awaiting payment
      'in_progress',          // Payment completed, processing
      'inspection',           // Items arrived, under inspection
      'ready_to_ship',       // Inspection passed, ready for packaging
      'packaging',           // User selecting packaging options
      'shipped',             // Shipped to customer
      'delivered',           // Customer confirmed receipt
      'cancelled',           // Cancelled at any stage
      'changes_requested'    // Admin requested changes
    ],
    default: 'pending'
  },
  
  // Enhanced Sub-status for detailed tracking
  subStatus: {
    type: String,
    enum: [
      // Review Stage
      'under_review',         // Under admin review
      'review_completed',     // Review completed
      
      // Payment Stage
      'payment_pending',      // Waiting for payment
      'payment_completed',    // Payment received
      'payment_failed',       // Payment failed
      
      // Processing Stage
      'purchasing',           // Items being purchased
      'purchased',            // Items purchased
      'shipping_to_warehouse', // Shipping to warehouse
      'arrived_at_warehouse', // Arrived at warehouse
      
      // Inspection Stage
      'inspection_pending',   // Inspection pending
      'inspection_in_progress', // Inspection in progress
      'inspection_passed',    // Inspection passed
      'inspection_failed',    // Inspection failed
      
      // Packaging Stage
      'packaging_options_sent', // Packaging options sent to user
      'packaging_selected',   // User selected packaging
      'packaging_in_progress', // Packaging in progress
      'packaged',             // Items packaged
      
      // Shipping Stage
      'shipping_prepared',    // Shipping prepared
      'shipped',              // Shipped
      'in_transit',           // In transit
      'out_for_delivery',    // Out for delivery
      
      // Delivery Stage
      'delivered',            // Delivered
      'delivery_confirmed',   // Delivery confirmed by customer
      
      // Changes Stage
      'changes_requested',    // Changes requested by admin
      'changes_submitted',    // Changes submitted by user
      'changes_approved',     // Changes approved by admin
      'changes_rejected'      // Changes rejected by admin
    ]
  },
  
  // Priority and review
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  reviewStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'needs_modification'],
    default: 'pending'
  },
  
  // Payment information
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'paypal', 'bank_transfer', 'cash'],
    default: 'credit_card'
  },
  transactionId: {
    type: String,
    trim: true,
    maxlength: 100
  },
  
  // Shipping information
  shippingAddress: {
    type: shippingAddressSchema,
    required: true
  },
  trackingNumber: {
    type: String,
    trim: true,
    maxlength: 100
  },
  
  // Packaging
  packagingChoice: {
    type: String,
    enum: ['original', 'grouped', 'mixed']
  },
  
  // Photos and documentation
  photos: [{
    type: String,
    validate: {
      validator: function(v) {
        return /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(v);
      },
      message: 'Must be a valid image URL'
    }
  }],
  
  // Notes and comments
  notes: {
    type: String,
    trim: true,
    maxlength: 2000
  },
  adminNotes: {
    type: String,
    trim: true,
    maxlength: 2000
  },
  rejectionReason: {
    type: String,
    trim: true,
    maxlength: 500
  },
  
  // Review system
  reviewComments: [reviewCommentSchema],
  
  // Detailed information
  orderDetails: orderDetailsSchema,
  controlDetails: controlDetailsSchema,
  customerReview: customerReviewSchema,
  packingChoice: packingChoiceSchema,
  
  // Delivery tracking
  estimatedDelivery: Date,
  actualDelivery: Date,
  
  // Cancellation
  cancelledAt: Date,
  cancellationReason: {
    type: String,
    trim: true,
    maxlength: 500
  },
  
  // Modification tracking
  modifiedByUser: {
    type: Boolean,
    default: false
  },
  modifiedByAdmin: {
    type: Boolean,
    default: false
  },
  adminModificationDate: Date,
  adminModificationNote: {
    type: String,
    trim: true,
    maxlength: 500
  },
  lastModifiedByAdmin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  lastModifiedByUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  modifiedButNeedsModification: {
    type: Boolean,
    default: false
  },
  
  // Original values for comparison
  originalValues: {
    productName: String,
    productLink: String,
    notes: String,
    quantity: Number,
    estimatedPrice: Number,
    currency: String
  },
  
  // Request Changes Workflow
  changeRequirements: [{
    id: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['product_change', 'quantity_change', 'price_change', 'shipping_change', 'other'],
      required: true
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500
    },
    required: {
      type: Boolean,
      default: true
    },
    currentValue: mongoose.Schema.Types.Mixed,
    suggestedValue: mongoose.Schema.Types.Mixed,
    reason: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500
    },
    deadline: Date,
    status: {
      type: String,
      enum: ['pending', 'submitted', 'approved', 'rejected'],
      default: 'pending'
    },
    submittedAt: Date,
    submittedValue: mongoose.Schema.Types.Mixed,
    submittedExplanation: String,
    reviewedAt: Date,
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin'
    },
    reviewComments: String
  }],
  
  changesDeadline: Date,
  changesPriority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  changesRequestedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  changesRequestedAt: Date,
  changesRequestComments: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  changesRequestAttachments: [{
    filename: String,
    url: String,
    uploadedAt: Date
  }],
  
  // Packaging & Shipping Workflow
  packagingOptions: [{
    id: String,
    name: String,
    description: String,
    cost: Number,
    items: [String], // Which items this applies to
    available: {
      type: Boolean,
      default: true
    }
  }],
  
  selectedPackaging: [{
    optionId: String,
    items: [String],
    quantity: Number,
    cost: Number
  }],
  
  packagingDeadline: Date,
  packagingInstructions: String,
  
  // Warehouse Inspection
  inspectionDetails: {
    inspectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin'
    },
    inspectionDate: Date,
    inspectionNotes: String,
    itemConditions: [{
      itemId: String,
      condition: {
        type: String,
        enum: ['excellent', 'good', 'fair', 'poor', 'damaged']
      },
      notes: String,
      photos: [String]
    }],
    passed: Boolean,
    photos: [String]
  },
  
  // Modification history
  modificationHistory: [{
    modificationNumber: Number,
    modifiedAt: Date,
    previousValues: {
      productName: String,
      productLink: String,
      notes: String,
      quantity: Number,
      estimatedPrice: Number,
      currency: String
    },
    newValues: {
      productName: String,
      productLink: String,
      notes: String,
      quantity: Number,
      estimatedPrice: Number,
      currency: String
    }
  }],

  // Comprehensive process change tracking
  processHistory: [{
    processId: {
      type: String,
      required: true
    },
    processType: {
      type: String,
      required: true,
      enum: [
        'status_change', 'substatus_change', 'priority_change', 'review_approval', 
        'review_rejection', 'payment_processed', 'payment_failed', 'marked_purchased',
        'tracking_added', 'packaging_selected', 'shipped', 'delivered', 'cancelled',
        'notes_added', 'admin_notes_added', 'review_comment_added', 'photo_added',
        'inspection_completed', 'customer_confirmed', 'customer_rejected', 'return_requested',
        'replacement_requested', 'refund_processed', 'request_created', 'request_modified',
        'arrived_to_warehouse', 'ready_to_ship', 'out_for_delivery', 'payment_received'
      ]
    },
    processAt: {
      type: Date,
      default: Date.now
    },
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      required: true
    },
    processedByName: {
      type: String,
      required: true,
      trim: true
    },
    processTitle: {
      type: String,
      required: true,
      trim: true
    },
    processDescription: {
      type: String,
      trim: true,
      maxlength: 1000
    },
    previousValue: mongoose.Schema.Types.Mixed,
    newValue: mongoose.Schema.Types.Mixed,
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound indexes for better query performance
buyForMeRequestSchema.index({ customerId: 1, status: 1 });
buyForMeRequestSchema.index({ status: 1, priority: 1, createdAt: -1 });
// requestNumber index is already created by unique: true
buyForMeRequestSchema.index({ customerEmail: 1 });
buyForMeRequestSchema.index({ createdAt: -1 });
buyForMeRequestSchema.index({ updatedAt: -1 });
buyForMeRequestSchema.index({ 'items.url': 1 });
buyForMeRequestSchema.index({ totalAmount: 1 });

// Text index for search functionality
buyForMeRequestSchema.index({
  customerName: 'text',
  customerEmail: 'text',
  'items.name': 'text',
  notes: 'text',
  adminNotes: 'text'
});

// Virtual for formatted status
buyForMeRequestSchema.virtual('statusFormatted').get(function() {
  const statusMap = {
    'pending': 'Pending Review',
    'approved': 'Approved',
    'in_progress': 'In Progress',
    'shipped': 'Shipped',
    'delivered': 'Delivered',
    'cancelled': 'Cancelled'
  };
  return statusMap[this.status] || 'Unknown';
});

// Virtual for customer view status
buyForMeRequestSchema.virtual('customerStatus').get(function() {
  const customerStatusMap = {
    'pending': 'Under Review',
    'approved': 'Ready to Pay',
    'in_progress': 'Processing',
    'shipped': 'On the Way',
    'delivered': 'Delivered',
    'cancelled': 'Cancelled'
  };
  return customerStatusMap[this.status] || 'Unknown';
});

// Virtual for total items count
buyForMeRequestSchema.virtual('totalItems').get(function() {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Pre-save middleware to generate request number
buyForMeRequestSchema.pre('save', async function(next) {
  if (!this.requestNumber) {
    let requestNumber;
    let isUnique = false;
    
    // Generate random request number until we find a unique one
    while (!isUnique) {
      // Generate random 8-digit number
      const randomNumber = Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
      requestNumber = `BFM${randomNumber}`;
      
      // Check if this request number already exists
      const existingRequest = await this.constructor.findOne({ requestNumber });
      if (!existingRequest) {
        isUnique = true;
      }
    }
    
    this.requestNumber = requestNumber;
  }
  
  // Calculate total amount
  if (this.items && this.items.length > 0) {
    this.totalAmount = this.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  }
  
  next();
});

// Pre-save middleware to update modification tracking
buyForMeRequestSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.modifiedByAdmin = true;
    this.adminModificationDate = new Date();
  }
  next();
});

// Static methods for common queries
buyForMeRequestSchema.statics.getByStatus = function(status) {
  return this.find({ status }).populate('customerId', 'name email');
};

buyForMeRequestSchema.statics.getByCustomer = function(customerId) {
  return this.find({ customerId }).sort({ createdAt: -1 });
};

buyForMeRequestSchema.statics.getStatistics = function(startDate, endDate) {
  const matchStage = {};
  if (startDate || endDate) {
    matchStage.createdAt = {};
    if (startDate) matchStage.createdAt.$gte = startDate;
    if (endDate) matchStage.createdAt.$lte = endDate;
  }

  return this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalRequests: { $sum: 1 },
        totalValue: { $sum: '$totalAmount' },
        averageValue: { $avg: '$totalAmount' },
        statusCounts: {
          $push: '$status'
        }
      }
    }
  ]);
};

// Instance methods
buyForMeRequestSchema.methods.updateStatus = function(newStatus, subStatus = null, adminId = null, adminName = null, reason = null, notes = null) {
  const previousStatus = this.status;
  const previousSubStatus = this.subStatus;
  
  // Track status change
  if (previousStatus !== newStatus) {
    this.addProcessRecord('status_change', adminId, adminName, 
      `Status changed from ${previousStatus} to ${newStatus}`,
      `Status updated: ${previousStatus} → ${newStatus}${reason ? ` | Reason: ${reason}` : ''}`,
      previousStatus, newStatus, { reason, notes });
  }
  
  // Track sub-status change
  if (previousSubStatus !== subStatus) {
    this.addProcessRecord('substatus_change', adminId, adminName,
      `Sub-status changed from ${previousSubStatus || 'none'} to ${subStatus || 'none'}`,
      `Sub-status updated: ${previousSubStatus || 'none'} → ${subStatus || 'none'}${reason ? ` | Reason: ${reason}` : ''}`,
      previousSubStatus, subStatus, { reason, notes });
  }
  
  this.status = newStatus;
  if (subStatus) this.subStatus = subStatus;
  if (adminId) this.lastModifiedByAdmin = adminId;
  this.updatedAt = new Date();
  return this.save();
};

// Add process record method
buyForMeRequestSchema.methods.addProcessRecord = function(processType, adminId, adminName, title, description, previousValue = null, newValue = null, metadata = {}) {
  const processId = `process_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  this.processHistory.push({
    processId,
    processType,
    processAt: new Date(),
    processedBy: adminId,
    processedByName: adminName || 'System',
    processTitle: title,
    processDescription: description,
    previousValue,
    newValue,
    metadata
  });
  
  return this;
};

buyForMeRequestSchema.methods.addComment = function(comment, adminId, adminName, isInternal = false) {
  this.reviewComments.push({
    comment,
    adminId,
    adminName,
    isInternal,
    createdAt: new Date()
  });
  
  // Track comment addition
  this.addProcessRecord('review_comment_added', adminId, adminName,
    `Review comment ${isInternal ? '(Internal)' : ''} added`,
    `Comment: ${comment.substring(0, 100)}${comment.length > 100 ? '...' : ''}`,
    null, comment, { isInternal });
  
  return this.save();
};

buyForMeRequestSchema.methods.addPhoto = function(photoUrl, adminId = null, adminName = null) {
  this.photos.push(photoUrl);
  
  // Track photo addition if admin info provided
  if (adminId && adminName) {
    this.addProcessRecord('photo_added', adminId, adminName,
      'Photo added to request',
      `Photo URL: ${photoUrl}`,
      null, photoUrl);
  }
  
  return this.save();
};

// Mark as purchased with process tracking
buyForMeRequestSchema.methods.markAsPurchased = function(adminId, adminName, supplier, trackingNumber, notes) {
  const previousStatus = this.status;
  const previousSubStatus = this.subStatus;
  
  this.status = 'in_progress';
  this.subStatus = 'purchased';
  this.lastModifiedByAdmin = adminId;
  
  // Track the purchase process
  this.addProcessRecord('marked_purchased', adminId, adminName,
    'Request marked as purchased',
    `Purchased from ${supplier || 'Unknown supplier'}${trackingNumber ? ` | Tracking: ${trackingNumber}` : ''}${notes ? ` | Notes: ${notes}` : ''}`,
    { status: previousStatus, subStatus: previousSubStatus },
    { status: this.status, subStatus: this.subStatus, supplier, trackingNumber },
    { supplier, trackingNumber, notes });
  
  this.updatedAt = new Date();
  return this.save();
};

// Add tracking number with process tracking
buyForMeRequestSchema.methods.addTrackingNumber = function(trackingNumber, adminId, adminName) {
  const previousTracking = this.trackingNumber;
  this.trackingNumber = trackingNumber;
  
  this.addProcessRecord('tracking_added', adminId, adminName,
    'Tracking number added/updated',
    `Tracking: ${previousTracking || 'None'} → ${trackingNumber}`,
    previousTracking, trackingNumber);
  
  this.updatedAt = new Date();
  return this.save();
};

const BuyForMeRequest = mongoose.model('BuyForMeRequest', buyForMeRequestSchema);

export default BuyForMeRequest;
