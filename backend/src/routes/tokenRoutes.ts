import express from 'express';
import { SolanaService } from '../services/solanaService';
import { logger } from '../utils/logger';
import { config } from '../config/config';

const router = express.Router();
const solanaService = new SolanaService();

interface SolanaError {
  code: number;
  message: string;
  name?: string;
  stack?: string;
}

router.get('/tokenomics', async (req, res) => {
  try {
    logger.info('GET /tokenomics request received');
    const data = await solanaService.getTokenomics();
    logger.info('Tokenomics data fetched successfully', { data });
    res.json(data);
  } catch (error) {
    const solanaError = error as SolanaError;
    logger.error('Error in tokenomics endpoint:', {
      code: solanaError.code,
      message: solanaError.message,
      name: solanaError.name,
      stack: solanaError.stack
    });
    res.status(500).json({ 
      error: 'Failed to fetch tokenomics data',
      details: process.env.NODE_ENV === 'development' ? solanaError.message : undefined
    });
  }
});

router.get('/burns/history', async (req, res) => {
  try {
    logger.info('GET /burns/history request received');
    const history = await solanaService.getBurnHistory();
    logger.info('Burn history fetched successfully', { count: history.length });
    res.json(history);
  } catch (error) {
    const solanaError = error as SolanaError;
    logger.error('Error in burn history endpoint:', {
      code: solanaError.code,
      message: solanaError.message,
      name: solanaError.name,
      stack: solanaError.stack
    });
    res.status(500).json({ 
      error: 'Failed to fetch burn history',
      details: process.env.NODE_ENV === 'development' ? solanaError.message : undefined
    });
  }
});

// Add a health check endpoint
router.get('/health', (req, res) => {
  logger.info('Health check requested');
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    solana: {
      rpc: config.apis.solanaRpc,
      tokenAddress: config.tokens.sobaAddress
    }
  });
});

export default router; 