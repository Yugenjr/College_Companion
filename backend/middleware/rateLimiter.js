// backend/middleware/rateLimiter.js
import rateLimit from 'express-rate-limit';

// Limit requests per IP (can be customized per user if req.user is available)
export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the RateLimit-* headers
  legacyHeaders: false, // Disable the X-RateLimit-* headers
  message: {
    success: false,
    error: 'Rate limit exceeded',
    message: 'Too many requests, please try again later.'
  },
  keyGenerator: (req) => {
    // If user is authenticated, use user ID; else use IP
    if (req.user && req.user.uid) {
      return req.user.uid;
    }
    return req.ip;
  },
  handler: (req, res, next, options) => {
    res.status(429).json(options.message);
  }
});
