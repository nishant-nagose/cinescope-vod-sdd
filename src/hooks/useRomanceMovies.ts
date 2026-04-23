import { useApi } from './useApi'
import { getRomanceMovies } from '../services/tmdbApi'
import { useContentFilter } from '../context/ContentFilterContext'
import { DiscoverResponse } from '../types/tmdb'

export const useRomanceMovies = () => {
  const { countries, languages, filterKey } = useContentFilter()
  return useApi<DiscoverResponse>(
    () => getRomanceMovies(1, { countries, languages }),
    { cacheKey: `romance-${filterKey}` }
  )
}
