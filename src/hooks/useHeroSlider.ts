import { useState, useEffect, useRef, useCallback } from 'react'
import { useDailyTrending } from './useDailyTrending'
import { getMovieVideos } from '../services/tmdbApi'
import { Movie } from '../types/tmdb'

export const useHeroSlider = () => {
  const { data, loading } = useDailyTrending()
  const movies = data?.results ?? []

  const [activeIndex, setActiveIndexState] = useState(0)
  const [currentVideoKey, setCurrentVideoKey] = useState<string | null>(null)
  const [videoLoading, setVideoLoading] = useState(false)
  const videoCache = useRef<Map<number, string | null>>(new Map())

  const fetchVideoForMovie = useCallback(async (movie: Movie) => {
    if (videoCache.current.has(movie.id)) {
      setCurrentVideoKey(videoCache.current.get(movie.id) ?? null)
      return
    }
    setVideoLoading(true)
    try {
      const response = await getMovieVideos(movie.id)
      const trailer = response.results.find(
        v => v.site === 'YouTube' && v.type === 'Trailer' && v.official
      ) ?? response.results.find(v => v.site === 'YouTube' && v.type === 'Trailer')
      const key = trailer?.key ?? null
      videoCache.current.set(movie.id, key)
      setCurrentVideoKey(key)
    } catch {
      videoCache.current.set(movie.id, null)
      setCurrentVideoKey(null)
    } finally {
      setVideoLoading(false)
    }
  }, [])

  useEffect(() => {
    if (movies.length > 0) {
      fetchVideoForMovie(movies[activeIndex])
    }
  }, [activeIndex, movies, fetchVideoForMovie])

  const setActiveIndex = useCallback((i: number) => {
    setActiveIndexState(i)
    setCurrentVideoKey(null)
  }, [])

  return { movies, loading, activeIndex, setActiveIndex, currentVideoKey, videoLoading }
}
