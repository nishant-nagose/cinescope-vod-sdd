import { useState } from 'react'
import { useMovieSearch } from '../hooks/useMovieSearch'
import { MovieGrid } from '../components/MovieGrid'
import { PaginationControls } from '../components/PaginationControls'
import { SearchBar } from '../components/SearchBar'
import { Movie } from '../types/tmdb'

type SortOption = 'relevance' | 'rating' | 'release_date'

const SORT_LABELS: Record<SortOption, string> = {
  relevance: 'Relevance',
  rating: 'Rating',
  release_date: 'Release Date',
}

const sortMovies = (movies: Movie[], sort: SortOption): Movie[] => {
  if (sort === 'relevance') return movies
  return [...movies].sort((a, b) => {
    if (sort === 'rating') return b.vote_average - a.vote_average
    return new Date(b.release_date).getTime() - new Date(a.release_date).getTime()
  })
}

export const SearchPage = () => {
  const { results, loading, error, query, page, totalPages, setQuery, setPage } =
    useMovieSearch()
  const [sortBy, setSortBy] = useState<SortOption>('relevance')

  const sortedResults = sortMovies(results, sortBy)

  const renderContent = () => {
    if (!query) {
      return (
        <p className="text-gray-400 text-center py-12 text-sm sm:text-base">
          Enter a movie title to start searching.
        </p>
      )
    }
    if (query.length < 3) {
      return (
        <p className="text-gray-400 text-center py-12 text-sm sm:text-base">
          Type at least 3 characters to search.
        </p>
      )
    }
    if (!loading && !error && results.length === 0) {
      return (
        <p className="text-gray-400 text-center py-12 text-sm sm:text-base">
          No movies found for &ldquo;{query}&rdquo;.
        </p>
      )
    }
    return (
      <>
        <MovieGrid
          movies={sortedResults}
          loading={loading}
          error={error}
          onRetry={() => setQuery(query)}
        />
        {totalPages > 1 && (
          <PaginationControls
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            loading={loading}
          />
        )}
      </>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4">
          Search Movies
        </h1>
        <SearchBar onSearch={setQuery} className="max-w-xl" />
        {query.length > 0 && query.length < 3 && (
          <p className="mt-2 text-xs sm:text-sm text-gray-500">
            {3 - query.length} more character{3 - query.length !== 1 ? 's' : ''} needed
          </p>
        )}
      </div>

      {query.length >= 3 && !loading && !error && results.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-4 sm:mb-6">
          <span className="text-sm text-gray-400">Sort by:</span>
          {(Object.keys(SORT_LABELS) as SortOption[]).map((opt) => (
            <button
              key={opt}
              onClick={() => setSortBy(opt)}
              className={`px-3 py-1.5 rounded text-sm transition-colors ${
                sortBy === opt
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {SORT_LABELS[opt]}
            </button>
          ))}
        </div>
      )}

      {renderContent()}
    </div>
  )
}
