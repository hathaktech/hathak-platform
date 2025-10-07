import mongoose from 'mongoose';

const moderationSchema = new mongoose.Schema({
  // Content being moderated
  contentType: { 
    type: String, 
    enum: ['product', 'review', 'comment', 'seller', 'user', 'image', 'video', 'description'],
    required: true 
  },
  contentId: { type: mongoose.Schema.Types.ObjectId, required: true },
  
  // Content details
  content: {
    title: String,
    description: String,
    text: String,
    images: [String],
    metadata: mongoose.Schema.Types.Mixed
  },
  
  // Reporter information
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reportReason: { 
    type: String, 
    enum: [
      'spam', 'inappropriate', 'fake', 'misleading', 'copyright', 
      'harassment', 'hate_speech', 'violence', 'adult_content', 'other'
    ],
    required: true 
  },
  reportDescription: String,
  
  // Moderation status
  status: { 
    type: String, 
    enum: ['pending', 'under_review', 'approved', 'rejected', 'escalated', 'resolved'],
    default: 'pending' 
  },
  
  // Moderation details
  moderator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  moderationNotes: String,
  actionTaken: {
    type: { type: String, enum: ['none', 'warn', 'hide', 'remove', 'suspend', 'ban'] },
    reason: String,
    duration: Number, // in days, for temporary actions
    appliedAt: Date
  },
  
  // AI moderation
  aiModeration: {
    enabled: { type: Boolean, default: true },
    confidence: { type: Number, min: 0, max: 1 },
    categories: [{
      category: String,
      confidence: Number,
      threshold: Number
    }],
    flags: [{
      type: String,
      severity: { type: String, enum: ['low', 'medium', 'high', 'critical'] },
      confidence: Number,
      description: String
    }],
    processedAt: Date
  },
  
  // Human moderation
  humanModeration: {
    required: { type: Boolean, default: false },
    priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    assignedAt: Date,
    reviewedAt: Date,
    reviewNotes: String
  },
  
  // Appeal process
  appeal: {
    submitted: { type: Boolean, default: false },
    submittedAt: Date,
    submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    appealReason: String,
    appealStatus: { 
      type: String, 
      enum: ['pending', 'under_review', 'approved', 'rejected'],
      default: 'pending' 
    },
    appealReviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    appealReviewedAt: Date,
    appealNotes: String
  },
  
  // Timeline
  timeline: [{
    action: String,
    performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    timestamp: { type: Date, default: Date.now },
    details: String,
    metadata: mongoose.Schema.Types.Mixed
  }],
  
  // Escalation
  escalation: {
    escalated: { type: Boolean, default: false },
    escalatedAt: Date,
    escalatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    escalatedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    escalationReason: String,
    resolution: String
  },
  
  // Compliance
  compliance: {
    gdpr: { type: Boolean, default: false },
    coppa: { type: Boolean, default: false },
    platformPolicy: { type: Boolean, default: true },
    legal: { type: Boolean, default: false }
  },
  
  // Analytics
  analytics: {
    viewCount: { type: Number, default: 0 },
    reportCount: { type: Number, default: 1 },
    resolutionTime: Number, // in hours
    satisfactionScore: Number // 1-5 rating
  },
  
  // Metadata
  tags: [String],
  priority: { type: Number, default: 0 },
  source: { type: String, enum: ['user_report', 'ai_detection', 'manual_review', 'automated'] },
  externalId: String, // For integration with external moderation services
  
  // Notifications
  notifications: [{
    type: String,
    sent: { type: Boolean, default: false },
    sentAt: Date,
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    channel: { type: String, enum: ['email', 'sms', 'push', 'dashboard'] }
  }]
}, { timestamps: true });

// Indexes
moderationSchema.index({ contentType: 1, contentId: 1 });
moderationSchema.index({ status: 1, priority: -1 });
moderationSchema.index({ reportedBy: 1 });
moderationSchema.index({ moderator: 1 });
moderationSchema.index({ createdAt: -1 });
moderationSchema.index({ 'aiModeration.confidence': -1 });
moderationSchema.index({ 'humanModeration.assignedTo': 1, status: 1 });

// Pre-save middleware to add timeline entry
moderationSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    this.timeline.push({
      action: `Status changed to ${this.status}`,
      performedBy: this.moderator,
      details: this.moderationNotes
    });
  }
  next();
});

// Method to assign to moderator
moderationSchema.methods.assignToModerator = function(moderatorId, assignedBy) {
  this.humanModeration.assignedTo = moderatorId;
  this.humanModeration.assignedAt = new Date();
  this.status = 'under_review';
  this.moderator = moderatorId;
  
  this.timeline.push({
    action: 'Assigned to moderator',
    performedBy: assignedBy,
    details: `Assigned to moderator ${moderatorId}`
  });
  
  return this.save();
};

// Method to resolve moderation
moderationSchema.methods.resolve = function(action, reason, moderatorId, notes) {
  this.status = 'resolved';
  this.actionTaken = {
    type: action,
    reason: reason,
    appliedAt: new Date()
  };
  this.humanModeration.reviewedAt = new Date();
  this.humanModeration.reviewNotes = notes;
  
  // Calculate resolution time
  const startTime = this.createdAt;
  const endTime = new Date();
  this.analytics.resolutionTime = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60));
  
  this.timeline.push({
    action: 'Resolved',
    performedBy: moderatorId,
    details: `Action: ${action}, Reason: ${reason}`,
    metadata: { notes }
  });
  
  return this.save();
};

// Method to escalate
moderationSchema.methods.escalate = function(escalatedTo, reason, escalatedBy) {
  this.escalation.escalated = true;
  this.escalation.escalatedAt = new Date();
  this.escalation.escalatedBy = escalatedBy;
  this.escalation.escalatedTo = escalatedTo;
  this.escalation.escalationReason = reason;
  this.status = 'escalated';
  
  this.timeline.push({
    action: 'Escalated',
    performedBy: escalatedBy,
    details: `Escalated to ${escalatedTo}: ${reason}`
  });
  
  return this.save();
};

// Method to submit appeal
moderationSchema.methods.submitAppeal = function(userId, reason) {
  this.appeal.submitted = true;
  this.appeal.submittedAt = new Date();
  this.appeal.submittedBy = userId;
  this.appeal.appealReason = reason;
  this.appeal.appealStatus = 'pending';
  
  this.timeline.push({
    action: 'Appeal submitted',
    performedBy: userId,
    details: reason
  });
  
  return this.save();
};

// Static method to get moderation queue
moderationSchema.statics.getQueue = function(moderatorId = null) {
  const query = { status: { $in: ['pending', 'under_review'] } };
  
  if (moderatorId) {
    query['humanModeration.assignedTo'] = moderatorId;
  }
  
  return this.find(query)
    .populate('reportedBy', 'name email')
    .populate('moderator', 'name email')
    .sort({ priority: -1, createdAt: 1 });
};

// Static method to get moderation stats
moderationSchema.statics.getStats = function(startDate, endDate) {
  const matchStage = {};
  if (startDate && endDate) {
    matchStage.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    };
  }
  
  return this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        avgResolutionTime: { $avg: '$analytics.resolutionTime' }
      }
    }
  ]);
};

export default mongoose.model('Moderation', moderationSchema);
