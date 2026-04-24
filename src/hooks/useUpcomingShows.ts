import { useInfiniteShows } from './useInfiniteShows'
import { getUpcomingShows } from '../services/tmdbApi'

export const useUpcomingShows = () =>
  useInfiniteShows(
    (page) => getUpcomingShows(page),
    { cacheKeyPrefix: 'upcoming-shows' }
  )
