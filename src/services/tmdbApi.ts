/// <reference types="vite/client" />

import type { Movie, GenresResponse, DiscoverResponse, TmdbCountry, TmdbLanguage, ContentFilterParams, MovieVideosResponse, WatchProvidersResponse, PersonMovieCredits } from '../types/tmdb'

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

const buildFilterParams = (filter: ContentFilterParams): Record<string, string> => {
  const params: Record<string, string> = {}
  if (filter.countries.length > 0) {
    params['with_origin_country'] = filter.countries.join('|')
  }
  if (filter.languages.length > 0) {
    params['with_original_language'] = filter.languages.join('|')
  }
  return params
}

export const getCountries = async (): Promise<TmdbCountry[]> => {
  return apiRequest('/configuration/countries')
}

export const getLanguages = async (): Promise<TmdbLanguage[]> => {
  return apiRequest('/configuration/languages')
}

export const getTrendingMovies = async (
  page: number = 1,
  filter?: ContentFilterParams
): Promise<DiscoverResponse> => {
  return apiRequest('/discover/movie', {
    sort_by: 'popularity.desc',
    page: page.toString(),
    ...(filter ? buildFilterParams(filter) : {}),
  })
}

export const getTopRatedMovies = async (
  page: number = 1,
  filter?: ContentFilterParams
): Promise<DiscoverResponse> => {
  return apiRequest('/discover/movie', {
    sort_by: 'vote_average.desc',
    'vote_count.gte': '200',
    page: page.toString(),
    ...(filter ? buildFilterParams(filter) : {}),
  })
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

export const getGenres = async (): Promise<GenresResponse> => {
  return apiRequest('/genre/movie/list')
}

export const getMoviesByGenre = async (
  genreId: number,
  page: number = 1,
  filter?: ContentFilterParams
): Promise<DiscoverResponse> => {
  return apiRequest('/discover/movie', {
    with_genres: genreId.toString(),
    sort_by: 'popularity.desc',
    page: page.toString(),
    ...(filter ? buildFilterParams(filter) : {}),
  })
}

export const getNewReleases = async (
  page: number = 1,
  filter?: ContentFilterParams
): Promise<DiscoverResponse> => {
  return apiRequest('/discover/movie', {
    sort_by: 'release_date.desc',
    'vote_count.gte': '50',
    page: page.toString(),
    ...(filter ? buildFilterParams(filter) : {}),
  })
}

export const getCriticallyAcclaimed = async (
  page: number = 1,
  filter?: ContentFilterParams
): Promise<DiscoverResponse> => {
  return apiRequest('/discover/movie', {
    sort_by: 'vote_average.desc',
    'vote_count.gte': '300',
    page: page.toString(),
    ...(filter ? buildFilterParams(filter) : {}),
  })
}

export const getMovieVideos = async (movieId: number): Promise<MovieVideosResponse> => {
  return apiRequest(`/movie/${movieId}/videos`)
}

export const getWatchProviders = async (movieId: number): Promise<WatchProvidersResponse> => {
  return apiRequest(`/movie/${movieId}/watch/providers`)
}

export const getPersonMovieCredits = async (personId: number): Promise<PersonMovieCredits> => {
  return apiRequest(`/person/${personId}/movie_credits`)
}

export const getDailyTrending = async (page: number = 1): Promise<DiscoverResponse> => {
  return apiRequest('/trending/movie/day', { page: page.toString() })
}

export const getWeeklyTrending = async (page: number = 1): Promise<DiscoverResponse> => {
  return apiRequest('/trending/movie/week', { page: page.toString() })
}

export const getComedyMovies = async (
  page: number = 1,
  filter?: ContentFilterParams
): Promise<DiscoverResponse> => {
  return apiRequest('/discover/movie', {
    with_genres: '35',
    sort_by: 'popularity.desc',
    page: page.toString(),
    ...(filter ? buildFilterParams(filter) : {}),
  })
}

export const getSciFiFantasyMovies = async (
  page: number = 1,
  filter?: ContentFilterParams
): Promise<DiscoverResponse> => {
  return apiRequest('/discover/movie', {
    with_genres: '878,14',
    sort_by: 'popularity.desc',
    page: page.toString(),
    ...(filter ? buildFilterParams(filter) : {}),
  })
}

export const getRealLifeMovies = async (
  page: number = 1,
  filter?: ContentFilterParams
): Promise<DiscoverResponse> => {
  return apiRequest('/discover/movie', {
    with_genres: '36,99',
    sort_by: 'popularity.desc',
    page: page.toString(),
    ...(filter ? buildFilterParams(filter) : {}),
  })
}

export const getAnimationMovies = async (
  page: number = 1,
  filter?: ContentFilterParams
): Promise<DiscoverResponse> => {
  return apiRequest('/discover/movie', {
    with_genres: '16',
    sort_by: 'popularity.desc',
    page: page.toString(),
    ...(filter ? buildFilterParams(filter) : {}),
  })
}

export const getRomanceMovies = async (
  page: number = 1,
  filter?: ContentFilterParams
): Promise<DiscoverResponse> => {
  return apiRequest('/discover/movie', {
    with_genres: '10749',
    sort_by: 'popularity.desc',
    page: page.toString(),
    ...(filter ? buildFilterParams(filter) : {}),
  })
}

export const getActionAdventureMovies = async (
  page: number = 1,
  filter?: ContentFilterParams
): Promise<DiscoverResponse> => {
  return apiRequest('/discover/movie', {
    with_genres: '28,12',
    sort_by: 'popularity.desc',
    page: page.toString(),
    ...(filter ? buildFilterParams(filter) : {}),
  })
}

export const getAwardWinningMovies = async (
  page: number = 1,
  filter?: ContentFilterParams
): Promise<DiscoverResponse> => {
  return apiRequest('/discover/movie', {
    sort_by: 'vote_average.desc',
    'vote_count.gte': '500',
    page: page.toString(),
    ...(filter ? buildFilterParams(filter) : {}),
  })
}

export const getInspiringMovies = async (
  page: number = 1,
  filter?: ContentFilterParams
): Promise<DiscoverResponse> => {
  return apiRequest('/discover/movie', {
    with_genres: '18,10751',
    sort_by: 'popularity.desc',
    page: page.toString(),
    ...(filter ? buildFilterParams(filter) : {}),
  })
}

export const getThrillerMovies = async (
  page: number = 1,
  filter?: ContentFilterParams
): Promise<DiscoverResponse> => {
  return apiRequest('/discover/movie', {
    with_genres: '53',
    sort_by: 'popularity.desc',
    page: page.toString(),
    ...(filter ? buildFilterParams(filter) : {}),
  })
}
