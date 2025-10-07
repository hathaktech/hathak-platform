import Cart, { calculateTotal } from '../models/Cart.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Coupon from '../models/Coupon.js';

// ------------------- GUEST CART MERGE -------------------
export const mergeGuestCart = async (userId, guestCart) => {
  if (!guestCart || guestCart.items.length === 0) return;

  let cart = await Cart.findOne({ user: userId });
  if (!cart) cart = new Cart({ user: userId, items: [] });

  guestCart.items.forEach((guestItem) => {
    const existing = cart.items.find(
      (i) =>
        i.product.toString() === guestItem.product.toString() &&
        JSON.stringify(i.options) === JSON.stringify(guestItem.options)
    );
    if (existing) existing.quantity += guestItem.quantity;
    else cart.items.push(guestItem);
  });

  cart.totalPrice = calculateTotal(cart.items, cart.discount || 0, cart.tax || 0);
  await cart.save();
  return cart;
};

// ------------------- GET CART -------------------
export const getCart = async (req, res) => {
  try {
    const userId = req.user?._id;
    const serviceType = req.query.serviceType || 'store'; // Default to store cart
    
    let cart = userId
      ? await Cart.findOne({ user: userId, serviceType }).populate('items.product')
      : req.session[`cart_${serviceType}`] || { items: [], totalPrice: 0, discount: 0, tax: 0, serviceType };

    if (!cart) cart = { items: [], totalPrice: 0, discount: 0, tax: 0, serviceType };
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ------------------- ADD TO CART -------------------
export const addToCart = async (req, res) => {
  const { productId, quantity = 1, options, serviceType = 'store' } = req.body;
  const userId = req.user?._id || null;

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.stock < quantity)
      return res.status(400).json({ message: `Only ${product.stock} items available` });

    let cart = userId
      ? await Cart.findOne({ user: userId, serviceType }) || new Cart({ user: userId, serviceType, items: [] })
      : req.session[`cart_${serviceType}`] || { items: [], discount: 0, tax: 0, serviceType };

    const existingItem = cart.items.find(
      (i) => i.product.toString() === productId && JSON.stringify(i.options) === JSON.stringify(options)
    );

    if (existingItem) existingItem.quantity += quantity;
    else cart.items.push({ product: product._id, quantity, price: product.price, options });

    cart.totalPrice = calculateTotal(cart.items, cart.discount || 0, cart.tax || 0);

    if (userId) await cart.save();
    else req.session[`cart_${serviceType}`] = cart;

    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ------------------- REMOVE FROM CART -------------------
export const removeFromCart = async (req, res) => {
  const { productId, options, serviceType = 'store' } = req.body;
  const userId = req.user?._id || null;

  try {
    let cart = userId ? await Cart.findOne({ user: userId, serviceType }) : req.session[`cart_${serviceType}`];
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter(
      (i) => !(i.product.toString() === productId && JSON.stringify(i.options) === JSON.stringify(options))
    );

    cart.totalPrice = calculateTotal(cart.items, cart.discount || 0, cart.tax || 0);

    if (userId) await cart.save();
    else req.session[`cart_${serviceType}`] = cart;

    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ------------------- UPDATE CART ITEM -------------------
export const updateCartItem = async (req, res) => {
  const { productId, quantity, options, serviceType = 'store' } = req.body;
  const userId = req.user?._id || null;

  try {
    let cart = userId ? await Cart.findOne({ user: userId, serviceType }) : req.session[`cart_${serviceType}`];
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const itemIndex = cart.items.findIndex(
      (i) => i.product.toString() === productId && JSON.stringify(i.options) === JSON.stringify(options)
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      cart.items.splice(itemIndex, 1);
    } else {
      // Update quantity
      cart.items[itemIndex].quantity = quantity;
    }

    cart.totalPrice = calculateTotal(cart.items, cart.discount || 0, cart.tax || 0);

    if (userId) await cart.save();
    else req.session[`cart_${serviceType}`] = cart;

    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ------------------- APPLY COUPON -------------------
export const applyCoupon = async (req, res) => {
  const { code, serviceType = 'store' } = req.body;
  const userId = req.user?._id || null;

  try {
    const cart = userId ? await Cart.findOne({ user: userId, serviceType }) : req.session[`cart_${serviceType}`];
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const coupon = await Coupon.findOne({ code: code.toUpperCase(), active: true });
    if (!coupon) return res.status(404).json({ message: 'Invalid coupon code' });
    if (coupon.expiresAt && new Date() > coupon.expiresAt)
      return res.status(400).json({ message: 'Coupon expired' });

    const subtotal = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    if (subtotal < (coupon.minCartValue || 0))
      return res.status(400).json({ message: `Cart must be at least ${coupon.minCartValue}` });

    cart.discount =
      coupon.type === 'percent' ? (subtotal * coupon.discount) / 100 : coupon.discount;

    cart.totalPrice = calculateTotal(cart.items, cart.discount, cart.tax || 0);

    if (userId) await cart.save();
    else req.session[`cart_${serviceType}`] = cart;

    res.json({ message: 'Coupon applied', discount: cart.discount, totalPrice: cart.totalPrice });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ------------------- APPLY TAX -------------------
export const applyTax = async (req, res) => {
  const { taxAmount, serviceType = 'store' } = req.body;
  const userId = req.user?._id || null;

  try {
    const cart = userId ? await Cart.findOne({ user: userId, serviceType }) : req.session[`cart_${serviceType}`];
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.tax = taxAmount;
    cart.totalPrice = calculateTotal(cart.items, cart.discount || 0, cart.tax);

    if (userId) await cart.save();
    else req.session[`cart_${serviceType}`] = cart;

    res.json({ message: 'Tax applied', tax: taxAmount, totalPrice: cart.totalPrice });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ------------------- CHECKOUT (Cart → Order) -------------------

export const checkoutCart = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Login required' });

    const serviceType = req.body.serviceType || 'store';
    const cart = await Cart.findOne({ user: req.user._id, serviceType }).populate('items.product');
    if (!cart || cart.items.length === 0)
      return res.status(400).json({ message: 'Cart is empty' });

    // Validate stock before creating order
    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${item.product.name}`,
        });
      }
    }

    // Build order products array with price snapshot
    const orderProducts = cart.items.map((i) => ({
      productId: i.product._id,
      quantity: i.quantity,
      price: i.price, // snapshot from when added to cart
      options: i.options,
    }));

    // Create order
    const newOrder = new Order({
      userId: req.user._id,
      products: orderProducts,
      totalPrice: cart.totalPrice,
      discount: cart.discount || 0,
      tax: cart.tax || 0,
      notes: req.body.notes || '',
      paymentMethod: 'cod', // default for now
      status: 'pending', // admin will confirm
    });

    await newOrder.save();

    // Deduct stock
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity },
      });
    }

    // Clear cart
    cart.items = [];
    cart.totalPrice = 0;
    cart.discount = 0;
    cart.tax = 0;
    await cart.save();

    res.json({ message: 'Checkout successful → Order created', order: newOrder });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ------------------- ADMIN COUPON MANAGEMENT -------------------
export const createCoupon = async (req, res) => {
  if (req.user?.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });

  const { code, discount, type, minCartValue, expiresAt } = req.body;

  try {
    const coupon = new Coupon({
      code: code.toUpperCase(),
      discount,
      type,
      minCartValue: minCartValue || 0,
      expiresAt: expiresAt || null,
      active: true,
    });

    await coupon.save();
    res.json({ message: 'Coupon created', coupon });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deactivateCoupon = async (req, res) => {
  if (req.user?.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });

  const { code } = req.body;

  try {
    const coupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' });

    coupon.active = false;
    await coupon.save();
    res.json({ message: 'Coupon deactivated', coupon });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllCoupons = async (req, res) => {
  if (req.user?.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });

  try {
    const coupons = await Coupon.find();
    res.json(coupons);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ------------------- ADMIN: GET ALL CARTS -------------------
export const getAllCarts = async (req, res) => {
  if (req.user?.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });

  try {
    const carts = await Cart.find().populate('user items.product');
    res.json(carts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
