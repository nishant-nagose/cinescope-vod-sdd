import { memo, useRef, useEffect, useLayoutEffect, ReactNode } from 'react'
import { Movie } from '../types/tmdb'
import { MovieCard } from './MovieCard'
import { RankedMovieCard } from './RankedMovieCard'

interface MovieCarouselProps {
  title: string
  titleExtra?: ReactNode
  movies: Movie[]
  loading?: boolean
  error?: string | null
  onRetry?: () => void
  emptyMessage?: string
  rankDisplay?: boolean
  maxItems?: number
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

export const MovieCarousel = memo(({
  title,
  titleExtra,
  movies,
  loading,
  error,
  onRetry,
  emptyMessage: _emptyMessage = 'No movies available for this section.',
  rankDisplay = false,
  maxItems,
  singleRow = false,
  hasMore = false,
  onLoadMore,
}: MovieCarouselProps) => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const scrollLeftRef = useRef(0)
  const prevMoviesLengthRef = useRef(0)
  const loadingRef = useRef(loading ?? false)
  loadingRef.current = loading ?? false

  useEffect(() => {
    const container = scrollRef.current
    if (!container) return
    const onScroll = () => { scrollLeftRef.current = container.scrollLeft }
    container.addEventListener('scroll', onScroll, { passive: true })
    return () => container.removeEventListener('scroll', onScroll)
  }, [])

  useLayoutEffect(() => {
    if (!scrollRef.current) return
    const prevLength = prevMoviesLengthRef.current
    prevMoviesLengthRef.current = movies.length
    if (movies.length > prevLength && prevLength > 0) {
      // More items appended — hold user's scroll position
      scrollRef.current.scrollLeft = scrollLeftRef.current
    } else if (movies.length < prevLength || prevLength === 0) {
      // Filter reset or initial load — start from beginning
      scrollRef.current.scrollLeft = 0
      scrollLeftRef.current = 0
    }
    // movies.length === prevLength → same data re-render, do nothing
  }, [movies])

  useEffect(() => {
    if (!onLoadMore || !hasMore || !sentinelRef.current) return
    const observer = new IntersectionObserver(
      entries => { if (entries[0].isIntersecting && !loadingRef.current) onLoadMore() },
      { root: scrollRef.current, rootMargin: '0px 200px 0px 0px', threshold: 0 }
    )
    observer.observe(sentinelRef.current)
    return () => observer.disconnect()
  }, [onLoadMore, hasMore])

  const displayMovies = maxItems != null ? movies.slice(0, maxItems) : movies
  const row1 = (singleRow || rankDisplay) ? displayMovies : displayMovies.slice(0, 10)
  const row2 = (singleRow || rankDisplay) ? [] : displayMovies.slice(10, 20)

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return
    const amount = scrollRef.current.clientWidth * 0.75
    scrollRef.current.scrollBy({
      left: direction === 'right' ? amount : -amount,
      behavior: 'smooth',
    })
  }

  // Empty carousels are not rendered (FR-018)
  if (!loading && !error && movies.length === 0) return null

  return (
    <section aria-label={title} className="mb-8 sm:mb-10 md:mb-12">
      <div className="flex items-center gap-3 flex-wrap px-3 sm:px-4 md:px-6 lg:px-8 mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-white">{title}</h2>
        {titleExtra}
      </div>

      {loading && movies.length === 0 && (
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

      {!error && movies.length > 0 && (
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
                {row1.map((movie, i) => (
                  <div
                    key={movie.id}
                    className="w-[150px] sm:w-[165px] md:w-[190px] lg:w-[210px] xl:w-[225px] flex-shrink-0"
                  >
                    {rankDisplay ? (
                      <RankedMovieCard movie={movie} rank={i + 1} />
                    ) : (
                      <MovieCard movie={movie} />
                    )}
                  </div>
                ))}
                {hasMore && <div ref={sentinelRef} className="w-1 flex-shrink-0" />}
                {loading && Array.from({ length: 4 }).map((_, i) => (
                  <div key={`skel-${i}`} className="w-[150px] sm:w-[165px] md:w-[190px] lg:w-[210px] xl:w-[225px] flex-shrink-0">
                    <div className="aspect-[2/3] bg-gray-700 rounded-lg animate-pulse" />
                    <div className="mt-2 h-3 bg-gray-700 rounded animate-pulse w-3/4" />
                    <div className="mt-1.5 h-3 bg-gray-700 rounded animate-pulse w-1/2" />
                  </div>
                ))}
              </div>
              {row2.length > 0 && (
                <div className="flex gap-3 sm:gap-4">
                  {row2.map(movie => (
                    <div
                      key={movie.id}
                      className="w-[150px] sm:w-[165px] md:w-[190px] lg:w-[210px] xl:w-[225px] flex-shrink-0"
                    >
                      <MovieCard movie={movie} />
                    </div>
                  ))}
                </div>
              )}
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
