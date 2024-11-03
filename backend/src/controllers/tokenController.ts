import { Request, Response } from 'express'
import { SolanaService } from '../services/solanaService'
import { cacheService } from '../services/cacheService'

let solanaService: SolanaService

try {
  solanaService = new SolanaService()
} catch (error) {
  console.error('Failed to initialize SolanaService:', error)
}

export const tokenController = {
  async getBurnStats(req: Request, res: Response) {
    try {
      if (!solanaService) {
        return res.status(500).json({ error: 'Solana service not initialized' })
      }

      const cacheKey = 'burn_stats'
      const cached = await cacheService.get(cacheKey)
      
      if (cached) {
        return res.json(cached)
      }

      const burnInfo = await solanaService.getBurnWalletInfo()
      await cacheService.set(cacheKey, burnInfo)
      
      res.json(burnInfo)
    } catch (error) {
      console.error('Error in getBurnStats:', error)
      res.status(500).json({ error: 'Failed to fetch burn statistics' })
    }
  },

  async getTokenomics(req: Request, res: Response) {
    try {
      if (!solanaService) {
        return res.status(500).json({ error: 'Solana service not initialized' })
      }

      const cacheKey = 'tokenomics'
      const cached = await cacheService.get(cacheKey)
      
      if (cached) {
        return res.json(cached)
      }

      const tokenomics = await solanaService.getTokenomicsData()
      await cacheService.set(cacheKey, tokenomics)
      
      res.json(tokenomics)
    } catch (error) {
      console.error('Error in getTokenomics:', error)
      res.status(500).json({ error: 'Failed to fetch tokenomics data' })
    }
  }
} 