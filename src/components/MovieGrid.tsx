import { MovieCard } from './MovieCard'
import { Movie } from '../types/tmdb'

interface MovieGridProps {
  movies: Movie[]
  loading?: boolean
  error?: string | null
  onRetry?: () => void
}

export const MovieGrid = ({ movies, loading, error, onRetry }: MovieGridProps) => {
  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400 mb-4">{error}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Retry
          </button>
        )}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="animate-pulse bg-gray-800 rounded-lg overflow-hidden">
            <div className="aspect-[2/3] bg-gray-700"></div>
            <div className="p-4 space-y-3">
              <div className="bg-gray-700 h-4 rounded w-3/4"></div>
              <div className="bg-gray-700 h-4 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (movies.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">No movies found.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  )
}