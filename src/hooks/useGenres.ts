import { useApi } from './useApi'
import { getGenres } from '../services/tmdbApi'
import { GenresResponse } from '../types/tmdb'

export const useGenres = () => {
  return useApi<GenresResponse>(
    () => getGenres(),
    { cacheKey: 'genres' }
  )
}
