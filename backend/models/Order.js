// models/Order.js
import mongoose from 'mongoose';

const orderProductSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, default: 1 },
  price: { type: Number, required: true }, // snapshot at time of purchase
  options: { type: Object }, // size/color if needed
});

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    buyMeId: { type: mongoose.Schema.Types.ObjectId, ref: 'BuyMe' },
    products: [orderProductSchema],
    totalPrice: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['pending', 'approved', 'purchased', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: ['cod', 'manual'],
      default: 'cod',
    },
    notes: { type: String, default: '' },
    tax: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('Order', orderSchema);
