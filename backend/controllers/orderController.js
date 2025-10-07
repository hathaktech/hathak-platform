// controllers/orderController.js
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import BuyForMeRequest from '../models/BuyForMeRequest.js';

/* ------------------- HELPERS ------------------- */
const populateOrder = async (order) => {
  return await order
    .populate('userId', 'name email role')
    .populate('products.productId', 'name price type')
    .populate('buyMeId');
};

const validateBuyForMeOwnership = async (buyForMeId, userId) => {
  if (!buyForMeId) return null;
  const buyForMe = await BuyForMeRequest.findById(buyForMeId);
  if (!buyForMe) throw { status: 400, message: 'Invalid BuyForMe ID' };
  if (buyForMe.customerId.toString() !== userId.toString())
    throw { status: 403, message: 'Cannot use BuyForMe of another user' };
  return buyForMe._id;
};

/* ------------------- ORDERS CONTROLLERS ------------------- */

// GET all orders (admin only)
export const getAllOrders = async (req, res) => {
  try {
    if (req.user.role !== 'admin')
      return res.status(403).json({ message: 'Forbidden: Admin only' });

    const orders = await Order.find()
      .populate('userId', 'name email role')
      .populate('products.productId', 'name price type')
      .populate('buyMeId');

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET logged-in user's orders
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .populate('products.productId', 'name price type')
      .populate('buyMeId');

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET single order by ID (admin or owner)
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('userId', 'name email role')
      .populate('products.productId', 'name price type')
      .populate('buyMeId');

    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (
      req.user.role !== 'admin' &&
      req.user._id.toString() !== order.userId._id.toString()
    ) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ------------------- CREATE ORDER ------------------- */

// Handles: single-product, multi-product, or cart-checkout flow
export const createOrder = async (req, res) => {
  try {
    let { products, productId, quantity = 1, buyMeId, notes } = req.body;
    const orderProducts = [];

    // Single-product shortcut
    if (productId) {
      const product = await Product.findById(productId);
      if (!product) return res.status(404).json({ message: 'Product not found' });
      if (quantity > product.stock)
        return res
          .status(400)
          .json({ message: `Insufficient stock for ${product.name}` });

      orderProducts.push({ productId: product._id, quantity, price: product.price });
    }

    // Multi-product array
    if (products && Array.isArray(products) && products.length > 0) {
      for (const item of products) {
        const product = await Product.findById(item.productId);
        if (!product)
          return res.status(400).json({ message: `Invalid productId: ${item.productId}` });
        const qty = item.quantity || 1;
        if (qty > product.stock)
          return res
            .status(400)
            .json({ message: `Insufficient stock for ${product.name}` });

        orderProducts.push({ productId: product._id, quantity: qty, price: product.price });
      }
    }

    if (orderProducts.length === 0) {
      return res.status(400).json({ message: 'No valid products provided' });
    }

    // Validate BuyForMe link
    const validatedBuyForMeId = await validateBuyForMeOwnership(buyMeId, req.user._id);

    // Total price
    let totalPrice = orderProducts.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0
    );

    // Create new order
    const newOrder = new Order({
      userId: req.user._id,
      products: orderProducts,
      totalPrice,
      buyForMeId: validatedBuyForMeId || null,
      notes,
      paymentMethod: 'cod',
      status: 'pending',
    });

    await newOrder.save();

    // Decrement stock
    for (const item of orderProducts) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity },
      });
    }

    const populatedOrder = await populateOrder(newOrder);
    res.status(201).json(populatedOrder);
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ message: error.message || 'Server error' });
  }
};

/* ------------------- UPDATE & DELETE ------------------- */

// Admin can update status/notes
export const updateOrder = async (req, res) => {
  try {
    if (req.user.role !== 'admin')
      return res.status(403).json({ message: 'Forbidden: Admin only' });

    const { status, notes } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (status) order.status = status;
    if (notes) order.notes = notes;

    await order.save();
    const populatedOrder = await populateOrder(order);
    res.json(populatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin can delete
export const deleteOrder = async (req, res) => {
  try {
    if (req.user.role !== 'admin')
      return res.status(403).json({ message: 'Forbidden: Admin only' });

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    await order.deleteOne();
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
