// Auction Item Model
import mongoose from 'mongoose';

const bidSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  kindnessAct: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const donationSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  details: { type: String },
  timestamp: { type: Date, default: Date.now },
});

const tradeSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  details: { type: String },
  timestamp: { type: Date, default: Date.now },
});

const kindnessChainSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  details: { type: String },
  timestamp: { type: Date, default: Date.now },
});

const auctionItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  imageUrl: { type: String },
  status: { type: String, enum: ['open', 'claimed', 'donated', 'traded'], default: 'open' },
  bids: [bidSchema],
  claimedBy: { type: String },
  donations: [donationSchema],
  trades: [tradeSchema],
  kindnessChains: [kindnessChainSchema],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('AuctionItem', auctionItemSchema);
