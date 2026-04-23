import { useState, useEffect, useCallback, useRef } from 'react'
import { useContentFilter } from '../context/ContentFilterContext'
import { Movie, DiscoverResponse, ContentFilterParams } from '../types/tmdb'

interface UseInfiniteMoviesResult {
  movies: Movie[]
  loading: boolean
  error: string | null
  hasMore: boolean
  fetchMore: () => void
  refetch: () => void
}

export const useInfiniteMovies = (
  fetcher: (page: number, filter: ContentFilterParams) => Promise<DiscoverResponse>,
  options: { cacheKeyPrefix: string }
): UseInfiniteMoviesResult => {
  const { countries, languages, filterKey } = useContentFilter()
  const [movies, setMovies] = useState<Movie[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fetchingPage = useRef(0)

  useEffect(() => {
    setMovies([])
    setPage(1)
    setHasMore(true)
    setError(null)
    fetchingPage.current = 0
  }, [filterKey])

  useEffect(() => {
    if (fetchingPage.current === page) return
    fetchingPage.current = page
    let cancelled = false

    const load = async () => {
      setLoading(true)
      try {
        const data = await fetcher(page, { countries, languages })
        if (!cancelled) {
          setMovies(prev => page === 1 ? data.results : [...prev, ...data.results])
          setHasMore(page < data.total_pages)
          setError(null)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load movies')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [page, filterKey, fetcher, countries, languages])

  const fetchMore = useCallback(() => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1)
    }
  }, [loading, hasMore])

  const refetch = useCallback(() => {
    setMovies([])
    setPage(1)
    setHasMore(true)
    fetchingPage.current = 0
  }, [])

  return { movies, loading, error, hasMore, fetchMore, refetch }
}
