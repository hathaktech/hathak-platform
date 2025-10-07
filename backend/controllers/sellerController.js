import Seller from '../models/Seller.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// @desc Register a new seller
// @route POST /api/seller/register
export const registerSeller = async (req, res) => {
  try {
    const {
      businessName,
      email,
      password,
      phone,
      businessType,
      description,
      website,
      taxId,
      businessLicense,
      address,
      bankDetails,
      socialMedia,
      agreeToTerms,
      agreeToPrivacy
    } = req.body;

    // Validation
    if (!businessName || !email || !password || !phone || !businessType) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    if (!agreeToTerms || !agreeToPrivacy) {
      return res.status(400).json({ message: 'Please accept terms and privacy policy' });
    }

    // Check if seller already exists
    const existingSeller = await Seller.findOne({ email });
    if (existingSeller) {
      return res.status(400).json({ message: 'Seller already exists with this email' });
    }

    // Create new seller
    const seller = new Seller({
      businessName,
      email,
      password,
      phone,
      businessType,
      description,
      website,
      taxId,
      businessLicense,
      address,
      bankDetails,
      socialMedia,
      status: 'pending' // Requires admin approval
    });

    await seller.save();

    // Generate JWT token
    const token = seller.getSignedJwtToken();

    res.status(201).json({
      message: 'Seller registration successful. Your account is pending approval.',
      seller: seller.toSafeObject(),
      token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Login seller
// @route POST /api/seller/login
export const loginSeller = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if seller exists
    const seller = await Seller.findOne({ email });
    if (!seller) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if seller is active
    if (seller.status !== 'approved') {
      return res.status(403).json({ 
        message: `Account is ${seller.status}. Please wait for approval.` 
      });
    }

    // Check password
    const isMatch = await seller.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Update last login
    seller.lastLogin = new Date();
    await seller.save();

    // Generate JWT token
    const token = seller.getSignedJwtToken();

    res.json({
      message: 'Login successful',
      seller: seller.toSafeObject(),
      token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get seller profile
// @route GET /api/seller/profile
export const getSellerProfile = async (req, res) => {
  try {
    const seller = await Seller.findById(req.seller.id).select('-password -bankDetails');
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    res.json({ seller: seller.toSafeObject() });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update seller profile
// @route PUT /api/seller/profile
export const updateSellerProfile = async (req, res) => {
  try {
    const seller = await Seller.findById(req.seller.id);
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    const {
      businessName,
      description,
      website,
      phone,
      address,
      socialMedia
    } = req.body;

    // Update fields
    if (businessName) seller.businessName = businessName;
    if (description) seller.description = description;
    if (website) seller.website = website;
    if (phone) seller.phone = phone;
    if (address) seller.address = address;
    if (socialMedia) seller.socialMedia = socialMedia;

    await seller.save();

    res.json({ 
      message: 'Profile updated successfully',
      seller: seller.toSafeObject() 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get seller dashboard stats
// @route GET /api/seller/dashboard
export const getSellerDashboard = async (req, res) => {
  try {
    const sellerId = req.seller.id;

    // Get products count
    const totalProducts = await Product.countDocuments({ seller: sellerId });
    const activeProducts = await Product.countDocuments({ 
      seller: sellerId, 
      status: 'active' 
    });

    // Get orders count
    const totalOrders = await Order.countDocuments({ 
      'products.seller': sellerId 
    });
    const pendingOrders = await Order.countDocuments({ 
      'products.seller': sellerId,
      status: 'pending'
    });

    // Get revenue (simplified - in real app, you'd calculate from orders)
    const orders = await Order.find({ 
      'products.seller': sellerId,
      status: { $in: ['confirmed', 'shipped', 'delivered'] }
    });

    const totalRevenue = orders.reduce((sum, order) => {
      const sellerProducts = order.products.filter(p => p.seller?.toString() === sellerId);
      return sum + sellerProducts.reduce((orderSum, product) => 
        orderSum + (product.price * product.quantity), 0
      );
    }, 0);

    // Get monthly revenue
    const currentMonth = new Date();
    currentMonth.setDate(1);
    const monthlyOrders = orders.filter(order => order.createdAt >= currentMonth);
    const monthlyRevenue = monthlyOrders.reduce((sum, order) => {
      const sellerProducts = order.products.filter(p => p.seller?.toString() === sellerId);
      return sum + sellerProducts.reduce((orderSum, product) => 
        orderSum + (product.price * product.quantity), 0
      );
    }, 0);

    // Get analytics
    const products = await Product.find({ seller: sellerId });
    const totalViews = products.reduce((sum, product) => sum + product.analytics.views, 0);
    const totalConversions = products.reduce((sum, product) => sum + product.analytics.conversions, 0);
    const conversionRate = totalViews > 0 ? (totalConversions / totalViews) * 100 : 0;

    // Get average rating
    const totalReviews = products.reduce((sum, product) => sum + product.reviews.totalReviews, 0);
    const totalRating = products.reduce((sum, product) => 
      sum + (product.reviews.averageRating * product.reviews.totalReviews), 0
    );
    const averageRating = totalReviews > 0 ? totalRating / totalReviews : 0;

    res.json({
      stats: {
        totalProducts,
        activeProducts,
        totalOrders,
        pendingOrders,
        totalRevenue,
        monthlyRevenue,
        totalViews,
        conversionRate: Math.round(conversionRate * 100) / 100,
        averageRating: Math.round(averageRating * 10) / 10,
        totalReviews
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get seller products
// @route GET /api/seller/products
export const getSellerProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    const sellerId = req.seller.id;

    const query = { seller: sellerId };
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const products = await Product.find(query)
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Product.countDocuments(query);

    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Create new product
// @route POST /api/seller/products
export const createProduct = async (req, res) => {
  try {
    const sellerId = req.seller.id;
    const productData = {
      ...req.body,
      seller: sellerId,
      status: 'pending_approval' // Requires admin approval
    };

    const product = new Product(productData);
    await product.save();

    res.status(201).json({
      message: 'Product created successfully. Pending admin approval.',
      product
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update product
// @route PUT /api/seller/products/:id
export const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const sellerId = req.seller.id;

    const product = await Product.findOne({ _id: productId, seller: sellerId });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Update product fields
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        product[key] = req.body[key];
      }
    });

    // Reset status to pending if significant changes made
    if (req.body.name || req.body.description || req.body.price) {
      product.status = 'pending_approval';
    }

    await product.save();

    res.json({
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete product
// @route DELETE /api/seller/products/:id
export const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const sellerId = req.seller.id;

    const product = await Product.findOne({ _id: productId, seller: sellerId });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await Product.findByIdAndDelete(productId);

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get seller orders
// @route GET /api/seller/orders
export const getSellerOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const sellerId = req.seller.id;

    const query = { 'products.seller': sellerId };
    if (status) query.status = status;

    const orders = await Order.find(query)
      .populate('userId', 'name email')
      .populate('products.productId', 'name price')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    res.json({
      orders,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update order status
// @route PUT /api/seller/orders/:id/status
export const updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;
    const sellerId = req.seller.id;

    const order = await Order.findOne({ 
      _id: orderId, 
      'products.seller': sellerId 
    });
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    await order.save();

    res.json({
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get seller analytics
// @route GET /api/seller/analytics
export const getSellerAnalytics = async (req, res) => {
  try {
    const sellerId = req.seller.id;
    const { period = '30d' } = req.query;

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    
    switch (period) {
      case '7d':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(endDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(endDate.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
    }

    // Get products
    const products = await Product.find({ 
      seller: sellerId,
      createdAt: { $gte: startDate, $lte: endDate }
    });

    // Get orders
    const orders = await Order.find({
      'products.seller': sellerId,
      createdAt: { $gte: startDate, $lte: endDate }
    });

    // Calculate metrics
    const totalViews = products.reduce((sum, product) => sum + product.analytics.views, 0);
    const totalClicks = products.reduce((sum, product) => sum + product.analytics.clicks, 0);
    const totalConversions = products.reduce((sum, product) => sum + product.analytics.conversions, 0);
    const conversionRate = totalViews > 0 ? (totalConversions / totalViews) * 100 : 0;

    const revenue = orders.reduce((sum, order) => {
      const sellerProducts = order.products.filter(p => p.seller?.toString() === sellerId);
      return sum + sellerProducts.reduce((orderSum, product) => 
        orderSum + (product.price * product.quantity), 0
      );
    }, 0);

    res.json({
      period,
      metrics: {
        totalViews,
        totalClicks,
        totalConversions,
        conversionRate: Math.round(conversionRate * 100) / 100,
        revenue,
        totalOrders: orders.length,
        averageOrderValue: orders.length > 0 ? revenue / orders.length : 0
      },
      products: products.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Upload seller documents
// @route POST /api/seller/documents
export const uploadDocuments = async (req, res) => {
  try {
    const sellerId = req.seller.id;
    const { type, url } = req.body;

    const seller = await Seller.findById(sellerId);
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    // Add document to seller
    seller.documents.push({
      type,
      url,
      status: 'pending'
    });

    await seller.save();

    res.json({
      message: 'Document uploaded successfully',
      document: seller.documents[seller.documents.length - 1]
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
