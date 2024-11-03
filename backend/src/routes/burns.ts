import express from 'express';
import { SolanaService } from '../services/solanaService';
import { logger } from '../utils/logger';

const router = express.Router();
const solanaService = new SolanaService();

router.get('/api/burns', async (req, res) => {
  try {
    const burnStats = await solanaService.getBurnStats();
    res.json(burnStats);
  } catch (error) {
    logger.error('Error in burns endpoint:', error);
    res.status(500).json({ error: 'Failed to fetch burn data' });
  }
});

router.get('/api/burns/history', async (req, res) => {
  try {
    const burnHistory = await solanaService.getBurnHistory();
    res.json(burnHistory);
  } catch (error) {
    logger.error('Error in burn history endpoint:', error);
    res.status(500).json({ error: 'Failed to fetch burn history' });
  }
});

export default router; 