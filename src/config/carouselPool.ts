import {
  discoverMovies, discoverTV,
  getDailyTrending, getWeeklyTrending,
  getTrendingTVDaily, getTrendingTVWeekly,
} from '../services/tmdbApi'
import type { ContentFilterParams, DiscoverResponse, TVShowListResponse } from '../types/tmdb'

export interface MovieCarouselConfig {
  id: string
  title: string
  type: 'movies'
  fetch: (page: number, filter: ContentFilterParams) => Promise<DiscoverResponse>
  genreKey?: string
  rankDisplay?: boolean
  maxItems?: number
}

export interface ShowCarouselConfig {
  id: string
  title: string
  type: 'shows'
  fetch: (page: number, filter: ContentFilterParams) => Promise<TVShowListResponse>
  genreKey?: string
  rankDisplay?: boolean
  maxItems?: number
}

export type DynamicCarouselConfig = MovieCarouselConfig | ShowCarouselConfig

// ── Helpers ─────────────────────────────────────────────────────────────────
// strip=true removes country filter so genre carousels always show global content
const mv = (params: Record<string, string>, strip = false) =>
  (page: number, f: ContentFilterParams): Promise<DiscoverResponse> =>
    discoverMovies(params, page, strip ? { ...f, countries: [] } : f)

const sh = (params: Record<string, string>, strip = false) =>
  (page: number, f: ContentFilterParams): Promise<TVShowListResponse> =>
    discoverTV(params, page, strip ? { ...f, countries: [] } : f)

// Date-dynamic versions (params evaluated at call time so dates stay fresh)
const mvd = (paramsFn: () => Record<string, string>, strip = false) =>
  (page: number, f: ContentFilterParams): Promise<DiscoverResponse> =>
    discoverMovies(paramsFn(), page, strip ? { ...f, countries: [] } : f)

const shd = (paramsFn: () => Record<string, string>, strip = false) =>
  (page: number, f: ContentFilterParams): Promise<TVShowListResponse> =>
    discoverTV(paramsFn(), page, strip ? { ...f, countries: [] } : f)

const today = () => new Date().toISOString().slice(0, 10)
const ago = (n: number) => new Date(Date.now() - n * 86400000).toISOString().slice(0, 10)
const ahead = (n: number) => new Date(Date.now() + n * 86400000).toISOString().slice(0, 10)
const year = (offset = 0) => (new Date().getFullYear() + offset).toString()

