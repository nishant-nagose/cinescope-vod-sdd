import { useApi } from './useApi'
import { getComedyMovies } from '../services/tmdbApi'
import { useContentFilter } from '../context/ContentFilterContext'
import { DiscoverResponse } from '../types/tmdb'

export const useComedyMovies = () => {
  const { countries, languages, filterKey } = useContentFilter()
  return useApi<DiscoverResponse>(
    () => getComedyMovies(1, { countries, languages }),
    { cacheKey: `comedy-${filterKey}` }
  )
}
