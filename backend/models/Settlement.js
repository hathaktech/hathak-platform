import mongoose from 'mongoose';

const settlementSchema = new mongoose.Schema({
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true },
  period: {
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    month: { type: Number, required: true },
    year: { type: Number, required: true }
  },
  
  // Financial summary
  grossSales: { type: Number, default: 0 },
  totalOrders: { type: Number, default: 0 },
  totalItems: { type: Number, default: 0 },
  
  // Fees and deductions
  platformFees: { type: Number, default: 0 },
  paymentProcessingFees: { type: Number, default: 0 },
  shippingFees: { type: Number, default: 0 },
  storageFees: { type: Number, default: 0 },
  advertisingFees: { type: Number, default: 0 },
  otherFees: { type: Number, default: 0 },
  totalFees: { type: Number, default: 0 },
  
  // Adjustments
  adjustments: [{
    type: { type: String, enum: ['bonus', 'penalty', 'refund', 'chargeback', 'dispute', 'other'] },
    amount: Number,
    description: String,
    reference: String,
    appliedAt: { type: Date, default: Date.now },
    appliedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }],
  
  // Reserves and holds
  reserves: {
    currentReserve: { type: Number, default: 0 },
    reserveReleases: [{
      amount: Number,
      reason: String,
      releasedAt: { type: Date, default: Date.now },
      releasedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    }],
    reserveHolds: [{
      amount: Number,
      reason: String,
      holdUntil: Date,
      createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    }]
  },
  
  // Chargebacks and disputes
  chargebacks: {
    count: { type: Number, default: 0 },
    amount: { type: Number, default: 0 },
    pending: { type: Number, default: 0 }
  },
  
  disputes: {
    count: { type: Number, default: 0 },
    amount: { type: Number, default: 0 },
    resolved: { type: Number, default: 0 },
    pending: { type: Number, default: 0 }
  },
  
  // Returns and refunds
  returns: {
    count: { type: Number, default: 0 },
    amount: { type: Number, default: 0 },
    processed: { type: Number, default: 0 }
  },
  
  // Performance metrics
  performance: {
    orderFulfillmentRate: { type: Number, default: 0 },
    averageOrderValue: { type: Number, default: 0 },
    customerSatisfactionScore: { type: Number, default: 0 },
    returnRate: { type: Number, default: 0 },
    chargebackRate: { type: Number, default: 0 }
  },
  
  // Settlement details
  netPayout: { type: Number, default: 0 },
  currency: { type: String, default: 'USD', uppercase: true },
  exchangeRate: { type: Number, default: 1 },
  
  // Payment details
  payment: {
    method: { type: String, enum: ['bank_transfer', 'check', 'paypal', 'crypto'] },
    status: { 
      type: String, 
      enum: ['pending', 'processing', 'completed', 'failed', 'cancelled'],
      default: 'pending' 
    },
    scheduledDate: Date,
    processedDate: Date,
    transactionId: String,
    bankDetails: {
      accountHolderName: String,
      accountNumber: String,
      routingNumber: String,
      bankName: String,
      swiftCode: String,
      iban: String
    }
  },
  
  // Status and workflow
  status: { 
    type: String, 
    enum: ['draft', 'review', 'approved', 'scheduled', 'paid', 'cancelled'],
    default: 'draft' 
  },
  
  statusHistory: [{
    status: String,
    timestamp: { type: Date, default: Date.now },
    notes: String,
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }],
  
  // Documents and reports
  documents: [{
    type: { type: String, enum: ['statement', 'invoice', 'receipt', 'tax_document'] },
    url: String,
    generatedAt: { type: Date, default: Date.now },
    generatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }],
  
  // Notifications
  notifications: [{
    type: String,
    sent: { type: Boolean, default: false },
    sentAt: Date,
    recipient: String,
    channel: { type: String, enum: ['email', 'sms', 'dashboard'] }
  }],
  
  // Audit trail
  auditTrail: [{
    action: String,
    timestamp: { type: Date, default: Date.now },
    performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    details: String,
    ipAddress: String
  }],
  
  // Metadata
  metadata: {
    calculationVersion: String,
    lastCalculated: Date,
    notes: String,
    tags: [String]
  }
}, { timestamps: true });

