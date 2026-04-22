import { useApi } from './useApi'
import { getLanguages } from '../services/tmdbApi'
import { TmdbLanguage } from '../types/tmdb'

export const useLanguages = () => {
  return useApi<TmdbLanguage[]>(
    () => getLanguages(),
    { cacheKey: 'tmdb-languages' }
  )
}
