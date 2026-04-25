import { useState, useEffect, useRef, useMemo } from 'react'
import { useContentFilter } from '../context/ContentFilterContext'
import { HeroSlider } from '../components/HeroSlider'
import { LazySection } from '../components/LazySection'
import { DynamicCarousel } from '../components/DynamicCarousel'
import { CAROUSEL_POOL, buildGenrePool, buildRegionalPool, buildLanguagePool } from '../config/carouselPool'
import { GENRE_KEY_MAP } from '../utils/genreKeyMap'
import { useHeroSlider } from '../hooks/useHeroSlider'

const INITIAL_VISIBLE = 8
const LOAD_BATCH = 6

export const HomePage = () => {
  const heroSlider = useHeroSlider()
  const { contentType, activeCategory, region } = useContentFilter()
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE)
  const sentinelRef = useRef<HTMLDivElement>(null)

  const activeGenreKey = activeCategory !== null ? (GENRE_KEY_MAP[activeCategory] ?? null) : null

  // Genre active → rich multi-angle genre pool.
  // Region active → regional carousels first, then global pool.
  // Default → global pool filtered by content type.
  const activePool = useMemo(() => {
    if (activeGenreKey !== null) {
      return buildGenrePool(activeGenreKey, contentType)
    }

    const globalPool = CAROUSEL_POOL.filter(config =>
      (config.type === 'movies' && (contentType === 'movies' || contentType === 'all')) ||
      (config.type === 'shows'  && (contentType === 'shows'  || contentType === 'all'))
    )

    const langPool = buildLanguagePool(region, contentType)

    if (region) {
      const regionalPool = buildRegionalPool(region, contentType)
      if (!langPool.length) return [...regionalPool, ...globalPool]
      // Prominent local languages immediately after regional block,
      // remaining languages woven in after first wave of global content
      const mid = Math.ceil(langPool.length / 2)
      return [
        ...regionalPool,
        ...langPool.slice(0, mid),
        ...globalPool.slice(0, 10),
        ...langPool.slice(mid),
        ...globalPool.slice(10),
      ]
    }

    if (!langPool.length) return globalPool

    // Global: weave language spotlights at natural breaks — not dumped at the top
    // Slice 0-7: Featured (new releases, trending, blockbusters, fan-favs)
    // Then: language spotlight → genre movies → language spotlight → genre shows+quality → language tail → rest
    const third = Math.ceil(langPool.length / 3)
    return [
      ...globalPool.slice(0, 8),
      ...langPool.slice(0, third),
      ...globalPool.slice(8, 18),
      ...langPool.slice(third, 2 * third),
      ...globalPool.slice(18, 30),
      ...langPool.slice(2 * third),
      ...globalPool.slice(30),
    ]
  }, [activeGenreKey, contentType, region])

  const visiblePool = activePool.slice(0, visibleCount)
  const hasMoreCarousels = visibleCount < activePool.length

  // Reset visible count whenever the filter selection changes
  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE)
  }, [contentType, activeCategory, region])

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
