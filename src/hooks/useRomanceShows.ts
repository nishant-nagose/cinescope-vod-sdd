import { useInfiniteShows } from './useInfiniteShows'
import { getShowsByGenre } from '../services/tmdbApi'

export const useRomanceShows = () =>
  useInfiniteShows(
    (page, filter) => getShowsByGenre(10749, page, filter),
    { cacheKeyPrefix: 'romance-shows' }
  )
