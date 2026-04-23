import { useState, useEffect, useCallback, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useContentFilter } from '../context/ContentFilterContext'
import { MovieGrid } from '../components/MovieGrid'
import { InfiniteScrollTrigger } from '../components/InfiniteScrollTrigger'
import { SearchBar } from '../components/SearchBar'
import { searchMovies } from '../services/tmdbApi'
import { Movie, SearchResponse } from '../types/tmdb'

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
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const { languages } = useContentFilter()
  const [sortBy, setSortBy] = useState<SortOption>('relevance')

  const [results, setResults] = useState<Movie[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const fetchingRef = useRef(0)

  const setQuery = useCallback((q: string) => {
    setSearchParams(q.length >= 3 ? { q } : {})
    setResults([])
    setPage(1)
    setHasMore(false)
    setError(null)
  }, [setSearchParams])

  useEffect(() => {
    setResults([])
    setPage(1)
    setHasMore(false)
    setError(null)
    fetchingRef.current = 0
  }, [query])

  useEffect(() => {
    if (query.length < 3) {
      setResults([])
      setLoading(false)
      return
    }
    if (fetchingRef.current === page && page > 1) return

    let cancelled = false
    fetchingRef.current = page
    setLoading(true)

    searchMovies(query, page)
      .then((data: SearchResponse) => {
        if (!cancelled) {
          setResults(prev => page === 1 ? data.results : [...prev, ...data.results])
          setHasMore(page < data.total_pages)
          setError(null)
        }
      })
      .catch(() => {
        if (!cancelled) setError('Something went wrong')
      })
      .finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [query, page])

  const fetchMore = useCallback(() => {
    if (!loading && hasMore) setPage(prev => prev + 1)
  }, [loading, hasMore])

  const languageFiltered = languages.length > 0
    ? results.filter(m => languages.includes(m.original_language))
    : results

  const sorted = sortMovies(languageFiltered, sortBy)

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
    if (!loading && !error && languageFiltered.length === 0 && !hasMore) {
      return (
        <p className="text-gray-400 text-center py-12 text-sm sm:text-base">
          No movies found for &ldquo;{query}&rdquo;.
        </p>
      )
    }
    return (
      <>
        <MovieGrid
          movies={sorted}
          loading={loading && results.length === 0}
          error={error}
          onRetry={() => setQuery(query)}
        />
        <InfiniteScrollTrigger
          onIntersect={fetchMore}
          hasMore={hasMore}
          loading={loading}
        />
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
