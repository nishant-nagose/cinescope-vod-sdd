import { useState, useEffect, useRef, useMemo } from 'react'
import { useContentFilter } from '../context/ContentFilterContext'
import { HeroSlider } from '../components/HeroSlider'
import { LazySection } from '../components/LazySection'
import { DynamicCarousel } from '../components/DynamicCarousel'
import { CAROUSEL_POOL, buildGenrePool } from '../config/carouselPool'
import { GENRE_KEY_MAP } from '../utils/genreKeyMap'
import { useHeroSlider } from '../hooks/useHeroSlider'

const INITIAL_VISIBLE = 8
const LOAD_BATCH = 6

export const HomePage = () => {
  const heroSlider = useHeroSlider()
  const { contentType, activeCategory } = useContentFilter()
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE)
  const sentinelRef = useRef<HTMLDivElement>(null)

  const activeGenreKey = activeCategory !== null ? (GENRE_KEY_MAP[activeCategory] ?? null) : null

  // When a genre is active, generate a rich multi-angle pool for that genre.
  // Otherwise, filter the global pool by content type only.
  const activePool = useMemo(() => {
    if (activeGenreKey !== null) {
      return buildGenrePool(activeGenreKey, contentType)
    }
    return CAROUSEL_POOL.filter(config =>
      (config.type === 'movies' && (contentType === 'movies' || contentType === 'all')) ||
      (config.type === 'shows'  && (contentType === 'shows'  || contentType === 'all'))
    )
  }, [activeGenreKey, contentType])

  const visiblePool = activePool.slice(0, visibleCount)
  const hasMoreCarousels = visibleCount < activePool.length

  // Reset visible count whenever the filter selection changes
  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE)
  }, [contentType, activeCategory])

  // Load more carousels when the page-bottom sentinel enters the viewport
  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel || !hasMoreCarousels) return

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setVisibleCount(n => Math.min(n + LOAD_BATCH, activePool.length))
        }
      },
      { rootMargin: '600px' }
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasMoreCarousels, activePool.length])

  return (
    <div>
      <HeroSlider items={heroSlider.items} loading={heroSlider.loading} />

      <div className="py-4 sm:py-6">
        {visiblePool.map(config => (
          <LazySection key={config.id}>
            <DynamicCarousel config={config} />
          </LazySection>
        ))}

        {/* Sentinel: triggers loading the next batch of carousels */}
        {hasMoreCarousels && (
          <div ref={sentinelRef} className="h-4" />
        )}
      </div>
    </div>
  )
}
