// Middleware for Route Protection and Permission Checks
// ...existing code...

const { hasPermission, checkFieldPermission } = require('./permissions');
const { getUserRole } = require('./assignment');
const { logAudit } = require('./audit');

function requireRole(role) {
  return (req, res, next) => {
    const userId = req.user.id;
    const userRole = getUserRole(userId);
    if (userRole === role) {
      logAudit(userId, 'access_granted', role, req.path);
      return next();
    }
    logAudit(userId, 'access_denied', role, req.path);
    return res.status(403).json({ error: 'Forbidden' });
  };
}

function requirePermission(permission) {
  return (req, res, next) => {
    const userId = req.user.id;
    if (hasPermission(userId, permission)) {
      logAudit(userId, 'access_granted', permission, req.path);
      return next();
    }
    logAudit(userId, 'access_denied', permission, req.path);
    return res.status(403).json({ error: 'Forbidden' });
  };
}

function requireFieldPermission(field, action) {
  return (req, res, next) => {
    const userId = req.user.id;
    if (checkFieldPermission(userId, field, action)) {
      logAudit(userId, 'field_access_granted', `${action}_${field}`, req.path);
      return next();
    }
    logAudit(userId, 'field_access_denied', `${action}_${field}`, req.path);
    return res.status(403).json({ error: 'Forbidden' });
  };
}

module.exports = { requireRole, requirePermission, requireFieldPermission };
