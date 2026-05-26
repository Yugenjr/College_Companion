import express from 'express';
import AuditLog from '../models/AuditLog.js';

const router = express.Router();

// Get audit logs (admin only)
router.get('/', async (req, res) => {
  try {
    const logs = await AuditLog.find({}).sort({ timestamp: -1 }).limit(200);
    res.json({ success: true, logs });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
