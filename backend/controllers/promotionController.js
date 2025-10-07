import Promotion from '../models/Promotion.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Seller from '../models/Seller.js';

// Promotion Management
export const createPromotion = async (req, res) => {
  try {
    const promotion = await Promotion.create({
      ...req.body,
      createdBy: req.user.id
    });
    
    res.status(201).json({
      success: true,
      data: promotion
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const getPromotions = async (req, res) => {
  try {
    const { status, type, startDate, endDate, page = 1, limit = 20 } = req.query;
    const filter = {};
    
    if (status) filter.status = status;
    if (type) filter.type = type;
    if (startDate && endDate) {
      filter.startDate = { $gte: new Date(startDate) };
      filter.endDate = { $lte: new Date(endDate) };
    }
    
    const promotions = await Promotion.find(filter)
      .populate('createdBy', 'name email')
      .populate('lastModifiedBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Promotion.countDocuments(filter);
    
    res.json({
      success: true,
      data: promotions,
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

export const getPromotionById = async (req, res) => {
  try {
    const promotion = await Promotion.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('lastModifiedBy', 'name email');
    
    if (!promotion) {
      return res.status(404).json({
        success: false,
        message: 'Promotion not found'
      });
    }
    
    res.json({
      success: true,
      data: promotion
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const updatePromotion = async (req, res) => {
  try {
    const promotion = await Promotion.findById(req.params.id);
    
    if (!promotion) {
      return res.status(404).json({
        success: false,
        message: 'Promotion not found'
      });
    }
    
    Object.assign(promotion, req.body);
    promotion.lastModifiedBy = req.user.id;
    
    await promotion.save();
    
    res.json({
      success: true,
      data: promotion
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const deletePromotion = async (req, res) => {
  try {
    const promotion = await Promotion.findById(req.params.id);
    
    if (!promotion) {
      return res.status(404).json({
        success: false,
        message: 'Promotion not found'
      });
    }
    
    await Promotion.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      message: 'Promotion deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Promotion Validation and Application
export const validatePromotion = async (req, res) => {
  try {
    const { code, orderAmount, orderItems, userId } = req.body;
    
    let promotion;
    if (code) {
      promotion = await Promotion.findOne({ code: code.toUpperCase() });
    } else {
      // Find applicable promotions without code
      const applicablePromotions = await Promotion.findApplicable(userId, orderAmount, orderItems);
      promotion = applicablePromotions[0]; // Get the first applicable promotion
    }
    
    if (!promotion) {
      return res.status(404).json({
        success: false,
        message: 'No valid promotion found'
      });
    }
    
    if (!promotion.isValid()) {
      return res.status(400).json({
        success: false,
        message: 'Promotion is not currently valid'
      });
    }
    
    if (!promotion.canUseByUser(userId, orderAmount)) {
      return res.status(400).json({
        success: false,
        message: 'Promotion cannot be used for this order'
      });
    }
    
    const discount = promotion.calculateDiscount(orderAmount, orderItems);
    
    res.json({
      success: true,
      data: {
        promotion,
        discount,
        valid: true
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const applyPromotion = async (req, res) => {
  try {
    const { promotionId, userId, orderAmount, orderItems } = req.body;
    
    const promotion = await Promotion.findById(promotionId);
    
    if (!promotion) {
      return res.status(404).json({
        success: false,
        message: 'Promotion not found'
      });
    }
    
    if (!promotion.isValid()) {
      return res.status(400).json({
        success: false,
        message: 'Promotion is not currently valid'
      });
    }
    
    if (!promotion.canUseByUser(userId, orderAmount)) {
      return res.status(400).json({
        success: false,
        message: 'Promotion cannot be used for this order'
      });
    }
    
    const discount = promotion.calculateDiscount(orderAmount, orderItems);
    
    // Record usage
    await promotion.recordUsage(userId, discount);
    
    res.json({
      success: true,
      data: {
        promotion,
        discount,
        applied: true
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Promotion Analytics
export const getPromotionAnalytics = async (req, res) => {
  try {
    const { promotionId, startDate, endDate } = req.query;
    
    const matchStage = {};
    if (promotionId) matchStage._id = promotionId;
    if (startDate && endDate) {
      matchStage.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    const analytics = await Promotion.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalPromotions: { $sum: 1 },
          totalUses: { $sum: '$usage.totalUses' },
          totalDiscount: { $sum: '$usage.totalDiscount' },
          avgConversionRate: { $avg: '$analytics.conversionRate' },
          totalRevenue: { $sum: '$analytics.revenue' }
        }
      }
    ]);
    
    res.json({
      success: true,
      data: analytics[0] || {
        totalPromotions: 0,
        totalUses: 0,
        totalDiscount: 0,
        avgConversionRate: 0,
        totalRevenue: 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// A/B Testing
export const createABTest = async (req, res) => {
  try {
    const { controlPromotion, testPromotion, trafficAllocation = 50 } = req.body;
    
    // Create test ID
    const testId = `AB_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    
    // Update control promotion
    await Promotion.findByIdAndUpdate(controlPromotion, {
      'abTest.enabled': true,
      'abTest.variant': 'control',
      'abTest.testId': testId,
      'abTest.trafficAllocation': 100 - trafficAllocation
    });
    
    // Update test promotion
    await Promotion.findByIdAndUpdate(testPromotion, {
      'abTest.enabled': true,
      'abTest.variant': 'test',
      'abTest.testId': testId,
      'abTest.trafficAllocation': trafficAllocation
    });
    
    res.json({
      success: true,
      data: {
        testId,
        controlPromotion,
        testPromotion,
        trafficAllocation
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const getABTestResults = async (req, res) => {
  try {
    const { testId } = req.params;
    
    const promotions = await Promotion.find({ 'abTest.testId': testId });
    
    if (promotions.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'AB test not found'
      });
    }
    
    const results = promotions.map(promo => ({
      variant: promo.abTest.variant,
      trafficAllocation: promo.abTest.trafficAllocation,
      analytics: promo.analytics,
      usage: promo.usage
    }));
    
    res.json({
      success: true,
      data: {
        testId,
        results
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
