import mongoose from 'mongoose';

const antiFraudSchema = new mongoose.Schema({
  // Event details
  eventType: { 
    type: String, 
    enum: [
      'user_registration', 'user_login', 'order_creation', 'payment_processing',
      'review_submission', 'seller_registration', 'product_creation',
      'suspicious_activity', 'chargeback', 'refund_request'
    ],
    required: true 
  },
  
  // User and session info
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  sessionId: String,
  ipAddress: { type: String, required: true },
  userAgent: String,
  
  // Location data
  location: {
    country: String,
    region: String,
    city: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    timezone: String,
    isp: String,
    organization: String
  },
  
  // Device fingerprinting
  device: {
    fingerprint: String,
    browser: String,
    os: String,
    deviceType: { type: String, enum: ['desktop', 'mobile', 'tablet', 'unknown'] },
    screenResolution: String,
    language: String,
    timezone: String,
    plugins: [String],
    fonts: [String]
  },
  
  // Risk assessment
  riskScore: { type: Number, min: 0, max: 100, required: true },
  riskLevel: { 
    type: String, 
    enum: ['low', 'medium', 'high', 'critical'],
    required: true 
  },
  
  // Fraud indicators
  indicators: [{
    type: { 
      type: String, 
      enum: [
        'velocity_check', 'geolocation_anomaly', 'device_fingerprint_mismatch',
        'email_domain_suspicious', 'phone_number_invalid', 'address_inconsistent',
        'payment_method_risky', 'behavioral_anomaly', 'network_anomaly',
        'account_takeover_risk', 'synthetic_identity', 'chargeback_risk'
      ]
    },
    severity: { type: String, enum: ['low', 'medium', 'high', 'critical'] },
    confidence: { type: Number, min: 0, max: 1 },
    description: String,
    metadata: mongoose.Schema.Types.Mixed
  }],
  
  // AI/ML analysis
  aiAnalysis: {
    model: String,
    version: String,
    features: mongoose.Schema.Types.Mixed,
    prediction: {
      fraudProbability: { type: Number, min: 0, max: 1 },
      confidence: { type: Number, min: 0, max: 1 },
      explanation: String
    },
    processedAt: { type: Date, default: Date.now }
  },
  
  // Decision and action
  decision: {
    action: { 
      type: String, 
      enum: ['allow', 'block', 'challenge', 'review', 'escalate'],
      required: true 
    },
    reason: String,
    confidence: { type: Number, min: 0, max: 1 },
    automated: { type: Boolean, default: true },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reviewedAt: Date,
    reviewNotes: String
  },
  
  // Challenge/verification
  challenge: {
    required: { type: Boolean, default: false },
    type: { 
      type: String, 
      enum: ['captcha', 'sms_verification', 'email_verification', 'phone_verification', 'document_verification'] 
    },
    status: { 
      type: String, 
      enum: ['pending', 'completed', 'failed', 'expired'],
      default: 'pending' 
    },
    token: String,
    expiresAt: Date,
    attempts: { type: Number, default: 0 },
    maxAttempts: { type: Number, default: 3 }
  },
  
  // Historical context
  context: {
    previousEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'AntiFraud' }],
    userHistory: {
      totalEvents: { type: Number, default: 0 },
      fraudEvents: { type: Number, default: 0 },
      lastEvent: Date,
      accountAge: Number, // in days
      verificationStatus: String
    },
    ipHistory: {
      firstSeen: Date,
      lastSeen: Date,
      eventCount: { type: Number, default: 0 },
      uniqueUsers: { type: Number, default: 0 }
    }
  },
  
  // Rules and patterns
  rules: [{
    name: String,
    description: String,
    triggered: { type: Boolean, default: false },
    weight: { type: Number, default: 1 },
    metadata: mongoose.Schema.Types.Mixed
  }],
  
  // Machine learning features
  mlFeatures: {
    // Behavioral features
    sessionDuration: Number,
    clickRate: Number,
    scrollRate: Number,
    timeOnPage: Number,
    
    // Transaction features
    orderValue: Number,
    paymentMethod: String,
    currency: String,
    
    // Network features
    proxy: { type: Boolean, default: false },
    vpn: { type: Boolean, default: false },
    tor: { type: Boolean, default: false },
    
    // Temporal features
    hourOfDay: Number,
    dayOfWeek: Number,
    isWeekend: { type: Boolean, default: false },
    
    // User features
    accountAge: Number,
    verificationLevel: String,
    previousFraud: { type: Boolean, default: false }
  },
  
  // Feedback loop
  feedback: {
    wasFraud: { type: Boolean },
    confirmedAt: Date,
    confirmedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    notes: String
  },
  
  // Status and lifecycle
  status: { 
    type: String, 
    enum: ['active', 'resolved', 'false_positive', 'confirmed_fraud'],
    default: 'active' 
  },
  
  // Notifications
  notifications: [{
    type: String,
    sent: { type: Boolean, default: false },
    sentAt: Date,
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    channel: { type: String, enum: ['email', 'sms', 'push', 'webhook'] }
  }],
  
  // Audit trail
  auditTrail: [{
    action: String,
    performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    timestamp: { type: Date, default: Date.now },
    details: String,
    metadata: mongoose.Schema.Types.Mixed
  }],
  
  // Metadata
  tags: [String],
  priority: { type: Number, default: 0 },
  source: { type: String, enum: ['real_time', 'batch', 'manual', 'api'] },
  externalId: String
}, { timestamps: true });

