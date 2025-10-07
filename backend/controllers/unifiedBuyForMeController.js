// controllers/unifiedBuyForMeController.js - Unified BuyForMe Controller
import BuyForMeRequest from '../models/BuyForMeRequest.js';
import User from '../models/User.js';
import Admin from '../models/Admin.js';
import mongoose from 'mongoose';
import notificationService from '../services/notificationService.js';
import { 
  asyncHandler, 
  NotFoundError, 
  ValidationError, 
  ConflictError,
  AppError 
} from '../middleware/errorHandler.js';

// Get all BuyForMe requests with advanced filtering and pagination
export const getAllRequests = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 1000, // Increased limit to show all requests
    status,
    subStatus,
    priority,
    customerId,
    search,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    startDate,
    endDate,
    minAmount,
    maxAmount,
  } = req.query;

  // Build filter object
  const filter = {};
  
  if (status) filter.status = status;
  if (subStatus) filter.subStatus = subStatus;
  if (priority) filter.priority = priority;
  if (customerId) filter.customerId = customerId;
  
  // Date range filter
  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) filter.createdAt.$gte = new Date(startDate);
    if (endDate) filter.createdAt.$lte = new Date(endDate);
  }
  
  // Amount range filter
  if (minAmount || maxAmount) {
    filter.totalAmount = {};
    if (minAmount) filter.totalAmount.$gte = parseFloat(minAmount);
    if (maxAmount) filter.totalAmount.$lte = parseFloat(maxAmount);
  }
  
  // Search filter
  if (search) {
    filter.$or = [
      { customerName: { $regex: search, $options: 'i' } },
      { customerEmail: { $regex: search, $options: 'i' } },
      { requestNumber: { $regex: search, $options: 'i' } },
      { 'items.name': { $regex: search, $options: 'i' } },
      { notes: { $regex: search, $options: 'i' } }
    ];
  }

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;
  const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

  // Standard individual requests - no grouping
  const [requests, total, statusCounts, priorityCounts] = await Promise.all([
    BuyForMeRequest.find(filter)
      .populate('customerId', 'name email')
      .populate('processHistory.processedBy', 'name email')
      .sort(sort)
      .skip(skip)
      .limit(limitNum),
    BuyForMeRequest.countDocuments(filter),
    BuyForMeRequest.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]),
    BuyForMeRequest.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ])
  ]);

  res.json({
    success: true,
    data: {
      requests,
      pagination: {
        current: pageNum,
        pages: Math.ceil(total / limitNum),
        total,
        limit: limitNum
      },
      statusCounts: statusCounts.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      priorityCounts: priorityCounts.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {})
    }
  });
});

// Get single request by ID
export const getRequestById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const request = await BuyForMeRequest.findById(id)
    .populate('customerId', 'name email')
    .populate('lastModifiedByAdmin', 'name email')
    .populate('lastModifiedByUser', 'name email')
    .populate('processHistory.processedBy', 'name email');

  if (!request) {
    throw new NotFoundError('Request not found');
  }

  res.json({
    success: true,
    data: request
  });
});

