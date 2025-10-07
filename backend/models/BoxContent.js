import mongoose from 'mongoose';

const boxContentSchema = new mongoose.Schema({
  // Basic Information
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  boxNumber: {
    type: String,
    required: true
  },
  
  // Product Information
  productName: {
    type: String,
    required: true
  },
  productDescription: {
    type: String
  },
  productImage: {
    type: String
  },
  productUrl: {
    type: String
  },
  productPrice: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'USD'
  },
  quantity: {
    type: Number,
    default: 1
  },
  
  // Purchase Information
  purchaseType: {
    type: String,
    enum: ['buy_me', 'customer_purchase'],
    required: true
  },
  buyMeRequest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BuyMe',
    required: function() {
      return this.purchaseType === 'buy_me';
    }
  },
  orderId: {
    type: String
  },
  
  // Warehouse Information
  warehouseLocation: {
    type: String,
    default: 'Main Warehouse'
  },
  arrivalDate: {
    type: Date,
    default: Date.now
  },
  trackingNumber: {
    type: String
  },
  
  // Status and Workflow
  status: {
    type: String,
    enum: [
      'arrived',           // Product has arrived at warehouse
      'inspected',         // Product has been inspected
      'ready_for_packing', // Ready to be packed
      'packed',           // Product has been packed
      'shipped',          // Product has been shipped
      'delivered',        // Product has been delivered
      'returned',         // Product was returned
      'disposed'          // Product was disposed of
    ],
    default: 'arrived'
  },
  
  // Inspection Details
  inspection: {
    inspectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    inspectionDate: {
      type: Date
    },
    condition: {
      type: String,
      enum: ['excellent', 'good', 'fair', 'poor', 'damaged']
    },
    notes: {
      type: String
    },
    images: [{
      type: String
    }]
  },
  
  // Packing Information
  packing: {
    packedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    packedDate: {
      type: Date
    },
    packageWeight: {
      type: Number
    },
    packageDimensions: {
      length: Number,
      width: Number,
      height: Number
    },
    packagingMaterials: [{
      type: String
    }],
    notes: {
      type: String
    }
  },
  
  // Shipping Information
  shipping: {
    shippingMethod: {
      type: String
    },
    shippingCost: {
      type: Number
    },
    trackingNumber: {
      type: String
    },
    shippedDate: {
      type: Date
    },
    estimatedDelivery: {
      type: Date
    },
    actualDelivery: {
      type: Date
    }
  },
  
  // Customer Actions
  customerActions: {
    requestedPacking: {
      type: Boolean,
      default: false
    },
    packingRequestDate: {
      type: Date
    },
    confirmedPacking: {
      type: Boolean,
      default: false
    },
    confirmationDate: {
      type: Date
    },
    specialInstructions: {
      type: String
    }
  },
  
  // Financial Information
  fees: {
    handlingFee: {
      type: Number,
      default: 0
    },
    storageFee: {
      type: Number,
      default: 0
    },
    shippingFee: {
      type: Number,
      default: 0
    },
    totalFees: {
      type: Number,
      default: 0
    }
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
}, {
  timestamps: true
});

// Indexes for better performance
boxContentSchema.index({ user: 1, status: 1 });
boxContentSchema.index({ boxNumber: 1 });
boxContentSchema.index({ arrivalDate: -1 });
boxContentSchema.index({ status: 1, arrivalDate: -1 });

// Virtual for total value
boxContentSchema.virtual('totalValue').get(function() {
  return this.productPrice * this.quantity;
});

// Pre-save middleware to update timestamps
boxContentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Method to update status
boxContentSchema.methods.updateStatus = function(newStatus, updatedBy) {
  this.status = newStatus;
  this.updatedAt = Date.now();
  
  // Add status-specific timestamps
  switch (newStatus) {
    case 'inspected':
      this.inspection.inspectionDate = Date.now();
      this.inspection.inspectedBy = updatedBy;
      break;
    case 'packed':
      this.packing.packedDate = Date.now();
      this.packing.packedBy = updatedBy;
      break;
    case 'shipped':
      this.shipping.shippedDate = Date.now();
      break;
    case 'delivered':
      this.shipping.actualDelivery = Date.now();
      break;
  }
  
  return this.save();
};

export default mongoose.model('BoxContent', boxContentSchema);
