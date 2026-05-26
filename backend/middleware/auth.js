import { getAuth } from '../config/firebaseAdmin.js';
import User from '../models/User.js';
import { DEFAULT_ROLE, normalizeRole } from './rbac.js';

/**
 * Middleware to verify Firebase ID token
 * Extracts token from Authorization header and verifies it
 * Sets req.user with decoded token data
 */
export const verifyFirebaseToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'No authorization token provided',
      });
    }

    const token = authHeader.split('Bearer ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Invalid authorization token format',
      });
    }

    // Verify token with Firebase Admin
    const decodedToken = await getAuth().verifyIdToken(token);

    // Set user data in request
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      emailVerified: decodedToken.email_verified,
      role: DEFAULT_ROLE,
      roleVerifiedFromDb: false
    };

    const dbUser = await User.findOne({ uid: decodedToken.uid }).select('role').lean();
    if (dbUser?.role) {
      req.user.role = normalizeRole(dbUser.role);
      req.user.roleVerifiedFromDb = true;
    }

    next();
  } catch (error) {
    console.error('❌ Token verification failed. Detailed Error:', JSON.stringify(error, null, 2));
    console.error('❌ Error Message:', error.message);
    console.error('❌ Error Code:', error.code);

    if (error.code === 'auth/id-token-expired') {
      return res.status(401).json({
        success: false,
        error: 'Token expired',
        message: 'Your session has expired. Please sign in again.',
      });
    }

    // Pass the actual error message to the frontend for debugging
    return res.status(401).json({
      success: false,
      error: 'Unauthorized',
      message: `Authentication Failed: ${error.message}`,
      debugCode: error.code
    });
  }
};

/**
 * Optional auth middleware - verifies token if present but doesn't fail if absent
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split('Bearer ')[1];
      const decodedToken = await getAuth().verifyIdToken(token);

      req.user = {
        uid: decodedToken.uid,
        email: decodedToken.email,
        emailVerified: decodedToken.email_verified,
        role: DEFAULT_ROLE,
        roleVerifiedFromDb: false
      };

      const dbUser = await User.findOne({ uid: decodedToken.uid }).select('role').lean();
      if (dbUser?.role) {
        req.user.role = normalizeRole(dbUser.role);
        req.user.roleVerifiedFromDb = true;
      }
    }

    next();
  } catch (error) {
    // Continue without user data
    next();
  }
};

export default { verifyFirebaseToken, optionalAuth };