// Create new request - Create individual requests for each item
export const createRequest = asyncHandler(async (req, res) => {
  const {
    customerId,
    customerName,
    customerEmail,
    items,
    shippingAddress,
    notes,
    priority = 'medium',
  } = req.body;

  // Validate required fields
  if (!customerId || !items || !Array.isArray(items) || items.length === 0) {
    throw new ValidationError('Customer ID and items are required');
  }

  // Validate customer exists
  const customer = await User.findById(customerId);
  if (!customer) {
    throw new NotFoundError('Customer not found');
  }

  const customerNameFinal = customerName || customer.name;
  const customerEmailFinal = customerEmail || customer.email;

  // Create individual requests for each item
  const individualRequests = [];
  
  // Get admin info for process tracking
  const adminId = req.admin?._id || req.user?._id;
  const adminName = req.admin?.name || req.user?.name || 'System';
  
  for (const item of items) {
    // Calculate item-specific total amount
    const itemTotalAmount = item.price * item.quantity;

    // Create new individual request for this item
    const newRequest = new BuyForMeRequest({
      customerId,
      customerName: customerNameFinal,
      customerEmail: customerEmailFinal,
      items: [item], // Single item per request
      totalAmount: itemTotalAmount,
      shippingAddress,
      notes: notes || '',
      priority,
      status: 'pending',
      reviewStatus: 'pending',
      paymentStatus: 'pending'
    });

    // Add initial process record for request creation
    newRequest.addProcessRecord('request_created', adminId, adminName,
      'Request created',
      `New request created for ${item.name} | Amount: ${itemTotalAmount} ${item.currency || 'USD'}`,
      null, { itemName: item.name, amount: itemTotalAmount, currency: item.currency || 'USD' },
      { itemName: item.name, amount: itemTotalAmount, currency: item.currency || 'USD' });

    await newRequest.save();
    individualRequests.push(newRequest);

    // Send notification for each individual request
    try {
      await notificationService.createRequestNotification(newRequest._id, 'request_submitted');
    } catch (notificationError) {
      console.error(`Failed to send notification for request ${newRequest.requestNumber}:`, notificationError);
    }
  }

  res.status(201).json({
    success: true,
    data: {
      individualRequests: individualRequests,
      totalAmount: individualRequests.reduce((total, req) => total + req.totalAmount, 0),
      itemCount: individualRequests.length
    },
    message: `${individualRequests.length} individual request(s) created successfully`
  });
});

// Update request status
export const updateRequestStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, subStatus, reason, notes } = req.body;
  
  // Get admin info from the authenticated request
  const adminId = req.admin?._id || req.user?._id;
  const adminName = req.admin?.name || req.user?.name || 'Unknown Admin';

  const request = await BuyForMeRequest.findById(id);
  if (!request) {
    throw new NotFoundError('Request not found');
  }

  // Use the model method to update status with tracking
  await request.updateStatus(status, subStatus, adminId, adminName, reason, notes);

  res.json({
    success: true,
    data: request,
    message: 'Status updated successfully'
  });
});

// Review request (approve/reject)
export const reviewRequest = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { 
    reviewStatus, 
    comment, 
    rejectionReason, 
    isInternal = false,
    modifiedItems,
    adminModificationNote,
    modifiedByAdmin,
    adminModificationDate,
    lastModifiedByAdmin
  } = req.body;

  // Get admin info from the authenticated request
  const adminId = req.admin?._id || req.user?._id;
  const adminName = req.admin?.name || req.user?.name;

  const request = await BuyForMeRequest.findById(id);
  if (!request) {
    throw new NotFoundError('Request not found');
  }

  // Handle admin modifications if provided
  if (modifiedItems && modifiedByAdmin) {
    console.log('Processing admin modifications:', modifiedItems);
    
    // Update items with admin modifications
    request.items = modifiedItems.map(item => ({
      ...item,
      // Remove the originalItem property that was added for comparison
      originalItem: undefined
    }));
    
    // Update modification tracking fields
    request.modifiedByAdmin = true;
    request.adminModificationDate = adminModificationDate ? new Date(adminModificationDate) : new Date();
    request.adminModificationNote = adminModificationNote;
    request.lastModifiedByAdmin = lastModifiedByAdmin || adminName;
    
    // Recalculate total amount based on modified items
    request.totalAmount = request.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    console.log('Updated request with admin modifications. New total:', request.totalAmount);
  }

  // Update review status
  request.reviewStatus = reviewStatus;
  if (adminId) {
    // Convert string adminId to ObjectId if needed
    request.lastModifiedByAdmin = mongoose.isValidObjectId(adminId) 
      ? adminId 
      : new mongoose.Types.ObjectId(adminId);
  }

  if (rejectionReason) {
    request.rejectionReason = rejectionReason;
  }

  // Add comment if provided
  if (comment) {
    await request.addComment(comment, adminId, adminName, isInternal);
  }

  // Track review process
  const previousStatus = request.status;
  const previousReviewStatus = request.reviewStatus;
  
  // Update main status based on review
  if (reviewStatus === 'approved') {
    request.status = 'approved';
    request.addProcessRecord('review_approval', adminId, adminName,
      'Request approved',
      `Request approved${comment ? ` | Comment: ${comment.substring(0, 100)}${comment.length > 100 ? '...' : ''}` : ''}`,
      { status: previousStatus, reviewStatus: previousReviewStatus },
      { status: request.status, reviewStatus },
      { comment, isInternal });
  } else if (reviewStatus === 'rejected') {
    request.status = 'cancelled';
    request.addProcessRecord('review_rejection', adminId, adminName,
      'Request rejected',
      `Request rejected${rejectionReason ? ` | Reason: ${rejectionReason}` : ''}${comment ? ` | Comment: ${comment.substring(0, 100)}${comment.length > 100 ? '...' : ''}` : ''}`,
      { status: previousStatus, reviewStatus: previousReviewStatus },
      { status: request.status, reviewStatus },
      { rejectionReason, comment, isInternal });
  } else if (reviewStatus === 'needs_modification') {
    request.status = 'pending';
    request.modifiedButNeedsModification = true;
    request.adminModificationDate = new Date();
    if (comment) {
      request.adminModificationNote = comment;
    }
    request.addProcessRecord('request_modified', adminId, adminName,
      'Request needs modification',
      `Modifications required${comment ? ` | Instructions: ${comment.substring(0, 100)}${comment.length > 100 ? '...' : ''}` : ''}`,
      { status: previousStatus, reviewStatus: previousReviewStatus },
      { status: request.status, reviewStatus },
      { comment, isInternal });
  }

  await request.save();

  // Send notifications based on review decision
  try {
    if (reviewStatus === 'approved') {
      await notificationService.createRequestNotification(request._id, 'request_approved');
    } else if (reviewStatus === 'rejected') {
      await notificationService.createRequestNotification(request._id, 'request_rejected', {
        reason: rejectionReason
      });
    } else if (reviewStatus === 'needs_modification') {
      await notificationService.createRequestNotification(request._id, 'changes_requested', {
        reason: comment
      });
    }
  } catch (notificationError) {
    console.error('Failed to send notification:', notificationError);
    // Don't fail the request if notification fails
  }

  res.json({
    success: true,
    data: request,
    message: 'Request reviewed successfully'
  });
});

