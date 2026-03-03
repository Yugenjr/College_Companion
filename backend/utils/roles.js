export const ROLE_HIERARCHY = Object.freeze({
  student: 1,
  moderator: 2,
  admin: 3
});

const LEGACY_ROLE_MAP = Object.freeze({
  user: 'student'
});

export const DEFAULT_ROLE = 'student';

export function normalizeRole(role) {
  if (!role || typeof role !== 'string') return DEFAULT_ROLE;
  const normalized = role.trim().toLowerCase();
  return LEGACY_ROLE_MAP[normalized] || normalized;
}

export function isValidRole(role) {
  return Object.prototype.hasOwnProperty.call(ROLE_HIERARCHY, normalizeRole(role));
}

export function hasSufficientRole(currentRole, requiredRole) {
  const currentRank = ROLE_HIERARCHY[normalizeRole(currentRole)] || 0;
  const requiredRank = ROLE_HIERARCHY[normalizeRole(requiredRole)] || Number.MAX_SAFE_INTEGER;
  return currentRank >= requiredRank;
}
