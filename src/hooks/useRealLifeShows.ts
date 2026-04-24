import { useInfiniteShows } from './useInfiniteShows'
import { getShowsByGenre } from '../services/tmdbApi'

export const useRealLifeShows = () =>
  useInfiniteShows(
    (page, filter) => getShowsByGenre(99, page, filter),
    { cacheKeyPrefix: 'real-life-shows' }
  )
