import Payment from '../models/Payment.js';
import Settlement from '../models/Settlement.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import Seller from '../models/Seller.js';

// Payment Processing
export const createPayment = async (req, res) => {
  try {
    const { orderId, method, provider, cardDetails, bankTransfer, wallet, installment } = req.body;
    
    // Get order details
    const order = await Order.findById(orderId).populate('products.product');
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Generate transaction ID
    const transactionId = generateTransactionId(provider);
    
    // Calculate fees based on method and provider
    const fees = calculatePaymentFees(order.totalPrice, method, provider);
    
    // Create payment record
    const payment = await Payment.create({
      order: orderId,
      user: req.user.id,
      amount: order.totalPrice,
      currency: order.currency || 'USD',
      method,
      provider,
      transactionId,
      cardDetails: method === 'card' ? cardDetails : undefined,
      bankTransfer: method === 'bank_transfer' ? bankTransfer : undefined,
      wallet: method === 'wallet' ? wallet : undefined,
      installment: method === 'installment' ? installment : undefined,
      fees,
      metadata: {
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        location: req.body.location
      }
    });
    
    // Process payment based on provider
    const paymentResult = await processPaymentWithProvider(payment, method, provider);
    
    // Update payment with gateway response
    payment.gatewayResponse = paymentResult;
    payment.externalTransactionId = paymentResult.transactionId;
    payment.status = paymentResult.status;
    
    await payment.save();
    
    // Calculate settlement amounts
    payment.calculateSettlement();
    await payment.save();
    
    res.status(201).json({
      success: true,
      data: payment
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const getPayments = async (req, res) => {
  try {
    const { status, method, provider, startDate, endDate, page = 1, limit = 20 } = req.query;
    const filter = {};
    
    if (status) filter.status = status;
    if (method) filter.method = method;
    if (provider) filter.provider = provider;
    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    const payments = await Payment.find(filter)
      .populate('order', 'orderNumber customerName')
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Payment.countDocuments(filter);
    
    res.json({
      success: true,
      data: payments,
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

export const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('order', 'orderNumber customerName')
      .populate('user', 'name email');
    
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }
    
    res.json({
      success: true,
      data: payment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const updatePaymentStatus = async (req, res) => {
  try {
    const { status, reason, gatewayResponse } = req.body;
    const payment = await Payment.findById(req.params.id);
    
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }
    
    await payment.updateStatus(status, reason, gatewayResponse, req.user.id);
    
    res.json({
      success: true,
      data: payment
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Refund Processing
export const processRefund = async (req, res) => {
  try {
    const { amount, reason } = req.body;
    const payment = await Payment.findById(req.params.id);
    
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }
    
    if (payment.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Only completed payments can be refunded'
      });
    }
    
    await payment.processRefund(amount, reason, req.user.id);
    
    res.json({
      success: true,
      data: payment
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Settlement Management
export const generateSettlement = async (req, res) => {
  try {
    const { sellerId, startDate, endDate } = req.body;
    
    const settlement = await Settlement.generateSettlement(sellerId, startDate, endDate);
    
    res.status(201).json({
      success: true,
      data: settlement
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const getSettlements = async (req, res) => {
  try {
    const { seller, status, year, month, page = 1, limit = 20 } = req.query;
    const filter = {};
    
    if (seller) filter.seller = seller;
    if (status) filter.status = status;
    if (year) filter['period.year'] = parseInt(year);
    if (month) filter['period.month'] = parseInt(month);
    
    const settlements = await Settlement.find(filter)
      .populate('seller', 'businessName email')
      .sort({ 'period.year': -1, 'period.month': -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Settlement.countDocuments(filter);
    
    res.json({
      success: true,
      data: settlements,
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

export const updateSettlementStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;
    const settlement = await Settlement.findById(req.params.id);
    
    if (!settlement) {
      return res.status(404).json({
        success: false,
        message: 'Settlement not found'
      });
    }
    
    await settlement.updateStatus(status, notes, req.user.id);
    
    res.json({
      success: true,
      data: settlement
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const scheduleSettlementPayment = async (req, res) => {
  try {
    const { paymentMethod, bankDetails, scheduledDate } = req.body;
    const settlement = await Settlement.findById(req.params.id);
    
    if (!settlement) {
      return res.status(404).json({
        success: false,
        message: 'Settlement not found'
      });
    }
    
    await settlement.schedulePayment(paymentMethod, bankDetails, scheduledDate, req.user.id);
    
    res.json({
      success: true,
      data: settlement
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Analytics and Reporting
export const getPaymentAnalytics = async (req, res) => {
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
      totalAmount: { $sum: '$amount' },
      totalFees: { $sum: '$fees.totalFees' },
      count: { $sum: 1 },
      completed: {
        $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
      },
      failed: {
        $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] }
      }
    };
    
    const analytics = await Payment.aggregate([
      { $match: matchStage },
      { $group: groupStage },
      { $sort: { _id: 1 } }
    ]);
    
    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Helper Functions
function generateTransactionId(provider) {
  const prefixes = {
    'stripe': 'STR',
    'paypal': 'PP',
    'square': 'SQ',
    'razorpay': 'RZ',
    'local_gateway': 'LG',
    'manual': 'MAN'
  };
  
  const prefix = prefixes[provider] || 'TXN';
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.random().toString(36).substr(2, 6).toUpperCase();
  
  return `${prefix}_${timestamp}_${random}`;
}

function calculatePaymentFees(amount, method, provider) {
  const baseFees = {
    'stripe': { percentage: 0.029, fixed: 0.30 },
    'paypal': { percentage: 0.034, fixed: 0.30 },
    'square': { percentage: 0.029, fixed: 0.30 },
    'razorpay': { percentage: 0.02, fixed: 0.20 },
    'local_gateway': { percentage: 0.015, fixed: 0.10 },
    'manual': { percentage: 0, fixed: 0 }
  };
  
  const fees = baseFees[provider] || { percentage: 0.03, fixed: 0.30 };
  const processingFee = (amount * fees.percentage) + fees.fixed;
  const platformFee = amount * 0.03; // 3% platform fee
  
  return {
    processingFee: Math.round(processingFee * 100) / 100,
    gatewayFee: Math.round(processingFee * 100) / 100,
    platformFee: Math.round(platformFee * 100) / 100,
    currencyConversionFee: 0, // Will be calculated if needed
    totalFees: Math.round((processingFee + platformFee) * 100) / 100
  };
}

async function processPaymentWithProvider(payment, method, provider) {
  // This would integrate with actual payment gateways
  // For now, simulate successful payment processing
  
  const mockResponse = {
    transactionId: payment.transactionId,
    status: 'completed',
    gatewayTransactionId: `GW_${Date.now()}`,
    processedAt: new Date(),
    fees: payment.fees
  };
  
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return mockResponse;
}
