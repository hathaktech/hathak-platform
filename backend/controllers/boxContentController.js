import BoxContent from '../models/BoxContent.js';
import User from '../models/User.js';
import BuyForMeRequest from '../models/BuyForMeRequest.js';

// Get all box contents (Admin only)
const getAllBoxContents = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      user,
      boxNumber,
      purchaseType,
      sortBy = 'arrivalDate',
      sortOrder = 'desc'
    } = req.query;

    const query = {};
    
    if (status) query.status = status;
    if (user) query.user = user;
    if (boxNumber) query.boxNumber = boxNumber;
    if (purchaseType) query.purchaseType = purchaseType;

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const boxContents = await BoxContent.find(query)
      .populate('user', 'name email boxNumber')
      .populate('buyMeRequest', 'productName productUrl status')
      .populate('inspection.inspectedBy', 'name')
      .populate('packing.packedBy', 'name')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await BoxContent.countDocuments(query);

    res.json({
      success: true,
      data: boxContents,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching box contents',
      error: error.message
    });
  }
};

// Get box contents for a specific user
const getUserBoxContents = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, page = 1, limit = 20 } = req.query;

    const query = { user: userId };
    if (status) query.status = status;

    const boxContents = await BoxContent.find(query)
      .populate('buyMeRequest', 'productName productUrl status')
      .sort({ arrivalDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await BoxContent.countDocuments(query);

    res.json({
      success: true,
      data: boxContents,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user box contents',
      error: error.message
    });
  }
};

// Get single box content
const getBoxContent = async (req, res) => {
  try {
    const { id } = req.params;
    
    const boxContent = await BoxContent.findById(id)
      .populate('user', 'name email boxNumber')
      .populate('buyMeRequest', 'productName productUrl status')
      .populate('inspection.inspectedBy', 'name')
      .populate('packing.packedBy', 'name');

    if (!boxContent) {
      return res.status(404).json({
        success: false,
        message: 'Box content not found'
      });
    }

    // Check if user can access this box content
    if (req.user.role !== 'admin' && boxContent.user._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: boxContent
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching box content',
      error: error.message
    });
  }
};

// Create new box content (Admin only)
const createBoxContent = async (req, res) => {
  try {
    const {
      user,
      productName,
      productDescription,
      productImage,
      productUrl,
      productPrice,
      currency = 'USD',
      quantity = 1,
      purchaseType,
      buyMeRequest,
      orderId,
      warehouseLocation = 'Main Warehouse',
      trackingNumber,
      specialInstructions
    } = req.body;

    // Validate required fields
    if (!user || !productName || !productPrice || !purchaseType) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Get user's box number
    const userData = await User.findById(user);
    if (!userData) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const boxContent = new BoxContent({
      user,
      boxNumber: userData.boxNumber,
      productName,
      productDescription,
      productImage,
      productUrl,
      productPrice,
      currency,
      quantity,
      purchaseType,
      buyMeRequest: purchaseType === 'buy_me' ? buyMeRequest : undefined,
      orderId,
      warehouseLocation,
      trackingNumber,
      customerActions: {
        specialInstructions
      }
    });

    await boxContent.save();

    // Populate the created box content
    await boxContent.populate([
      { path: 'user', select: 'name email boxNumber' },
      { path: 'buyMeRequest', select: 'productName productUrl status' }
    ]);

    res.status(201).json({
      success: true,
      data: boxContent,
      message: 'Box content created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating box content',
      error: error.message
    });
  }
};

// Update box content status
const updateBoxContentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes, condition, images } = req.body;
    const updatedBy = req.user.id;

    const boxContent = await BoxContent.findById(id);
    if (!boxContent) {
      return res.status(404).json({
        success: false,
        message: 'Box content not found'
      });
    }

    // Update status
    await boxContent.updateStatus(status, updatedBy);

    // Add inspection details if provided
    if (status === 'inspected' && (notes || condition || images)) {
      if (notes) boxContent.inspection.notes = notes;
      if (condition) boxContent.inspection.condition = condition;
      if (images) boxContent.inspection.images = images;
      await boxContent.save();
    }

    // Populate updated data
    await boxContent.populate([
      { path: 'user', select: 'name email boxNumber' },
      { path: 'buyMeRequest', select: 'productName productUrl status' },
      { path: 'inspection.inspectedBy', select: 'name' },
      { path: 'packing.packedBy', select: 'name' }
    ]);

    res.json({
      success: true,
      data: boxContent,
      message: 'Box content status updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating box content status',
      error: error.message
    });
  }
};

