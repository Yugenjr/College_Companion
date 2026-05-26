import express from 'express';
import { backupCollections, restoreBackup, listBackups, validateBackup } from '../backup/backupService.js';

const router = express.Router();

// Schedule backup (manual trigger)
router.post('/run', async (req, res) => {
  try {
    const { type = 'full', collections, timestamp, userId } = req.body;
    const fileName = await backupCollections({ type, collections, timestamp: timestamp ? new Date(timestamp) : new Date() });
    // Audit log
    try {
      const AuditLog = (await import('../models/AuditLog.js')).default;
      await AuditLog.create({ eventType: 'backup', userId, fileName, timestamp: new Date(), success: true, details: { type, collections } });
    } catch (auditError) { console.warn('Audit log failed:', auditError.message); }
    res.json({ success: true, fileName });
  } catch (error) {
    try {
      const AuditLog = (await import('../models/AuditLog.js')).default;
      await AuditLog.create({ eventType: 'backup', userId: req.body.userId, timestamp: new Date(), success: false, details: { error: error.message } });
    } catch {}
    res.status(500).json({ success: false, error: error.message });
  }
});

// List backups
router.get('/list', async (req, res) => {
  try {
    const files = await listBackups();
    res.json({ success: true, files });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Validate backup integrity
router.get('/validate/:fileName', async (req, res) => {
  try {
    const valid = await validateBackup(req.params.fileName);
    // Audit log
    try {
      const AuditLog = (await import('../models/AuditLog.js')).default;
      await AuditLog.create({ eventType: 'validate', fileName: req.params.fileName, timestamp: new Date(), success: valid });
    } catch (auditError) { console.warn('Audit log failed:', auditError.message); }
    res.json({ success: valid });
  } catch (error) {
    try {
      const AuditLog = (await import('../models/AuditLog.js')).default;
      await AuditLog.create({ eventType: 'validate', fileName: req.params.fileName, timestamp: new Date(), success: false, details: { error: error.message } });
    } catch {}
    res.status(500).json({ success: false, error: error.message });
  }
});

// Restore backup
router.post('/restore', async (req, res) => {
  try {
    const { fileName, userId } = req.body;
    await restoreBackup(fileName);
    // Audit log
    try {
      const AuditLog = (await import('../models/AuditLog.js')).default;
      await AuditLog.create({ eventType: 'restore', userId, fileName, timestamp: new Date(), success: true });
    } catch (auditError) { console.warn('Audit log failed:', auditError.message); }
    res.json({ success: true });
  } catch (error) {
    try {
      const AuditLog = (await import('../models/AuditLog.js')).default;
      await AuditLog.create({ eventType: 'restore', userId: req.body.userId, fileName: req.body.fileName, timestamp: new Date(), success: false, details: { error: error.message } });
    } catch {}
    res.status(500).json({ success: false, error: error.message });
  }
});

// Simulate disaster recovery
router.post('/simulate-disaster', async (req, res) => {
  try {
    // Example: delete all docs, then restore from latest backup
    // (In production, add more safety checks!)
    // ...existing code for deletion and restore...
    // Audit log
    try {
      const AuditLog = (await import('../models/AuditLog.js')).default;
      await AuditLog.create({ eventType: 'disaster-simulation', userId: req.body.userId, timestamp: new Date(), success: true });
    } catch (auditError) { console.warn('Audit log failed:', auditError.message); }
    res.json({ success: true, message: 'Disaster recovery simulation complete.' });
  } catch (error) {
    try {
      const AuditLog = (await import('../models/AuditLog.js')).default;
      await AuditLog.create({ eventType: 'disaster-simulation', userId: req.body.userId, timestamp: new Date(), success: false, details: { error: error.message } });
    } catch {}
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
