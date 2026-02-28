// Protected Routes Example
import express from 'express';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';
const router = express.Router();

router.get('/profile', requireAuth, (req, res) => {
  res.json({ user: req.user });
});

router.get('/admin', requireAuth, requireRole('admin'), (req, res) => {
  res.json({ message: 'Welcome, admin!' });
});

export default router;
