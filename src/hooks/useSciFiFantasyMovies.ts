import { useApi } from './useApi'
import { getSciFiFantasyMovies } from '../services/tmdbApi'
import { useContentFilter } from '../context/ContentFilterContext'
import { DiscoverResponse } from '../types/tmdb'

export const useSciFiFantasyMovies = () => {
  const { countries, languages, filterKey } = useContentFilter()
  return useApi<DiscoverResponse>(
    () => getSciFiFantasyMovies(1, { countries, languages }),
    { cacheKey: `scifi-fantasy-${filterKey}` }
  )
}
