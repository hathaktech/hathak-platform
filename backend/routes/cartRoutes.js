import express from 'express';
import {
  getCart,
  addToCart,
  removeFromCart,
  updateCartItem,
  checkoutCart,
  applyCoupon,
  applyTax,
  mergeGuestCart,
  createCoupon,
  deactivateCoupon,
  getAllCoupons,
  getAllCarts
} from '../controllers/cartController.js';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// ------------------ USER CART ROUTES ------------------

// Get current cart (guest or logged-in)
router.get('/', getCart);

// Add item to cart (guest or logged-in)
router.post('/add', addToCart);

// Remove item from cart
router.post('/remove', removeFromCart);

// Update item quantity
router.post('/update', updateCartItem);

// Apply coupon
router.post('/apply-coupon', applyCoupon);

// Apply tax
router.post('/apply-tax', applyTax);

// Checkout (requires login)
router.post('/checkout', authMiddleware, checkoutCart);

// Merge guest cart into user cart after login
router.post('/merge-guest', authMiddleware, async (req, res) => {
  try {
    await mergeGuestCart(req.user._id, req.session.cart);
    // Clear guest session cart
    req.session.cart = { items: [], totalPrice: 0, discount: 0, tax: 0 };
    res.json({ message: 'Guest cart merged into your account' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ------------------ ADMIN CART ROUTES ------------------

// Get all carts (admin only)
router.get('/admin/all-carts', authMiddleware, adminMiddleware, getAllCarts);

// Admin: create coupon
router.post('/admin/coupons/create', authMiddleware, adminMiddleware, createCoupon);

// Admin: deactivate coupon
router.post('/admin/coupons/deactivate', authMiddleware, adminMiddleware, deactivateCoupon);

// Admin: get all coupons
router.get('/admin/coupons', authMiddleware, adminMiddleware, getAllCoupons);

export default router;
