import mongoose from 'mongoose';

const promotionSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  code: { type: String, unique: true, sparse: true, uppercase: true },
  
  // Promotion type
  type: { 
    type: String, 
    enum: ['percentage', 'fixed_amount', 'free_shipping', 'buy_x_get_y', 'bundle', 'flash_sale'],
    required: true 
  },
  
  // Value and conditions
  value: { type: Number, required: true, min: 0 },
  minOrderAmount: { type: Number, default: 0 },
  maxDiscountAmount: { type: Number },
  maxUses: { type: Number },
  maxUsesPerUser: { type: Number, default: 1 },
  
  // Targeting
  targetType: { 
    type: String, 
    enum: ['all', 'products', 'categories', 'sellers', 'users'],
    default: 'all' 
  },
  targetIds: [{ type: mongoose.Schema.Types.ObjectId }], // Product, category, seller, or user IDs
  
  // User targeting
  userSegments: [{
    type: { type: String, enum: ['new_customer', 'returning_customer', 'vip', 'location', 'purchase_history'] },
    value: mongoose.Schema.Types.Mixed
  }],
  
  // Validity period
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  timezone: { type: String, default: 'UTC' },
  
  // Status and visibility
  status: { 
    type: String, 
    enum: ['draft', 'active', 'paused', 'expired', 'cancelled'],
    default: 'draft' 
  },
  visibility: { 
    type: String, 
    enum: ['public', 'private', 'unlisted'],
    default: 'public' 
  },
  
  // Usage tracking
  usage: {
    totalUses: { type: Number, default: 0 },
    totalDiscount: { type: Number, default: 0 },
    uniqueUsers: { type: Number, default: 0 },
    lastUsed: Date
  },
  
  // Advanced conditions
  conditions: {
    // Product conditions
    productConditions: [{
      type: { type: String, enum: ['category', 'brand', 'price_range', 'tags', 'seller'] },
      operator: { type: String, enum: ['equals', 'not_equals', 'in', 'not_in', 'greater_than', 'less_than'] },
      value: mongoose.Schema.Types.Mixed
    }],
    
    // User conditions
    userConditions: [{
      type: { type: String, enum: ['registration_date', 'purchase_count', 'total_spent', 'location', 'device'] },
      operator: { type: String, enum: ['equals', 'not_equals', 'in', 'not_in', 'greater_than', 'less_than'] },
      value: mongoose.Schema.Types.Mixed
    }],
    
    // Time conditions
    timeConditions: {
      dayOfWeek: [Number], // 0-6 (Sunday-Saturday)
      timeOfDay: {
        start: String, // HH:MM format
        end: String    // HH:MM format
      },
      specificDates: [Date]
    }
  },
  
  // Display settings
  display: {
    title: String,
    subtitle: String,
    image: String,
    backgroundColor: String,
    textColor: String,
    position: { type: String, enum: ['top', 'bottom', 'sidebar', 'popup'], default: 'top' },
    priority: { type: Number, default: 0 }
  },
  
  // A/B Testing
  abTest: {
    enabled: { type: Boolean, default: false },
    variant: { type: String, enum: ['control', 'test'], default: 'control' },
    trafficAllocation: { type: Number, default: 50 }, // Percentage
    testId: String
  },
  
  // Analytics
  analytics: {
    views: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    conversions: { type: Number, default: 0 },
    revenue: { type: Number, default: 0 },
    conversionRate: { type: Number, default: 0 }
  },
  
  // Audit trail
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  lastModifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  // Notifications
  notifications: [{
    type: { type: String, enum: ['usage_alert', 'expiry_warning', 'performance_alert'] },
    threshold: Number,
    sent: { type: Boolean, default: false },
    sentAt: Date
  }],
  
  // Metadata
  tags: [String],
  notes: String,
  internalNotes: String
}, { timestamps: true });

// Indexes
promotionSchema.index({ code: 1 });
promotionSchema.index({ status: 1, startDate: 1, endDate: 1 });
promotionSchema.index({ type: 1, status: 1 });
promotionSchema.index({ 'targetType': 1, 'targetIds': 1 });
promotionSchema.index({ createdBy: 1 });
promotionSchema.index({ createdAt: -1 });

// Pre-save middleware to validate dates
promotionSchema.pre('save', function(next) {
  if (this.startDate >= this.endDate) {
    return next(new Error('Start date must be before end date'));
  }
  
  if (this.maxUses && this.usage.totalUses >= this.maxUses) {
    this.status = 'expired';
  }
  
  if (new Date() > this.endDate) {
    this.status = 'expired';
  }
  
  next();
});

// Method to check if promotion is valid
promotionSchema.methods.isValid = function() {
  const now = new Date();
  return this.status === 'active' && 
         this.startDate <= now && 
         this.endDate >= now &&
         (!this.maxUses || this.usage.totalUses < this.maxUses);
};

// Method to check if user can use promotion
promotionSchema.methods.canUseByUser = function(userId, orderAmount = 0) {
  if (!this.isValid()) return false;
  
  // Check minimum order amount
  if (orderAmount < this.minOrderAmount) return false;
  
  // Check user-specific conditions
  if (this.maxUsesPerUser) {
    // This would need to be implemented with actual usage tracking
    // For now, return true
  }
  
  return true;
};

// Method to calculate discount
promotionSchema.methods.calculateDiscount = function(orderAmount, orderItems = []) {
  if (!this.canUseByUser(null, orderAmount)) return 0;
  
  let discount = 0;
  
  switch (this.type) {
    case 'percentage':
      discount = (orderAmount * this.value) / 100;
      break;
    case 'fixed_amount':
      discount = Math.min(this.value, orderAmount);
      break;
    case 'free_shipping':
      // This would be handled separately in shipping calculation
      discount = 0;
      break;
    case 'buy_x_get_y':
      // Complex logic for buy X get Y promotions
      discount = this.calculateBuyXGetYDiscount(orderItems);
      break;
    case 'bundle':
      // Complex logic for bundle promotions
      discount = this.calculateBundleDiscount(orderItems);
      break;
    case 'flash_sale':
      discount = (orderAmount * this.value) / 100;
      break;
  }
  
  // Apply maximum discount limit
  if (this.maxDiscountAmount) {
    discount = Math.min(discount, this.maxDiscountAmount);
  }
  
  return Math.round(discount * 100) / 100;
};

// Method to record usage
promotionSchema.methods.recordUsage = function(userId, discountAmount) {
  this.usage.totalUses += 1;
  this.usage.totalDiscount += discountAmount;
  this.usage.lastUsed = new Date();
  
  // Update analytics
  this.analytics.conversions += 1;
  this.analytics.revenue += discountAmount;
  this.analytics.conversionRate = this.analytics.conversions / Math.max(this.analytics.views, 1) * 100;
  
  return this.save();
};

// Static method to find active promotions
promotionSchema.statics.findActive = function() {
  const now = new Date();
  return this.find({
    status: 'active',
    startDate: { $lte: now },
    endDate: { $gte: now }
  });
};

// Static method to find applicable promotions
promotionSchema.statics.findApplicable = function(userId, orderAmount, orderItems = []) {
  return this.findActive().then(promotions => {
    return promotions.filter(promo => promo.canUseByUser(userId, orderAmount));
  });
};

export default mongoose.model('Promotion', promotionSchema);