// ── Pool ─────────────────────────────────────────────────────────────────────
export const CAROUSEL_POOL: DynamicCarouselConfig[] = [

  // ── Tier 1: Featured (first 8 visible on load) ───────────────────────────
  {
    id: 'new-movies',
    title: 'New Movie Releases',
    type: 'movies',
    fetch: mvd(() => ({
      sort_by: 'release_date.desc',
      'primary_release_date.gte': ago(30),
      'primary_release_date.lte': today(),
      'vote_count.gte': '3',
    })),
  },
  {
    id: 'new-shows',
    title: 'New TV Shows',
    type: 'shows',
    fetch: shd(() => ({
      sort_by: 'first_air_date.desc',
      'first_air_date.gte': ago(30),
      'first_air_date.lte': today(),
      'vote_count.gte': '3',
    })),
  },
  {
    id: 'trending-movies-day',
    title: 'Trending Movies Today',
    type: 'movies',
    rankDisplay: true,
    maxItems: 10,
    fetch: (page, f) => getDailyTrending(page, f),
  },
  {
    id: 'trending-shows-day',
    title: 'Trending Shows Today',
    type: 'shows',
    rankDisplay: true,
    maxItems: 10,
    fetch: (page, f) => getTrendingTVDaily(page, f),
  },
  {
    id: 'trending-movies-week',
    title: "This Week's Best Movies",
    type: 'movies',
    rankDisplay: true,
    maxItems: 10,
    fetch: (page, f) => getWeeklyTrending(page, f),
  },
  {
    id: 'trending-shows-week',
    title: "This Week's Best Shows",
    type: 'shows',
    rankDisplay: true,
    maxItems: 10,
    fetch: (page, f) => getTrendingTVWeekly(page, f),
  },
  {
    id: 'blockbusters',
    title: 'Blockbusters',
    type: 'movies',
    fetch: mv({ sort_by: 'popularity.desc', 'vote_count.gte': '500', 'vote_average.gte': '6.5' }),
  },
  {
    id: 'fan-fav-shows',
    title: 'Fan-Favorite Shows',
    type: 'shows',
    fetch: sh({ sort_by: 'popularity.desc', 'vote_count.gte': '200', 'vote_average.gte': '7.5' }),
  },

  // ── Tier 2: Genre — Movies ───────────────────────────────────────────────
  {
    id: 'action-movies',
    title: 'Action & Adventure Movies',
    type: 'movies',
    genreKey: 'action',
    fetch: mv({ with_genres: '28|12', sort_by: 'popularity.desc' }, true),
  },
  {
    id: 'scifi-movies',
    title: 'Sci-Fi & Fantasy Movies',
    type: 'movies',
    genreKey: 'scifi',
    fetch: mv({ with_genres: '878|14', sort_by: 'popularity.desc' }, true),
  },
  {
    id: 'thriller-movies',
    title: 'Thriller Movies',
    type: 'movies',
    genreKey: 'thriller',
    fetch: mv({ with_genres: '53', without_genres: '10749', sort_by: 'popularity.desc' }, true),
  },
  {
    id: 'comedy-movies',
    title: 'Comedy Movies',
    type: 'movies',
    genreKey: 'comedy',
    fetch: mv({ with_genres: '35', sort_by: 'popularity.desc' }, true),
  },
  {
    id: 'horror-movies',
    title: 'Horror Movies',
    type: 'movies',
    genreKey: 'thriller',
    fetch: mv({ with_genres: '27', sort_by: 'popularity.desc' }, true),
  },
  {
    id: 'romance-movies',
    title: 'Romance Movies',
    type: 'movies',
    genreKey: 'romance',
    fetch: mv({ with_genres: '10749', without_genres: '27|53', sort_by: 'popularity.desc' }, true),
  },
  {
    id: 'animation-movies',
    title: 'Animation Movies',
    type: 'movies',
    genreKey: 'animation',
    fetch: mv({ with_genres: '16', sort_by: 'popularity.desc' }, true),
  },
  {
    id: 'documentary-movies',
    title: 'Documentary Films',
    type: 'movies',
    genreKey: 'documentary',
    fetch: mv({ with_genres: '99|36', sort_by: 'popularity.desc' }, true),
  },
  {
    id: 'crime-movies',
    title: 'Crime & Mystery Movies',
    type: 'movies',
    genreKey: 'thriller',
    fetch: mv({ with_genres: '80|9648', without_genres: '10749', sort_by: 'popularity.desc' }, true),
  },
  {
    id: 'family-movies',
    title: 'Family Movies',
    type: 'movies',
    genreKey: 'family',
    fetch: mv({ with_genres: '10751', without_genres: '27|53', sort_by: 'popularity.desc' }, true),
  },
  {
    id: 'drama-movies',
    title: 'Drama Movies',
    type: 'movies',
    genreKey: 'drama',
    fetch: mv({ with_genres: '18', without_genres: '10749', sort_by: 'popularity.desc' }, true),
  },

  // ── Tier 3: Genre — Shows ────────────────────────────────────────────────
  {
    id: 'action-shows',
    title: 'Action & Adventure Shows',
    type: 'shows',
    genreKey: 'action',
    fetch: sh({ with_genres: '10759', sort_by: 'popularity.desc', 'vote_count.gte': '30' }, true),
  },
  {
    id: 'scifi-shows',
    title: 'Sci-Fi & Fantasy Shows',
    type: 'shows',
    genreKey: 'scifi',
    fetch: sh({ with_genres: '10765', sort_by: 'popularity.desc', 'vote_count.gte': '30' }, true),
  },
  {
    id: 'thriller-shows',
    title: 'Crime & Thriller Shows',
    type: 'shows',
    genreKey: 'thriller',
    fetch: sh({ with_genres: '9648|80', without_genres: '10749', sort_by: 'popularity.desc', 'vote_count.gte': '30' }, true),
  },
  {
    id: 'comedy-shows',
    title: 'Comedy Shows',
    type: 'shows',
    genreKey: 'comedy',
    fetch: sh({ with_genres: '35', sort_by: 'popularity.desc', 'vote_count.gte': '30' }, true),
  },
  {
    id: 'horror-shows',
    title: 'Horror Shows',
    type: 'shows',
    genreKey: 'thriller',
    fetch: sh({ with_genres: '27', sort_by: 'popularity.desc', 'vote_count.gte': '20' }, true),
  },
  {
    id: 'romance-shows',
    title: 'Romance Shows',
    type: 'shows',
    genreKey: 'romance',
    fetch: sh({ with_genres: '10749', without_genres: '27', sort_by: 'popularity.desc', 'vote_count.gte': '30' }, true),
  },
  {
    id: 'animation-shows',
    title: 'Animation Shows',
    type: 'shows',
    genreKey: 'animation',
    fetch: sh({ with_genres: '16|10762', sort_by: 'popularity.desc', 'vote_count.gte': '30' }, true),
  },
  {
    id: 'documentary-shows',
    title: 'Documentary Shows',
    type: 'shows',
    genreKey: 'documentary',
    fetch: sh({ with_genres: '99|10764', sort_by: 'popularity.desc', 'vote_count.gte': '20' }, true),
  },
  {
    id: 'family-shows',
    title: 'Family & Kids Shows',
    type: 'shows',
    genreKey: 'family',
    fetch: sh({ with_genres: '10751|10762', without_genres: '27', sort_by: 'popularity.desc', 'vote_count.gte': '30' }, true),
  },
  {
    id: 'drama-shows',
    title: 'Drama Series',
    type: 'shows',
    genreKey: 'drama',
    fetch: sh({ with_genres: '18', without_genres: '10749', sort_by: 'popularity.desc', 'vote_count.gte': '50' }, true),
  },
  {
    id: 'mystery-shows',
    title: 'Mystery Shows',
    type: 'shows',
    genreKey: 'thriller',
    fetch: sh({ with_genres: '9648', sort_by: 'popularity.desc', 'vote_count.gte': '30' }, true),
  },

  // ── Tier 4: Quality-curated ──────────────────────────────────────────────
  {
    id: 'acclaimed-movies',
    title: 'Critically Acclaimed Movies',
    type: 'movies',
    fetch: mv({ sort_by: 'vote_average.desc', 'vote_count.gte': '300', 'vote_average.gte': '7.5' }),
  },
  {
    id: 'acclaimed-shows',
    title: "Critics' Pick Shows",
    type: 'shows',
    fetch: sh({ sort_by: 'vote_average.desc', 'vote_count.gte': '200', 'vote_average.gte': '8' }),
  },
  {
    id: 'award-movies',
    title: 'Award-Worthy Dramas',
    type: 'movies',
    genreKey: 'drama',
    fetch: mv({ with_genres: '18|36', sort_by: 'vote_average.desc', 'vote_count.gte': '1000', 'vote_average.gte': '7.5' }, true),
  },
  {
    id: 'award-shows',
    title: 'Acclaimed Drama Series',
    type: 'shows',
    genreKey: 'drama',
    fetch: sh({ with_genres: '18', sort_by: 'vote_average.desc', 'vote_count.gte': '300', 'vote_average.gte': '8' }, true),
  },

  // ── Tier 5: Upcoming ─────────────────────────────────────────────────────
  {
    id: 'upcoming-movies',
    title: 'Coming Soon — Movies',
    type: 'movies',
    fetch: mvd(() => ({
      sort_by: 'primary_release_date.asc',
      'primary_release_date.gte': ahead(1),
      'primary_release_date.lte': ahead(90),
    })),
  },
  {
    id: 'upcoming-shows',
    title: 'Coming Soon — Shows',
    type: 'shows',
    fetch: shd(() => ({
      sort_by: 'first_air_date.asc',
      'first_air_date.gte': ahead(1),
      'first_air_date.lte': ahead(90),
    })),
  },

  // ── Tier 6: Mood-based — Movies ──────────────────────────────────────────
  {
    id: 'feel-good-movies',
    title: 'Feel-Good Movies',
    type: 'movies',
    fetch: mv({ with_genres: '35|10751', without_genres: '27|53|18', sort_by: 'popularity.desc' }, true),
  },
  {
    id: 'inspiring-movies',
    title: 'Inspiring Movies',
    type: 'movies',
    genreKey: 'drama',
    fetch: mv({ with_genres: '18,10751', without_genres: '10749', sort_by: 'vote_average.desc', 'vote_count.gte': '200' }, true),
  },
  {
    id: 'edge-thrillers',
    title: 'Edge-of-Seat Thrillers',
    type: 'movies',
    genreKey: 'thriller',
    fetch: mv({ with_genres: '53|28', without_genres: '10749|35', sort_by: 'popularity.desc', 'vote_count.gte': '200' }, true),
  },
  {
    id: 'mind-bending',
    title: 'Mind-Bending Movies',
    type: 'movies',
    genreKey: 'scifi',
    fetch: mv({ with_genres: '878|9648', sort_by: 'vote_average.desc', 'vote_count.gte': '100', 'vote_average.gte': '7' }, true),
  },
  {
    id: 'dark-movies',
    title: 'Dark & Gritty Movies',
    type: 'movies',
    genreKey: 'thriller',
    fetch: mv({ with_genres: '80|53', without_genres: '35|10749', sort_by: 'vote_average.desc', 'vote_count.gte': '300' }, true),
  },
  {
    id: 'romantic-comedies',
    title: 'Romantic Comedies',
    type: 'movies',
    genreKey: 'romance',
    fetch: mv({ with_genres: '10749,35', sort_by: 'popularity.desc' }, true),
  },
  {
    id: 'psychological-thrillers',
    title: 'Psychological Thrillers',
    type: 'movies',
    genreKey: 'thriller',
    fetch: mv({ with_genres: '53|9648', sort_by: 'vote_average.desc', 'vote_count.gte': '200', 'vote_average.gte': '7' }, true),
  },

  // ── Tier 7: Mood-based — Shows ───────────────────────────────────────────
  {
    id: 'feel-good-shows',
    title: 'Feel-Good Shows',
    type: 'shows',
    fetch: sh({ with_genres: '35|10751', without_genres: '27', sort_by: 'popularity.desc', 'vote_count.gte': '30' }, true),
  },
  {
    id: 'inspiring-shows',
    title: 'Inspiring Shows',
    type: 'shows',
    genreKey: 'drama',
    fetch: sh({ with_genres: '18,10751', without_genres: '10749', sort_by: 'vote_average.desc', 'vote_count.gte': '100' }, true),
  },
  {
    id: 'dark-shows',
    title: 'Dark & Gritty Shows',
    type: 'shows',
    genreKey: 'thriller',
    fetch: sh({ with_genres: '18|80', without_genres: '35|10749', sort_by: 'vote_average.desc', 'vote_count.gte': '200' }, true),
  },
  {
    id: 'reality-tv',
    title: 'Reality TV',
    type: 'shows',
    fetch: sh({ with_genres: '10764', sort_by: 'popularity.desc', 'vote_count.gte': '30' }, true),
  },
  {
    id: 'war-politics-shows',
    title: 'War & Politics Shows',
    type: 'shows',
    genreKey: 'drama',
    fetch: sh({ with_genres: '10768', sort_by: 'popularity.desc', 'vote_count.gte': '30' }, true),
  },

  // ── Tier 8: Time-based ───────────────────────────────────────────────────
  {
    id: 'best-this-year-m',
    title: "Best Movies of This Year",
    type: 'movies',
    fetch: mvd(() => ({
      sort_by: 'vote_average.desc',
      'primary_release_date.gte': `${year()}-01-01`,
      'primary_release_date.lte': today(),
      'vote_count.gte': '100',
    })),
  },
  {
    id: 'best-this-year-s',
    title: "Best Shows of This Year",
    type: 'shows',
    fetch: shd(() => ({
      sort_by: 'vote_average.desc',
      'first_air_date.gte': `${year()}-01-01`,
      'first_air_date.lte': today(),
      'vote_count.gte': '100',
    })),
  },
  {
    id: 'best-last-year-m',
    title: "Best Movies of Last Year",
    type: 'movies',
    fetch: mvd(() => ({
      sort_by: 'vote_average.desc',
      'primary_release_date.gte': `${year(-1)}-01-01`,
      'primary_release_date.lte': `${year(-1)}-12-31`,
      'vote_count.gte': '200',
    }), true),
  },
  {
    id: 'best-last-year-s',
    title: "Best Shows of Last Year",
    type: 'shows',
    fetch: shd(() => ({
      sort_by: 'vote_average.desc',
      'first_air_date.gte': `${year(-1)}-01-01`,
      'first_air_date.lte': `${year(-1)}-12-31`,
      'vote_count.gte': '100',
    }), true),
  },
  {
    id: 'modern-classics',
    title: 'Modern Classics (2000–2015)',
    type: 'movies',
    fetch: mv({ sort_by: 'vote_average.desc', 'primary_release_date.gte': '2000-01-01', 'primary_release_date.lte': '2015-12-31', 'vote_count.gte': '500', 'vote_average.gte': '7.5' }, true),
  },
  {
    id: 'classic-cinema',
    title: 'Classic Cinema',
    type: 'movies',
    fetch: mv({ sort_by: 'vote_average.desc', 'primary_release_date.lte': '1999-12-31', 'vote_count.gte': '500', 'vote_average.gte': '7.5' }, true),
  },

  // ── Tier 9: Specialty ────────────────────────────────────────────────────
  {
    id: 'hidden-gems',
    title: 'Hidden Gems',
    type: 'movies',
    fetch: mv({ sort_by: 'vote_average.desc', 'vote_count.gte': '50', 'vote_count.lte': '300', 'vote_average.gte': '7.5' }, true),
  },
  {
    id: 'international-movies',
    title: 'International Cinema',
    type: 'movies',
    fetch: mv({ sort_by: 'popularity.desc', without_original_language: 'en', 'vote_count.gte': '50' }, true),
  },
  {
    id: 'international-shows',
    title: 'International Shows',
    type: 'shows',
    fetch: sh({ sort_by: 'popularity.desc', without_original_language: 'en', 'vote_count.gte': '30' }, true),
  },
  {
    id: 'fan-favorites',
    title: 'All-Time Fan Favorites',
    type: 'movies',
    fetch: mv({ sort_by: 'popularity.desc', 'vote_count.gte': '5000', 'vote_average.gte': '7.5' }, true),
  },
  {
    id: 'war-history',
    title: 'War & History Movies',
    type: 'movies',
    fetch: mv({ with_genres: '10752|36', sort_by: 'popularity.desc' }, true),
  },
  {
    id: 'western-movies',
    title: 'Western Movies',
    type: 'movies',
    fetch: mv({ with_genres: '37', sort_by: 'popularity.desc' }, true),
  },
  {
    id: 'fantasy-adventure',
    title: 'Fantasy Adventures',
    type: 'movies',
    genreKey: 'scifi',
    fetch: mv({ with_genres: '12,14', without_genres: '27', sort_by: 'popularity.desc' }, true),
  },
  {
    id: 'kids-animation',
    title: "Kids' Animation",
    type: 'shows',
    genreKey: 'animation',
    fetch: sh({ with_genres: '10762', sort_by: 'popularity.desc', 'vote_count.gte': '20' }, true),
  },
]

