import { useApi } from './useApi'
import { getCountries } from '../services/tmdbApi'
import { TmdbCountry } from '../types/tmdb'

export const useCountries = () => {
  return useApi<TmdbCountry[]>(
    () => getCountries(),
    { cacheKey: 'tmdb-countries' }
  )
}
