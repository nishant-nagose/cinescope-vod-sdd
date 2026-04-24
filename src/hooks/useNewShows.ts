import { useInfiniteShows } from './useInfiniteShows'
import { getNewShows } from '../services/tmdbApi'

export const useNewShows = () =>
  useInfiniteShows(
    (page, filter) => getNewShows(page, filter),
    { cacheKeyPrefix: 'new-shows' }
  )