// ── Genre-specific carousel builder ─────────────────────────────────────────
// TMDB genre IDs per internal genreKey (pipe = OR on TMDB discover)
export const GENRE_MOVIE_IDS: Record<string, string> = {
  action:      '28|12',
  scifi:       '878|14',
  thriller:    '53|27|80',   // Thriller + Horror + Crime
  comedy:      '35',
  romance:     '10749',
  animation:   '16',
  documentary: '99|36',
  family:      '10751',
  drama:       '18',
}

export const GENRE_SHOW_IDS: Record<string, string> = {
  action:      '10759',
  scifi:       '10765',
  thriller:    '9648|80|27', // Mystery + Crime + Horror
  comedy:      '35',
  romance:     '10749',
  animation:   '16|10762',
  documentary: '99|10764',
  family:      '10751|10762',
  drama:       '18',
}

const GENRE_LABELS: Record<string, string> = {
  action:      'Action & Adventure',
  scifi:       'Sci-Fi & Fantasy',
  thriller:    'Thriller & Horror',
  comedy:      'Comedy',
  romance:     'Romance',
  animation:   'Animation',
  documentary: 'Documentary',
  family:      'Family',
  drama:       'Drama',
}

// Genre-specific exclusions to prevent bleed-in of unrelated genres
const GENRE_MOVIE_EXCLUDE: Record<string, string> = {
  drama:   '10749',    // exclude Romance from Drama
  family:  '27|53',   // exclude Horror + Thriller from Family
}