// Process payment
export const processPayment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { paymentMethod, transactionId, amount } = req.body;
  
  // Get admin info from the authenticated request
  const adminId = req.admin?._id || req.user?._id;
  const adminName = req.admin?.name || req.user?.name || 'System';

  const request = await BuyForMeRequest.findById(id);
  if (!request) {
    throw new NotFoundError('Request not found');
  }

  // Track payment process
  const previousStatus = request.status;
  const previousSubStatus = request.subStatus;
  const previousPaymentStatus = request.paymentStatus;

  // Update payment information
  request.paymentStatus = 'paid';
  request.paymentMethod = paymentMethod;
  request.transactionId = transactionId;
  request.status = 'in_progress';
  request.subStatus = 'payment_completed';
  
  if (adminId) request.lastModifiedByAdmin = adminId;

  // Add payment process record
  request.addProcessRecord('payment_received', adminId, adminName,
    'Payment received',
    `Payment processed: ${amount || request.totalAmount} ${request.currency} via ${paymentMethod}${transactionId ? ` | Transaction: ${transactionId}` : ''}`,
    { status: previousStatus, subStatus: previousSubStatus, paymentStatus: previousPaymentStatus },
    { status: request.status, subStatus: request.subStatus, paymentStatus: request.paymentStatus, amount, paymentMethod, transactionId },
    { amount, paymentMethod, transactionId });

  await request.save();

  // Send payment received notification
  try {
    await notificationService.createRequestNotification(request._id, 'payment_received', {
      amount,
      paymentMethod,
      transactionId
    });
  } catch (notificationError) {
    console.error('Failed to send payment notification:', notificationError);
  }

  res.json({
    success: true,
    data: request,
    message: 'Payment processed successfully'
  });
});

