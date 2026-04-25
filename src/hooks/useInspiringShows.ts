import { useInfiniteShows } from './useInfiniteShows'
import { getShowsByGenre } from '../services/tmdbApi'

export const useInspiringShows = () =>
  useInfiniteShows(
    (page, filter) => getShowsByGenre('18,10751', page, { ...filter, countries: [] }),
    { cacheKeyPrefix: 'inspiring-shows' }
  )
