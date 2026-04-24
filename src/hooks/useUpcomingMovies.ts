import { useInfiniteMovies } from './useInfiniteMovies'
import { getUpcomingMovies } from '../services/tmdbApi'

export const useUpcomingMovies = () =>
  useInfiniteMovies(
    (page) => getUpcomingMovies(page),
    { cacheKeyPrefix: 'upcoming-movies' }
  )
