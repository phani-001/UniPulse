const ApiError = require('../utils/ApiError');

/**
 * Role-based access control middleware (reserved for admin portal later)
 * @param  {...string} roles - Allowed roles
 */
const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) {
    return next(ApiError.unauthorized());
  }
  if (!roles.includes(req.user.role)) {
    return next(ApiError.forbidden('Insufficient permissions'));
  }
  next();
};

module.exports = requireRole;