const GENRE_SHOW_EXCLUDE: Record<string, string> = {
  drama:   '10749',
  family:  '27',
}

/**
 * Builds a region-first carousel set: "streaming in region" carousels + genre angles.
 * Prepended to the global pool in HomePage when a region is detected.
 */
export const buildRegionalPool = (
  region: string,
  contentType: 'movies' | 'shows' | 'all'
): DynamicCarouselConfig[] => {
  const pool: DynamicCarouselConfig[] = []

  if (contentType !== 'shows') {
    pool.push(
      {
        id: 'reg-popular-m',
        title: 'Popular Movies in Your Region',
        type: 'movies',
        fetch: mv({ sort_by: 'popularity.desc', 'vote_count.gte': '10' }),
      },
      {
        id: 'reg-new-m',
        title: 'New Releases in Your Region',
        type: 'movies',
        fetch: mvd(() => ({
          sort_by: 'release_date.desc',
          'primary_release_date.gte': ago(60),
          'primary_release_date.lte': today(),
          'vote_count.gte': '3',
        })),
      },
      {
        id: 'reg-top-m',
        title: 'Top Rated Movies in Your Region',
        type: 'movies',
        fetch: mv({ sort_by: 'vote_average.desc', 'vote_count.gte': '50' }),
      },
      {
        id: 'reg-action-m',
        title: 'Action Films from Your Region',
        type: 'movies',
        genreKey: 'action',
        fetch: mv({ with_genres: '28|12', sort_by: 'popularity.desc' }),
      },
      {
        id: 'reg-drama-m',
        title: 'Drama Films from Your Region',
        type: 'movies',
        genreKey: 'drama',
        fetch: mv({ with_genres: '18', without_genres: '10749', sort_by: 'vote_average.desc', 'vote_count.gte': '30' }),
      },
      {
        id: 'reg-comedy-m',
        title: 'Comedy Films from Your Region',
        type: 'movies',
        genreKey: 'comedy',
        fetch: mv({ with_genres: '35', sort_by: 'popularity.desc' }),
      },
      {
        id: `local-cinema-${region}`,
        title: 'Local Cinema',
        type: 'movies',
        fetch: (page, f) => discoverMovies(
          { with_origin_country: region, sort_by: 'popularity.desc', 'vote_count.gte': '10' },
          page, { ...f, countries: [] }
        ),
      },
      {
        id: `local-top-films-${region}`,
        title: 'Top Rated Local Films',
        type: 'movies',
        fetch: (page, f) => discoverMovies(
          { with_origin_country: region, sort_by: 'vote_average.desc', 'vote_count.gte': '50' },
          page, { ...f, countries: [] }
        ),
      },
    )
  }

  if (contentType !== 'movies') {
    pool.push(
      {
        id: 'reg-popular-s',
        title: 'Popular Shows in Your Region',
        type: 'shows',
        fetch: sh({ sort_by: 'popularity.desc', 'vote_count.gte': '10' }),
      },
      {
        id: 'reg-new-s',
        title: 'New Shows in Your Region',
        type: 'shows',
        fetch: shd(() => ({
          sort_by: 'first_air_date.desc',
          'first_air_date.gte': ago(60),
          'first_air_date.lte': today(),
          'vote_count.gte': '3',
        })),
      },
      {
        id: 'reg-top-s',
        title: 'Top Rated Shows in Your Region',
        type: 'shows',
        fetch: sh({ sort_by: 'vote_average.desc', 'vote_count.gte': '30' }),
      },
      {
        id: 'reg-drama-s',
        title: 'Drama Series from Your Region',
        type: 'shows',
        genreKey: 'drama',
        fetch: sh({ with_genres: '18', without_genres: '10749', sort_by: 'vote_average.desc', 'vote_count.gte': '20' }),
      },
      {
        id: 'reg-comedy-s',
        title: 'Comedy Shows from Your Region',
        type: 'shows',
        genreKey: 'comedy',
        fetch: sh({ with_genres: '35', sort_by: 'popularity.desc', 'vote_count.gte': '10' }),
      },
      {
        id: 'reg-action-s',
        title: 'Action Shows from Your Region',
        type: 'shows',
        genreKey: 'action',
        fetch: sh({ with_genres: '10759', sort_by: 'popularity.desc', 'vote_count.gte': '10' }),
      },
      {
        id: `local-shows-${region}`,
        title: 'Local TV Shows',
        type: 'shows',
        fetch: (page, f) => discoverTV(
          { with_origin_country: region, sort_by: 'popularity.desc', 'vote_count.gte': '10' },
          page, { ...f, countries: [] }
        ),
      },
      {
        id: `local-top-shows-${region}`,
        title: 'Acclaimed Local Shows',
        type: 'shows',
        fetch: (page, f) => discoverTV(
          { with_origin_country: region, sort_by: 'vote_average.desc', 'vote_count.gte': '30' },
          page, { ...f, countries: [] }
        ),
      },
    )
  }

  return pool
}

