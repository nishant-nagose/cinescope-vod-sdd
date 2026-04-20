/// <reference types="vite/client" />

import type { Movie } from '../types/tmdb'

const TMDB_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.themoviedb.org/3'
const TMDB_IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p'

export const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY

if (!TMDB_API_KEY) {
  throw new Error('VITE_TMDB_API_KEY is not defined')
}

export type { Movie }

export const getImageUrl = (path: string | null, size: string = 'w500'): string | null => {
  if (!path) return null
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`
}

const apiRequest = async (endpoint: string, params: Record<string, string> = {}) => {
  const url = new URL(`${TMDB_BASE_URL}${endpoint}`)
  url.searchParams.set('api_key', TMDB_API_KEY)

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value)
  })

  const response = await fetch(url.toString())

  if (!response.ok) {
    throw new Error(`TMDB API error: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

export const getTrendingMovies = async (page: number = 1) => {
  return apiRequest('/trending/movie/week', { page: page.toString() })
}

export const getTopRatedMovies = async (page: number = 1) => {
  return apiRequest('/movie/top_rated', { page: page.toString() })
}

export const searchMovies = async (query: string, page: number = 1) => {
  return apiRequest('/search/movie', {
    query,
    page: page.toString()
  })
}

export const getMovieDetails = async (id: number) => {
  return apiRequest(`/movie/${id}`)
}

export const getMovieCredits = async (id: number) => {
  return apiRequest(`/movie/${id}/credits`)
}

export const getSimilarMovies = async (id: number, page: number = 1) => {
  return apiRequest(`/movie/${id}/similar`, { page: page.toString() })
}