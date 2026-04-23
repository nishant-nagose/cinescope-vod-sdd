import { useApi } from './useApi'
import { getActionAdventureMovies } from '../services/tmdbApi'
import { useContentFilter } from '../context/ContentFilterContext'
import { DiscoverResponse } from '../types/tmdb'

export const useActionAdventureMovies = () => {
  const { countries, languages, filterKey } = useContentFilter()
  return useApi<DiscoverResponse>(
    () => getActionAdventureMovies(1, { countries, languages }),
    { cacheKey: `action-adventure-${filterKey}` }
  )
}
