import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import User from '../models/User.js';
import Note from '../models/Note.js';
import SurvivalPlan from '../models/SurvivalPlan.js';
import RevisionPlan from '../models/RevisionPlan.js';
// Add other critical models as needed

const BACKUP_DIR = path.resolve('backend/backup');
const ENCRYPTION_KEY = process.env.BACKUP_ENCRYPTION_KEY || 'default_key_32byteslong!';
const IV_LENGTH = 16;

function encryptData(data) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(data);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decryptData(text) {
  const parts = text.split(':');
  const iv = Buffer.from(parts.shift(), 'hex');
  const encryptedText = Buffer.from(parts.join(':'), 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

export async function backupCollections({ type = 'full', collections = ['User', 'Note', 'SurvivalPlan', 'RevisionPlan'], timestamp = new Date() }) {
  const backupData = {};
  for (const col of collections) {
    let Model;
    switch (col) {
      case 'User': Model = User; break;
      case 'Note': Model = Note; break;
      case 'SurvivalPlan': Model = SurvivalPlan; break;
      case 'RevisionPlan': Model = RevisionPlan; break;
      // Add more models as needed
      default: continue;
    }
    backupData[col] = await Model.find({}).lean();
  }
  const backupJson = JSON.stringify({ type, timestamp, backupData });
  const encrypted = encryptData(backupJson);
  const fileName = `${type}-backup-${timestamp.toISOString().replace(/[:.]/g, '-')}.enc`;
  await fs.writeFile(path.join(BACKUP_DIR, fileName), encrypted);
  return fileName;
}

export async function restoreBackup(fileName) {
  const filePath = path.join(BACKUP_DIR, fileName);
  const encrypted = await fs.readFile(filePath, 'utf-8');
  const decrypted = decryptData(encrypted);
  const { backupData } = JSON.parse(decrypted);
  // Restore logic: upsert each collection
  for (const [col, docs] of Object.entries(backupData)) {
    let Model;
    switch (col) {
      case 'User': Model = User; break;
      case 'Note': Model = Note; break;
      case 'SurvivalPlan': Model = SurvivalPlan; break;
      case 'RevisionPlan': Model = RevisionPlan; break;
      default: continue;
    }
    for (const doc of docs) {
      await Model.updateOne({ _id: doc._id }, doc, { upsert: true });
    }
  }
  return true;
}

export async function listBackups() {
  const files = await fs.readdir(BACKUP_DIR);
  return files.filter(f => f.endsWith('.enc'));
}

export async function validateBackup(fileName) {
  const filePath = path.join(BACKUP_DIR, fileName);
  try {
    const encrypted = await fs.readFile(filePath, 'utf-8');
    const decrypted = decryptData(encrypted);
    JSON.parse(decrypted);
    return true;
  } catch {
    return false;
  }
}