// Indexes
antiFraudSchema.index({ user: 1, createdAt: -1 });
antiFraudSchema.index({ ipAddress: 1, createdAt: -1 });
antiFraudSchema.index({ riskScore: -1, createdAt: -1 });
antiFraudSchema.index({ riskLevel: 1, status: 1 });
antiFraudSchema.index({ eventType: 1, createdAt: -1 });
antiFraudSchema.index({ 'decision.action': 1, status: 1 });
antiFraudSchema.index({ 'challenge.status': 1 });

// Pre-save middleware to set risk level
antiFraudSchema.pre('save', function(next) {
  if (this.riskScore >= 80) {
    this.riskLevel = 'critical';
  } else if (this.riskScore >= 60) {
    this.riskLevel = 'high';
  } else if (this.riskScore >= 30) {
    this.riskLevel = 'medium';
  } else {
    this.riskLevel = 'low';
  }
  next();
});

// Method to add indicator
antiFraudSchema.methods.addIndicator = function(type, severity, confidence, description, metadata) {
  this.indicators.push({
    type,
    severity,
    confidence,
    description,
    metadata
  });
  
  // Recalculate risk score based on indicators
  this.calculateRiskScore();
  
  return this.save();
};

// Method to calculate risk score
antiFraudSchema.methods.calculateRiskScore = function() {
  let score = 0;
  
  // Base score from indicators
  this.indicators.forEach(indicator => {
    const weight = this.getIndicatorWeight(indicator.type, indicator.severity);
    score += weight * indicator.confidence;
  });
  
  // Adjust based on context
  if (this.context.userHistory.fraudEvents > 0) {
    score += 20;
  }
  
  if (this.context.ipHistory.uniqueUsers > 10) {
    score += 15;
  }
  
  if (this.device.proxy || this.device.vpn || this.device.tor) {
    score += 25;
  }
  
  this.riskScore = Math.min(100, Math.max(0, score));
  return this.riskScore;
};

// Method to get indicator weight
antiFraudSchema.methods.getIndicatorWeight = function(type, severity) {
  const weights = {
    'account_takeover_risk': { low: 10, medium: 20, high: 40, critical: 60 },
    'synthetic_identity': { low: 15, medium: 30, high: 50, critical: 70 },
    'chargeback_risk': { low: 5, medium: 15, high: 30, critical: 50 },
    'velocity_check': { low: 5, medium: 10, high: 20, critical: 30 },
    'geolocation_anomaly': { low: 8, medium: 15, high: 25, critical: 40 },
    'device_fingerprint_mismatch': { low: 10, medium: 20, high: 35, critical: 50 },
    'behavioral_anomaly': { low: 5, medium: 12, high: 25, critical: 40 }
  };
  
  return weights[type]?.[severity] || 5;
};

// Method to challenge user
antiFraudSchema.methods.requireChallenge = function(type, expiresInHours = 24) {
  this.challenge.required = true;
  this.challenge.type = type;
  this.challenge.status = 'pending';
  this.challenge.token = this.generateChallengeToken();
  this.challenge.expiresAt = new Date(Date.now() + expiresInHours * 60 * 60 * 1000);
  
  this.decision.action = 'challenge';
  
  return this.save();
};

// Method to generate challenge token
antiFraudSchema.methods.generateChallengeToken = function() {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
};

// Method to complete challenge
antiFraudSchema.methods.completeChallenge = function() {
  this.challenge.status = 'completed';
  this.decision.action = 'allow';
  this.status = 'resolved';
  
  return this.save();
};

// Method to fail challenge
antiFraudSchema.methods.failChallenge = function() {
  this.challenge.attempts += 1;
  
  if (this.challenge.attempts >= this.challenge.maxAttempts) {
    this.challenge.status = 'failed';
    this.decision.action = 'block';
    this.status = 'resolved';
  }
  
  return this.save();
};

// Static method to get fraud patterns
antiFraudSchema.statics.getFraudPatterns = function(startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
        status: 'confirmed_fraud'
      }
    },
    {
      $group: {
        _id: '$eventType',
        count: { $sum: 1 },
        avgRiskScore: { $avg: '$riskScore' },
        commonIndicators: { $push: '$indicators.type' }
      }
    },
    { $sort: { count: -1 } }
  ]);
};

// Static method to get risk trends
antiFraudSchema.statics.getRiskTrends = function(startDate, endDate, groupBy = 'day') {
  const groupStage = {
    _id: groupBy === 'day' ? {
      year: { $year: '$createdAt' },
      month: { $month: '$createdAt' },
      day: { $dayOfMonth: '$createdAt' }
    } : groupBy === 'month' ? {
      year: { $year: '$createdAt' },
      month: { $month: '$createdAt' }
    } : {
      year: { $year: '$createdAt' }
    },
    totalEvents: { $sum: 1 },
    highRiskEvents: {
      $sum: { $cond: [{ $gte: ['$riskScore', 60] }, 1, 0] }
    },
    avgRiskScore: { $avg: '$riskScore' },
    blockedEvents: {
      $sum: { $cond: [{ $eq: ['$decision.action', 'block'] }, 1, 0] }
    }
  };
  
  return this.aggregate([
    {
      $match: {
        createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
      }
    },
    { $group: groupStage },
    { $sort: { _id: 1 } }
  ]);
};

export default mongoose.model('AntiFraud', antiFraudSchema);
