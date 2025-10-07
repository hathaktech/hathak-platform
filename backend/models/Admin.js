import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const adminSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true,
      trim: true 
    },
    email: { 
      type: String, 
      required: true, 
      unique: true,
      lowercase: true,
      trim: true 
    },
    password: { 
      type: String, 
      required: true 
    },
    role: { 
      type: String, 
      enum: ['admin', 'manager', 'employee', 'worker'],
      default: 'worker',
      required: true 
    },
    permissions: {
      userManagement: { type: Boolean, default: false },
      productManagement: { type: Boolean, default: false },
      orderManagement: { type: Boolean, default: false },
      financialAccess: { type: Boolean, default: false },
      systemSettings: { type: Boolean, default: false },
      analyticsAccess: { type: Boolean, default: false },
      canGrantPermissions: { type: Boolean, default: false },
      canCreateAdmins: { type: Boolean, default: false }
    },
    isActive: { 
      type: Boolean, 
      default: true 
    },
    lastLogin: { 
      type: Date 
    },
    createdBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Admin' 
    },
    notes: { 
      type: String,
      maxlength: 500 
    }
  },
  { 
    timestamps: true,
    collection: 'admins' // Explicit collection name
  }
);

// Set default permissions based on role
adminSchema.pre('save', function(next) {
  if (this.isNew || this.isModified('role')) {
    switch (this.role) {
      case 'admin':
        this.permissions = {
          userManagement: true,
          productManagement: true,
          orderManagement: true,
          financialAccess: true,
          systemSettings: true,
          analyticsAccess: true,
          canGrantPermissions: true,
          canCreateAdmins: true
        };
        break;
      case 'manager':
        this.permissions = {
          userManagement: true,
          productManagement: true,
          orderManagement: true,
          financialAccess: true,
          analyticsAccess: true,
          canGrantPermissions: false,
          canCreateAdmins: false
        };
        break;
      case 'employee':
        this.permissions = {
          userManagement: false,
          productManagement: true,
          orderManagement: true,
          financialAccess: false,
          analyticsAccess: true,
          canGrantPermissions: false,
          canCreateAdmins: false
        };
        break;
      case 'worker':
        this.permissions = {
          userManagement: false,
          productManagement: false,
          orderManagement: true,
          financialAccess: false,
          analyticsAccess: false,
          canGrantPermissions: false,
          canCreateAdmins: false
        };
        break;
    }
  }
  next();
});

// Hash password before save
adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
adminSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT
adminSchema.methods.getSignedJwtToken = function () {
  return jwt.sign(
    { 
      id: this._id, 
      role: this.role,
      permissions: this.permissions,
      type: 'admin' // Distinguish from regular user tokens
    },
    process.env.JWT_SECRET,
    { 
      expiresIn: '24h', // Shorter expiry for admin tokens
      issuer: 'hathak-platform',
      audience: 'hathak-users'
    }
  );
};

// Check if admin has specific permission
adminSchema.methods.hasPermission = function(permission) {
  return this.permissions[permission] === true;
};

// Check if admin can manage other admins
adminSchema.methods.canManageAdmins = function() {
  return this.role === 'admin' || this.permissions.canCreateAdmins;
};

// Update last login
adminSchema.methods.updateLastLogin = function() {
  this.lastLogin = new Date();
  return this.save();
};

// Sanitize admin data (remove sensitive info)
adminSchema.methods.toSafeObject = function() {
  const adminObj = this.toObject();
  delete adminObj.password;
  return adminObj;
};

const Admin = mongoose.model("Admin", adminSchema);
export default Admin;
