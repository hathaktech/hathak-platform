import FulfillmentCenter from '../models/FulfillmentCenter.js';
import Inventory from '../models/Inventory.js';
import OrderFulfillment from '../models/OrderFulfillment.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Seller from '../models/Seller.js';

// Fulfillment Center Management
export const createFulfillmentCenter = async (req, res) => {
  try {
    const fulfillmentCenter = await FulfillmentCenter.create(req.body);
    res.status(201).json({
      success: true,
      data: fulfillmentCenter
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const getFulfillmentCenters = async (req, res) => {
  try {
    const { type, status, seller } = req.query;
    const filter = {};
    
    if (type) filter.type = type;
    if (status) filter.status = status;
    if (seller) filter.seller = seller;
    
    const fulfillmentCenters = await FulfillmentCenter.find(filter)
      .populate('seller', 'businessName email')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: fulfillmentCenters
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getFulfillmentCenterById = async (req, res) => {
  try {
    const fulfillmentCenter = await FulfillmentCenter.findById(req.params.id)
      .populate('seller', 'businessName email');
    
    if (!fulfillmentCenter) {
      return res.status(404).json({
        success: false,
        message: 'Fulfillment center not found'
      });
    }
    
    res.json({
      success: true,
      data: fulfillmentCenter
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Inventory Management
export const getInventory = async (req, res) => {
  try {
    const { product, fulfillmentCenter, seller, status, lowStock } = req.query;
    const filter = {};
    
    if (product) filter.product = product;
    if (fulfillmentCenter) filter.fulfillmentCenter = fulfillmentCenter;
    if (seller) filter.seller = seller;
    if (status) filter.status = status;
    
    // Low stock filter
    if (lowStock === 'true') {
      filter.$expr = {
        $lte: ['$available', '$reorderPoint']
      };
    }
    
    const inventory = await Inventory.find(filter)
      .populate('product', 'name sku')
      .populate('productVariant', 'sku options')
      .populate('fulfillmentCenter', 'name code')
      .populate('seller', 'businessName')
      .sort({ updatedAt: -1 });
    
    res.json({
      success: true,
      data: inventory
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const updateInventory = async (req, res) => {
  try {
    const { action, quantity, reason, reference, notes } = req.body;
    const inventory = await Inventory.findById(req.params.id);
    
    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: 'Inventory not found'
      });
    }
    
    let result;
    switch (action) {
      case 'adjust':
        result = await inventory.adjust(quantity, reason, reference, req.user.id, notes);
        break;
      case 'reserve':
        result = await inventory.reserve(quantity, reason, reference, req.user.id);
        break;
      case 'release':
        result = await inventory.release(quantity, reason, reference, req.user.id);
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid action'
        });
    }
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Order Fulfillment
export const createOrderFulfillment = async (req, res) => {
  try {
    const { orderId, orderItemId, fulfillmentType, fulfillmentCenterId } = req.body;
    
    // Get order and order item
    const order = await Order.findById(orderId).populate('products.product');
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    const orderItem = order.products.find(item => item._id.toString() === orderItemId);
    if (!orderItem) {
      return res.status(404).json({
        success: false,
        message: 'Order item not found'
      });
    }
    
    // Determine fulfillment center
    let fulfillmentCenter;
    if (fulfillmentCenterId) {
      fulfillmentCenter = await FulfillmentCenter.findById(fulfillmentCenterId);
    } else {
      // Auto-select based on product and location
      fulfillmentCenter = await selectOptimalFulfillmentCenter(
        orderItem.product._id,
        order.shippingAddress,
        fulfillmentType
      );
    }
    
    if (!fulfillmentCenter) {
      return res.status(400).json({
        success: false,
        message: 'No suitable fulfillment center found'
      });
    }
    
    // Reserve inventory
    const inventory = await Inventory.findOne({
      product: orderItem.product._id,
      fulfillmentCenter: fulfillmentCenter._id,
      status: 'active'
    });
    
    if (!inventory || inventory.available < orderItem.quantity) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient inventory'
      });
    }
    
    // Create fulfillment record
    const fulfillment = await OrderFulfillment.create({
      order: orderId,
      orderItem: orderItemId,
      fulfillmentType,
      fulfillmentCenter: fulfillmentCenter._id,
      seller: orderItem.product.seller,
      product: orderItem.product._id,
      productVariant: orderItem.productVariant,
      quantity: orderItem.quantity,
      shippingAddress: order.shippingAddress,
      inventoryReservation: {
        inventoryId: inventory._id,
        reservedAt: new Date(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        quantity: orderItem.quantity
      }
    });
    
    // Reserve inventory
    await inventory.reserve(
      orderItem.quantity,
      'Order fulfillment',
      orderId,
      req.user.id
    );
    
    res.status(201).json({
      success: true,
      data: fulfillment
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const getOrderFulfillments = async (req, res) => {
  try {
    const { order, status, fulfillmentCenter, seller } = req.query;
    const filter = {};
    
    if (order) filter.order = order;
    if (status) filter.status = status;
    if (fulfillmentCenter) filter.fulfillmentCenter = fulfillmentCenter;
    if (seller) filter.seller = seller;
    
    const fulfillments = await OrderFulfillment.find(filter)
      .populate('order', 'orderNumber customerName')
      .populate('product', 'name sku')
      .populate('fulfillmentCenter', 'name code')
      .populate('seller', 'businessName')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: fulfillments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const updateFulfillmentStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;
    const fulfillment = await OrderFulfillment.findById(req.params.id);
    
    if (!fulfillment) {
      return res.status(404).json({
        success: false,
        message: 'Fulfillment not found'
      });
    }
    
    await fulfillment.updateStatus(status, notes, req.user.id);
    
    res.json({
      success: true,
      data: fulfillment
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Pick, Pack, Ship Workflow
export const generatePickList = async (req, res) => {
  try {
    const fulfillment = await OrderFulfillment.findById(req.params.id)
      .populate('product', 'name sku')
      .populate('fulfillmentCenter', 'name');
    
    if (!fulfillment) {
      return res.status(404).json({
        success: false,
        message: 'Fulfillment not found'
      });
    }
    
    // Generate pick list based on inventory location
    const inventory = await Inventory.findById(fulfillment.inventoryReservation.inventoryId);
    
    const pickList = [{
      location: inventory.location.zone + inventory.location.shelf + inventory.location.bin,
      product: fulfillment.product.name,
      quantity: fulfillment.quantity,
      picked: false
    }];
    
    fulfillment.workflow.pickList = pickList;
    fulfillment.status = 'picking';
    await fulfillment.save();
    
    res.json({
      success: true,
      data: {
        pickList,
        fulfillment
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const generateShippingLabel = async (req, res) => {
  try {
    const fulfillment = await OrderFulfillment.findById(req.params.id);
    
    if (!fulfillment) {
      return res.status(404).json({
        success: false,
        message: 'Fulfillment not found'
      });
    }
    
    // Generate tracking number
    const trackingNumber = generateTrackingNumber(fulfillment.shipping.carrier);
    
    fulfillment.shipping.trackingNumber = trackingNumber;
    fulfillment.shipping.labelGenerated = true;
    fulfillment.shipping.labelUrl = `/api/logistics/labels/${trackingNumber}`;
    fulfillment.workflow.shippingLabel = {
      generated: true,
      url: `/api/logistics/labels/${trackingNumber}`,
      generatedAt: new Date(),
      carrier: fulfillment.shipping.carrier,
      service: fulfillment.shipping.method
    };
    
    // Generate tracking URL
    fulfillment.generateTrackingUrl();
    
    fulfillment.status = 'shipped';
    await fulfillment.save();
    
    res.json({
      success: true,
      data: {
        trackingNumber,
        trackingUrl: fulfillment.shipping.trackingUrl,
        labelUrl: fulfillment.shipping.labelUrl
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Helper Functions
async function selectOptimalFulfillmentCenter(productId, shippingAddress, fulfillmentType) {
  const product = await Product.findById(productId).populate('seller');
  
  // Find fulfillment centers that have this product in stock
  const inventory = await Inventory.find({
    product: productId,
    available: { $gt: 0 },
    status: 'active'
  }).populate('fulfillmentCenter');
  
  if (inventory.length === 0) {
    return null;
  }
  
  // For seller-fulfilled, prefer seller's own fulfillment centers
  if (fulfillmentType === 'seller_fulfilled') {
    const sellerCenters = inventory.filter(inv => 
      inv.fulfillmentCenter.seller && 
      inv.fulfillmentCenter.seller.toString() === product.seller._id.toString()
    );
    
    if (sellerCenters.length > 0) {
      return sellerCenters[0].fulfillmentCenter;
    }
  }
  
  // For platform-fulfilled, prefer platform centers
  if (fulfillmentType === 'platform_fulfilled') {
    const platformCenters = inventory.filter(inv => 
      inv.fulfillmentCenter.type === 'platform'
    );
    
    if (platformCenters.length > 0) {
      return platformCenters[0].fulfillmentCenter;
    }
  }
  
  // Return the first available center
  return inventory[0].fulfillmentCenter;
}

function generateTrackingNumber(carrier) {
  const prefixes = {
    'fedex': 'FDX',
    'ups': 'UPS',
    'dhl': 'DHL',
    'usps': 'USPS'
  };
  
  const prefix = prefixes[carrier] || 'TRK';
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.random().toString(36).substr(2, 4).toUpperCase();
  
  return `${prefix}${timestamp}${random}`;
}

// Analytics and Reporting
export const getFulfillmentAnalytics = async (req, res) => {
  try {
    const { startDate, endDate, fulfillmentCenter } = req.query;
    
    const filter = {};
    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    if (fulfillmentCenter) filter.fulfillmentCenter = fulfillmentCenter;
    
    const analytics = await OrderFulfillment.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalQuantity: { $sum: '$quantity' }
        }
      }
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
