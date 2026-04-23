import { useApi } from './useApi'
import { getMovieVideos } from '../services/tmdbApi'
import { MovieVideosResponse } from '../types/tmdb'

export const useMovieVideos = (movieId: number) => {
  return useApi<MovieVideosResponse>(
    () => getMovieVideos(movieId),
    { cacheKey: `movie-videos-${movieId}`, enabled: movieId > 0 }
  )
}
