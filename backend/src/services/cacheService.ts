import NodeCache from 'node-cache'
import { config } from '../config/config'

class CacheService {
  private cache: NodeCache

  constructor() {
    this.cache = new NodeCache({
      stdTTL: config.cache.ttl
    })
  }

  async get(key: string) {
    return this.cache.get(key)
  }

  async set(key: string, value: any) {
    return this.cache.set(key, value)
  }
}

export const cacheService = new CacheService() 