// Update packing information
const updatePackingInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      packageWeight,
      packageDimensions,
      packagingMaterials,
      notes
    } = req.body;
    const packedBy = req.user.id;

    const boxContent = await BoxContent.findById(id);
    if (!boxContent) {
      return res.status(404).json({
        success: false,
        message: 'Box content not found'
      });
    }

    // Update packing information
    boxContent.packing.packedBy = packedBy;
    boxContent.packing.packedDate = Date.now();
    if (packageWeight) boxContent.packing.packageWeight = packageWeight;
    if (packageDimensions) boxContent.packing.packageDimensions = packageDimensions;
    if (packagingMaterials) boxContent.packing.packagingMaterials = packagingMaterials;
    if (notes) boxContent.packing.notes = notes;

    await boxContent.save();

    res.json({
      success: true,
      data: boxContent,
      message: 'Packing information updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating packing information',
      error: error.message
    });
  }
};

// Update shipping information
const updateShippingInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      shippingMethod,
      shippingCost,
      trackingNumber,
      estimatedDelivery
    } = req.body;

    const boxContent = await BoxContent.findById(id);
    if (!boxContent) {
      return res.status(404).json({
        success: false,
        message: 'Box content not found'
      });
    }

    // Update shipping information
    if (shippingMethod) boxContent.shipping.shippingMethod = shippingMethod;
    if (shippingCost) boxContent.shipping.shippingCost = shippingCost;
    if (trackingNumber) boxContent.shipping.trackingNumber = trackingNumber;
    if (estimatedDelivery) boxContent.shipping.estimatedDelivery = estimatedDelivery;

    await boxContent.save();

    res.json({
      success: true,
      data: boxContent,
      message: 'Shipping information updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating shipping information',
      error: error.message
    });
  }
};

// Customer request packing
const requestPacking = async (req, res) => {
  try {
    const { id } = req.params;
    const { specialInstructions } = req.body;
    const userId = req.user.id;

    const boxContent = await BoxContent.findById(id);
    if (!boxContent) {
      return res.status(404).json({
        success: false,
        message: 'Box content not found'
      });
    }

    // Check if user owns this box content
    if (boxContent.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Update customer actions
    boxContent.customerActions.requestedPacking = true;
    boxContent.customerActions.packingRequestDate = Date.now();
    if (specialInstructions) {
      boxContent.customerActions.specialInstructions = specialInstructions;
    }

    await boxContent.save();

    res.json({
      success: true,
      data: boxContent,
      message: 'Packing request submitted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error submitting packing request',
      error: error.message
    });
  }
};

// Customer confirm packing
const confirmPacking = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const boxContent = await BoxContent.findById(id);
    if (!boxContent) {
      return res.status(404).json({
        success: false,
        message: 'Box content not found'
      });
    }

    // Check if user owns this box content
    if (boxContent.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Update customer actions
    boxContent.customerActions.confirmedPacking = true;
    boxContent.customerActions.confirmationDate = Date.now();

    await boxContent.save();

    res.json({
      success: true,
      data: boxContent,
      message: 'Packing confirmed successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error confirming packing',
      error: error.message
    });
  }
};

// Get box contents statistics
const getBoxContentsStats = async (req, res) => {
  try {
    const stats = await BoxContent.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalValue: { $sum: { $multiply: ['$productPrice', '$quantity'] } }
        }
      }
    ]);

    const totalItems = await BoxContent.countDocuments();
    const totalValue = await BoxContent.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: { $multiply: ['$productPrice', '$quantity'] } }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        statusBreakdown: stats,
        totalItems,
        totalValue: totalValue[0]?.total || 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
};

// Delete box content (Admin only)
const deleteBoxContent = async (req, res) => {
  try {
    const { id } = req.params;

    const boxContent = await BoxContent.findByIdAndDelete(id);
    if (!boxContent) {
      return res.status(404).json({
        success: false,
        message: 'Box content not found'
      });
    }

    res.json({
      success: true,
      message: 'Box content deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting box content',
      error: error.message
    });
  }
};

export {
  getAllBoxContents,
  getUserBoxContents,
  getBoxContent,
  createBoxContent,
  updateBoxContentStatus,
  updatePackingInfo,
  updateShippingInfo,
  requestPacking,
  confirmPacking,
  getBoxContentsStats,
  deleteBoxContent
};
