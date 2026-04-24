import { useState, useEffect, useCallback, useRef } from 'react'
import { ContentSearchItem } from '../types/tmdb'
import { searchMulti } from '../services/tmdbApi'

interface UseContentSearchResult {
  results: ContentSearchItem[]
  loading: boolean
  error: string | null
  hasMore: boolean
  fetchMore: () => void
}

export const useContentSearch = (query: string, page: number): UseContentSearchResult => {
  const [results, setResults] = useState<ContentSearchItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(false)
  const fetchingRef = useRef(0)
  const [currentPage, setCurrentPage] = useState(page)

  useEffect(() => {
    setResults([])
    setCurrentPage(1)
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
    if (fetchingRef.current === currentPage && currentPage > 1) return

    let cancelled = false
    fetchingRef.current = currentPage
    setLoading(true)

    searchMulti(query, currentPage)
      .then(data => {
        if (!cancelled) {
          const filtered = data.results.filter(
            (r): r is ContentSearchItem => r.media_type === 'movie' || r.media_type === 'tv'
          )
          setResults(prev => currentPage === 1 ? filtered : [...prev, ...filtered])
          setHasMore(currentPage < data.total_pages)
          setError(null)
        }
      })
      .catch(() => {
        if (!cancelled) setError('Something went wrong')
      })
      .finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [query, currentPage])

  const fetchMore = useCallback(() => {
    if (!loading && hasMore) setCurrentPage(prev => prev + 1)
  }, [loading, hasMore])

  return { results, loading, error, hasMore, fetchMore }
}
