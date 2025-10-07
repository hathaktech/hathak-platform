import mongoose from 'mongoose';

const fulfillmentCenterSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  code: { type: String, required: true, unique: true, uppercase: true },
  type: { 
    type: String, 
    enum: ['platform', 'seller', '3pl', 'dropship'], 
    required: true 
  },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    zipCode: { type: String, required: true },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  contact: {
    phone: String,
    email: String,
    manager: String
  },
  capabilities: [{
    type: { type: String, enum: ['pick', 'pack', 'ship', 'return', 'storage'] },
    enabled: { type: Boolean, default: true }
  }],
  operatingHours: {
    timezone: { type: String, default: 'UTC' },
    schedule: [{
      day: { type: String, enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] },
      open: String, // HH:MM format
      close: String, // HH:MM format
      closed: { type: Boolean, default: false }
    }]
  },
  capacity: {
    maxOrdersPerDay: Number,
    maxStorageCapacity: Number, // in cubic meters
    currentUtilization: { type: Number, default: 0 }
  },
  shipping: {
    supportedCarriers: [String], // ['fedex', 'ups', 'dhl', 'usps']
    defaultCarrier: String,
    processingTime: { type: Number, default: 1 }, // days
    cutOffTime: String // HH:MM format
  },
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'maintenance', 'suspended'], 
    default: 'active' 
  },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller' }, // For seller-fulfilled centers
  isDefault: { type: Boolean, default: false },
  metadata: {
    lastInventoryUpdate: Date,
    lastOrderProcessed: Date,
    totalOrdersProcessed: { type: Number, default: 0 }
  }
}, { timestamps: true });

// Indexes
fulfillmentCenterSchema.index({ type: 1, status: 1 });
fulfillmentCenterSchema.index({ 'address.country': 1, 'address.state': 1 });
fulfillmentCenterSchema.index({ seller: 1 });

export default mongoose.model('FulfillmentCenter', fulfillmentCenterSchema);
