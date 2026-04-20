import { useApi } from './useApi'
import { getTrendingMovies } from '../services/tmdbApi'
import { TrendingResponse } from '../types/tmdb'

export const useTrendingMovies = () => {
  return useApi<TrendingResponse>(
    () => getTrendingMovies(),
    { cacheKey: 'trending-movies' }
  )
}