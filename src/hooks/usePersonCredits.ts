import { useApi } from './useApi'
import { getPersonMovieCredits } from '../services/tmdbApi'
import { PersonMovieCredits } from '../types/tmdb'

export const usePersonCredits = (personId: number) => {
  return useApi<PersonMovieCredits>(
    () => getPersonMovieCredits(personId),
    { cacheKey: `person-credits-${personId}`, enabled: personId > 0 }
  )
}
