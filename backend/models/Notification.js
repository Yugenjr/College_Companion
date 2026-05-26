import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true }, // recipient user
  type: { type: String, required: true }, // alert, message, event, etc.
  title: { type: String, required: true },
  body: { type: String, required: true },
  data: { type: mongoose.Schema.Types.Mixed }, // extra payload
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  group: { type: String }, // for group broadcasts
  source: { type: String }, // attendance, revision, financial, etc.
});

export default mongoose.model('Notification', NotificationSchema);