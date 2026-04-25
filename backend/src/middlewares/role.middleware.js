import { ApiError } from '../utils/ApiError.js';

/**
 * Middleware to restrict route access based on user roles.
 * MUST be used AFTER authMiddleware in the route chain.
 * * @param {...string} roles - Pass the allowed roles (e.g., 'Super Admin', 'Staff')
 */
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(
        new ApiError(401, "Authentication required before checking roles.")
      );
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError(403, "Access denied. You do not have permission to perform this action.")
      );
    }

    next();
  };
};

/**
 * Permission gate. Allows the request through if:
 *   - the user is a Super Admin (bypasses all permission checks), OR
 *   - the user is Staff AND has every required permission key in their
 *     `permissions` array.
 *
 * Multiple keys are AND-ed. Compose with `restrictTo('Staff', 'Super Admin')`
 * earlier in the chain to lock the route down to admins first.
 */
export const hasPermission = (...required) => {
  return (req, _res, next) => {
    if (!req.user) {
      return next(new ApiError(401, "Authentication required."));
    }

    if (req.user.role === 'Super Admin') return next();

    if (req.user.role !== 'Staff') {
      return next(new ApiError(403, "Access denied."));
    }

    const granted = new Set(req.user.permissions || []);
    const missing = required.filter((p) => !granted.has(p));
    if (missing.length) {
      return next(
        new ApiError(403, `Missing permission${missing.length > 1 ? 's' : ''}: ${missing.join(', ')}`)
      );
    }
    next();
  };
};