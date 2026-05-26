// Permission and Field-Level Checks
// ...existing code...

const { rolePermissions, roleHierarchy } = require('./models');
const { getUserRole } = require('./assignment');

function hasPermission(userId, permission) {
  const role = getUserRole(userId);
  if (!role) return false;
  let allowed = rolePermissions[role] || [];
  // Inherit permissions from lower roles
  for (const lowerRole of roleHierarchy[role]) {
    allowed = allowed.concat(rolePermissions[lowerRole] || []);
  }
  return allowed.includes(permission);
}

function checkFieldPermission(userId, field, action) {
  // Example: restrict editing grades to staff/admin
  if (field === 'grades' && action === 'edit') {
    const role = getUserRole(userId);
    return role === 'admin' || role === 'staff';
  }
  // Default: allow if permission exists
  return hasPermission(userId, `${action}_${field}`);
}

module.exports = { hasPermission, checkFieldPermission };
