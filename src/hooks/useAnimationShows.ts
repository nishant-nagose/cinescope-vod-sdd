import { useInfiniteShows } from './useInfiniteShows'
import { getShowsByGenre } from '../services/tmdbApi'

export const useAnimationShows = () =>
  useInfiniteShows(
    (page, filter) => getShowsByGenre(16, page, { ...filter, countries: [] }),
    { cacheKeyPrefix: 'animation-shows' }
  )
