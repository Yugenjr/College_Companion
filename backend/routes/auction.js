// Auction House Routes
import express from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import { getAuctionItems, bidKindness, claimItem, donateItem, tradeItem, startKindnessChain } from '../services/auctionService.js';
const router = express.Router();

router.get('/items', requireAuth, async (req, res) => {
  try {
    const items = await getAuctionItems();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:itemId/bid', requireAuth, async (req, res) => {
  try {
    const item = await bidKindness(req.params.itemId, req.user.uid, req.body.kindnessAct);
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/:itemId/claim', requireAuth, async (req, res) => {
  try {
    const item = await claimItem(req.params.itemId, req.user.uid);
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/:itemId/donate', requireAuth, async (req, res) => {
  try {
    const item = await donateItem(req.params.itemId, req.user.uid, req.body);
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/:itemId/trade', requireAuth, async (req, res) => {
  try {
    const item = await tradeItem(req.params.itemId, req.user.uid, req.body);
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/:itemId/chain', requireAuth, async (req, res) => {
  try {
    const item = await startKindnessChain(req.params.itemId, req.user.uid, req.body);
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
