/// <reference types="vite/client" />

import type { Movie, GenresResponse, DiscoverResponse, TmdbCountry, TmdbLanguage, ContentFilterParams, MovieVideosResponse, WatchProvidersResponse, PersonMovieCredits, TVShow, TVShowDetails, TVShowListResponse, SeasonDetails, CreditsResponse, MultiSearchResult } from '../types/tmdb'

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
  // Blockbusters: all-time crowd favourites ranked by popularity score
  return apiRequest('/discover/movie', {
    sort_by: 'popularity.desc',
    'vote_count.gte': '500',
    'vote_average.gte': '6',
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
  const today = new Date().toISOString().slice(0, 10)
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  return apiRequest('/discover/movie', {
    sort_by: 'release_date.desc',
    'primary_release_date.gte': thirtyDaysAgo,
    'primary_release_date.lte': today,
    'vote_count.gte': '3',
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
  // Drama (18) + History (36) + Biography bias: prestige films with very high ratings & broad audience
  return apiRequest('/discover/movie', {
    sort_by: 'vote_average.desc',
    'vote_count.gte': '1000',
    'vote_average.gte': '7.5',
    with_genres: '18,36',
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

// ---- TV Show API Functions ----

const buildTVFilterParams = (filter: ContentFilterParams): Record<string, string> => {
  const params: Record<string, string> = {}
  const lang = filter.languages[0] ?? ''
  const country = filter.countries[0] ?? ''
  if (lang) params['language'] = lang
  if (country) params['with_origin_country'] = country
  return params
}

export const getTrendingTVDaily = async (
  page: number = 1,
  filter?: ContentFilterParams
): Promise<TVShowListResponse> => {
  // Use discover when region is set so with_origin_country is applied
  if (filter?.countries[0]) {
    return apiRequest('/discover/tv', {
      sort_by: 'popularity.desc',
      'vote_count.gte': '20',
      page: page.toString(),
      ...buildTVFilterParams(filter),
    })
  }
  return apiRequest('/trending/tv/day', { page: page.toString() })
}

export const getTrendingTVWeekly = async (
  page: number = 1,
  filter?: ContentFilterParams
): Promise<TVShowListResponse> => {
  if (filter?.countries[0]) {
    return apiRequest('/discover/tv', {
      sort_by: 'popularity.desc',
      'vote_count.gte': '50',
      page: page.toString(),
      ...buildTVFilterParams(filter),
    })
  }
  return apiRequest('/trending/tv/week', { page: page.toString() })
}

export const getTopRatedTV = async (
  page: number = 1,
  filter?: ContentFilterParams
): Promise<TVShowListResponse> => {
  return apiRequest('/discover/tv', {
    sort_by: 'vote_average.desc',
    'vote_count.gte': '200',
    page: page.toString(),
    ...(filter ? buildTVFilterParams(filter) : {}),
  })
}

export const getNewShows = async (
  page: number = 1,
  filter?: ContentFilterParams
): Promise<TVShowListResponse> => {
  const today = new Date().toISOString().slice(0, 10)
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  return apiRequest('/discover/tv', {
    sort_by: 'first_air_date.desc',
    'first_air_date.lte': today,
    'first_air_date.gte': thirtyDaysAgo,
    'vote_count.gte': '3',
    page: page.toString(),
    ...(filter ? buildTVFilterParams(filter) : {}),
  })
}

export const getRecommendedShows = async (
  page: number = 1,
  filter?: ContentFilterParams
): Promise<TVShowListResponse> => {
  return apiRequest('/discover/tv', {
    sort_by: 'popularity.desc',
    'vote_count.gte': '100',
    'vote_average.gte': '7',
    page: page.toString(),
    ...(filter ? buildTVFilterParams(filter) : {}),
  })
}

export const getCriticallyAcclaimedShows = async (
  page: number = 1,
  filter?: ContentFilterParams
): Promise<TVShowListResponse> => {
  return apiRequest('/discover/tv', {
    sort_by: 'vote_average.desc',
    'vote_count.gte': '200',
    'vote_average.gte': '8',
    page: page.toString(),
    ...(filter ? buildTVFilterParams(filter) : {}),
  })
}

export const getShowsByGenre = async (
  genreId: number | string,
  page: number = 1,
  filter?: ContentFilterParams
): Promise<TVShowListResponse> => {
  return apiRequest('/discover/tv', {
    with_genres: genreId.toString(),
    sort_by: 'popularity.desc',
    'vote_count.gte': '30',
    page: page.toString(),
    ...(filter ? buildTVFilterParams(filter) : {}),
  })
}

export const getAwardWinningShows = async (
  page: number = 1,
  filter?: ContentFilterParams
): Promise<TVShowListResponse> => {
  return apiRequest('/discover/tv', {
    sort_by: 'vote_average.desc',
    'vote_count.gte': '300',
    'vote_average.gte': '8',
    page: page.toString(),
    ...(filter ? buildTVFilterParams(filter) : {}),
  })
}

export const getUpcomingShows = async (page: number = 1): Promise<TVShowListResponse> => {
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  return apiRequest('/discover/tv', {
    sort_by: 'first_air_date.asc',
    'first_air_date.gte': tomorrow,
    page: page.toString(),
  })
}

export const getUpcomingMovies = async (page: number = 1): Promise<DiscoverResponse> => {
  const today = new Date().toISOString().slice(0, 10)
  const ninetyDaysLater = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  return apiRequest('/discover/movie', {
    sort_by: 'primary_release_date.asc',
    'primary_release_date.gte': today,
    'primary_release_date.lte': ninetyDaysLater,
    page: page.toString(),
  })
}

export const getShowVideos = async (showId: number): Promise<MovieVideosResponse> => {
  return apiRequest(`/tv/${showId}/videos`)
}

export const getShowWatchProviders = async (showId: number): Promise<WatchProvidersResponse> => {
  return apiRequest(`/tv/${showId}/watch/providers`)
}

export const getShowDetails = async (id: number): Promise<TVShowDetails> => {
  return apiRequest(`/tv/${id}`, { language: 'en-US' })
}

export const getShowCredits = async (id: number): Promise<CreditsResponse> => {
  return apiRequest(`/tv/${id}/credits`, { language: 'en-US' })
}

export const getSimilarShows = async (
  id: number,
  page: number = 1
): Promise<TVShowListResponse> => {
  return apiRequest(`/tv/${id}/similar`, { page: page.toString(), language: 'en-US' })
}

export const getSeasonDetails = async (
  showId: number,
  seasonNumber: number
): Promise<SeasonDetails> => {
  return apiRequest(`/tv/${showId}/season/${seasonNumber}`, { language: 'en-US' })
}

export const searchMulti = async (
  query: string,
  page: number = 1
): Promise<MultiSearchResult> => {
  return apiRequest('/search/multi', { query, page: page.toString(), language: 'en-US' })
}

// suppress unused import warning — TVShow is used by callers via re-export
export type { TVShow }
