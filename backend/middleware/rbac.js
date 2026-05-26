import User from '../models/User.js';
import { DEFAULT_ROLE, ROLE_HIERARCHY, hasSufficientRole, normalizeRole } from '../utils/roles.js';

export const forbiddenResponse = (res, data = {}) => {
  return res.status(403).json({
    success: false,
    error: 'Forbidden',
    message: data.message || 'You do not have permission to access this resource.',
    code: 403,
    requiredRoles: data.requiredRoles || [],
    currentRole: data.currentRole || DEFAULT_ROLE
  });
};

export const authorizeRoles = (...allowedRoles) => {
  const normalizedAllowedRoles = [...new Set(allowedRoles.map((role) => normalizeRole(role)))];

  return async (req, res, next) => {
    try {
      if (!req.user?.uid) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
          message: 'Authentication required before role authorization.',
          code: 401
        });
      }

      const dbUser = await User.findOne({ uid: req.user.uid }).select('uid role').lean();

      if (!dbUser) {
        return forbiddenResponse(res, {
          message: 'Role verification failed. No user record found for this account.',
          requiredRoles: normalizedAllowedRoles,
          currentRole: DEFAULT_ROLE
        });
      }

      const dbRole = normalizeRole(dbUser.role);
      req.user.role = dbRole;
      req.user.roleVerifiedFromDb = true;

      const isAllowed = normalizedAllowedRoles.some((role) => hasSufficientRole(dbRole, role));

      if (!isAllowed) {
        return forbiddenResponse(res, {
          message: 'Insufficient role privileges for this operation.',
          requiredRoles: normalizedAllowedRoles,
          currentRole: dbRole
        });
      }

      next();
    } catch (error) {
      console.error('❌ RBAC authorization error:', error.message);
      return res.status(500).json({
        success: false,
        error: 'AuthorizationFailed',
        message: 'Could not validate role permissions.',
        code: 500
      });
    }
  };
};

export { DEFAULT_ROLE, ROLE_HIERARCHY, normalizeRole };
