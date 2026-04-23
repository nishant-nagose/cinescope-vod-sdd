import { useApi } from './useApi'
import { getDailyTrending } from '../services/tmdbApi'
import { useContentFilter } from '../context/ContentFilterContext'
import { DiscoverResponse } from '../types/tmdb'

export const useDailyTrending = () => {
  const { countries, languages, filterKey } = useContentFilter()

  const result = useApi<DiscoverResponse>(
    () => getDailyTrending(1),
    { cacheKey: `daily-trending-${filterKey}` }
  )

  const filtered = result.data
    ? {
        ...result.data,
        results: result.data.results
          .filter(m =>
            (countries.length === 0 || countries.includes(m.original_language)) &&
            (languages.length === 0 || languages.includes(m.original_language))
          )
          .slice(0, 10),
      }
    : null

  return { ...result, data: filtered }
}
