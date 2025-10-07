import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    discount: { type: Number, required: true }, // fixed amount or percentage
    type: { type: String, enum: ['fixed', 'percent'], default: 'fixed' },
    minCartValue: { type: Number, default: 0 }, // minimum cart subtotal to apply
    active: { type: Boolean, default: true },
    expiresAt: { type: Date },
  },
  { timestamps: true }
);

// Helper method: check if coupon is valid
couponSchema.methods.isValid = function (cartSubtotal) {
  if (!this.active) return false;
  if (this.expiresAt && new Date() > this.expiresAt) return false;
  if (cartSubtotal < this.minCartValue) return false;
  return true;
};

export default mongoose.model('Coupon', couponSchema);
