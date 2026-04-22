import { useParams, useNavigate } from 'react-router-dom'
import { useMovieDetails } from '../hooks/useMovieDetails'
import { MovieGrid } from '../components/MovieGrid'
import { CastSection } from '../components/CastSection'
import { RatingBadge } from '../components/RatingBadge'
import { getImageUrl } from '../services/tmdbApi'

const formatRuntime = (minutes: number): string => {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

const DetailSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-48 sm:h-64 md:h-80 bg-gray-700 w-full mb-6" />
    <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
      <div className="h-8 bg-gray-700 rounded w-1/2 mb-4" />
      <div className="h-4 bg-gray-700 rounded w-1/4 mb-6" />
      <div className="space-y-2">
        {[...Array(4)].map((_, i) => <div key={i} className="h-4 bg-gray-700 rounded" />)}
      </div>
    </div>
  </div>
)

export const MovieDetailPage = () => {
  const { id = '' } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { movie, cast, similar, loading, error } = useMovieDetails(id)

  if (loading) return <DetailSkeleton />

  if (error || !movie) {
    return (
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-xl font-bold text-white mb-2">Movie not found</h2>
        <p className="text-gray-400 mb-6">{error || "The movie you're looking for doesn't exist."}</p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded transition-colors"
        >
          Go Back
        </button>
      </div>
    )
  }

  const backdropUrl = getImageUrl(movie.backdrop_path, 'original')
  const posterUrl = getImageUrl(movie.poster_path, 'w500')

  return (
    <article>
      {/* Back button */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 pt-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors min-h-[44px]"
          aria-label="Go back"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
      </div>

      {/* Backdrop */}
      {backdropUrl && (
        <div className="relative h-48 sm:h-64 md:h-80 lg:h-96 overflow-hidden mt-2">
          <img
            src={backdropUrl}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">
        {/* Hero: poster + metadata */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 -mt-16 md:-mt-24 relative z-10">
          {posterUrl && (
            <div className="flex-shrink-0 self-start">
              <img
                src={posterUrl}
                alt={movie.title}
                className="w-32 sm:w-40 md:w-48 lg:w-56 rounded-lg shadow-xl"
              />
            </div>
          )}

          <div className="flex-1 pt-0 md:pt-16">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">{movie.title}</h1>

            <div className="flex flex-wrap items-center gap-3 mb-3 text-sm text-gray-400">
              {movie.release_date && <span>{movie.release_date.slice(0, 4)}</span>}
              {movie.runtime != null && movie.runtime > 0 && <span>{formatRuntime(movie.runtime)}</span>}
              {movie.vote_average > 0 && (
                <div className="flex items-center gap-2">
                  <RatingBadge rating={movie.vote_average} />
                  <span className="text-xs text-gray-500">({movie.vote_count?.toLocaleString()} votes)</span>
                </div>
              )}
            </div>

            {movie.genres?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {movie.genres.map((g) => (
                  <span key={g.id} className="px-2 py-1 bg-gray-700 text-xs text-gray-300 rounded-full">
                    {g.name}
                  </span>
                ))}
              </div>
            )}

            {movie.tagline && (
              <p className="text-gray-400 italic text-sm mb-3">{movie.tagline}</p>
            )}
          </div>
        </div>

        {/* Overview */}
        {movie.overview && (
          <section className="mt-6 sm:mt-8">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-2">Overview</h2>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">{movie.overview}</p>
          </section>
        )}

        {/* Cast */}
        <CastSection cast={cast} />

        {/* Similar Movies */}
        {similar.length > 0 && (
          <section className="mt-8 sm:mt-10">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-4">Similar Movies</h2>
            <MovieGrid movies={similar} loading={false} error={null} />
          </section>
        )}
      </div>
    </article>
  )
}
