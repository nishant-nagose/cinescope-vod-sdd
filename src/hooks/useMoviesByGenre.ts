import { useApi } from './useApi'
import { getMoviesByGenre } from '../services/tmdbApi'
import { DiscoverResponse } from '../types/tmdb'

export const useMoviesByGenre = (genreId: number) => {
  return useApi<DiscoverResponse>(
    () => getMoviesByGenre(genreId),
    { cacheKey: `movies-genre-${genreId}`, enabled: genreId > 0 }
  )
}
