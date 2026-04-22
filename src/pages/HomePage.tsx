import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MovieCarousel } from '../components/MovieCarousel'
import { CategoryDropdown } from '../components/CategoryDropdown'
import { useTrendingMovies } from '../hooks/useTrendingMovies'
import { useTopRatedMovies } from '../hooks/useTopRatedMovies'
import { useGenres } from '../hooks/useGenres'
import { useMoviesByGenre } from '../hooks/useMoviesByGenre'
import { useNewReleases } from '../hooks/useNewReleases'
import { useCriticallyAcclaimed } from '../hooks/useCriticallyAcclaimed'

const ACTION_GENRE_ID = 28

export const HomePage = () => {
  const [selectedGenreId, setSelectedGenreId] = useState(ACTION_GENRE_ID)

  const trending = useTrendingMovies()
  const topRated = useTopRatedMovies()
  const genres = useGenres()
  const byGenre = useMoviesByGenre(selectedGenreId)
  const newReleases = useNewReleases()
  const acclaimed = useCriticallyAcclaimed()

  return (
    <div className="py-4 sm:py-6 md:py-8">
      <div className="px-3 sm:px-4 md:px-6 lg:px-8 mb-8 sm:mb-10 md:mb-12">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
          Welcome to CineScope
        </h1>
        <p className="text-gray-400 text-sm sm:text-base">
          Discover trending, top-rated and new movies.{' '}
          <Link to="/trending" className="text-blue-400 hover:text-blue-300 transition-colors">
            Browse all trending →
          </Link>
        </p>
      </div>

      <MovieCarousel
        title="Top & Latest Movies"
        movies={trending.data?.results ?? []}
        loading={trending.loading}
        error={trending.error}
        onRetry={trending.refetch}
      />

      <MovieCarousel
        title="Top 10 Movies Today"
        movies={(topRated.movies ?? []).slice(0, 20)}
        loading={topRated.loading}
        error={topRated.error}
        onRetry={topRated.refetch}
      />

      <MovieCarousel
        title="Movies by Category"
        titleExtra={
          genres.data ? (
            <CategoryDropdown
              genres={genres.data.genres}
              selectedGenreId={selectedGenreId}
              onChange={setSelectedGenreId}
            />
          ) : undefined
        }
        movies={byGenre.data?.results ?? []}
        loading={byGenre.loading || genres.loading}
        error={byGenre.error}
        onRetry={byGenre.refetch}
      />

      <MovieCarousel
        title="New on CineScope"
        movies={newReleases.data?.results ?? []}
        loading={newReleases.loading}
        error={newReleases.error}
        onRetry={newReleases.refetch}
      />

      <MovieCarousel
        title="Critically Acclaimed"
        movies={acclaimed.data?.results ?? []}
        loading={acclaimed.loading}
        error={acclaimed.error}
        onRetry={acclaimed.refetch}
      />

      <div className="px-3 sm:px-4 md:px-6 lg:px-8 mt-4 text-center space-x-4">
        <Link
          to="/trending"
          className="inline-block text-blue-400 hover:text-blue-300 text-sm transition-colors"
        >
          All Trending →
        </Link>
        <Link
          to="/top-rated"
          className="inline-block text-blue-400 hover:text-blue-300 text-sm transition-colors"
        >
          All Top Rated →
        </Link>
        <Link
          to="/search"
          className="inline-block text-blue-400 hover:text-blue-300 text-sm transition-colors"
        >
          Search Movies →
        </Link>
      </div>
    </div>
  )
}
