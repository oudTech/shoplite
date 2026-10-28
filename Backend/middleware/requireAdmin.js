
const User = require('../models/User');

async function requireAdmin(req, res, next) {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      console.warn(`Admin check failed: user not found (${req.userId})`);

      return res.status(403).json({
        error: 'Access denied'
      });
    }

    if (user.isAdmin !== true) {
      console.warn(`Admin access denied for user ${user._id}`);

      return res.status(403).json({
        error: 'Admin privileges required'
      });
    }

    next();
  } catch (err) {
    console.error('Admin authorization check failed:', err);

    return res.status(500).json({
      error: 'Failed to verify admin permissions'
    });
  }
}

module.exports = requireAdmin;
