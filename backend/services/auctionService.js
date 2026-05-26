// Kindness Auction House Service
import AuctionItem from '../models/AuctionItem.js';
import User from '../models/User.js';

export async function getAuctionItems() {
  return AuctionItem.find({});
}

export async function bidKindness(itemId, userId, kindnessAct) {
  const item = await AuctionItem.findById(itemId);
  if (!item) throw new Error('Item not found');
  item.bids.push({ userId, kindnessAct, timestamp: Date.now() });
  await item.save();
  return item;
}

export async function claimItem(itemId, userId) {
  const item = await AuctionItem.findById(itemId);
  if (!item) throw new Error('Item not found');
  const highestBid = item.bids[item.bids.length - 1];
  if (highestBid.userId !== userId) throw new Error('Not highest bidder');
  item.claimedBy = userId;
  item.status = 'claimed';
  await item.save();
  return item;
}

export async function donateItem(itemId, userId, donationDetails) {
  const item = await AuctionItem.findById(itemId);
  if (!item) throw new Error('Item not found');
  item.donations.push({ userId, ...donationDetails, timestamp: Date.now() });
  await item.save();
  return item;
}

export async function tradeItem(itemId, userId, tradeDetails) {
  const item = await AuctionItem.findById(itemId);
  if (!item) throw new Error('Item not found');
  item.trades.push({ userId, ...tradeDetails, timestamp: Date.now() });
  await item.save();
  return item;
}

export async function startKindnessChain(itemId, userId, chainDetails) {
  const item = await AuctionItem.findById(itemId);
  if (!item) throw new Error('Item not found');
  item.kindnessChains.push({ userId, ...chainDetails, timestamp: Date.now() });
  await item.save();
  return item;
}
