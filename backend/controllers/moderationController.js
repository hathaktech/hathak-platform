import Moderation from '../models/Moderation.js';
import Product from '../models/Product.js';
import Review from '../models/Review.js';
import User from '../models/User.js';
import Seller from '../models/Seller.js';

// Moderation Management
export const createModerationCase = async (req, res) => {
  try {
    const moderation = await Moderation.create({
      ...req.body,
      reportedBy: req.user.id
    });
    
    res.status(201).json({
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

export const getModerationQueue = async (req, res) => {
  try {
    const { status, priority, moderator, page = 1, limit = 20 } = req.query;
    
    const filter = {};
    if (status) filter.status = status;
    if (priority) filter['humanModeration.priority'] = priority;
    if (moderator) filter['humanModeration.assignedTo'] = moderator;
    
    const moderations = await Moderation.find(filter)
      .populate('reportedBy', 'name email')
      .populate('moderator', 'name email')
      .populate('humanModeration.assignedTo', 'name email')
      .sort({ priority: -1, createdAt: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Moderation.countDocuments(filter);
    
    res.json({
      success: true,
      data: moderations,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getModerationById = async (req, res) => {
  try {
    const moderation = await Moderation.findById(req.params.id)
      .populate('reportedBy', 'name email')
      .populate('moderator', 'name email')
      .populate('humanModeration.assignedTo', 'name email')
      .populate('escalation.escalatedTo', 'name email');
    
    if (!moderation) {
      return res.status(404).json({
        success: false,
        message: 'Moderation case not found'
      });
    }
    
    res.json({
      success: true,
      data: moderation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const assignModeration = async (req, res) => {
  try {
    const { moderatorId } = req.body;
    const moderation = await Moderation.findById(req.params.id);
    
    if (!moderation) {
      return res.status(404).json({
        success: false,
        message: 'Moderation case not found'
      });
    }
    
    await moderation.assignToModerator(moderatorId, req.user.id);
    
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

export const resolveModeration = async (req, res) => {
  try {
    const { action, reason, notes } = req.body;
    const moderation = await Moderation.findById(req.params.id);
    
    if (!moderation) {
      return res.status(404).json({
        success: false,
        message: 'Moderation case not found'
      });
    }
    
    await moderation.resolve(action, reason, req.user.id, notes);
    
    // Apply the action to the content
    await applyModerationAction(moderation, action);
    
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

export const escalateModeration = async (req, res) => {
  try {
    const { escalatedTo, reason } = req.body;
    const moderation = await Moderation.findById(req.params.id);
    
    if (!moderation) {
      return res.status(404).json({
        success: false,
        message: 'Moderation case not found'
      });
    }
    
    await moderation.escalate(escalatedTo, reason, req.user.id);
    
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

// Appeal Management
export const submitAppeal = async (req, res) => {
  try {
    const { reason } = req.body;
    const moderation = await Moderation.findById(req.params.id);
    
    if (!moderation) {
      return res.status(404).json({
        success: false,
        message: 'Moderation case not found'
      });
    }
    
    await moderation.submitAppeal(req.user.id, reason);
    
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

export const reviewAppeal = async (req, res) => {
  try {
    const { decision, notes } = req.body;
    const moderation = await Moderation.findById(req.params.id);
    
    if (!moderation) {
      return res.status(404).json({
        success: false,
        message: 'Moderation case not found'
      });
    }
    
    moderation.appeal.appealStatus = decision;
    moderation.appeal.appealReviewedBy = req.user.id;
    moderation.appeal.appealReviewedAt = new Date();
    moderation.appeal.appealNotes = notes;
    
    if (decision === 'approved') {
      // Reverse the original action
      await reverseModerationAction(moderation);
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

// Analytics and Reporting
export const getModerationStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const stats = await Moderation.getStats(startDate, endDate);
    
    // Get additional metrics
    const totalCases = await Moderation.countDocuments();
    const pendingCases = await Moderation.countDocuments({ status: 'pending' });
    const avgResolutionTime = await Moderation.aggregate([
      {
        $group: {
          _id: null,
          avgTime: { $avg: '$analytics.resolutionTime' }
        }
      }
    ]);
    
    res.json({
      success: true,
      data: {
        totalCases,
        pendingCases,
        statusBreakdown: stats,
        avgResolutionTime: avgResolutionTime[0]?.avgTime || 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getModerationTrends = async (req, res) => {
  try {
    const { startDate, endDate, groupBy = 'day' } = req.query;
    
    const matchStage = {};
    if (startDate && endDate) {
      matchStage.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
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
      totalCases: { $sum: 1 },
      resolvedCases: {
        $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] }
      },
      avgResolutionTime: { $avg: '$analytics.resolutionTime' }
    };
    
    const trends = await Moderation.aggregate([
      { $match: matchStage },
      { $group: groupStage },
      { $sort: { _id: 1 } }
    ]);
    
    res.json({
      success: true,
      data: trends
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// AI Moderation Integration
export const processAIModeration = async (req, res) => {
  try {
    const { contentId, contentType, content } = req.body;
    
    // This would integrate with actual AI moderation services
    // For now, simulate AI processing
    const aiResult = await simulateAIModeration(content);
    
    const moderation = await Moderation.create({
      contentType,
      contentId,
      content,
      reportedBy: null, // AI detected
      reportReason: 'ai_detection',
      aiModeration: aiResult,
      source: 'ai_detection'
    });
    
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

// Helper Functions
async function applyModerationAction(moderation, action) {
  const { contentType, contentId } = moderation;
  
  switch (action) {
    case 'hide':
      await hideContent(contentType, contentId);
      break;
    case 'remove':
      await removeContent(contentType, contentId);
      break;
    case 'suspend':
      await suspendUser(contentId);
      break;
    case 'ban':
      await banUser(contentId);
      break;
    // Add more actions as needed
  }
}

async function reverseModerationAction(moderation) {
  const { contentType, contentId } = moderation;
  
  switch (moderation.actionTaken.type) {
    case 'hide':
      await showContent(contentType, contentId);
      break;
    case 'remove':
      await restoreContent(contentType, contentId);
      break;
    case 'suspend':
      await unsuspendUser(contentId);
      break;
    case 'ban':
      await unbanUser(contentId);
      break;
    // Add more reversals as needed
  }
}

async function hideContent(contentType, contentId) {
  // Implementation depends on content type
  switch (contentType) {
    case 'product':
      await Product.findByIdAndUpdate(contentId, { visibility: 'hidden' });
      break;
    case 'review':
      await Review.findByIdAndUpdate(contentId, { status: 'hidden' });
      break;
    // Add more content types
  }
}

async function removeContent(contentType, contentId) {
  // Implementation depends on content type
  switch (contentType) {
    case 'product':
      await Product.findByIdAndUpdate(contentId, { status: 'archived' });
      break;
    case 'review':
      await Review.findByIdAndDelete(contentId);
      break;
    // Add more content types
  }
}

async function suspendUser(userId) {
  await User.findByIdAndUpdate(userId, { 
    status: 'suspended',
    suspendedAt: new Date()
  });
}

async function banUser(userId) {
  await User.findByIdAndUpdate(userId, { 
    status: 'banned',
    bannedAt: new Date()
  });
}

async function simulateAIModeration(content) {
  // Simulate AI moderation processing
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
