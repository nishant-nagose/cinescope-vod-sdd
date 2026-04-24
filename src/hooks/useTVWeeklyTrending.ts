import { useInfiniteShows } from './useInfiniteShows'
import { getTrendingTVWeekly } from '../services/tmdbApi'

export const useTVWeeklyTrending = () =>
  useInfiniteShows(
    (page, filter) => getTrendingTVWeekly(page, filter),
    { cacheKeyPrefix: 'tv-weekly-trending' }
  )
