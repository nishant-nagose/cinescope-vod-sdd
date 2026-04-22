import { useState, useCallback, useEffect } from 'react'
import { useApi } from './useApi'
import { getTopRatedMovies } from '../services/tmdbApi'
import { useContentFilter } from '../context/ContentFilterContext'
import { DiscoverResponse } from '../types/tmdb'

export const useTopRatedMovies = (initialPage: number = 1) => {
  const { countries, languages, filterKey } = useContentFilter()
  const [currentPage, setCurrentPage] = useState(initialPage)

  useEffect(() => {
    setCurrentPage(1)
  }, [filterKey])

  const { data, loading, error, refetch } = useApi<DiscoverResponse>(
    () => getTopRatedMovies(currentPage, { countries, languages }),
    { cacheKey: `top-rated-${currentPage}-${filterKey}` }
  )

  const loadPage = useCallback((page: number) => {
    setCurrentPage(page)
  }, [])

  const nextPage = useCallback(() => {
    if (data && currentPage < data.total_pages) {
      setCurrentPage(prev => prev + 1)
    }
  }, [data, currentPage])

  const prevPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1)
    }
  }, [currentPage])

  return {
    movies: data?.results || [],
    currentPage,
    totalPages: data?.total_pages || 0,
    loading,
    error,
    loadPage,
    nextPage,
    prevPage,
    refetch
  }
}
