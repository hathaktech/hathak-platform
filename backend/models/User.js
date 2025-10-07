import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "user" },
    boxNumber: { type: String, unique: true, sparse: true },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

// Generate unique 6-digit box number
const generateBoxNumber = async () => {
  let boxNumber;
  let isUnique = false;
  
  while (!isUnique) {
    // Generate a 6-digit number
    boxNumber = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Check if this box number already exists
    const existingUser = await mongoose.model('User').findOne({ boxNumber });
    if (!existingUser) {
      isUnique = true;
    }
  }
  
  return boxNumber;
};

// Hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Generate box number for new users
userSchema.pre("save", async function (next) {
  if (this.isNew && !this.boxNumber) {
    this.boxNumber = await generateBoxNumber();
  }
  next();
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT
userSchema.methods.getSignedJwtToken = function () {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' } // token valid for 7 days
  );
};

const User = mongoose.model("User", userSchema);
export default User;
