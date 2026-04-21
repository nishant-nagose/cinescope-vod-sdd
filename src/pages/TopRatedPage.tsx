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
    <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2">Top Rated Movies</h1>
        <p className="text-xs sm:text-sm md:text-base text-gray-400">Discover the highest-rated movies of all time</p>
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