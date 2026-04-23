import { useApi } from './useApi'
import { getWatchProviders } from '../services/tmdbApi'
import { WatchProvidersResponse } from '../types/tmdb'

export const useWatchProviders = (movieId: number) => {
  return useApi<WatchProvidersResponse>(
    () => getWatchProviders(movieId),
    { cacheKey: `watch-providers-${movieId}`, enabled: movieId > 0 }
  )
}
