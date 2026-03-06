import mongoose from 'mongoose';

const AuditLogSchema = new mongoose.Schema({
  eventType: { type: String, required: true }, // backup, restore, validate, delete, etc.
  userId: { type: String }, // who triggered
  timestamp: { type: Date, default: Date.now },
  details: { type: mongoose.Schema.Types.Mixed },
  success: { type: Boolean, default: true },
  fileName: { type: String },
});

export default mongoose.model('AuditLog', AuditLogSchema);