// Mark as purchased
export const markAsPurchased = asyncHandler(async (req, res) => {
  console.log('📦 markAsPurchased called - Request params:', req.params);
  console.log('📦 markAsPurchased called - Request body:', req.body);
  console.log('📦 markAsPurchased called - Admin:', req.admin ? 'Present' : 'Missing');
  console.log('📦 markAsPurchased called - User:', req.user ? 'Present' : 'Missing');
  
  const { id } = req.params;
  const { 
    supplier, 
    purchaseOrderNumber, 
    estimatedDelivery, 
    notes, 
    trackingNumber,
    purchaseAmount,
    paymentMethod,
    currency,
    shippingAddress
  } = req.body;
  
  // Get admin info from the authenticated request
  const adminId = req.admin?._id || req.user?._id;
  const adminName = req.admin?.name || req.user?.name || 'Unknown Admin';
  console.log('📦 Admin ID:', adminId);

  const request = await BuyForMeRequest.findById(id);
  console.log('📦 Request found:', request ? 'Yes' : 'No');
  
  if (!request) {
    console.log('❌ Request not found with ID:', id);
    throw new NotFoundError('Request not found');
  }

  // Update order details with all provided fields
  request.orderDetails = {
    purchaseDate: new Date(),
    purchasedBy: adminId,
    supplier,
    purchaseOrderNumber,
    estimatedDelivery: estimatedDelivery ? new Date(estimatedDelivery) : null,
    trackingNumber,
    notes,
    purchaseAmount: purchaseAmount ? parseFloat(purchaseAmount) : undefined,
    paymentMethod: paymentMethod || undefined,
    currency: currency || undefined,
    shippingAddress: shippingAddress || undefined
  };

  // Update tracking number at request level if provided
  if (trackingNumber) {
    request.trackingNumber = trackingNumber;
  }

  // Update payment information at request level if provided
  if (paymentMethod) {
    request.paymentMethod = paymentMethod;
  }

  if (currency) {
    request.currency = currency;
  }

  // Use the new markAsPurchased method with comprehensive tracking
  await request.markAsPurchased(adminId, adminName, supplier, trackingNumber, notes);
  console.log('✅ Request saved successfully');

  const response = {
    success: true,
    data: request,
    message: 'Order marked as purchased'
  };
  
  console.log('✅ Sending response:', { success: response.success, message: response.message });
  res.json(response);
});

// Update shipping status
export const updateShippingStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, trackingNumber, carrier, estimatedArrival } = req.body;
  
  // Get admin info from the authenticated request
  const adminId = req.admin?._id || req.user?._id;

  const request = await BuyForMeRequest.findById(id);
  if (!request) {
    throw new NotFoundError('Request not found');
  }

  // Update shipping information
  request.trackingNumber = trackingNumber;
  
  if (status === 'shipped') {
    request.status = 'shipped';
  } else if (status === 'delivered') {
    request.status = 'delivered';
    request.actualDelivery = new Date();
  }
  
  if (adminId) request.lastModifiedByAdmin = adminId;

  await request.save();

  res.json({
    success: true,
    data: request,
    message: 'Shipping status updated'
  });
});

// Admin control (quality check)
export const adminControl = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { controlNotes, photos, itemConditions } = req.body;
  
  // Get admin info from the authenticated request
  const adminId = req.admin?._id || req.user?._id;

  const request = await BuyForMeRequest.findById(id);
  if (!request) {
    throw new NotFoundError('Request not found');
  }

  // Update control details
  request.controlDetails = {
    controlledBy: adminId,
    controlDate: new Date(),
    controlNotes,
    photos: photos || [],
    itemConditions: itemConditions || []
  };

  request.status = 'in_progress';
  request.subStatus = 'customer_review';
  
  if (adminId) request.lastModifiedByAdmin = adminId;

  await request.save();

  res.json({
    success: true,
    data: request,
    message: 'Admin control completed'
  });
});

// Customer review
export const customerReview = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { customerDecision, customerNotes, rejectedItems } = req.body;

  const request = await BuyForMeRequest.findById(id);
  if (!request) {
    throw new NotFoundError('Request not found');
  }

  // Update customer review
  request.customerReview = {
    reviewedAt: new Date(),
    customerDecision,
    customerNotes,
    rejectedItems: rejectedItems || []
  };

  if (customerDecision === 'approved') {
    request.status = 'in_progress';
    request.subStatus = 'customer_approved';
  } else if (customerDecision === 'rejected') {
    request.status = 'cancelled';
    request.subStatus = 'customer_rejected';
  }

  await request.save();

  res.json({
    success: true,
    data: request,
    message: 'Customer review recorded'
  });
});

