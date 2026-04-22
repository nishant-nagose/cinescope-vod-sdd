import { useRef, ReactNode } from 'react'
import { Movie } from '../types/tmdb'
import { MovieCard } from './MovieCard'

interface MovieCarouselProps {
  title: string
  titleExtra?: ReactNode
  movies: Movie[]
  loading?: boolean
  error?: string | null
  onRetry?: () => void
  emptyMessage?: string
}

const CarouselSkeleton = () => (
  <div className="flex flex-col gap-3 sm:gap-4">
    {[0, 1].map(row => (
      <div key={row} className="flex gap-3 sm:gap-4">
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
    ))}
  </div>
)

export const MovieCarousel = ({
  title,
  titleExtra,
  movies,
  loading,
  error,
  onRetry,
  emptyMessage = 'No movies available for this section.',
}: MovieCarouselProps) => {
  const scrollRef = useRef<HTMLDivElement>(null)

  const row1 = movies.slice(0, 10)
  const row2 = movies.slice(10, 20)

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
        <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-8 text-center">
          <p className="text-red-400 mb-3 text-sm sm:text-base">{error}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
            >
              Retry
            </button>
          )}
        </div>
      )}

      {!loading && !error && movies.length === 0 && (
        <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-8 text-center">
          <p className="text-gray-400 text-sm sm:text-base">
            {emptyMessage}
          </p>
        </div>
      )}

      {!loading && !error && movies.length > 0 && (
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
            style={{ scrollBehavior: 'smooth' }}
          >
            <div className="flex flex-col gap-3 sm:gap-4 w-max">
              <div className="flex gap-3 sm:gap-4">
                {row1.map(movie => (
                  <div
                    key={movie.id}
                    className="w-[150px] sm:w-[165px] md:w-[190px] lg:w-[210px] xl:w-[225px] flex-shrink-0"
                  >
                    <MovieCard movie={movie} />
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
}
