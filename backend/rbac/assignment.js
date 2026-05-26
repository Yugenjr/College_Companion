// Dynamic Role Assignment Logic
// ...existing code...

const { userRoles, roles } = require('./models');

function assignRole(userId, role) {
  if (!roles.includes(role)) throw new Error('Invalid role');
  userRoles[userId] = role;
}

function getUserRole(userId) {
  return userRoles[userId] || null;
}

function removeRole(userId) {
  delete userRoles[userId];
}

module.exports = { assignRole, getUserRole, removeRole };
