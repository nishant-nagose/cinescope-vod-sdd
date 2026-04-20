import { useState, useCallback } from 'react'
import { useApi } from './useApi'
import { getTopRatedMovies } from '../services/tmdbApi'
import { TopRatedResponse } from '../types/tmdb'

export const useTopRatedMovies = (initialPage: number = 1) => {
  const [currentPage, setCurrentPage] = useState(initialPage)

  const { data, loading, error, refetch } = useApi<TopRatedResponse>(
    () => getTopRatedMovies(currentPage),
    { cacheKey: `top-rated-movies-${currentPage}` }
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