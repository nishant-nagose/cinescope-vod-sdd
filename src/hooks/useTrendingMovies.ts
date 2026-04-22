import { useApi } from './useApi'
import { getTrendingMovies } from '../services/tmdbApi'
import { useContentFilter } from '../context/ContentFilterContext'
import { DiscoverResponse } from '../types/tmdb'

export const useTrendingMovies = () => {
  const { countries, languages, filterKey } = useContentFilter()
  return useApi<DiscoverResponse>(
    () => getTrendingMovies(1, { countries, languages }),
    { cacheKey: `trending-${filterKey}` }
  )
}
