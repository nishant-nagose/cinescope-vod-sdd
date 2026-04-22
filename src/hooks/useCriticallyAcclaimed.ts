import { useApi } from './useApi'
import { getCriticallyAcclaimed } from '../services/tmdbApi'
import { DiscoverResponse } from '../types/tmdb'

export const useCriticallyAcclaimed = () => {
  return useApi<DiscoverResponse>(
    () => getCriticallyAcclaimed(),
    { cacheKey: 'critically-acclaimed' }
  )
}
