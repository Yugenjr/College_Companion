// RBAC Models: Role, Permission, Hierarchy, Assignment
// ...existing code...

const roles = [
  'admin', 'staff', 'student', 'auditor'
];

const permissions = [
  'manage_users', 'view_reports', 'edit_profile', 'access_audit', 'view_dashboard', 'assign_roles', 'edit_attendance', 'view_attendance', 'edit_grades', 'view_grades', 'access_study_arena', 'access_survival_plan', 'access_room_system', 'access_profile', 'access_progress_dashboard'
];

// Hierarchy: admin > staff > student > auditor
const roleHierarchy = {
  admin: ['staff', 'student', 'auditor'],
  staff: ['student', 'auditor'],
  student: ['auditor'],
  auditor: []
};

// Role-permission mapping
const rolePermissions = {
  admin: permissions,
  staff: [
    'view_reports', 'edit_profile', 'view_dashboard', 'assign_roles', 'edit_attendance', 'view_attendance', 'edit_grades', 'view_grades', 'access_study_arena', 'access_survival_plan', 'access_room_system', 'access_profile', 'access_progress_dashboard'
  ],
  student: [
    'edit_profile', 'view_dashboard', 'view_attendance', 'view_grades', 'access_study_arena', 'access_survival_plan', 'access_room_system', 'access_profile', 'access_progress_dashboard'
  ],
  auditor: [
    'view_reports', 'access_audit', 'view_dashboard', 'view_attendance', 'view_grades', 'access_profile', 'access_progress_dashboard'
  ]
};

// User-role assignments (example)
const userRoles = {};

module.exports = { roles, permissions, roleHierarchy, rolePermissions, userRoles };
