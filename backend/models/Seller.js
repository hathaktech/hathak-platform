import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const sellerSchema = new mongoose.Schema(
  {
    // Basic Information
    businessName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    
    // Business Details
    businessType: {
      type: String,
      enum: ['individual', 'company', 'brand'],
      default: 'individual'
    },
    taxId: String,
    businessLicense: String,
    website: String,
    description: String,
    
    // Address Information
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      zipCode: String
    },
    
    // Financial Information
    bankDetails: {
      accountName: String,
      accountNumber: String,
      bankName: String,
      routingNumber: String
    },
    
    // Status & Verification
    status: {
      type: String,
      enum: ['pending', 'approved', 'suspended', 'rejected'],
      default: 'pending'
    },
    verificationStatus: {
      email: { type: Boolean, default: false },
      phone: { type: Boolean, default: false },
      identity: { type: Boolean, default: false },
      business: { type: Boolean, default: false }
    },
    
    // Performance Metrics
    metrics: {
      totalSales: { type: Number, default: 0 },
      totalOrders: { type: Number, default: 0 },
      averageRating: { type: Number, default: 0 },
      responseTime: { type: Number, default: 0 }, // in hours
      fulfillmentRate: { type: Number, default: 0 }, // percentage
    },
    
    // Settings
    settings: {
      autoAcceptOrders: { type: Boolean, default: false },
      notificationEmail: { type: Boolean, default: true },
      notificationSMS: { type: Boolean, default: false },
      currency: { type: String, default: 'USD' },
      timezone: { type: String, default: 'UTC' }
    },
    
    // Commission & Fees
    commissionRate: { type: Number, default: 10 }, // percentage
    monthlyFee: { type: Number, default: 0 },
    
    // Documents
    documents: [{
      type: { type: String, enum: ['identity', 'business_license', 'tax_certificate', 'bank_statement'] },
      url: String,
      status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
      uploadedAt: { type: Date, default: Date.now }
    }],
    
    // Social Media
    socialMedia: {
      instagram: String,
      facebook: String,
      twitter: String,
      tiktok: String
    },
    
    // Timestamps
    lastLogin: Date,
    approvedAt: Date,
    suspendedAt: Date,
    suspendedReason: String
  },
  { 
    timestamps: true,
    collection: 'sellers'
  }
);

// Hash password before save
sellerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
sellerSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT
sellerSchema.methods.getSignedJwtToken = function () {
  return jwt.sign(
    { 
      id: this._id, 
      role: 'seller',
      type: 'seller'
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Check if seller is verified
sellerSchema.methods.isVerified = function() {
  return this.verificationStatus.email && 
         this.verificationStatus.phone && 
         this.verificationStatus.identity && 
         this.verificationStatus.business;
};

// Update metrics
sellerSchema.methods.updateMetrics = function(sales, orders, rating) {
  this.metrics.totalSales += sales || 0;
  this.metrics.totalOrders += orders || 0;
  if (rating) {
    // Calculate weighted average rating
    const currentTotal = this.metrics.averageRating * (this.metrics.totalOrders - 1);
    this.metrics.averageRating = (currentTotal + rating) / this.metrics.totalOrders;
  }
  return this.save();
};

// Sanitize seller data
sellerSchema.methods.toSafeObject = function() {
  const sellerObj = this.toObject();
  delete sellerObj.password;
  delete sellerObj.bankDetails;
  return sellerObj;
};

const Seller = mongoose.model('Seller', sellerSchema);
export default Seller;
