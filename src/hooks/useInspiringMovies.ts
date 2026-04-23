import { useApi } from './useApi'
import { getInspiringMovies } from '../services/tmdbApi'
import { useContentFilter } from '../context/ContentFilterContext'
import { DiscoverResponse } from '../types/tmdb'

export const useInspiringMovies = () => {
  const { countries, languages, filterKey } = useContentFilter()
  return useApi<DiscoverResponse>(
    () => getInspiringMovies(1, { countries, languages }),
    { cacheKey: `inspiring-${filterKey}` }
  )
}
