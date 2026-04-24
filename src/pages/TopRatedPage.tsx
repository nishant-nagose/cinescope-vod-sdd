import { useInfiniteMovies } from '../hooks/useInfiniteMovies'
import { useInfiniteShows } from '../hooks/useInfiniteShows'
import { getTopRatedMovies, getTopRatedTV } from '../services/tmdbApi'
import { MovieGrid } from '../components/MovieGrid'
import { ShowGrid } from '../components/ShowGrid'
import { InfiniteScrollTrigger } from '../components/InfiniteScrollTrigger'
import { useContentFilter } from '../context/ContentFilterContext'

export const TopRatedPage = () => {
  const { contentType } = useContentFilter()

  const movieData = useInfiniteMovies(
    getTopRatedMovies,
    { cacheKeyPrefix: 'top-rated-page-movies' }
  )
  const showData = useInfiniteShows(
    (page, filter) => getTopRatedTV(page, filter),
    { cacheKeyPrefix: 'top-rated-page-shows' }
  )

  const showingShows  = contentType === 'shows'
  const showingMovies = contentType !== 'shows'
  const showingBoth   = contentType === 'all'

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2">
          Top Rated {showingBoth ? 'Movies & Shows' : showingShows ? 'Shows' : 'Movies'}
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-gray-400">
          The highest-rated {showingBoth ? 'content' : showingShows ? 'shows' : 'movies'} of all time
        </p>
      </div>

      {showingMovies && (
        <>
          {showingBoth && (
            <h2 className="text-lg font-semibold text-white mb-4">Movies</h2>
          )}
          <MovieGrid
            movies={movieData.movies}
            loading={movieData.loading && movieData.movies.length === 0}
            error={movieData.error}
            onRetry={movieData.refetch}
          />
          <InfiniteScrollTrigger
            onIntersect={movieData.fetchMore}
            hasMore={movieData.hasMore}
            loading={movieData.loading}
          />
        </>
      )}

      {showingShows && (
        <>
          {showingBoth && (
            <h2 className="text-lg font-semibold text-white mb-4 mt-8">Shows</h2>
          )}
          <ShowGrid
            shows={showData.shows}
            loading={showData.loading && showData.shows.length === 0}
            error={showData.error}
            onRetry={showData.refetch}
          />
          <InfiniteScrollTrigger
            onIntersect={showData.loadMore}
            hasMore={showData.hasMore}
            loading={showData.loading}
          />
        </>
      )}
    </div>
  )
}
