import { useState, useEffect, useRef, useCallback } from 'react'
import { Movie, TVShow } from '../types/tmdb'
import { getDailyTrending, getTrendingTVDaily, getMovieVideos } from '../services/tmdbApi'

export type HeroItem = (Movie & { mediaType: 'movie' }) | (TVShow & { mediaType: 'tv' })

export const useHeroSlider = () => {
  const [items, setItems] = useState<HeroItem[]>([])
  const [loading, setLoading] = useState(true)
  const [activeIndex, setActiveIndexState] = useState(0)
  const [currentVideoKey, setCurrentVideoKey] = useState<string | null>(null)
  const [videoLoading, setVideoLoading] = useState(false)
  const videoCache = useRef<Map<string, string | null>>(new Map())

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    Promise.all([getDailyTrending(1), getTrendingTVDaily(1)])
      .then(([moviesResp, tvResp]) => {
        if (cancelled) return
        const movies: HeroItem[] = (moviesResp.results ?? [])
          .slice(0, 5)
          .map(m => ({ ...m, mediaType: 'movie' as const }))
        const shows: HeroItem[] = (tvResp.results ?? [])
          .slice(0, 5)
          .map(s => ({ ...s, mediaType: 'tv' as const }))
        const merged = [...movies, ...shows]
          .sort((a, b) => b.popularity - a.popularity)
          .slice(0, 10)
        setItems(merged)
      })
      .catch(() => { if (!cancelled) setItems([]) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  const fetchVideoForItem = useCallback(async (item: HeroItem) => {
    if (item.mediaType !== 'movie') {
      setCurrentVideoKey(null)
      return
    }
    const cacheKey = `movie-${item.id}`
    if (videoCache.current.has(cacheKey)) {
      setCurrentVideoKey(videoCache.current.get(cacheKey) ?? null)
      return
    }
    setVideoLoading(true)
    try {
      const response = await getMovieVideos(item.id)
      const trailer = response.results.find(
        v => v.site === 'YouTube' && v.type === 'Trailer' && v.official
      ) ?? response.results.find(v => v.site === 'YouTube' && v.type === 'Trailer')
      const key = trailer?.key ?? null
      videoCache.current.set(cacheKey, key)
      setCurrentVideoKey(key)
    } catch {
      videoCache.current.set(cacheKey, null)
      setCurrentVideoKey(null)
    } finally {
      setVideoLoading(false)
    }
  }, [])

  useEffect(() => {
    if (items.length > 0) fetchVideoForItem(items[activeIndex])
  }, [activeIndex, items, fetchVideoForItem])

  const setActiveIndex = useCallback((i: number) => {
    setActiveIndexState(i)
    setCurrentVideoKey(null)
  }, [])

  return { items, loading, activeIndex, setActiveIndex, currentVideoKey, videoLoading }
}
