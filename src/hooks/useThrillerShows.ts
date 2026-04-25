import { useInfiniteShows } from './useInfiniteShows'
import { getShowsByGenre } from '../services/tmdbApi'

export const useThrillerShows = () =>
  useInfiniteShows(
    (page, filter) => getShowsByGenre('9648,80', page, { ...filter, countries: [] }),
    { cacheKeyPrefix: 'thriller-shows' }
  )
