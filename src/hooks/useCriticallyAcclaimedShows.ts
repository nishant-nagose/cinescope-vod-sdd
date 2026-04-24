import { useInfiniteShows } from './useInfiniteShows'
import { getCriticallyAcclaimedShows } from '../services/tmdbApi'

export const useCriticallyAcclaimedShows = () =>
  useInfiniteShows(
    (page, filter) => getCriticallyAcclaimedShows(page, filter),
    { cacheKeyPrefix: 'critically-acclaimed-shows' }
  )
