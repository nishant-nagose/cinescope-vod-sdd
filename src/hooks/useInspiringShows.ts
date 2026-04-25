import { useInfiniteShows } from './useInfiniteShows'
import { discoverTV } from '../services/tmdbApi'

export const useInspiringShows = () =>
  useInfiniteShows(
    (page, filter) => discoverTV({
      with_genres: '18,10751',
      without_genres: '10749',   // exclude Romance
      sort_by: 'vote_average.desc',
      'vote_count.gte': '100',
    }, page, { ...filter, countries: [] }),
    { cacheKeyPrefix: 'inspiring-shows' }
  )
