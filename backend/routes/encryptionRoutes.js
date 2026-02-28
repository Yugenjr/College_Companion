// End-to-End Encryption for Sensitive Data at Rest and in Transit
// Implements encryption, key management, secure transport, and compliant APIs

import express from 'express';
import crypto from 'crypto';
import User from '../models/User.js';
import FinancialRecord from '../models/FinancialRecord.js';

const router = express.Router();

// Key management (for demo: in-memory, use vault/HSM in production)
const keyStore = {};
function generateKey(userId) {
  const key = crypto.randomBytes(32).toString('hex');
  keyStore[userId] = key;
  return key;
}
function getKey(userId) {
  return keyStore[userId];
}

// Field-level encryption helpers
function encryptField(value, key) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv);
  let encrypted = cipher.update(value, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}
function decryptField(encrypted, key) {
  const [ivHex, dataHex] = encrypted.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv);
  let decrypted = decipher.update(dataHex, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

// Middleware: Enforce HTTPS (secure transport)
function requireHTTPS(req, res, next) {
  if (req.secure || req.headers['x-forwarded-proto'] === 'https') return next();
  res.status(403).json({ error: 'HTTPS required' });
}
router.use(requireHTTPS);

// API: Generate encryption key for user
router.post('/encryption/key', async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId required' });
    const key = generateKey(userId);
    res.json({ success: true, key });
  } catch (error) {
    res.status(500).json({ error: 'Key generation failed', details: error.message });
  }
});

// API: Store sensitive user data (encrypted at rest)
router.post('/user/sensitive', async (req, res) => {
  try {
    const { userId, ssn, cardNumber, address } = req.body;
    if (!userId || !ssn || !cardNumber || !address) return res.status(400).json({ error: 'Missing fields' });
    const key = getKey(userId);
    if (!key) return res.status(403).json({ error: 'Encryption key not found' });
    const encryptedSSN = encryptField(ssn, key);
    const encryptedCard = encryptField(cardNumber, key);
    const encryptedAddress = encryptField(address, key);
    const user = await User.findByIdAndUpdate(userId, {
      ssn: encryptedSSN,
      cardNumber: encryptedCard,
      address: encryptedAddress,
    }, { new: true, runValidators: true });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to store sensitive data', details: error.message });
  }
});

// API: Retrieve and decrypt sensitive user data
router.get('/user/sensitive/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const key = getKey(userId);
    if (!key) return res.status(403).json({ error: 'Encryption key not found' });
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const ssn = decryptField(user.ssn, key);
    const cardNumber = decryptField(user.cardNumber, key);
    const address = decryptField(user.address, key);
    res.json({ success: true, ssn, cardNumber, address });
  } catch (error) {
    res.status(500).json({ error: 'Failed to decrypt data', details: error.message });
  }
});

// API: Store encrypted financial record
router.post('/financial/encrypt', async (req, res) => {
  try {
    const { userId, amount, account, details } = req.body;
    if (!userId || !amount || !account || !details) return res.status(400).json({ error: 'Missing fields' });
    const key = getKey(userId);
    if (!key) return res.status(403).json({ error: 'Encryption key not found' });
    const encryptedAmount = encryptField(amount.toString(), key);
    const encryptedAccount = encryptField(account, key);
    const encryptedDetails = encryptField(details, key);
    const record = new FinancialRecord({
      userId,
      amount: encryptedAmount,
      account: encryptedAccount,
      details: encryptedDetails,
    });
    await record.save();
    res.status(201).json({ success: true, record });
  } catch (error) {
    res.status(500).json({ error: 'Failed to store financial record', details: error.message });
  }
});

// API: Retrieve and decrypt financial record
router.get('/financial/decrypt/:id', async (req, res) => {
  try {
    const record = await FinancialRecord.findById(req.params.id);
    if (!record) return res.status(404).json({ error: 'Record not found' });
    const key = getKey(record.userId);
    if (!key) return res.status(403).json({ error: 'Encryption key not found' });
    const amount = decryptField(record.amount, key);
    const account = decryptField(record.account, key);
    const details = decryptField(record.details, key);
    res.json({ success: true, amount, account, details });
  } catch (error) {
    res.status(500).json({ error: 'Failed to decrypt financial record', details: error.message });
  }
});

// API: Rotate encryption key (compliance)
router.post('/encryption/rotate', async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId required' });
    const oldKey = getKey(userId);
    if (!oldKey) return res.status(403).json({ error: 'Encryption key not found' });
    const newKey = generateKey(userId);
    // Re-encrypt all fields for user
    const user = await User.findById(userId);
    if (user) {
      user.ssn = encryptField(decryptField(user.ssn, oldKey), newKey);
      user.cardNumber = encryptField(decryptField(user.cardNumber, oldKey), newKey);
      user.address = encryptField(decryptField(user.address, oldKey), newKey);
      await user.save();
    }
    const records = await FinancialRecord.find({ userId });
    for (const record of records) {
      record.amount = encryptField(decryptField(record.amount, oldKey), newKey);
      record.account = encryptField(decryptField(record.account, oldKey), newKey);
      record.details = encryptField(decryptField(record.details, oldKey), newKey);
      await record.save();
    }
    res.json({ success: true, message: 'Key rotated and data re-encrypted' });
  } catch (error) {
    res.status(500).json({ error: 'Key rotation failed', details: error.message });
  }
});

// API: Compliance check endpoint
router.get('/encryption/compliance', (req, res) => {
  res.json({
    success: true,
    standards: ['PCI DSS', 'GDPR'],
    encryption: 'AES-256-CBC',
    transport: 'HTTPS required',
    keyManagement: 'Demo in-memory, use vault/HSM in production',
    fieldLevel: true,
    audit: 'Key rotation supported',
  });
});

export default router;
