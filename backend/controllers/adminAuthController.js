// controllers/adminAuthController.js
import Admin from '../models/Admin.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// @desc Register a new admin (only by existing admins)
// @route POST /api/admin/auth/register
export const registerAdmin = async (req, res) => {
  const { name, email, password, role, notes } = req.body;

  try {
    // Check if admin exists
    const adminExists = await Admin.findOne({ email });
    if (adminExists) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    // Validate role
    const validRoles = ['admin', 'manager', 'employee', 'worker'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    // Check if current admin can create this role
    if (role === 'admin' && !req.admin.permissions.canCreateAdmins) {
      return res.status(403).json({ message: 'Insufficient permissions to create admin' });
    }

    const admin = new Admin({
      name,
      email,
      password,
      role,
      notes,
      createdBy: req.admin._id
    });

    await admin.save();

    // Generate JWT
    const token = jwt.sign(
      { 
        id: admin._id, 
        role: admin.role,
        permissions: admin.permissions,
        type: 'admin'
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      admin: admin.toSafeObject(),
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Login admin
// @route POST /api/admin/auth/login
export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if admin is active
    if (!admin.isActive) {
      return res.status(403).json({ message: 'Account is deactivated' });
    }

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Update last login
    await admin.updateLastLogin();

    // Use the Admin model's JWT generation method
    const token = admin.getSignedJwtToken();

    res.json({
      admin: admin.toSafeObject(),
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get current admin
// @route GET /api/admin/auth/me
export const getCurrentAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('-password');
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    res.json({ admin: admin.toSafeObject() });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get all admins (admin only)
// @route GET /api/admin/auth/admins
export const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find({})
      .select('-password')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({ admins: admins.map(admin => admin.toSafeObject()) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update admin permissions (admin only)
// @route PUT /api/admin/auth/permissions/:id
export const updateAdminPermissions = async (req, res) => {
  try {
    const { id } = req.params;
    const { permissions, role, isActive } = req.body;

    const adminToUpdate = await Admin.findById(id);
    if (!adminToUpdate) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Check if current admin can manage this admin
    if (adminToUpdate.role === 'admin' && req.admin.role !== 'admin') {
      return res.status(403).json({ message: 'Cannot modify admin permissions' });
    }

    // Update permissions
    if (permissions) {
      adminToUpdate.permissions = { ...adminToUpdate.permissions, ...permissions };
    }

    // Update role if provided
    if (role && role !== adminToUpdate.role) {
      adminToUpdate.role = role;
    }

    // Update active status
    if (typeof isActive === 'boolean') {
      adminToUpdate.isActive = isActive;
    }

    await adminToUpdate.save();

    res.json({ admin: adminToUpdate.toSafeObject() });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete admin (admin only)
// @route DELETE /api/admin/auth/:id
export const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent self-deletion
    if (id === req.admin.id) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    const adminToDelete = await Admin.findById(id);
    if (!adminToDelete) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Check if current admin can delete this admin
    if (adminToDelete.role === 'admin' && req.admin.role !== 'admin') {
      return res.status(403).json({ message: 'Cannot delete admin account' });
    }

    await Admin.findByIdAndDelete(id);

    res.json({ message: 'Admin deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Change admin password
// @route PUT /api/admin/auth/change-password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const admin = await Admin.findById(req.admin.id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Update password
    admin.password = newPassword;
    await admin.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
