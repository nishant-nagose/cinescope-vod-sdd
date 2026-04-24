export interface Movie {
  id: number
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
  vote_count: number
  genre_ids?: number[]
  genres?: Genre[]
  adult: boolean
  original_language: string
  original_title: string
  popularity: number
  video: boolean
}

export interface Genre {
  id: number
  name: string
}

export interface TrendingResponse {
  page: number
  results: Movie[]
  total_pages: number
  total_results: number
}

export interface TopRatedResponse {
  page: number
  results: Movie[]
  total_pages: number
  total_results: number
}

export interface SearchResponse {
  page: number
  results: Movie[]
  total_pages: number
  total_results: number
}

export interface MovieDetails extends Movie {
  belongs_to_collection: any | null
  budget: number
  genres: Genre[]
  homepage: string | null
  imdb_id: string | null
  production_companies: ProductionCompany[]
  production_countries: ProductionCountry[]
  revenue: number
  runtime: number | null
  spoken_languages: SpokenLanguage[]
  status: string
  tagline: string | null
}

export interface ProductionCompany {
  id: number
  logo_path: string | null
  name: string
  origin_country: string
}

export interface ProductionCountry {
  iso_3166_1: string
  name: string
}

export interface SpokenLanguage {
  english_name: string
  iso_639_1: string
  name: string
}

export interface CastMember {
  adult: boolean
  gender: number | null
  id: number
  known_for_department: string
  name: string
  original_name: string
  popularity: number
  profile_path: string | null
  cast_id: number
  character: string
  credit_id: string
  order: number
}

export interface CrewMember {
  adult: boolean
  gender: number | null
  id: number
  known_for_department: string
  name: string
  original_name: string
  popularity: number
  profile_path: string | null
  credit_id: string
  department: string
  job: string
}

export interface CreditsResponse {
  id: number
  cast: CastMember[]
  crew: CrewMember[]
}

export interface SimilarMoviesResponse {
  page: number
  results: Movie[]
  total_pages: number
  total_results: number
}

export interface GenresResponse {
  genres: Genre[]
}

export interface DiscoverResponse {
  page: number
  results: Movie[]
  total_pages: number
  total_results: number
}

export interface TmdbCountry {
  iso_3166_1: string
  english_name: string
  native_name: string
}

export interface TmdbLanguage {
  iso_639_1: string
  english_name: string
  name: string
}

export interface ContentFilterParams {
  countries: string[]
  languages: string[]
  contentType?: 'movies' | 'shows' | 'all'
  activeCategory?: number | null
}

// ---- TV Show Types ----

export interface TVShow {
  id: number
  name: string
  original_name: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  vote_average: number
  vote_count: number
  popularity: number
  first_air_date: string
  origin_country: string[]
  original_language: string
  genre_ids: number[]
  media_type?: 'tv'
}

export interface Network {
  id: number
  name: string
  logo_path: string | null
  origin_country: string
}

export interface EpisodeSummary {
  id: number
  name: string
  episode_number: number
  season_number: number
  air_date: string | null
}

export interface SeasonSummary {
  id: number
  name: string
  season_number: number
  episode_count: number
  air_date: string | null
  poster_path: string | null
  overview: string
}

export interface Episode {
  id: number
  name: string
  episode_number: number
  season_number: number
  overview: string
  air_date: string | null
  still_path: string | null
  vote_average: number
  vote_count: number
  runtime: number | null
}

export interface SeasonDetails {
  id: number
  name: string
  season_number: number
  air_date: string | null
  poster_path: string | null
  overview: string
  episodes: Episode[]
}

export interface TVShowDetails extends Omit<TVShow, 'genre_ids'> {
  genres: Genre[]
  tagline: string
  status: string
  type: string
  number_of_seasons: number
  number_of_episodes: number
  seasons: SeasonSummary[]
  networks: Network[]
  production_companies: ProductionCompany[]
  episode_run_time: number[]
  homepage: string
  in_production: boolean
  languages: string[]
  last_air_date: string
  last_episode_to_air: EpisodeSummary | null
  next_episode_to_air: EpisodeSummary | null
}

export interface TVShowListResponse {
  page: number
  results: TVShow[]
  total_pages: number
  total_results: number
}

export interface Person {
  id: number
  name: string
  media_type: 'person'
}

export type SearchMovieItem = Movie & { media_type: 'movie' }
export type SearchShowItem = TVShow & { media_type: 'tv' }
export type ContentSearchItem = SearchMovieItem | SearchShowItem

export interface MultiSearchResult {
  page: number
  results: (SearchMovieItem | SearchShowItem | Person)[]
  total_pages: number
  total_results: number
}

export interface MovieVideo {
  id: string
  key: string
  name: string
  site: string
  type: string
  official: boolean
  published_at: string
}

export interface MovieVideosResponse {
  id: number
  results: MovieVideo[]
}

export interface WatchProvider {
  display_priority: number
  logo_path: string
  provider_id: number
  provider_name: string
}

export interface WatchProvidersForCountry {
  link: string
  flatrate?: WatchProvider[]
  rent?: WatchProvider[]
  buy?: WatchProvider[]
}

export interface WatchProvidersResponse {
  id: number
  results: Record<string, WatchProvidersForCountry>
}

export interface PersonMovieCredit {
  id: number
  title: string
  poster_path: string | null
  release_date: string
  vote_average: number
  popularity: number
  character?: string
  job?: string
  department?: string
}

export interface PersonMovieCredits {
  id: number
  cast: PersonMovieCredit[]
  crew: PersonMovieCredit[]
}

export interface CarouselConfig {
  id: string
  title: string
  type: 'movies' | 'shows' | 'both'
  hookKey: string
  rankDisplay: boolean
}

export interface OTTPlatform {
  provider_id: number
  provider_name: string
  logo_path: string | null
  webUrl: string
  appScheme?: string
}