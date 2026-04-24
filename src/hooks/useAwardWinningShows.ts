import { useInfiniteShows } from './useInfiniteShows'
import { getAwardWinningShows } from '../services/tmdbApi'

export const useAwardWinningShows = () =>
  useInfiniteShows(
    (page, filter) => getAwardWinningShows(page, filter),
    { cacheKeyPrefix: 'award-winning-shows' }
  )
