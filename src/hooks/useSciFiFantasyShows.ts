import { useInfiniteShows } from './useInfiniteShows'
import { getShowsByGenre } from '../services/tmdbApi'

export const useSciFiFantasyShows = () =>
  useInfiniteShows(
    (page, filter) => getShowsByGenre(10765, page, filter),
    { cacheKeyPrefix: 'scifi-fantasy-shows' }
  )
