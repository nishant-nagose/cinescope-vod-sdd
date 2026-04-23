import { useApi } from './useApi'
import { getAwardWinningMovies } from '../services/tmdbApi'
import { useContentFilter } from '../context/ContentFilterContext'
import { DiscoverResponse } from '../types/tmdb'

export const useAwardWinningMovies = () => {
  const { countries, languages, filterKey } = useContentFilter()
  return useApi<DiscoverResponse>(
    () => getAwardWinningMovies(1, { countries, languages }),
    { cacheKey: `award-winning-${filterKey}` }
  )
}
