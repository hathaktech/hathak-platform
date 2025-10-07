// models/Address.js
import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    name: { 
      type: String, 
      required: true,
      trim: true
    },
    type: { 
      type: String, 
      enum: ['home', 'work', 'other'], 
      default: 'home' 
    },
    street: { 
      type: String, 
      required: true,
      trim: true
    },
    city: { 
      type: String, 
      required: true,
      trim: true
    },
    state: { 
      type: String, 
      required: true,
      trim: true
    },
    zipCode: { 
      type: String, 
      required: true,
      trim: true
    },
    country: { 
      type: String, 
      required: true,
      trim: true
    },
    phone: { 
      type: String, 
      required: true,
      trim: true
    },
    isDefault: { 
      type: Boolean, 
      default: false 
    }
  },
  {
    timestamps: true
  }
);

// Index for efficient queries
addressSchema.index({ userId: 1 });
addressSchema.index({ userId: 1, isDefault: 1 });

// Ensure only one default address per user
addressSchema.pre('save', async function(next) {
  if (this.isDefault) {
    await this.constructor.updateMany(
      { userId: this.userId, _id: { $ne: this._id } },
      { isDefault: false }
    );
  }
  next();
});

export default mongoose.models.Address || mongoose.model("Address", addressSchema);
