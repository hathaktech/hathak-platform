import mongoose from 'mongoose';

const orderFulfillmentSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  orderItem: { type: mongoose.Schema.Types.ObjectId, required: true }, // Reference to order item
  
  // Fulfillment details
  fulfillmentType: { 
    type: String, 
    enum: ['seller_fulfilled', 'platform_fulfilled', 'dropship'], 
    required: true 
  },
  fulfillmentCenter: { type: mongoose.Schema.Types.ObjectId, ref: 'FulfillmentCenter' },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true },
  
  // Product and quantity
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  productVariant: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductVariant' },
  quantity: { type: Number, required: true, min: 1 },
  
  // Status tracking
  status: { 
    type: String, 
    enum: [
      'pending',           // Waiting for processing
      'confirmed',         // Confirmed by fulfillment center
      'picking',          // Items being picked from inventory
      'picked',           // Items picked and ready for packing
      'packing',          // Items being packed
      'packed',           // Items packed and ready for shipping
      'shipped',          // Items shipped
      'delivered',        // Items delivered
      'cancelled',        // Fulfillment cancelled
      'returned',         // Items returned
      'refunded'          // Fulfillment refunded
    ], 
    default: 'pending' 
  },
  
  // Timeline
  statusHistory: [{
    status: String,
    timestamp: { type: Date, default: Date.now },
    notes: String,
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }],
  
  // Shipping details
  shipping: {
    method: String, // 'standard', 'express', 'overnight'
    carrier: String, // 'fedex', 'ups', 'dhl', 'usps'
    trackingNumber: String,
    trackingUrl: String,
    estimatedDelivery: Date,
    actualDelivery: Date,
    shippingCost: Number,
    labelGenerated: { type: Boolean, default: false },
    labelUrl: String
  },
  
  // Address
  shippingAddress: {
    name: String,
    company: String,
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String,
    phone: String
  },
  
  // Inventory
  inventoryReservation: {
    inventoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Inventory' },
    reservedAt: Date,
    expiresAt: Date,
    quantity: Number
  },
  
  // Pick, Pack, Ship workflow
  workflow: {
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    pickList: [{
      location: String,
      product: String,
      quantity: Number,
      picked: { type: Boolean, default: false },
      pickedAt: Date,
      pickedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    }],
    packingSlip: {
      generated: { type: Boolean, default: false },
      url: String,
      generatedAt: Date
    },
    shippingLabel: {
      generated: { type: Boolean, default: false },
      url: String,
      generatedAt: Date,
      carrier: String,
      service: String
    }
  },
  
  // Quality control
  qualityCheck: {
    required: { type: Boolean, default: false },
    status: { type: String, enum: ['pending', 'passed', 'failed'], default: 'pending' },
    checkedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    checkedAt: Date,
    notes: String
  },
  
  // Special handling
  specialInstructions: String,
  fragile: { type: Boolean, default: false },
  hazardous: { type: Boolean, default: false },
  temperatureControlled: { type: Boolean, default: false },
  
  // Costs and fees
  costs: {
    fulfillmentFee: Number,
    shippingCost: Number,
    packagingCost: Number,
    handlingFee: Number,
    totalCost: Number
  },
  
  // Dropship specific
  dropship: {
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' },
    supplierOrderId: String,
    supplierTracking: String,
    supplierStatus: String,
    lastSync: Date
  },
  
  // Returns and exchanges
  returnInfo: {
    returnable: { type: Boolean, default: true },
    returnWindow: Number, // days
    returnReason: String,
    returnStatus: { type: String, enum: ['none', 'requested', 'approved', 'received', 'processed'] },
    returnTracking: String
  },
  
  // Notifications
  notifications: [{
    type: String,
    sent: { type: Boolean, default: false },
    sentAt: Date,
    recipient: String,
    channel: { type: String, enum: ['email', 'sms', 'push'] }
  }],
  
  // Metadata
  priority: { type: String, enum: ['low', 'normal', 'high', 'urgent'], default: 'normal' },
  tags: [String],
  notes: String,
  internalNotes: String
}, { timestamps: true });

// Indexes
orderFulfillmentSchema.index({ order: 1 });
orderFulfillmentSchema.index({ status: 1 });
orderFulfillmentSchema.index({ fulfillmentCenter: 1, status: 1 });
orderFulfillmentSchema.index({ seller: 1, status: 1 });
orderFulfillmentSchema.index({ 'shipping.trackingNumber': 1 });
orderFulfillmentSchema.index({ createdAt: -1 });

// Pre-save middleware to add status to history
orderFulfillmentSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date()
    });
  }
  next();
});

// Method to update status
orderFulfillmentSchema.methods.updateStatus = function(newStatus, notes, updatedBy) {
  this.status = newStatus;
  this.statusHistory.push({
    status: newStatus,
    timestamp: new Date(),
    notes: notes,
    updatedBy: updatedBy
  });
  return this.save();
};

// Method to generate tracking URL
orderFulfillmentSchema.methods.generateTrackingUrl = function() {
  if (!this.shipping.trackingNumber || !this.shipping.carrier) {
    return null;
  }
  
  const trackingUrls = {
    'fedex': `https://www.fedex.com/fedextrack/?trknbr=${this.shipping.trackingNumber}`,
    'ups': `https://www.ups.com/track?track=yes&trackNums=${this.shipping.trackingNumber}`,
    'dhl': `https://www.dhl.com/tracking?trackingNumber=${this.shipping.trackingNumber}`,
    'usps': `https://tools.usps.com/go/TrackConfirmAction?qtc_tLabels1=${this.shipping.trackingNumber}`
  };
  
  this.shipping.trackingUrl = trackingUrls[this.shipping.carrier.toLowerCase()] || null;
  return this.shipping.trackingUrl;
};

export default mongoose.model('OrderFulfillment', orderFulfillmentSchema);
