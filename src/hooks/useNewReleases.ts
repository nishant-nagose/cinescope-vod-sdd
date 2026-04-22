import { useApi } from './useApi'
import { getNewReleases } from '../services/tmdbApi'
import { DiscoverResponse } from '../types/tmdb'

export const useNewReleases = () => {
  return useApi<DiscoverResponse>(
    () => getNewReleases(),
    { cacheKey: 'new-releases' }
  )
}
