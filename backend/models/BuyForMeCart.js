// models/BuyForMeCart.js
import mongoose from "mongoose";

const buyForMeCartSchema = new mongoose.Schema(
  {
    // User reference
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },

    // Product details
    productName: { 
      type: String, 
      required: true,
      trim: true
    },
    productLink: { 
      type: String, 
      required: true,
      validate: {
        validator: function(v) {
          try {
            new URL(v);
            return true;
          } catch (error) {
            return false;
          }
        },
        message: 'Invalid product URL'
      }
    },
    images: [{ 
      type: String,
      validate: {
        validator: function(v) {
          try {
            new URL(v);
            return true;
          } catch (error) {
            return false;
          }
        },
        message: 'Invalid image URL'
      }
    }],
    colors: [{ 
      type: String,
      trim: true
    }],
    sizes: [{ 
      type: String,
      trim: true
    }],
    quantity: { 
      type: Number, 
      default: 1,
      min: 1
    },
    estimatedPrice: { 
      type: Number, 
      default: 0,
      min: 0
    },
    currency: { 
      type: String, 
      default: "USD",
      enum: ['USD', 'EUR', 'GBP', 'TRY', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR', 'BRL', 'MXN', 'KRW', 'SGD', 'HKD', 'NZD', 'SEK', 'NOK', 'DKK', 'PLN', 'CZK', 'HUF', 'RUB', 'ZAR', 'AED', 'SAR', 'EGP', 'ILS', 'THB', 'MYR', 'IDR', 'PHP', 'VND']
    },

    // Additional details
    notes: { 
      type: String, 
      default: "",
      maxlength: 1000
    },
    
    // Status tracking
    status: {
      type: String,
      enum: ['active', 'submitted', 'archived'],
      default: 'active'
    },
    
    // Metadata
    isActive: {
      type: Boolean,
      default: true
    },
    
    // Timestamps
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for better performance
buyForMeCartSchema.index({ userId: 1, status: 1 });
buyForMeCartSchema.index({ createdAt: -1 });

// Virtual for formatted price
buyForMeCartSchema.virtual('formattedPrice').get(function() {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: this.currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(this.estimatedPrice);
  } catch (error) {
    return `${this.currency} ${this.estimatedPrice.toFixed(2)}`;
  }
});

// Virtual for total cost
buyForMeCartSchema.virtual('totalCost').get(function() {
  return this.estimatedPrice * this.quantity;
});

// Pre-save middleware to update updatedAt
buyForMeCartSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});


// Static method to get user's BuyForMe cart items
buyForMeCartSchema.statics.getUserCartItems = function(userId) {
  return this.find({ userId, isActive: true, status: 'active' }).sort({ createdAt: -1 });
};

// Static method to archive product
buyForMeCartSchema.statics.archiveProduct = function(productId, userId) {
  return this.findOneAndUpdate(
    { _id: productId, userId, isActive: true },
    { isActive: false, status: 'archived', updatedAt: new Date() },
    { new: true }
  );
};

export default mongoose.model("BuyForMeCart", buyForMeCartSchema);
