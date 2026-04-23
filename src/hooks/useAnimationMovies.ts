import { useApi } from './useApi'
import { getAnimationMovies } from '../services/tmdbApi'
import { useContentFilter } from '../context/ContentFilterContext'
import { DiscoverResponse } from '../types/tmdb'

export const useAnimationMovies = () => {
  const { countries, languages, filterKey } = useContentFilter()
  return useApi<DiscoverResponse>(
    () => getAnimationMovies(1, { countries, languages }),
    { cacheKey: `animation-${filterKey}` }
  )
}
