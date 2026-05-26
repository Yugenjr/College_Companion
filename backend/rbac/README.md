# RBAC System Overview

This module implements a flexible Role-Based Access Control (RBAC) system with hierarchical permissions for College Companion.

## Features
- Multiple roles: admin, staff, student, auditor
- Hierarchical permissions (role inheritance)
- Middleware for route and field-level protection
- Dynamic role assignment
- Permission checks at API and field levels
- Audit logging for permission changes and access attempts

## File Structure
- `models.js`: Defines roles, permissions, hierarchy, and assignments
- `assignment.js`: Dynamic role assignment logic
- `permissions.js`: Permission and field-level checks
- `middleware.js`: Express middleware for route/field protection
- `audit.js`: Audit logging for permission changes/access
- `api.js`: API endpoints for RBAC management

## Usage
- Import and use middleware in your routes for protection
- Use API endpoints to manage roles, permissions, and audit logs

## Example
```js
// Protect a route
app.get('/dashboard', requirePermission('view_dashboard'), (req, res) => {
  res.json({ message: 'Dashboard data' });
});

// Field-level protection
app.post('/grades', requireFieldPermission('grades', 'edit'), (req, res) => {
  res.json({ message: 'Grades updated' });
});
```

## Audit Logging
All permission changes and access attempts are logged in `audit.log` for review and compliance.

---
For detailed API documentation, see `API_DOCUMENTATION_INDEX.md` and `API_DOCUMENTATION_SUMMARY.md`.
