import express from 'express';
import { logger } from '../utils/logger';
import { config } from '../config/config';

const router = express.Router();

router.get('/api/roadmap/progress', async (req, res) => {
  logger.info('Fetching roadmap progress');
  try {
    // Mock data for now - you can replace with real data from MongoDB later
    const progress = {
      currentPhase: 2,
      lastUpdate: new Date().toISOString(),
      phases: [
        {
          id: 1,
          title: 'Phase 1: Launch',
          status: 'Completed',
          objective: 'Successfully launch $SOBA on Solana',
          details: 'Fair launch, initial liquidity provision, and community building',
          completionDate: '2024-03-01'
        },
        {
          id: 2,
          title: 'Phase 2: Growth',
          status: 'In Progress',
          objective: 'Expand community and establish partnerships',
          details: 'Marketing campaigns, exchange listings, and strategic partnerships'
        },
        // Add more phases as needed
      ]
    };

    logger.info('Roadmap progress fetched successfully', { progress });
    res.json(progress);
  } catch (error) {
    logger.error('Error fetching roadmap progress:', error);
    res.status(500).json({ error: 'Failed to fetch roadmap progress' });
  }
});

export default router; 