/**
 * Builds a rich set of carousels for a single genre, covering multiple angles
 * (popular, top-rated, new releases, hidden gems, classics).
 * Used by HomePage when a category filter is active.
 */
export const buildGenrePool = (
  genreKey: string,
  contentType: 'movies' | 'shows' | 'all'
): DynamicCarouselConfig[] => {
  const label   = GENRE_LABELS[genreKey]         ?? genreKey
  const movieId = GENRE_MOVIE_IDS[genreKey]
  const showId  = GENRE_SHOW_IDS[genreKey]
  const movieEx = GENRE_MOVIE_EXCLUDE[genreKey]  ?? ''
  const showEx  = GENRE_SHOW_EXCLUDE[genreKey]   ?? ''
  const pool: DynamicCarouselConfig[] = []

  if (movieId && contentType !== 'shows') {
    const mBase: Record<string, string> = { with_genres: movieId }
    if (movieEx) mBase['without_genres'] = movieEx

    pool.push(
      { id: `g-${genreKey}-m-popular`, title: `Popular ${label} Movies`,   type: 'movies', genreKey, fetch: mv({ ...mBase, sort_by: 'popularity.desc' }, true) },
      { id: `g-${genreKey}-m-rated`,   title: `Top-Rated ${label} Movies`, type: 'movies', genreKey, fetch: mv({ ...mBase, sort_by: 'vote_average.desc', 'vote_count.gte': '200' }, true) },
      { id: `g-${genreKey}-m-new`,     title: `New ${label} Releases`,     type: 'movies', genreKey, fetch: mvd(() => ({ ...mBase, sort_by: 'release_date.desc', 'primary_release_date.gte': ago(365), 'primary_release_date.lte': today() }), true) },
      { id: `g-${genreKey}-m-gems`,    title: `${label} Hidden Gems`,      type: 'movies', genreKey, fetch: mv({ ...mBase, sort_by: 'vote_average.desc', 'vote_count.gte': '30', 'vote_count.lte': '500', 'vote_average.gte': '7' }, true) },
      { id: `g-${genreKey}-m-classic`, title: `Classic ${label} Movies`,   type: 'movies', genreKey, fetch: mv({ ...mBase, sort_by: 'vote_average.desc', 'primary_release_date.lte': '2010-12-31', 'vote_count.gte': '200' }, true) },
    )
  }

  if (showId && contentType !== 'movies') {
    const sBase: Record<string, string> = { with_genres: showId }
    if (showEx) sBase['without_genres'] = showEx

    pool.push(
      { id: `g-${genreKey}-s-popular`, title: `Popular ${label} Shows`,        type: 'shows', genreKey, fetch: sh({ ...sBase, sort_by: 'popularity.desc',   'vote_count.gte': '20' }, true) },
      { id: `g-${genreKey}-s-rated`,   title: `Top-Rated ${label} Shows`,      type: 'shows', genreKey, fetch: sh({ ...sBase, sort_by: 'vote_average.desc', 'vote_count.gte': '50' }, true) },
      { id: `g-${genreKey}-s-new`,     title: `New ${label} Shows`,            type: 'shows', genreKey, fetch: shd(() => ({ ...sBase, sort_by: 'first_air_date.desc', 'first_air_date.gte': ago(365), 'first_air_date.lte': today() }), true) },
      { id: `g-${genreKey}-s-gems`,    title: `${label} Hidden Gem Shows`,     type: 'shows', genreKey, fetch: sh({ ...sBase, sort_by: 'vote_average.desc', 'vote_count.gte': '30', 'vote_count.lte': '300', 'vote_average.gte': '7.5' }, true) },
      { id: `g-${genreKey}-s-classic`, title: `Classic ${label} Series`,       type: 'shows', genreKey, fetch: sh({ ...sBase, sort_by: 'vote_average.desc', 'first_air_date.lte': '2015-12-31', 'vote_count.gte': '50' }, true) },
    )
  }

  return pool
}
