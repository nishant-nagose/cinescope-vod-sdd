import { useInfiniteShows } from './useInfiniteShows'
import { getTrendingTVDaily } from '../services/tmdbApi'

export const useTVDailyTrending = () =>
  useInfiniteShows(
    (page, filter) => getTrendingTVDaily(page, filter),
    { cacheKeyPrefix: 'tv-daily-trending' }
  )
