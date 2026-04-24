import { useState, useEffect, useRef, useCallback } from 'react'
import { Movie, TVShow } from '../types/tmdb'
import { getDailyTrending, getTrendingTVDaily, getMovieVideos, getTrendingMovies, getRecommendedShows } from '../services/tmdbApi'
import { useContentFilter } from '../context/ContentFilterContext'

export type HeroItem = (Movie & { mediaType: 'movie' }) | (TVShow & { mediaType: 'tv' })

// Merge regional items first, then fill remaining slots with global items not already present
const mergeWithRegionalPriority = <T extends { id: number }>(
  global: T[],
  regional: T[]
): T[] => {
  const seen = new Set(regional.map(i => i.id))
  const extras = global.filter(i => !seen.has(i.id))
  return [...regional, ...extras]
}

export const useHeroSlider = () => {
  const [items, setItems] = useState<HeroItem[]>([])
  const [loading, setLoading] = useState(true)
  const [activeIndex, setActiveIndexState] = useState(0)
  const [currentVideoKey, setCurrentVideoKey] = useState<string | null>(null)
  const [videoLoading, setVideoLoading] = useState(false)
  const videoCache = useRef<Map<string, string | null>>(new Map())
  const { contentType, countries } = useContentFilter()
  const region = countries[0] ?? null

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setActiveIndexState(0)
    setCurrentVideoKey(null)

    const fetchMovies = contentType !== 'shows'
    const fetchShows  = contentType !== 'movies'

    const regionFilter = region ? { countries: [region], languages: [] } : undefined

    Promise.all([
      fetchMovies ? getDailyTrending(1) : Promise.resolve({ results: [] }),
      fetchMovies && region ? getTrendingMovies(1, regionFilter) : Promise.resolve({ results: [] }),
      fetchShows  ? getTrendingTVDaily(1) : Promise.resolve({ results: [] }),
      fetchShows  && region ? getRecommendedShows(1, regionFilter) : Promise.resolve({ results: [] }),
    ])
      .then(([globalMoviesResp, regionalMoviesResp, globalShowsResp, regionalShowsResp]) => {
        if (cancelled) return

        const globalMovies: HeroItem[] = (globalMoviesResp.results ?? [])
          .slice(0, 10).map(m => ({ ...m, mediaType: 'movie' as const }))
        const regionalMovies: HeroItem[] = (regionalMoviesResp.results ?? [])
          .slice(0, 10).map(m => ({ ...m, mediaType: 'movie' as const }))

        const globalShows: HeroItem[] = (globalShowsResp.results ?? [])
          .slice(0, 10).map(s => ({ ...s, mediaType: 'tv' as const }))
        const regionalShows: HeroItem[] = (regionalShowsResp.results ?? [])
          .slice(0, 10).map(s => ({ ...s, mediaType: 'tv' as const }))

        const movies = fetchMovies ? mergeWithRegionalPriority(globalMovies, regionalMovies) : []
        const shows  = fetchShows  ? mergeWithRegionalPriority(globalShows, regionalShows)   : []

        const merged = [...movies.slice(0, 5), ...shows.slice(0, 5)]
          .sort((a, b) => b.popularity - a.popularity)
          .slice(0, 10)

        setItems(merged)
      })
      .catch(() => { if (!cancelled) setItems([]) })
      .finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [contentType, region])

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
