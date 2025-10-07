import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' }, // Optional, for verified purchases
  
  // Review content
  rating: { type: Number, required: true, min: 1, max: 5 },
  title: { type: String, required: true, trim: true, maxlength: 200 },
  content: { type: String, required: true, trim: true, maxlength: 2000 },
  
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
    duration: Number
  }],
  
  // Review metadata
  verifiedPurchase: { type: Boolean, default: false },
  helpfulVotes: { type: Number, default: 0 },
  totalVotes: { type: Number, default: 0 },
  helpfulnessScore: { type: Number, default: 0 }, // helpfulVotes / totalVotes
  
  // Product-specific ratings
  productRatings: {
    quality: { type: Number, min: 1, max: 5 },
    value: { type: Number, min: 1, max: 5 },
    shipping: { type: Number, min: 1, max: 5 },
    packaging: { type: Number, min: 1, max: 5 },
    customerService: { type: Number, min: 1, max: 5 }
  },
  
  // Seller rating (if applicable)
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller' },
  sellerRating: { type: Number, min: 1, max: 5 },
  sellerReview: { type: String, maxlength: 1000 },
  
  // Review status and moderation
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected', 'hidden', 'flagged'],
    default: 'pending' 
  },
  
  moderation: {
    flagged: { type: Boolean, default: false },
    flaggedReason: String,
    flaggedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    flaggedAt: Date,
    moderatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    moderatedAt: Date,
    moderationNotes: String
  },
  
  // AI content analysis
  aiAnalysis: {
    sentiment: { type: String, enum: ['positive', 'neutral', 'negative'] },
    confidence: { type: Number, min: 0, max: 1 },
    language: String,
    topics: [String],
    spamScore: { type: Number, min: 0, max: 1 },
    toxicityScore: { type: Number, min: 0, max: 1 },
    processedAt: Date
  },
  
  // User engagement
  engagement: {
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    comments: { type: Number, default: 0 }
  },
  
  // Response from seller/merchant
  response: {
    content: String,
    respondedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    respondedAt: Date,
    isOfficial: { type: Boolean, default: false }
  },
  
  // Review helpfulness tracking
  helpfulness: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    helpful: { type: Boolean, required: true },
    votedAt: { type: Date, default: Date.now }
  }],
  
  // Report system
  reports: [{
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reason: { 
      type: String, 
      enum: ['spam', 'inappropriate', 'fake', 'misleading', 'harassment', 'other'] 
    },
    description: String,
    reportedAt: { type: Date, default: Date.now },
    status: { 
      type: String, 
      enum: ['pending', 'reviewed', 'resolved', 'dismissed'],
      default: 'pending' 
    },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reviewedAt: Date,
    reviewNotes: String
  }],
  
  // Quality indicators
  quality: {
    isVerified: { type: Boolean, default: false },
    isDetailed: { type: Boolean, default: false },
    hasMedia: { type: Boolean, default: false },
    wordCount: { type: Number, default: 0 },
    qualityScore: { type: Number, min: 0, max: 100, default: 0 }
  },
  
  // Analytics
  analytics: {
    clickThroughRate: { type: Number, default: 0 },
    conversionRate: { type: Number, default: 0 },
    lastViewed: Date,
    viewCount: { type: Number, default: 0 }
  },
  
  // Metadata
  device: String,
  ipAddress: String,
  userAgent: String,
  location: {
    country: String,
    city: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  
  // Notifications
  notifications: [{
    type: String,
    sent: { type: Boolean, default: false },
    sentAt: Date,
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }]
}, { timestamps: true });

// Indexes
reviewSchema.index({ product: 1, status: 1 });
reviewSchema.index({ user: 1 });
reviewSchema.index({ rating: 1 });
reviewSchema.index({ status: 1, createdAt: -1 });
reviewSchema.index({ 'moderation.flagged': 1 });
reviewSchema.index({ 'quality.qualityScore': -1 });
reviewSchema.index({ createdAt: -1 });