// Packing choice
export const packingChoice = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { choice, customerNotes } = req.body;
  
  // Get admin info from the authenticated request
  const adminId = req.admin?._id || req.user?._id;

  const request = await BuyForMeRequest.findById(id);
  if (!request) {
    throw new NotFoundError('Request not found');
  }

  // Update packing choice
  request.packingChoice = {
    choice,
    chosenAt: new Date(),
    customerNotes
  };

  request.status = 'in_progress';
  request.subStatus = 'packed';
  
  if (adminId) request.lastModifiedByAdmin = adminId;

  await request.save();

  res.json({
    success: true,
    data: request,
    message: 'Packing choice recorded'
  });
});

// Handle return/replacement
export const handleReturnReplacement = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { action, items, reason, replacementDetails } = req.body;
  
  // Get admin info from the authenticated request
  const adminId = req.admin?._id || req.user?._id;

  const request = await BuyForMeRequest.findById(id);
  if (!request) {
    throw new NotFoundError('Request not found');
  }

  if (action === 'return') {
    request.status = 'cancelled';
    request.subStatus = 'return_requested';
  } else if (action === 'replace') {
    request.status = 'in_progress';
    request.subStatus = 'replacement_requested';
  }

  if (adminId) request.lastModifiedByAdmin = adminId;

  await request.save();

  res.json({
    success: true,
    data: request,
    message: `${action} processed successfully`
  });
});

// Delete request
export const deleteRequest = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const request = await BuyForMeRequest.findByIdAndDelete(id);
  if (!request) {
    throw new NotFoundError('Request not found');
  }

  res.json({
    success: true,
    message: 'Request deleted successfully'
  });
});

// Get statistics
export const getStatistics = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  const matchStage = {};
  if (startDate || endDate) {
    matchStage.createdAt = {};
    if (startDate) matchStage.createdAt.$gte = new Date(startDate);
    if (endDate) matchStage.createdAt.$lte = new Date(endDate);
  }

  const stats = await BuyForMeRequest.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalRequests: { $sum: 1 },
        totalValue: { $sum: '$totalAmount' },
        averageValue: { $avg: '$totalAmount' },
        statusCounts: { $push: '$status' },
        priorityCounts: { $push: '$priority' }
      }
    }
  ]);

  const result = stats[0] || {
    totalRequests: 0,
    totalValue: 0,
    averageValue: 0,
    statusCounts: [],
    priorityCounts: []
  };

  // Count status occurrences
  const statusCounts = result.statusCounts.reduce((acc, status) => {
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  // Count priority occurrences
  const priorityCounts = result.priorityCounts.reduce((acc, priority) => {
    acc[priority] = (acc[priority] || 0) + 1;
    return acc;
  }, {});

  res.json({
    success: true,
    data: {
      totalRequests: result.totalRequests,
      totalValue: result.totalValue,
      averageValue: result.averageValue,
      statusCounts,
      priorityCounts
    }
  });
});

// User-specific endpoints
export const getUserRequests = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 1000, // Increased limit to show all user requests
    status,
    search,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;

  // Build filter object
  const filter = { customerId: req.user._id };
  
  if (status) filter.status = status;
  
  // Search filter
  if (search) {
    filter.$or = [
      { requestNumber: { $regex: search, $options: 'i' } },
      { 'items.name': { $regex: search, $options: 'i' } },
      { notes: { $regex: search, $options: 'i' } }
    ];
  }

  // Calculate pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

  // Execute query
  const requests = await BuyForMeRequest.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit))
    .select('-adminNotes -reviewComments -controlDetails -orderDetails');

  // Get total count for pagination
  const total = await BuyForMeRequest.countDocuments(filter);

  res.json({
    success: true,
    data: requests,
    pagination: {
      current: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      total,
      limit: parseInt(limit)
    }
  });
});

export const getUserRequestById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const request = await BuyForMeRequest.findOne({
    _id: id,
    customerId: req.user._id
  }).select('-adminNotes -reviewComments -controlDetails -orderDetails');

  if (!request) {
    throw new NotFoundError('Request not found');
  }

  res.json({
    success: true,
    data: request
  });
});
