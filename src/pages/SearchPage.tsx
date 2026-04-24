import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useSearchParams } from 'react-router-dom'
import { InfiniteScrollTrigger } from '../components/InfiniteScrollTrigger'
import { SearchBar } from '../components/SearchBar'
import { useContentSearch } from '../hooks/useContentSearch'
import { ContentSearchItem } from '../types/tmdb'
import { getImageUrl } from '../services/tmdbApi'

type SortOption = 'relevance' | 'rating' | 'date'

const SORT_LABELS: Record<SortOption, string> = {
  relevance: 'Relevance',
  rating: 'Rating',
  date: 'Release Date',
}

const sortResults = (items: ContentSearchItem[], sort: SortOption): ContentSearchItem[] => {
  if (sort === 'relevance') return items
  return [...items].sort((a, b) => {
    if (sort === 'rating') return b.vote_average - a.vote_average
    const dateA = a.media_type === 'movie' ? a.release_date : a.first_air_date
    const dateB = b.media_type === 'movie' ? b.release_date : b.first_air_date
    return new Date(dateB ?? '').getTime() - new Date(dateA ?? '').getTime()
  })
}

const SearchResultCard = ({ item }: { item: ContentSearchItem }) => {
  const isMovie = item.media_type === 'movie'
  const title = isMovie ? item.title : item.name
  const date = isMovie ? item.release_date : item.first_air_date
  const year = date ? new Date(date).getFullYear() : 'TBA'
  const posterUrl = getImageUrl(item.poster_path, 'w342')
  const href = `/${isMovie ? 'movie' : 'show'}/${item.id}`

  return (
    <Link
      to={href}
      className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 block"
    >
      <div className="aspect-[2/3] relative">
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gray-700 flex items-center justify-center">
            <span className="text-gray-400 text-sm">No Image</span>
          </div>
        )}
        <div className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-black bg-opacity-75 text-white px-1.5 py-0.5 rounded text-xs font-medium">
          {item.vote_average.toFixed(1)}
        </div>
        <div
          className={`absolute top-1 left-1 sm:top-2 sm:left-2 px-1.5 py-0.5 rounded text-xs font-bold uppercase ${
            isMovie ? 'bg-blue-600 text-white' : 'bg-purple-600 text-white'
          }`}
        >
          {isMovie ? 'Movie' : 'Show'}
        </div>
      </div>
      <div className="p-2 sm:p-3">
        <h3 className="font-semibold text-white mb-1 line-clamp-2 text-xs sm:text-sm">{title}</h3>
        <p className="text-gray-400 text-xs sm:text-sm">{year}</p>
      </div>
    </Link>
  )
}

export const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const [sortBy, setSortBy] = useState<SortOption>('relevance')
  const [page] = useState(1)

  const { results, loading, error, hasMore, fetchMore } = useContentSearch(query, page)

  const setQuery = useCallback((q: string) => {
    setSearchParams(q.length >= 3 ? { q } : {})
    setSortBy('relevance')
  }, [setSearchParams])

  const sorted = sortResults(results, sortBy)

  const renderContent = () => {
    if (!query) {
      return (
        <p className="text-gray-400 text-center py-12 text-sm sm:text-base">
          Enter a title to start searching.
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
    if (error) {
      return (
        <div className="text-center py-8">
          <p className="text-red-400 mb-4 text-sm">{error}</p>
          <button
            onClick={() => setQuery(query)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
          >
            Retry
          </button>
        </div>
      )
    }
    if (!loading && results.length === 0) {
      return (
        <p className="text-gray-400 text-center py-12 text-sm sm:text-base">
          No results found for &ldquo;{query}&rdquo;.
        </p>
      )
    }
    return (
      <>
        {loading && results.length === 0 ? (
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
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
            {sorted.map(item => (
              <SearchResultCard key={`${item.media_type}-${item.id}`} item={item} />
            ))}
          </div>
        )}
        <InfiniteScrollTrigger onIntersect={fetchMore} hasMore={hasMore} loading={loading} />
      </>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4">
          Search
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