// Pre-save middleware to calculate quality score
reviewSchema.pre('save', function(next) {
  // Calculate word count
  this.quality.wordCount = this.content.split(' ').length;
  
  // Determine if review is detailed
  this.quality.isDetailed = this.quality.wordCount >= 50;
  
  // Determine if review has media
  this.quality.hasMedia = this.images.length > 0 || this.videos.length > 0;
  
  // Calculate quality score
  let score = 0;
  if (this.verifiedPurchase) score += 20;
  if (this.quality.isDetailed) score += 30;
  if (this.quality.hasMedia) score += 20;
  if (this.productRatings.quality) score += 10;
  if (this.productRatings.value) score += 10;
  if (this.productRatings.shipping) score += 10;
  
  this.quality.qualityScore = Math.min(100, score);
  
  // Calculate helpfulness score
  if (this.totalVotes > 0) {
    this.helpfulnessScore = this.helpfulVotes / this.totalVotes;
  }
  
  next();
});

// Method to vote on helpfulness
reviewSchema.methods.voteHelpful = function(userId, helpful) {
  // Remove existing vote if exists
  this.helpfulness = this.helpfulness.filter(vote => 
    vote.user.toString() !== userId.toString()
  );
  
  // Add new vote
  this.helpfulness.push({
    user: userId,
    helpful: helpful
  });
  
  // Recalculate votes
  this.helpfulVotes = this.helpfulness.filter(vote => vote.helpful).length;
  this.totalVotes = this.helpfulness.length;
  
  return this.save();
};

// Method to report review
reviewSchema.methods.report = function(userId, reason, description) {
  this.reports.push({
    reportedBy: userId,
    reason: reason,
    description: description
  });
  
  // Auto-flag if multiple reports
  if (this.reports.length >= 3) {
    this.status = 'flagged';
    this.moderation.flagged = true;
    this.moderation.flaggedReason = 'Multiple reports';
  }
  
  return this.save();
};

// Method to respond to review
reviewSchema.methods.respond = function(content, respondedBy, isOfficial = false) {
  this.response = {
    content: content,
    respondedBy: respondedBy,
    respondedAt: new Date(),
    isOfficial: isOfficial
  };
  
  return this.save();
};

// Static method to get reviews for product
reviewSchema.statics.getProductReviews = function(productId, options = {}) {
  const {
    status = 'approved',
    sort = 'helpfulness',
    limit = 20,
    skip = 0,
    rating = null
  } = options;
  
  const filter = { product: productId, status: status };
  if (rating) filter.rating = rating;
  
  let sortObj = {};
  switch (sort) {
    case 'newest':
      sortObj = { createdAt: -1 };
      break;
    case 'oldest':
      sortObj = { createdAt: 1 };
      break;
    case 'rating':
      sortObj = { rating: -1 };
      break;
    case 'helpfulness':
    default:
      sortObj = { helpfulnessScore: -1, createdAt: -1 };
      break;
  }
  
  return this.find(filter)
    .populate('user', 'name email avatar')
    .populate('response.respondedBy', 'name email')
    .sort(sortObj)
    .limit(limit)
    .skip(skip);
};

// Static method to get review statistics
reviewSchema.statics.getReviewStats = function(productId) {
  return this.aggregate([
    { $match: { product: productId, status: 'approved' } },
    {
      $group: {
        _id: null,
        totalReviews: { $sum: 1 },
        averageRating: { $avg: '$rating' },
        ratingDistribution: {
          $push: '$rating'
        },
        verifiedPurchases: {
          $sum: { $cond: ['$verifiedPurchase', 1, 0] }
        },
        withImages: {
          $sum: { $cond: [{ $gt: [{ $size: '$images' }, 0] }, 1, 0] }
        },
        averageHelpfulness: { $avg: '$helpfulnessScore' }
      }
    }
  ]);
};

export default mongoose.model('Review', reviewSchema);
