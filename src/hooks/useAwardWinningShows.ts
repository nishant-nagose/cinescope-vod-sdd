import { useInfiniteShows } from './useInfiniteShows'
import { getAwardWinningShows } from '../services/tmdbApi'

export const useAwardWinningShows = () =>
  useInfiniteShows(
    (page, filter) => getAwardWinningShows(page, { ...filter, countries: [] }),
    { cacheKeyPrefix: 'award-winning-shows' }
  )
