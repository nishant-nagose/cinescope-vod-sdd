import { useApi } from './useApi'
import { getShowWatchProviders } from '../services/tmdbApi'
import { WatchProvidersResponse } from '../types/tmdb'

export const useShowWatchProviders = (showId: number) => {
  return useApi<WatchProvidersResponse>(
    () => getShowWatchProviders(showId),
    { cacheKey: `show-watch-providers-${showId}`, enabled: showId > 0 }
  )
}
