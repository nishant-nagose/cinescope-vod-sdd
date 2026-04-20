interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

class TTLCache<T> {
  private cache = new Map<string, CacheEntry<T>>()

  constructor(private defaultTTL: number = 5 * 60 * 1000) {} // 5 minutes default

  set(key: string, data: T, ttl?: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl ?? this.defaultTTL
    })
  }

  get(key: string): T | null {
    const entry = this.cache.get(key)
    if (!entry) return null

    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key)
      return null
    }

    return entry.data
  }

  clear(): void {
    this.cache.clear()
  }

  // Clean up expired entries
  cleanup(): void {
    const now = Date.now()
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key)
      }
    }
  }
}

export const apiCache = new TTLCache()

// Clean up cache periodically (optional)
setInterval(() => {
  apiCache.cleanup()
}, 10 * 60 * 1000) // Every 10 minutes