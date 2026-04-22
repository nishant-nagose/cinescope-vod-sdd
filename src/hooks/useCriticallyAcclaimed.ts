import { useApi } from './useApi'
import { getCriticallyAcclaimed } from '../services/tmdbApi'
import { useContentFilter } from '../context/ContentFilterContext'
import { DiscoverResponse } from '../types/tmdb'

export const useCriticallyAcclaimed = () => {
  const { countries, languages, filterKey } = useContentFilter()
  return useApi<DiscoverResponse>(
    () => getCriticallyAcclaimed(1, { countries, languages }),
    { cacheKey: `critically-acclaimed-${filterKey}` }
  )
}
