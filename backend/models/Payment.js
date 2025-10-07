import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // Payment details
  amount: { type: Number, required: true, min: 0 },
  currency: { type: String, required: true, uppercase: true, default: 'USD' },
  exchangeRate: { type: Number, default: 1 }, // Rate from base currency (USD)
  
  // Payment method
  method: { 
    type: String, 
    enum: ['card', 'bank_transfer', 'wallet', 'crypto', 'cash_on_delivery', 'installment'],
    required: true 
  },
  provider: { 
    type: String, 
    enum: ['stripe', 'paypal', 'square', 'razorpay', 'local_gateway', 'manual'],
    required: true 
  },
  
  // Transaction details
  transactionId: { type: String, required: true, unique: true },
  externalTransactionId: String, // From payment gateway
  gatewayResponse: mongoose.Schema.Types.Mixed, // Raw response from gateway
  
  // Status tracking
  status: { 
    type: String, 
    enum: [
      'pending',           // Payment initiated
      'processing',        // Being processed by gateway
      'completed',         // Successfully completed
      'failed',            // Payment failed
      'cancelled',         // Payment cancelled
      'refunded',          // Payment refunded
      'partially_refunded', // Partial refund
      'disputed',          // Payment disputed
      'chargeback'         // Chargeback initiated
    ], 
    default: 'pending' 
  },
  
  // Timeline
  statusHistory: [{
    status: String,
    timestamp: { type: Date, default: Date.now },
    reason: String,
    gatewayResponse: mongoose.Schema.Types.Mixed,
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }],
  
  // Card details (encrypted)
  cardDetails: {
    last4: String,
    brand: String, // visa, mastercard, amex, etc.
    expiryMonth: Number,
    expiryYear: Number,
    fingerprint: String // For fraud detection
  },
  
  // Bank transfer details
  bankTransfer: {
    bankName: String,
    accountNumber: String,
    routingNumber: String,
    reference: String
  },
  
  // Wallet details
  wallet: {
    provider: String, // paypal, apple_pay, google_pay, etc.
    walletId: String,
    email: String
  },
  
  // Installment details
  installment: {
    totalInstallments: Number,
    currentInstallment: { type: Number, default: 1 },
    installmentAmount: Number,
    nextDueDate: Date,
    frequency: { type: String, enum: ['weekly', 'monthly', 'quarterly'] }
  },
  
  // Fees and charges
  fees: {
    processingFee: { type: Number, default: 0 },
    gatewayFee: { type: Number, default: 0 },
    platformFee: { type: Number, default: 0 },
    currencyConversionFee: { type: Number, default: 0 },
    totalFees: { type: Number, default: 0 }
  },
  
  // Refund details
  refunds: [{
    amount: Number,
    reason: String,
    status: { type: String, enum: ['pending', 'completed', 'failed'] },
    refundId: String,
    processedAt: Date,
    processedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }],
  
  // Risk and fraud
  riskScore: { type: Number, min: 0, max: 100 },
  fraudFlags: [{
    type: String,
    description: String,
    severity: { type: String, enum: ['low', 'medium', 'high', 'critical'] },
    flaggedAt: { type: Date, default: Date.now }
  }],
  
  // Compliance
  compliance: {
    pciCompliant: { type: Boolean, default: true },
    gdprCompliant: { type: Boolean, default: true },
    auditTrail: [{
      action: String,
      timestamp: { type: Date, default: Date.now },
      performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      details: String
    }]
  },
  
  // Metadata
  metadata: {
    ipAddress: String,
    userAgent: String,
    deviceFingerprint: String,
    location: {
      country: String,
      city: String,
      coordinates: {
        latitude: Number,
        longitude: Number
      }
    },
    referrer: String,
    campaign: String
  },
  
  // Notifications
  notifications: [{
    type: String,
    sent: { type: Boolean, default: false },
    sentAt: Date,
    recipient: String,
    channel: { type: String, enum: ['email', 'sms', 'push', 'webhook'] },
    content: String
  }],
  
  // Settlement
  settlement: {
    settled: { type: Boolean, default: false },
    settledAt: Date,
    settlementBatch: String,
    netAmount: Number, // Amount after all fees
    sellerPayout: Number, // Amount to seller
    platformRevenue: Number // Platform's cut
  }
}, { timestamps: true });

// Indexes
paymentSchema.index({ order: 1 });
paymentSchema.index({ user: 1 });
paymentSchema.index({ transactionId: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ method: 1, provider: 1 });
paymentSchema.index({ createdAt: -1 });
paymentSchema.index({ 'settlement.settled': 1 });

// Pre-save middleware to calculate total fees
paymentSchema.pre('save', function(next) {
  this.fees.totalFees = 
    this.fees.processingFee + 
    this.fees.gatewayFee + 
    this.fees.platformFee + 
    this.fees.currencyConversionFee;
  next();
});

// Method to update status
paymentSchema.methods.updateStatus = function(newStatus, reason, gatewayResponse, updatedBy) {
  this.status = newStatus;
  this.statusHistory.push({
    status: newStatus,
    timestamp: new Date(),
    reason: reason,
    gatewayResponse: gatewayResponse,
    updatedBy: updatedBy
  });
  return this.save();
};

// Method to process refund
paymentSchema.methods.processRefund = function(amount, reason, processedBy) {
  const refundAmount = amount || this.amount;
  
  if (refundAmount > this.amount) {
    throw new Error('Refund amount cannot exceed payment amount');
  }
  
  this.refunds.push({
    amount: refundAmount,
    reason: reason,
    status: 'pending',
    refundId: `REF_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    processedBy: processedBy
  });
  
  this.status = refundAmount === this.amount ? 'refunded' : 'partially_refunded';
  return this.save();
};

// Method to calculate settlement amounts
paymentSchema.methods.calculateSettlement = function(platformFeeRate = 0.03) {
  const platformFee = this.amount * platformFeeRate;
  const sellerPayout = this.amount - platformFee - this.fees.totalFees;
  const platformRevenue = platformFee + this.fees.platformFee;
  
  this.settlement = {
    ...this.settlement,
    netAmount: this.amount - this.fees.totalFees,
    sellerPayout: Math.max(0, sellerPayout),
    platformRevenue: platformRevenue
  };
  
  return this.settlement;
};

export default mongoose.model('Payment', paymentSchema);
