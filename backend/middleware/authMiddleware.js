// Auth Middleware for protected routes
import User from '../models/User.js';
import { verifyToken } from '../services/authService.js';
import { authorizeRoles } from './rbac.js';
import { normalizeRole } from '../utils/roles.js';

export async function requireAuth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const payload = verifyToken(token);
    const dbUser = await User.findOne({ uid: payload.uid }).select('uid email role').lean();

    if (!dbUser) {
      return res.status(401).json({ error: 'User not found for token' });
    }

    req.user = {
      uid: dbUser.uid,
      email: dbUser.email,
      role: normalizeRole(dbUser.role),
      roleVerifiedFromDb: true
    };

    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

export function requireRole(role) {
  return authorizeRoles(role);
}

export { authorizeRoles };
