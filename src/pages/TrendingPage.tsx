import { useInfiniteMovies } from '../hooks/useInfiniteMovies'
import { getTrendingMovies } from '../services/tmdbApi'
import { MovieGrid } from '../components/MovieGrid'
import { InfiniteScrollTrigger } from '../components/InfiniteScrollTrigger'

export const TrendingPage = () => {
  const { movies, loading, error, hasMore, fetchMore, refetch } = useInfiniteMovies(
    getTrendingMovies,
    { cacheKeyPrefix: 'trending-infinite' }
  )

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2">Trending Movies</h1>
        <p className="text-xs sm:text-sm md:text-base text-gray-400">Discover the most popular movies this week</p>
      </div>

      <MovieGrid
        movies={movies}
        loading={loading && movies.length === 0}
        error={error}
        onRetry={refetch}
      />

      <InfiniteScrollTrigger
        onIntersect={fetchMore}
        hasMore={hasMore}
        loading={loading}
      />
    </div>
  )
}
