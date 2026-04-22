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