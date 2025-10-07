// middleware/adminMiddleware.js

// Admin route protection middleware
export const adminMiddleware = (req, res, next) => {
  // Check if user is attached to request and has admin role
  if (req.user && req.user.role === 'admin') {
    return next();
  }

  // Forbidden if not admin
  return res.status(403).json({ message: 'Forbidden: Admin access only' });
};

export default adminMiddleware;
