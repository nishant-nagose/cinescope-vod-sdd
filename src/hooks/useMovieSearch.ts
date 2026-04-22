import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { searchMovies } from '../services/tmdbApi'
import { Movie, SearchResponse } from '../types/tmdb'

interface UseMovieSearchResult {
  results: Movie[]
  loading: boolean
  error: string | null
  query: string
  page: number
  totalPages: number
  setQuery: (q: string) => void
  setPage: (p: number) => void
}

export const useMovieSearch = (): UseMovieSearchResult => {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const page = parseInt(searchParams.get('page') || '1', 10)

  const [results, setResults] = useState<Movie[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [totalPages, setTotalPages] = useState(0)

  useEffect(() => {
    if (query.length < 3) {
      setResults([])
      setTotalPages(0)
      setError(null)
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)

    searchMovies(query, page)
      .then((data: SearchResponse) => {
        if (!cancelled) {
          setResults(data.results)
          setTotalPages(data.total_pages)
          setLoading(false)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError('Something went wrong')
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [query, page])

  const setQuery = useCallback(
    (q: string) => {
      setSearchParams(q.length >= 3 ? { q, page: '1' } : {})
    },
    [setSearchParams]
  )

  const setPage = useCallback(
    (p: number) => {
      setSearchParams((prev) => {
        const params = new URLSearchParams(prev)
        params.set('page', p.toString())
        return params
      })
    },
    [setSearchParams]
  )

  return { results, loading, error, query, page, totalPages, setQuery, setPage }
}
