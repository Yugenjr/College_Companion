// API Endpoints for RBAC Management
// ...existing code...

const express = require('express');
const router = express.Router();
const { assignRole, getUserRole, removeRole } = require('./assignment');
const { roles, permissions, userRoles } = require('./models');
const { requireRole, requirePermission } = require('./middleware');
const { getAuditLogs } = require('./audit');

// Assign role to user
router.post('/assign-role', requirePermission('assign_roles'), (req, res) => {
  const { userId, role } = req.body;
  try {
    assignRole(userId, role);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Remove role from user
router.post('/remove-role', requirePermission('assign_roles'), (req, res) => {
  const { userId } = req.body;
  removeRole(userId);
  res.json({ success: true });
});

// Get user role
router.get('/user-role/:userId', requirePermission('view_reports'), (req, res) => {
  const userId = req.params.userId;
  res.json({ role: getUserRole(userId) });
});

// List all roles
router.get('/roles', requirePermission('view_reports'), (req, res) => {
  res.json({ roles });
});

// List all permissions
router.get('/permissions', requirePermission('view_reports'), (req, res) => {
  res.json({ permissions });
});

// List all user-role assignments
router.get('/user-roles', requireRole('admin'), (req, res) => {
  res.json({ userRoles });
});

// Get audit logs
router.get('/audit-logs', requireRole('admin'), (req, res) => {
  res.json({ logs: getAuditLogs() });
});

module.exports = router;
