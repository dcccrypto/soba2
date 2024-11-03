import express from 'express';
import axios from 'axios';
import NodeCache from 'node-cache';

const router = express.Router();
const cache = new NodeCache({ stdTTL: 300 }); // Cache for 5 minutes

const SOLANA_RPC_URL = process.env.SOLANA_RPC_URL;
const SOLSCAN_API_KEY = process.env.SOLSCAN_API_KEY;
const SOBA_TOKEN_ADDRESS = process.env.SOBA_TOKEN_ADDRESS;
const SOBA_BURN_WALLET = process.env.SOBA_BURN_WALLET;

router.get('/api/tokenomics', async (req, res) => {
  try {
    // Check cache first
    const cachedData = cache.get('tokenomics');
    if (cachedData) {
      return res.json(cachedData);
    }

    // Fetch data from Solscan
    const [tokenInfo, holders] = await Promise.all([
      axios.get(`https://public-api.solscan.io/token/meta?tokenAddress=${SOBA_TOKEN_ADDRESS}`, {
        headers: {
          'token': SOLSCAN_API_KEY
        }
      }),
      axios.get(`https://public-api.solscan.io/token/holders?tokenAddress=${SOBA_TOKEN_ADDRESS}`, {
        headers: {
          'token': SOLSCAN_API_KEY
        }
      })
    ]);

    // Get burn wallet balance
    const burnWalletInfo = await axios.get(
      `https://public-api.solscan.io/account/tokens?account=${SOBA_BURN_WALLET}`,
      {
        headers: {
          'token': SOLSCAN_API_KEY
        }
      }
    );

    const burnedAmount = burnWalletInfo.data.find(
      (token: any) => token.tokenAddress === SOBA_TOKEN_ADDRESS
    )?.amount || 0;

    const tokenomicsData = {
      totalSupply: tokenInfo.data.supply,
      circulatingSupply: tokenInfo.data.supply - burnedAmount,
      burnedTokens: burnedAmount,
      holders: holders.data.total,
      marketCap: tokenInfo.data.marketCap,
      price: tokenInfo.data.price,
      volume24h: tokenInfo.data.volume24h,
    };

    // Store in cache
    cache.set('tokenomics', tokenomicsData);

    res.json(tokenomicsData);
  } catch (error) {
    console.error('Error fetching tokenomics:', error);
    res.status(500).json({ error: 'Failed to fetch tokenomics data' });
  }
});

export default router; 