import { useApi } from './useApi'
import { getShowVideos } from '../services/tmdbApi'
import { MovieVideosResponse } from '../types/tmdb'

export const useShowVideos = (showId: number) => {
  return useApi<MovieVideosResponse>(
    () => getShowVideos(showId),
    { cacheKey: `show-videos-${showId}`, enabled: showId > 0 }
  )
}
