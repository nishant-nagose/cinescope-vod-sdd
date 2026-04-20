import { useTrendingMovies } from '../hooks/useTrendingMovies'
import { MovieGrid } from '../components/MovieGrid'

export const TrendingPage = () => {
  const { data, loading, error, refetch } = useTrendingMovies()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Trending Movies</h1>
        <p className="text-gray-400">Discover the most popular movies this week</p>
      </div>

      <MovieGrid
        movies={data?.results || []}
        loading={loading}
        error={error}
        onRetry={refetch}
      />
    </div>
  )
}