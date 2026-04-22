import { useApi } from './useApi'
import { getMoviesByGenre } from '../services/tmdbApi'
import { useContentFilter } from '../context/ContentFilterContext'
import { DiscoverResponse } from '../types/tmdb'

export const useMoviesByGenre = (genreId: number) => {
  const { countries, languages, filterKey } = useContentFilter()
  return useApi<DiscoverResponse>(
    () => getMoviesByGenre(genreId, 1, { countries, languages }),
    { cacheKey: `movies-genre-${genreId}-${filterKey}`, enabled: genreId > 0 }
  )
}
