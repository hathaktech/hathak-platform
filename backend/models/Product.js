// models/Product.js
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    // Basic Information
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      index: 'text'
    },
    description: {
      type: String,
      default: '',
      index: 'text'
    },
    shortDescription: {
      type: String,
      maxlength: 160
    },
    
    // Pricing (for simple products without variants)
    price: {
      type: Number,
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
    
    // Inventory (for simple products)
    stock: {
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
    
    // Categorization
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true
    },
    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category'
    },
    tags: [{
      type: String,
      trim: true
    }],
    
    // Product Type & Variants
    type: {
      type: String,
      enum: ['simple', 'variable'],
      default: 'simple'
    },
    variants: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProductVariant'
    }],
    
    // Media
    images: [{
      url: { type: String, required: true },
      alt: String,
      isPrimary: { type: Boolean, default: false },
      order: { type: Number, default: 0 }
    }],
    videos: [{
      url: String,
      thumbnail: String,
      duration: Number,
      type: { type: String, enum: ['youtube', 'vimeo', 'upload'], default: 'upload' }
    }],
    
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
    
    // Seller Information
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Seller',
      required: true
    },
    
    // SEO
    seo: {
      title: String,
      description: String,
      keywords: [String],
      slug: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true
      }
    },
    
    // Status & Visibility
    status: {
      type: String,
      enum: ['draft', 'active', 'inactive', 'archived', 'pending_approval'],
      default: 'draft'
    },
    visibility: {
      type: String,
      enum: ['public', 'private', 'unlisted'],
      default: 'public'
    },
    
    // Features & Badges
    features: [{
      name: String,
      value: String,
      icon: String
    }],
    badges: [{
      type: String,
      enum: ['new', 'sale', 'bestseller', 'trending', 'limited', 'exclusive'],
      text: String,
      color: String
    }],
    
    // Shipping
    shipping: {
      weight: Number,
      dimensions: {
        length: Number,
        width: Number,
        height: Number
      },
      freeShipping: { type: Boolean, default: false },
      shippingClass: String,
      handlingTime: { type: Number, default: 1 }, // days
      internationalShipping: { type: Boolean, default: false }
    },
    
    // Analytics
    analytics: {
      views: { type: Number, default: 0 },
      clicks: { type: Number, default: 0 },
      conversions: { type: Number, default: 0 },
      wishlistCount: { type: Number, default: 0 },
      lastViewed: Date,
      lastSold: Date
    },
    
    // Reviews & Ratings
    reviews: {
      averageRating: { type: Number, default: 0, min: 0, max: 5 },
      totalReviews: { type: Number, default: 0 },
      ratingDistribution: {
        5: { type: Number, default: 0 },
        4: { type: Number, default: 0 },
        3: { type: Number, default: 0 },
        2: { type: Number, default: 0 },
        1: { type: Number, default: 0 }
      }
    },
    
    // Timestamps
    publishedAt: Date,
    lastRestocked: Date,
    lastSold: Date
  },
  { 
    timestamps: true,
    collection: 'products'
  }
);

// Indexes for performance
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, status: 1 });
productSchema.index({ seller: 1, status: 1 });
productSchema.index({ 'analytics.views': -1 });
productSchema.index({ 'reviews.averageRating': -1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ 'seo.slug': 1 });

// Virtual for primary image
productSchema.virtual('primaryImage').get(function() {
  const primary = this.images.find(img => img.isPrimary);
  return primary || this.images[0] || null;
});

// Virtual for availability
productSchema.virtual('availability').get(function() {
  if (this.status !== 'active') return 'unavailable';
  if (this.type === 'variable') {
    const availableVariants = this.variants.filter(v => v.isAvailable());
    return availableVariants.length > 0 ? 'in_stock' : 'out_of_stock';
  }
  if (this.trackQuantity && this.stock <= 0) {
    return this.allowBackorder ? 'backorder' : 'out_of_stock';
  }
  return 'in_stock';
});

// Method to check if product is available
productSchema.methods.isAvailable = function() {
  return this.status === 'active' && 
         this.visibility === 'public' &&
         (this.type === 'variable' ? 
          this.variants.some(v => v.isAvailable()) :
          (!this.trackQuantity || this.stock > 0 || this.allowBackorder));
};

// Method to update inventory
productSchema.methods.updateInventory = function(quantity, operation = 'set') {
  if (this.type === 'simple') {
    if (operation === 'add') {
      this.stock += quantity;
    } else if (operation === 'subtract') {
      this.stock = Math.max(0, this.stock - quantity);
    } else {
      this.stock = quantity;
    }
    
    if (quantity > 0) {
      this.lastRestocked = new Date();
    }
  }
  return this.save();
};

// Method to record view
productSchema.methods.recordView = function() {
  this.analytics.views += 1;
  this.analytics.lastViewed = new Date();
  return this.save();
};

// Method to record sale
productSchema.methods.recordSale = function(quantity = 1) {
  this.analytics.conversions += quantity;
  this.lastSold = new Date();
  return this.updateInventory(quantity, 'subtract');
};

// Method to update rating
productSchema.methods.updateRating = function(rating) {
  const reviews = this.reviews;
  reviews.totalReviews += 1;
  
  // Update rating distribution
  reviews.ratingDistribution[rating] += 1;
  
  // Calculate new average
  let totalPoints = 0;
  let totalReviews = 0;
  for (let i = 1; i <= 5; i++) {
    totalPoints += i * reviews.ratingDistribution[i];
    totalReviews += reviews.ratingDistribution[i];
  }
  reviews.averageRating = totalReviews > 0 ? totalPoints / totalReviews : 0;
  
  return this.save();
};

const Product = mongoose.model('Product', productSchema);
export default Product;
