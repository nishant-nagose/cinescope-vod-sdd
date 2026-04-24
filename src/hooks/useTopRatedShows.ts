import { useInfiniteShows } from './useInfiniteShows'
import { getTopRatedTV } from '../services/tmdbApi'

export const useTopRatedShows = () =>
  useInfiniteShows(
    (page, filter) => getTopRatedTV(page, filter),
    { cacheKeyPrefix: 'top-rated-tv' }
  )
