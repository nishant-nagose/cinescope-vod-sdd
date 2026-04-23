import { useApi } from './useApi'
import { getThrillerMovies } from '../services/tmdbApi'
import { useContentFilter } from '../context/ContentFilterContext'
import { DiscoverResponse } from '../types/tmdb'

export const useThrillerMovies = () => {
  const { countries, languages, filterKey } = useContentFilter()
  return useApi<DiscoverResponse>(
    () => getThrillerMovies(1, { countries, languages }),
    { cacheKey: `thriller-${filterKey}` }
  )
}
