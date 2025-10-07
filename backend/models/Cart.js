// models/Cart.js
import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, default: 1 },
  price: { type: Number, required: true }, // snapshot of product price
  options: { type: Object }, // size, color, etc.
});

const cartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }, // optional for guest
    serviceType: { 
      type: String, 
      enum: ['store', 'buyme'], 
      default: 'store',
      required: true 
    }, // Distinguish between Store and Buy for Me carts
    items: [cartItemSchema],
    totalPrice: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Indexes for better performance
cartSchema.index({ user: 1, serviceType: 1 });
cartSchema.index({ serviceType: 1 });

const Cart = mongoose.model('Cart', cartSchema);

// ✅ Helper function
export const calculateTotal = (items, discount = 0, tax = 0) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return Math.max(subtotal - discount + tax, 0);
};

export default Cart;
