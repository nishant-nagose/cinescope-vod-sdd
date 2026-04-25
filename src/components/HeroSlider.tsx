import { useEffect, useRef, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { getImageUrl, getMovieVideos, getShowVideos } from '../services/tmdbApi'
import { TrailerPlayer } from './TrailerPlayer'
import { HeroItem } from '../hooks/useHeroSlider'

interface HeroSliderProps {
  items: HeroItem[]
  loading: boolean
}

const HeroSkeleton = () => (
  <div className="w-full aspect-video max-h-[85vh] min-h-[300px]">
    <div className="w-full h-full bg-gray-800 animate-pulse" />
  </div>
)

export const HeroSlider = ({ items, loading }: HeroSliderProps) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [currentVideoKey, setCurrentVideoKey] = useState<string | null>(null)
  const [muted, setMuted] = useState(true)
  const [isPaused, setIsPaused] = useState(false)
  const intervalRef       = useRef<ReturnType<typeof setInterval> | null>(null)
  const videoTimerRef     = useRef<ReturnType<typeof setTimeout> | null>(null)
  const trailerAdvanceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const videoCache        = useRef<Map<string, string | null>>(new Map())
  const heroRef           = useRef<HTMLDivElement>(null)
  const isHeroVisibleRef  = useRef(true)
  const activeIndexRef    = useRef(activeIndex)
  const itemsRef          = useRef(items)

  // Keep refs current so the IntersectionObserver callback always sees latest state
  activeIndexRef.current = activeIndex
  itemsRef.current = items

  const current = items[Math.min(activeIndex, Math.max(0, items.length - 1))]
  const isMovie = current?.mediaType === 'movie'
  // Trailers supported for both movies and TV shows
  const isTrailerPlaying = !!currentVideoKey

  // Reset to slide 0 when items change (filter/region changed)
  useEffect(() => {
    setActiveIndex(0)
    setCurrentVideoKey(null)
    if (videoTimerRef.current)     clearTimeout(videoTimerRef.current)
    if (trailerAdvanceRef.current) clearTimeout(trailerAdvanceRef.current)
  }, [items])

  // Pause trailer when hero scrolls out of view; resume from cache when it returns
  useEffect(() => {
    const el = heroRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        isHeroVisibleRef.current = entry.isIntersecting
        if (!entry.isIntersecting) {
          if (videoTimerRef.current) clearTimeout(videoTimerRef.current)
          if (trailerAdvanceRef.current) clearTimeout(trailerAdvanceRef.current)
          setCurrentVideoKey(null)
        } else {
          // Re-schedule from cache so the trailer picks back up
          const curItems = itemsRef.current
          const item = curItems[activeIndexRef.current]
          if (!item) return
          const cached = videoCache.current.get(`hero-${item.id}-${item.mediaType}`)
          if (cached) {
            videoTimerRef.current = setTimeout(() => {
              setCurrentVideoKey(cached)
              trailerAdvanceRef.current = setTimeout(() => {
                setCurrentVideoKey(null)
                setActiveIndex(prev => (prev + 1) % itemsRef.current.length)
              }, 150_000)
            }, 3000)
          }
        }
      },
      { threshold: 0.1 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  // 10s auto-advance — paused while trailer is playing or mouse is hovering
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (items.length === 0 || isPaused || isTrailerPlaying) return
    intervalRef.current = setInterval(() => {
      if (!isHeroVisibleRef.current) return
      setActiveIndex(prev => (prev + 1) % items.length)
    }, 10000)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [items.length, isPaused, isTrailerPlaying])

  // Fetch trailer for current slide (movie OR TV show) — show after 5s hold
  useEffect(() => {
    if (videoTimerRef.current)     clearTimeout(videoTimerRef.current)
    if (trailerAdvanceRef.current) clearTimeout(trailerAdvanceRef.current)
    setCurrentVideoKey(null)

    if (!items.length || activeIndex >= items.length) return
    const item = items[activeIndex]
    if (!item) return

    // Cache key includes media type so movie/show with same id don't collide
    const cacheKey = `hero-${item.id}-${item.mediaType}`

    const scheduleVideo = (key: string | null) => {
      if (!key) return
      videoTimerRef.current = setTimeout(() => {
        if (!isHeroVisibleRef.current) return
        setCurrentVideoKey(key)
        // Auto-advance after 2.5 min in case YouTube doesn't fire an end event
        trailerAdvanceRef.current = setTimeout(() => {
          setCurrentVideoKey(null)
          setActiveIndex(prev => (prev + 1) % items.length)
        }, 150_000)
      }, 5000)
    }

    if (videoCache.current.has(cacheKey)) {
      scheduleVideo(videoCache.current.get(cacheKey) ?? null)
      return
    }

    let cancelled = false
    const fetchVideos = item.mediaType === 'movie'
      ? getMovieVideos(item.id)
      : getShowVideos(item.id)

    fetchVideos
      .then(response => {
        const trailer = response.results.find(v => v.site === 'YouTube' && v.type === 'Trailer' && v.official)
          ?? response.results.find(v => v.site === 'YouTube' && v.type === 'Trailer')
          ?? response.results.find(v => v.site === 'YouTube' && v.type === 'Teaser' && v.official)
          ?? response.results.find(v => v.site === 'YouTube' && v.type === 'Teaser')
          ?? response.results.find(v => v.site === 'YouTube' && v.type === 'Clip')
        const key = trailer?.key ?? null
        videoCache.current.set(cacheKey, key)
        if (!cancelled) scheduleVideo(key)
      })
      .catch(() => { videoCache.current.set(cacheKey, null) })

    return () => {
      cancelled = true
      if (videoTimerRef.current)     clearTimeout(videoTimerRef.current)
      if (trailerAdvanceRef.current) clearTimeout(trailerAdvanceRef.current)
    }
  }, [activeIndex, items])

  const goTo = useCallback((index: number) => {
    if (videoTimerRef.current)     clearTimeout(videoTimerRef.current)
    if (trailerAdvanceRef.current) clearTimeout(trailerAdvanceRef.current)
    setCurrentVideoKey(null)
    setActiveIndex(index)
  }, [])

  const goPrev = useCallback(() => {
    goTo((activeIndex - 1 + items.length) % items.length)
  }, [activeIndex, goTo, items.length])

  const goNext = useCallback(() => {
    goTo((activeIndex + 1) % items.length)
  }, [activeIndex, goTo, items.length])

  if (loading) return <HeroSkeleton />
  if (!items.length || !current) return null

  const title = isMovie ? (current as any).title : (current as any).name
  const year = isMovie
    ? ((current as any).release_date ?? '').slice(0, 4)
    : ((current as any).first_air_date ?? '').slice(0, 4)
  const detailPath = isMovie ? `/movie/${current.id}` : `/show/${current.id}`
  const backdropUrl = getImageUrl(current.backdrop_path, 'original')

  return (
    <div
      ref={heroRef}
      className="relative w-full overflow-hidden bg-gray-900 aspect-video max-h-[85vh] min-h-[300px]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {isTrailerPlaying ? (
        <div className="absolute inset-0">
          <TrailerPlayer videoKey={currentVideoKey!} autoplay muted={muted} title={title} onEnded={goNext} />
        </div>
      ) : (
        backdropUrl && (
          <img
            src={backdropUrl}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover object-center"
            loading="eager"
            fetchPriority="high"
          />
        )
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/30 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-transparent to-transparent pointer-events-none" />

      {/* Content overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 md:p-12 pb-16 z-10">
        <div className="flex items-center gap-2 mb-2">
          <span className={`px-2 py-0.5 text-xs font-bold rounded uppercase tracking-wide ${isMovie ? 'bg-blue-600 text-white' : 'bg-purple-600 text-white'}`}>
            {isMovie ? 'Movie' : 'Show'}
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 drop-shadow-lg max-w-2xl line-clamp-2">
          {title}
        </h2>
        <div className="flex items-center gap-3 mb-4">
          {current.vote_average > 0 && (
            <span className="px-2 py-0.5 bg-yellow-500 text-black text-xs font-bold rounded">
              ★ {current.vote_average.toFixed(1)}
            </span>
          )}
          {year && <span className="text-gray-300 text-sm">{year}</span>}
        </div>
        <Link
          to={detailPath}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors text-sm sm:text-base"
        >
          View Details
        </Link>
      </div>

      {/* Mute toggle */}
      {isTrailerPlaying && (
        <button
          onClick={() => setMuted(m => !m)}
          className="absolute bottom-16 right-4 z-20 p-2 bg-black bg-opacity-60 rounded-full text-white hover:bg-opacity-80 transition-colors"
          aria-label={muted ? 'Unmute trailer' : 'Mute trailer'}
        >
          {muted ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M12 6v12M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          )}
        </button>
      )}

      {/* Prev / Next arrows */}
      <button
        onClick={goPrev}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-80 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
        aria-label="Previous slide"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={goNext}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-80 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
        aria-label="Next slide"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-2 rounded-full transition-all ${
              i === activeIndex ? 'bg-white w-6' : 'bg-white/50 w-2'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
