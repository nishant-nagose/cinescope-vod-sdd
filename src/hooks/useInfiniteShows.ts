import { useState, useEffect, useCallback, useRef } from 'react'
import { useContentFilter } from '../context/ContentFilterContext'
import { TVShow, TVShowListResponse, ContentFilterParams } from '../types/tmdb'

interface UseInfiniteShowsResult {
  shows: TVShow[]
  loading: boolean
  error: string | null
  hasMore: boolean
  loadMore: () => void
  refetch: () => void
}

export const useInfiniteShows = (
  fetcher: (page: number, filter: ContentFilterParams) => Promise<TVShowListResponse>,
  _options?: { cacheKeyPrefix: string }
): UseInfiniteShowsResult => {
  const { countries, languages, filterKey } = useContentFilter()
  const [shows, setShows] = useState<TVShow[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fetchingPage = useRef(0)
  const fetcherRef = useRef(fetcher)
  fetcherRef.current = fetcher

  useEffect(() => {
    setShows([])
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
        const data = await fetcherRef.current(page, { countries, languages })
        if (!cancelled) {
          setShows(prev => page === 1 ? data.results : [...prev, ...data.results])
          setHasMore(page < data.total_pages)
          setError(null)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load shows')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [page, filterKey, countries, languages])

  const loadMore = useCallback(() => {
    if (!loading && hasMore) setPage(prev => prev + 1)
  }, [loading, hasMore])

  const refetch = useCallback(() => {
    setShows([])
    setPage(1)
    setHasMore(true)
    fetchingPage.current = 0
  }, [])

  return { shows, loading, error, hasMore, loadMore, refetch }
}
