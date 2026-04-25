import { useInfiniteShows } from './useInfiniteShows'
import { getShowsByGenre } from '../services/tmdbApi'

export const useActionAdventureShows = () =>
  useInfiniteShows(
    (page, filter) => getShowsByGenre(10759, page, { ...filter, countries: [] }),
    { cacheKeyPrefix: 'action-adventure-shows' }
  )
