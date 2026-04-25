import { useInfiniteShows } from './useInfiniteShows'
import { getShowsByGenre } from '../services/tmdbApi'

export const useComedyShows = () =>
  useInfiniteShows(
    (page, filter) => getShowsByGenre(35, page, { ...filter, countries: [] }),
    { cacheKeyPrefix: 'comedy-shows' }
  )
