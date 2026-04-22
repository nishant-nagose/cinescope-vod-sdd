import { useApi } from './useApi'
import { getNewReleases } from '../services/tmdbApi'
import { useContentFilter } from '../context/ContentFilterContext'
import { DiscoverResponse } from '../types/tmdb'

export const useNewReleases = () => {
  const { countries, languages, filterKey } = useContentFilter()
  return useApi<DiscoverResponse>(
    () => getNewReleases(1, { countries, languages }),
    { cacheKey: `new-releases-${filterKey}` }
  )
}
