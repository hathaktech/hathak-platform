import Review from '../models/Review.js';
import AntiFraud from '../models/AntiFraud.js';
import Moderation from '../models/Moderation.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import Seller from '../models/Seller.js';

// Review Management
export const createReview = async (req, res) => {
  try {
    const { productId, rating, title, content, productRatings, images, videos } = req.body;
    
    // Check if user has already reviewed this product
    const existingReview = await Review.findOne({
      product: productId,
      user: req.user.id
    });
    
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product'
      });
    }
    
    // Check if user has purchased the product (for verified purchase)
    const hasPurchased = await checkUserPurchase(req.user.id, productId);
    
    const review = await Review.create({
      product: productId,
      user: req.user.id,
      rating,
      title,
      content,
      productRatings,
      images: images || [],
      videos: videos || [],
      verifiedPurchase: hasPurchased,
      device: req.get('User-Agent'),
      ipAddress: req.ip,
      location: req.body.location
    });
    
    // Process AI analysis
    await processReviewAI(review);
    
    // Update product rating
    await updateProductRating(productId);
    
    res.status(201).json({
      success: true,
      data: review
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const getReviews = async (req, res) => {
  try {
    const { productId, status, rating, sort, page = 1, limit = 20 } = req.query;
    
    const options = {
      status: status || 'approved',
      sort: sort || 'helpfulness',
      limit: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit),
      rating: rating ? parseInt(rating) : null
    };
    
    const reviews = await Review.getProductReviews(productId, options);
    const stats = await Review.getReviewStats(productId);
    
    res.json({
      success: true,
      data: {
        reviews,
        stats: stats[0] || {
          totalReviews: 0,
          averageRating: 0,
          ratingDistribution: [],
          verifiedPurchases: 0,
          withImages: 0,
          averageHelpfulness: 0
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const voteReviewHelpful = async (req, res) => {
  try {
    const { helpful } = req.body;
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }
    
    await review.voteHelpful(req.user.id, helpful);
    
    res.json({
      success: true,
      data: review
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const reportReview = async (req, res) => {
  try {
    const { reason, description } = req.body;
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }
    
    await review.report(req.user.id, reason, description);
    
    res.json({
      success: true,
      data: review
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Anti-Fraud Detection
export const detectFraud = async (req, res) => {
  try {
    const { eventType, data } = req.body;
    
    // Collect fraud detection data
    const fraudData = {
      eventType,
      user: req.user?.id,
      sessionId: req.sessionID,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      location: req.body.location,
      device: req.body.device,
      mlFeatures: req.body.mlFeatures || {}
    };
    
    // Run fraud detection
    const fraudResult = await runFraudDetection(fraudData);
    
    // Create fraud record
    const fraudRecord = await AntiFraud.create(fraudResult);
    
    // Take action based on risk level
    const action = await takeFraudAction(fraudRecord);
    
    res.json({
      success: true,
      data: {
        fraudRecord,
        action,
        riskScore: fraudRecord.riskScore,
        riskLevel: fraudRecord.riskLevel
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const getFraudAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const [patterns, trends] = await Promise.all([
      AntiFraud.getFraudPatterns(startDate, endDate),
      AntiFraud.getRiskTrends(startDate, endDate)
    ]);
    
    res.json({
      success: true,
      data: {
        patterns,
        trends
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Content Moderation
export const moderateContent = async (req, res) => {
  try {
    const { contentType, contentId, content, action } = req.body;
    
    // Create moderation case
    const moderation = await Moderation.create({
      contentType,
      contentId,
      content,
      reportedBy: req.user.id,
      reportReason: 'manual_review',
      source: 'manual'
    });
    
    // Process AI moderation
    const aiResult = await processAIModeration(content);
    moderation.aiModeration = aiResult;
    
    // Take action if automated
    if (action && aiResult.confidence > 0.8) {
      await applyModerationAction(moderation, action);
    }
    
    await moderation.save();
    
    res.json({
      success: true,
      data: moderation
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Trust & Safety Dashboard
export const getTrustSafetyStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const matchStage = {};
    if (startDate && endDate) {
      matchStage.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    const [reviewStats, fraudStats, moderationStats] = await Promise.all([
      Review.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: null,
            totalReviews: { $sum: 1 },
            approvedReviews: { $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] } },
            flaggedReviews: { $sum: { $cond: [{ $eq: ['$status', 'flagged'] }, 1, 0] } },
            avgRating: { $avg: '$rating' }
          }
        }
      ]),
      AntiFraud.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: null,
            totalEvents: { $sum: 1 },
            highRiskEvents: { $sum: { $cond: [{ $gte: ['$riskScore', 60] }, 1, 0] } },
            blockedEvents: { $sum: { $cond: [{ $eq: ['$decision.action', 'block'] }, 1, 0] } },
            avgRiskScore: { $avg: '$riskScore' }
          }
        }
      ]),
      Moderation.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: null,
            totalCases: { $sum: 1 },
            pendingCases: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
            resolvedCases: { $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] } },
            avgResolutionTime: { $avg: '$analytics.resolutionTime' }
          }
        }
      ])
    ]);
    
    res.json({
      success: true,
      data: {
        reviews: reviewStats[0] || {
          totalReviews: 0,
          approvedReviews: 0,
          flaggedReviews: 0,
          avgRating: 0
        },
        fraud: fraudStats[0] || {
          totalEvents: 0,
          highRiskEvents: 0,
          blockedEvents: 0,
          avgRiskScore: 0
        },
        moderation: moderationStats[0] || {
          totalCases: 0,
          pendingCases: 0,
          resolvedCases: 0,
          avgResolutionTime: 0
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Helper Functions
async function checkUserPurchase(userId, productId) {
  // This would check if user has purchased the product
  // For now, return false
  return false;
}

async function processReviewAI(review) {
  // Simulate AI processing
  const sentiment = Math.random() > 0.5 ? 'positive' : 'negative';
  const confidence = Math.random();
  const spamScore = Math.random() * 0.3; // Low spam score
  const toxicityScore = Math.random() * 0.2; // Low toxicity score
  
  review.aiAnalysis = {
    sentiment,
    confidence,
    language: 'en',
    topics: ['product', 'quality'],
    spamScore,
    toxicityScore,
    processedAt: new Date()
  };
  
  // Auto-approve if low risk
  if (spamScore < 0.1 && toxicityScore < 0.1 && confidence > 0.7) {
    review.status = 'approved';
  } else {
    review.status = 'pending';
  }
  
  return review.save();
}

async function updateProductRating(productId) {
  const stats = await Review.getReviewStats(productId);
  const productStats = stats[0];
  
  if (productStats) {
    await Product.findByIdAndUpdate(productId, {
      'reviews.averageRating': productStats.averageRating,
      'reviews.totalReviews': productStats.totalReviews,
      'reviews.ratingDistribution': {
        5: productStats.ratingDistribution.filter(r => r === 5).length,
        4: productStats.ratingDistribution.filter(r => r === 4).length,
        3: productStats.ratingDistribution.filter(r => r === 3).length,
        2: productStats.ratingDistribution.filter(r => r === 2).length,
        1: productStats.ratingDistribution.filter(r => r === 1).length
      }
    });
  }
}

async function runFraudDetection(data) {
  let riskScore = 0;
  const indicators = [];
  
  // Velocity check
  const recentEvents = await AntiFraud.countDocuments({
    user: data.user,
    createdAt: { $gte: new Date(Date.now() - 60 * 60 * 1000) } // Last hour
  });
  
  if (recentEvents > 10) {
    riskScore += 30;
    indicators.push({
      type: 'velocity_check',
      severity: 'high',
      confidence: 0.8,
      description: 'High activity in short time period'
    });
  }
  
  // IP reputation check
  const ipEvents = await AntiFraud.countDocuments({
    ipAddress: data.ipAddress,
    createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Last 24 hours
  });
  
  if (ipEvents > 50) {
    riskScore += 25;
    indicators.push({
      type: 'network_anomaly',
      severity: 'medium',
      confidence: 0.7,
      description: 'Suspicious IP activity'
    });
  }
  
  // Device fingerprint check
  if (data.device?.proxy || data.device?.vpn) {
    riskScore += 20;
    indicators.push({
      type: 'device_fingerprint_mismatch',
      severity: 'medium',
      confidence: 0.9,
      description: 'Proxy or VPN detected'
    });
  }
  
  // Geolocation anomaly
  if (data.location) {
    const userLocation = await getUserLastLocation(data.user);
    if (userLocation && calculateDistance(userLocation, data.location) > 1000) {
      riskScore += 15;
      indicators.push({
        type: 'geolocation_anomaly',
        severity: 'medium',
        confidence: 0.6,
        description: 'Unusual location detected'
      });
    }
  }
  
  // Determine action
  let action = 'allow';
  if (riskScore >= 70) {
    action = 'block';
  } else if (riskScore >= 40) {
    action = 'challenge';
  } else if (riskScore >= 20) {
    action = 'review';
  }
  
  return {
    ...data,
    riskScore,
    indicators,
    decision: {
      action,
      reason: `Risk score: ${riskScore}`,
      confidence: Math.min(riskScore / 100, 1),
      automated: true
    },
    status: 'active'
  };
}

async function takeFraudAction(fraudRecord) {
  switch (fraudRecord.decision.action) {
    case 'block':
      // Block the user or session
      return { action: 'block', message: 'Access blocked due to high risk' };
    
    case 'challenge':
      // Require additional verification
      await fraudRecord.requireChallenge('captcha');
      return { action: 'challenge', message: 'Additional verification required' };
    
    case 'review':
      // Flag for manual review
      return { action: 'review', message: 'Flagged for manual review' };
    
    default:
      return { action: 'allow', message: 'Access granted' };
  }
}

async function processAIModeration(content) {
  // Simulate AI moderation
  const confidence = Math.random();
  const categories = [
    { category: 'spam', confidence: Math.random(), threshold: 0.7 },
    { category: 'inappropriate', confidence: Math.random(), threshold: 0.8 }
  ];
  
  const flags = [];
  if (confidence > 0.8) {
    flags.push({
      type: 'inappropriate_content',
      severity: 'high',
      confidence: confidence,
      description: 'Potential inappropriate content detected'
    });
  }
  
  return {
    enabled: true,
    confidence,
    categories,
    flags,
    processedAt: new Date()
  };
}

async function applyModerationAction(moderation, action) {
  // Apply moderation action based on content type
  // This would be implemented based on specific requirements
  console.log(`Applying moderation action: ${action} to ${moderation.contentType}`);
}

async function getUserLastLocation(userId) {
  // Get user's last known location
  const lastEvent = await AntiFraud.findOne({ user: userId })
    .sort({ createdAt: -1 });
  
  return lastEvent?.location;
}

function calculateDistance(loc1, loc2) {
  // Simple distance calculation (in km)
  const R = 6371; // Earth's radius in km
  const dLat = (loc2.coordinates.latitude - loc1.coordinates.latitude) * Math.PI / 180;
  const dLon = (loc2.coordinates.longitude - loc1.coordinates.longitude) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(loc1.coordinates.latitude * Math.PI / 180) * Math.cos(loc2.coordinates.latitude * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}
