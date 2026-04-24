import { ShowCard } from './ShowCard'
import { TVShow } from '../types/tmdb'

interface ShowGridProps {
  shows: TVShow[]
  loading?: boolean
  error?: string | null
  onRetry?: () => void
}

export const ShowGrid = ({ shows, loading, error, onRetry }: ShowGridProps) => {
  if (error) {
    return (
      <div className="text-center py-8 sm:py-12">
        <p className="text-red-400 mb-4 text-sm sm:text-base">{error}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm sm:text-base"
          >
            Retry
          </button>
        )}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="animate-pulse bg-gray-800 rounded-lg overflow-hidden">
            <div className="aspect-[2/3] bg-gray-700" />
            <div className="p-2 sm:p-3 space-y-2">
              <div className="bg-gray-700 h-3 rounded w-3/4" />
              <div className="bg-gray-700 h-3 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (shows.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12">
        <p className="text-gray-400 text-sm sm:text-base">No shows found.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
      {shows.map(show => (
        <ShowCard key={show.id} show={show} />
      ))}
    </div>
  )
}
