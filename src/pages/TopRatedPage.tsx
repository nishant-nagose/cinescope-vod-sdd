import { useTopRatedMovies } from '../hooks/useTopRatedMovies'
import { MovieGrid } from '../components/MovieGrid'
import { PaginationControls } from '../components/PaginationControls'

export const TopRatedPage = () => {
  const {
    movies,
    currentPage,
    totalPages,
    loading,
    error,
    loadPage,
    refetch
  } = useTopRatedMovies()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Top Rated Movies</h1>
        <p className="text-gray-400">Discover the highest-rated movies of all time</p>
      </div>

      <MovieGrid
        movies={movies}
        loading={loading}
        error={error}
        onRetry={refetch}
      />

      {totalPages > 1 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={loadPage}
          loading={loading}
        />
      )}
    </div>
  )
}