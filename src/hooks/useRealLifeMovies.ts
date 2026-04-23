import { useApi } from './useApi'
import { getRealLifeMovies } from '../services/tmdbApi'
import { useContentFilter } from '../context/ContentFilterContext'
import { DiscoverResponse } from '../types/tmdb'

export const useRealLifeMovies = () => {
  const { countries, languages, filterKey } = useContentFilter()
  return useApi<DiscoverResponse>(
    () => getRealLifeMovies(1, { countries, languages }),
    { cacheKey: `real-life-${filterKey}` }
  )
}
