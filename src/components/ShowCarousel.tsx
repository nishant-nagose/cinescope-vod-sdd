import { memo, useRef, useEffect, useLayoutEffect, ReactNode } from 'react'
import { TVShow } from '../types/tmdb'
import { ShowCard } from './ShowCard'

interface ShowCarouselProps {
  title: string
  titleExtra?: ReactNode
  shows: TVShow[]
  loading?: boolean
  error?: string | null
  onRetry?: () => void
  rankDisplay?: boolean
  singleRow?: boolean
  hasMore?: boolean
  onLoadMore?: () => void
}

const CarouselSkeleton = () => (
  <div className="flex gap-3 sm:gap-4">
    {Array.from({ length: 6 }).map((_, i) => (
      <div
        key={i}
        className="w-[150px] sm:w-[165px] md:w-[190px] lg:w-[210px] xl:w-[225px] flex-shrink-0"
      >
        <div className="aspect-[2/3] bg-gray-700 rounded-lg animate-pulse" />
        <div className="mt-2 h-3 bg-gray-700 rounded animate-pulse w-3/4" />
        <div className="mt-1.5 h-3 bg-gray-700 rounded animate-pulse w-1/2" />
      </div>
    ))}
  </div>
)

export const ShowCarousel = memo(({
  title,
  titleExtra,
  shows,
  loading,
  error,
  onRetry,
  singleRow = true,
  hasMore = false,
  onLoadMore,
}: ShowCarouselProps) => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const scrollLeftRef = useRef(0)

  useEffect(() => {
    const container = scrollRef.current
    if (!container) return
    const onScroll = () => { scrollLeftRef.current = container.scrollLeft }
    container.addEventListener('scroll', onScroll, { passive: true })
    return () => container.removeEventListener('scroll', onScroll)
  }, [])

  useLayoutEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollLeft = scrollLeftRef.current
  }, [shows])

  useEffect(() => {
    if (!onLoadMore || !hasMore || !sentinelRef.current) return
    const observer = new IntersectionObserver(
      entries => { if (entries[0].isIntersecting) onLoadMore() },
      { root: scrollRef.current, rootMargin: '0px 200px 0px 0px' }
    )
    observer.observe(sentinelRef.current)
    return () => observer.disconnect()
  }, [onLoadMore, hasMore])

  // Empty carousels are not rendered (FR-018)
  if (!loading && !error && shows.length === 0) return null

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return
    const amount = scrollRef.current.clientWidth * 0.75
    scrollRef.current.scrollBy({
      left: direction === 'right' ? amount : -amount,
      behavior: 'smooth',
    })
  }

  return (
    <section aria-label={title} className="mb-8 sm:mb-10 md:mb-12">
      <div className="flex items-center gap-3 flex-wrap px-3 sm:px-4 md:px-6 lg:px-8 mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-white">{title}</h2>
        {titleExtra}
      </div>

      {loading && (
        <div className="px-3 sm:px-4 md:px-6 lg:px-8">
          <CarouselSkeleton />
        </div>
      )}

      {error && (
        <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-4 text-center">
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded text-xs transition-colors"
            >
              Retry
            </button>
          )}
        </div>
      )}

      {!loading && !error && shows.length > 0 && (
        <div className="relative group">
          <button
            onClick={() => scroll('left')}
            className="hidden md:flex absolute left-1 top-1/2 -translate-y-1/2 z-10 items-center justify-center w-10 h-10 bg-black bg-opacity-70 hover:bg-opacity-90 text-white rounded-full transition-opacity opacity-0 group-hover:opacity-100 min-h-[44px] min-w-[44px]"
            aria-label="Scroll left"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div
            ref={scrollRef}
            className="overflow-x-auto px-3 sm:px-4 md:px-6 lg:px-8 pb-3 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-gray-800 [&::-webkit-scrollbar-thumb]:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full"
          >
            <div className={`${singleRow ? 'flex' : 'flex flex-col'} gap-3 sm:gap-4 w-max`}>
              <div className="flex gap-3 sm:gap-4">
                {shows.map(show => (
                  <div
                    key={show.id}
                    className="w-[150px] sm:w-[165px] md:w-[190px] lg:w-[210px] xl:w-[225px] flex-shrink-0"
                  >
                    <ShowCard show={show} />
                  </div>
                ))}
                {hasMore && <div ref={sentinelRef} className="w-1 flex-shrink-0" />}
              </div>
            </div>
          </div>

          <button
            onClick={() => scroll('right')}
            className="hidden md:flex absolute right-1 top-1/2 -translate-y-1/2 z-10 items-center justify-center w-10 h-10 bg-black bg-opacity-70 hover:bg-opacity-90 text-white rounded-full transition-opacity opacity-0 group-hover:opacity-100 min-h-[44px] min-w-[44px]"
            aria-label="Scroll right"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </section>
  )
})
