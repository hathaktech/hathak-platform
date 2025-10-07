import mongoose from 'mongoose';

const variantSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: true,
    trim: true
  },
  sku: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  
  // Pricing
  price: {
    type: Number,
    required: true,
    min: 0
  },
  compareAtPrice: {
    type: Number,
    min: 0
  },
  costPrice: {
    type: Number,
    min: 0
  },
  
  // Inventory
  inventory: {
    quantity: {
      type: Number,
      default: 0,
      min: 0
    },
    trackQuantity: {
      type: Boolean,
      default: true
    },
    allowBackorder: {
      type: Boolean,
      default: false
    },
    lowStockThreshold: {
      type: Number,
      default: 10
    }
  },
  
  // Physical Attributes
  weight: {
    value: Number,
    unit: { type: String, enum: ['g', 'kg', 'lb', 'oz'], default: 'kg' }
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
    unit: { type: String, enum: ['cm', 'in', 'm'], default: 'cm' }
  },
  
  // Variant Options (size, color, material, etc.)
  options: {
    size: String,
    color: String,
    material: String,
    style: String,
    pattern: String,
    // Flexible options object for custom attributes
    custom: mongoose.Schema.Types.Mixed
  },
  
  // Media
  images: [{
    url: String,
    alt: String,
    isPrimary: { type: Boolean, default: false },
    order: { type: Number, default: 0 }
  }],
  
  // SEO
  seo: {
    title: String,
    description: String,
    keywords: [String]
  },
  
  // Status
  status: {
    type: String,
    enum: ['active', 'inactive', 'draft', 'archived'],
    default: 'active'
  },
  
  // Analytics
  analytics: {
    views: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    conversions: { type: Number, default: 0 },
    lastViewed: Date
  },
  
  // Timestamps
  lastRestocked: Date,
  lastSold: Date
}, {
  timestamps: true
});

// Index for efficient queries
variantSchema.index({ sku: 1 });
variantSchema.index({ 'inventory.quantity': 1 });
variantSchema.index({ status: 1 });
variantSchema.index({ 'options.size': 1, 'options.color': 1 });

// Virtual for availability status
variantSchema.virtual('availability').get(function() {
  if (this.status !== 'active') return 'unavailable';
  if (this.inventory.trackQuantity && this.inventory.quantity <= 0) {
    return this.inventory.allowBackorder ? 'backorder' : 'out_of_stock';
  }
  if (this.inventory.trackQuantity && this.inventory.quantity <= this.inventory.lowStockThreshold) {
    return 'low_stock';
  }
  return 'in_stock';
});

// Method to check if variant is available
variantSchema.methods.isAvailable = function() {
  return this.status === 'active' && 
         (!this.inventory.trackQuantity || 
          this.inventory.quantity > 0 || 
          this.inventory.allowBackorder);
};

// Method to update inventory
variantSchema.methods.updateInventory = function(quantity, operation = 'set') {
  if (operation === 'add') {
    this.inventory.quantity += quantity;
  } else if (operation === 'subtract') {
    this.inventory.quantity = Math.max(0, this.inventory.quantity - quantity);
  } else {
    this.inventory.quantity = quantity;
  }
  
  if (quantity > 0) {
    this.lastRestocked = new Date();
  }
  
  return this.save();
};

// Method to record sale
variantSchema.methods.recordSale = function(quantity = 1) {
  this.analytics.conversions += quantity;
  this.lastSold = new Date();
  return this.updateInventory(quantity, 'subtract');
};

const ProductVariant = mongoose.model('ProductVariant', variantSchema);
export default ProductVariant;
