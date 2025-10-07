// controllers/buyForMeCartController.js
import BuyForMeCart from '../models/BuyForMeCart.js';
import { validationResult } from 'express-validator';

// ------------------- GET USER'S CART ITEMS -------------------
export const getUserCartItems = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const products = await BuyForMeCart.getUserCartItems(req.user._id);

    res.json({
      success: true,
      data: products,
      count: products.length
    });
  } catch (error) {
    console.error('Error fetching cart items:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch cart items',
      error: error.message 
    });
  }
};

// ------------------- CREATE CART ITEM -------------------
export const createCartItem = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      productName,
      productLink,
      images = [],
      colors = [],
      sizes = [],
      quantity = 1,
      estimatedPrice = 0,
      currency = 'USD',
      notes = ''
    } = req.body;

    // Create new BuyForMe cart item
    const cartItem = new BuyForMeCart({
      userId: req.user._id,
      productName,
      productLink,
      images,
      colors,
      sizes,
      quantity,
      estimatedPrice,
      currency,
      notes,
      status: 'active'
    });

    await cartItem.save();

    res.status(201).json({
      success: true,
      message: 'Product added to cart successfully',
      data: cartItem
    });
  } catch (error) {
    console.error('Error creating cart item:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add product to cart',
      error: error.message
    });
  }
};

// ------------------- UPDATE CART ITEM -------------------
export const updateCartItem = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const { productId } = req.params;
    const updateData = req.body;

    // Remove fields that shouldn't be updated
    delete updateData.userId;
    delete updateData.createdAt;

    const cartItem = await BuyForMeCart.findOneAndUpdate(
      { _id: productId, userId: req.user._id, isActive: true, status: 'active' },
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
    }

    res.json({
      success: true,
      message: 'Cart item updated successfully',
      data: cartItem
    });
  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update cart item',
      error: error.message
    });
  }
};

// ------------------- DELETE CART ITEM -------------------
export const deleteCartItem = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const { productId } = req.params;

    const cartItem = await BuyForMeCart.archiveProduct(productId, req.user._id);

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
    }

    res.json({
      success: true,
      message: 'Cart item deleted successfully',
      data: cartItem
    });
  } catch (error) {
    console.error('Error deleting cart item:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete cart item',
      error: error.message
    });
  }
};


// ------------------- GET SINGLE CART ITEM -------------------
export const getCartItem = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const { productId } = req.params;

    const cartItem = await BuyForMeCart.findOne({
      _id: productId,
      userId: req.user._id,
      isActive: true,
      status: 'active'
    });

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
    }

    res.json({
      success: true,
      data: cartItem
    });
  } catch (error) {
    console.error('Error fetching cart item:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch cart item',
      error: error.message
    });
  }
};

// ------------------- SUBMIT CART FOR PURCHASE -------------------
export const submitCartForPurchase = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const { productIds } = req.body;

    if (!Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Product IDs array is required'
      });
    }

    // Update products to submitted status
    const result = await BuyForMeCart.updateMany(
      { 
        _id: { $in: productIds }, 
        userId: req.user._id, 
        isActive: true,
        status: 'active'
      },
      { 
        status: 'submitted',
        updatedAt: new Date() 
      }
    );

    res.json({
      success: true,
      message: `${result.modifiedCount} cart items submitted for purchase successfully`,
      submittedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('Error submitting cart:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit cart',
      error: error.message
    });
  }
};

// ------------------- GET CART STATISTICS -------------------
export const getCartStats = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const stats = await BuyForMeCart.aggregate([
      { $match: { userId: req.user._id, isActive: true, status: 'active' } },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
          totalValue: { $sum: { $multiply: ['$estimatedPrice', '$quantity'] } }
        }
      }
    ]);

    const formattedStats = {
      active: { count: 0, totalValue: 0 }
    };

    if (stats.length > 0) {
      formattedStats.active = {
        count: stats[0].count,
        totalValue: stats[0].totalValue
      };
    }

    res.json({
      success: true,
      data: formattedStats
    });
  } catch (error) {
    console.error('Error fetching cart stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch cart statistics',
      error: error.message
    });
  }
};
