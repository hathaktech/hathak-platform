import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  productVariant: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductVariant' },
  fulfillmentCenter: { type: mongoose.Schema.Types.ObjectId, ref: 'FulfillmentCenter', required: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true },
  
  // Physical inventory
  quantity: { type: Number, required: true, min: 0 },
  reserved: { type: Number, default: 0, min: 0 }, // Reserved for pending orders
  available: { type: Number, required: true, min: 0 }, // quantity - reserved
  
  // Inventory management
  reorderPoint: { type: Number, default: 0 },
  reorderQuantity: { type: Number, default: 0 },
  maxStock: { type: Number },
  minStock: { type: Number, default: 0 },
  
  // Location within fulfillment center
  location: {
    zone: String, // e.g., 'A1', 'B2'
    shelf: String,
    bin: String,
    coordinates: {
      x: Number,
      y: Number,
      z: Number
    }
  },
  
  // Cost and pricing
  costPrice: { type: Number, min: 0 },
  landedCost: { type: Number, min: 0 }, // Cost including shipping, duties, etc.
  
  // Status and tracking
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'discontinued', 'recalled'], 
    default: 'active' 
  },
  lastCounted: Date,
  lastRestocked: Date,
  lastSold: Date,
  
  // Batch/lot tracking
  batchNumber: String,
  expiryDate: Date,
  serialNumbers: [String],
  
  // Quality control
  qualityStatus: { 
    type: String, 
    enum: ['passed', 'failed', 'pending', 'quarantined'], 
    default: 'passed' 
  },
  qualityNotes: String,
  
  // Movement tracking
  movements: [{
    type: { type: String, enum: ['in', 'out', 'adjustment', 'reservation', 'release'] },
    quantity: Number,
    reason: String,
    reference: String, // Order ID, PO number, etc.
    performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    timestamp: { type: Date, default: Date.now },
    notes: String
  }],
  
  // Alerts and notifications
  alerts: [{
    type: { type: String, enum: ['low_stock', 'out_of_stock', 'overstock', 'expiry', 'quality_issue'] },
    message: String,
    severity: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

// Indexes
inventorySchema.index({ product: 1, fulfillmentCenter: 1 });
inventorySchema.index({ seller: 1, fulfillmentCenter: 1 });
inventorySchema.index({ status: 1, available: 1 });
inventorySchema.index({ 'location.zone': 1, 'location.shelf': 1 });
inventorySchema.index({ batchNumber: 1 });
inventorySchema.index({ expiryDate: 1 });

// Virtual for stock level
inventorySchema.virtual('stockLevel').get(function() {
  if (this.quantity === 0) return 'out_of_stock';
  if (this.available <= this.reorderPoint) return 'low_stock';
  if (this.available >= this.maxStock * 0.9) return 'overstock';
  return 'normal';
});

// Pre-save middleware to update available quantity
inventorySchema.pre('save', function(next) {
  this.available = Math.max(0, this.quantity - this.reserved);
  next();
});

// Method to reserve inventory
inventorySchema.methods.reserve = function(quantity, reason, reference, performedBy) {
  if (this.available < quantity) {
    throw new Error('Insufficient available inventory');
  }
  
  this.reserved += quantity;
  this.available -= quantity;
  
  this.movements.push({
    type: 'reservation',
    quantity: quantity,
    reason: reason,
    reference: reference,
    performedBy: performedBy
  });
  
  return this.save();
};

// Method to release reserved inventory
inventorySchema.methods.release = function(quantity, reason, reference, performedBy) {
  const releaseQuantity = Math.min(quantity, this.reserved);
  
  this.reserved -= releaseQuantity;
  this.available += releaseQuantity;
  
  this.movements.push({
    type: 'release',
    quantity: releaseQuantity,
    reason: reason,
    reference: reference,
    performedBy: performedBy
  });
  
  return this.save();
};

// Method to adjust inventory
inventorySchema.methods.adjust = function(quantity, reason, reference, performedBy, notes) {
  this.quantity += quantity;
  this.available += quantity;
  
  this.movements.push({
    type: 'adjustment',
    quantity: quantity,
    reason: reason,
    reference: reference,
    performedBy: performedBy,
    notes: notes
  });
  
  return this.save();
};

export default mongoose.model('Inventory', inventorySchema);
