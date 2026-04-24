import { useInfiniteShows } from './useInfiniteShows'
import { getRecommendedShows } from '../services/tmdbApi'

export const useRecommendedShows = () =>
  useInfiniteShows(
    (page, filter) => getRecommendedShows(page, filter),
    { cacheKeyPrefix: 'recommended-shows' }
  )