// Indexes
settlementSchema.index({ seller: 1, 'period.year': 1, 'period.month': 1 });
settlementSchema.index({ status: 1 });
settlementSchema.index({ 'period.startDate': 1, 'period.endDate': 1 });
settlementSchema.index({ 'payment.status': 1 });
settlementSchema.index({ createdAt: -1 });

// Pre-save middleware to calculate totals
settlementSchema.pre('save', function(next) {
  // Calculate total fees
  this.totalFees = 
    this.platformFees + 
    this.paymentProcessingFees + 
    this.shippingFees + 
    this.storageFees + 
    this.advertisingFees + 
    this.otherFees;
  
  // Calculate net payout
  const adjustmentsTotal = this.adjustments.reduce((sum, adj) => sum + adj.amount, 0);
  this.netPayout = this.grossSales - this.totalFees + adjustmentsTotal - this.reserves.currentReserve;
  
  // Calculate performance metrics
  if (this.totalOrders > 0) {
    this.performance.averageOrderValue = this.grossSales / this.totalOrders;
    this.performance.returnRate = (this.returns.count / this.totalOrders) * 100;
    this.performance.chargebackRate = (this.chargebacks.count / this.totalOrders) * 100;
  }
  
  next();
});

// Method to add adjustment
settlementSchema.methods.addAdjustment = function(type, amount, description, reference, appliedBy) {
  this.adjustments.push({
    type,
    amount,
    description,
    reference,
    appliedBy
  });
  return this.save();
};

// Method to update status
settlementSchema.methods.updateStatus = function(newStatus, notes, updatedBy) {
  this.status = newStatus;
  this.statusHistory.push({
    status: newStatus,
    timestamp: new Date(),
    notes: notes,
    updatedBy: updatedBy
  });
  return this.save();
};

// Method to schedule payment
settlementSchema.methods.schedulePayment = function(paymentMethod, bankDetails, scheduledDate, scheduledBy) {
  this.payment.method = paymentMethod;
  this.payment.bankDetails = bankDetails;
  this.payment.scheduledDate = scheduledDate;
  this.status = 'scheduled';
  
  this.statusHistory.push({
    status: 'scheduled',
    timestamp: new Date(),
    notes: `Payment scheduled for ${scheduledDate}`,
    updatedBy: scheduledBy
  });
  
  return this.save();
};

// Method to process payment
settlementSchema.methods.processPayment = function(transactionId, processedBy) {
  this.payment.status = 'completed';
  this.payment.processedDate = new Date();
  this.payment.transactionId = transactionId;
  this.status = 'paid';
  
  this.statusHistory.push({
    status: 'paid',
    timestamp: new Date(),
    notes: `Payment processed with transaction ID: ${transactionId}`,
    updatedBy: processedBy
  });
  
  return this.save();
};

// Static method to generate settlement for period
settlementSchema.statics.generateSettlement = async function(sellerId, startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // Get all payments for the seller in the period
  const Payment = mongoose.model('Payment');
  const payments = await Payment.find({
    'settlement.settled': false,
    createdAt: { $gte: start, $lte: end }
  }).populate('order');
  
  // Calculate settlement data
  const settlementData = {
    seller: sellerId,
    period: {
      startDate: start,
      endDate: end,
      month: start.getMonth() + 1,
      year: start.getFullYear()
    },
    grossSales: payments.reduce((sum, payment) => sum + payment.amount, 0),
    totalOrders: payments.length,
    platformFees: payments.reduce((sum, payment) => sum + payment.settlement.platformRevenue, 0),
    paymentProcessingFees: payments.reduce((sum, payment) => sum + payment.fees.gatewayFee, 0)
  };
  
  return this.create(settlementData);
};

export default mongoose.model('Settlement', settlementSchema);
