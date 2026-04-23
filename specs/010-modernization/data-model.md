# Data Model: CineScope App Modernization

**Branch**: `019-modernization` | **Date**: 2026-04-23

## New TypeScript Interfaces (`src/types/tmdb.ts`)

### MovieVideo

Represents a single trailer, clip, or teaser from TMDB's `/movie/{id}/videos` endpoint.

```typescript
export interface MovieVideo {
  id: string
  key: string          // YouTube video ID
  name: string         // e.g. "Official Trailer"
  site: 'YouTube' | 'Vimeo'
  type: 'Trailer' | 'Clip' | 'Teaser' | 'Behind the Scenes' | 'Bloopers' | 'Featurette'
  official: boolean
  published_at: string // ISO date string
}

export interface MovieVideosResponse {
  id: number
  results: MovieVideo[]
}
```

### WatchProvider

Represents a single streaming, rental, or purchase option from TMDB's `/movie/{id}/watch/providers`.

```typescript
export interface WatchProvider {
  logo_path: string
  provider_id: number
  provider_name: string
  display_priority: number
}

export interface WatchProvidersForCountry {
  link: string             // JustWatch URL → redirects to provider's movie page
  flatrate?: WatchProvider[]
  rent?: WatchProvider[]
  buy?: WatchProvider[]
}

export interface WatchProvidersResponse {
  id: number
  results: Record<string, WatchProvidersForCountry>  // Key: ISO 3166-1 country code
}
```

### PersonMovieCredit

Represents a movie in a person's filmography from `/person/{id}/movie_credits`.

```typescript
export interface PersonMovieCredit {
  id: number
  title: string
  poster_path: string | null
  release_date: string
  vote_average: number
  popularity: number
  character?: string  // Present in cast credits
  job?: string        // Present in crew credits (e.g. "Director", "Producer")
  department?: string // e.g. "Directing", "Production"
}

export interface PersonMovieCredits {
  id: number
  cast: PersonMovieCredit[]
  crew: PersonMovieCredit[]
}
```

### HeroSlide (UI state — not stored externally)

Represents one slide in the hero slider. Composed at runtime from a `Movie` and an optionally fetched `MovieVideo`.

```typescript
export interface HeroSlide {
  movie: Movie
  videoKey: string | null  // null if no trailer available yet or fetched
  videoLoaded: boolean     // true once the video key lookup has completed
}
```

### InfiniteScrollPage (hook state — not stored externally)

Internal state shape used by the `useInfiniteMovies` hook for any infinite-scroll list view.

```typescript
interface InfiniteScrollState<T> {
  items: T[]
  page: number
  hasMore: boolean
  loading: boolean
  error: string | null
  fetchMore: () => void
  reset: () => void
}
```

---

## Updated Interfaces

### MovieDetails (existing — extend with runtime field already present)

No changes needed; existing `MovieDetails` covers all movie detail page fields.

---

## Entity Relationships

```
Movie (existing)
  │
  ├── MovieVideo[]        via /movie/{id}/videos
  ├── WatchProvidersResponse  via /movie/{id}/watch/providers
  ├── CreditsResponse (existing)
  │     ├── CastMember[]   → PersonMovieCredits via /person/{id}/movie_credits
  │     └── CrewMember[]   → PersonMovieCredits via /person/{id}/movie_credits
  └── SimilarMoviesResponse (existing)

HeroSlide[]  (composed from Movie[] + MovieVideo per slide)
InfiniteScrollState  (wraps Movie[] for TrendingPage, TopRatedPage, SearchPage)
```

---

## Carousel Section Registry

Defines the ordered list of home page carousels and their data source configuration. Managed as a static constant in `HomePage.tsx`.

```typescript
interface CarouselConfig {
  id: string
  title: string
  hook: () => { movies: Movie[]; loading: boolean; error: string | null }
  rankDisplay?: boolean       // true → show rank numbers (1–N) on cards
  maxItems?: number           // limit results to this count
  categoryDropdown?: boolean  // true → show genre dropdown (Movies by Category)
}
```

| # | Section Title | Hook | rankDisplay | maxItems |
|---|---|---|---|---|
| 1 | New Movies on CineScope | `useNewReleases` | — | — |
| 2 | Today's Top 10 Movies | `useDailyTrending` | ✓ | 10 |
| 3 | Weekly Top 10 Movies | `useWeeklyTrending` | — | 10 |
| 4 | Movies by Category | `useMoviesByGenre` | — | — |
| 5 | Recommended Movies | `useTrendingMovies` | — | — |
| 6 | Critically Acclaimed Movies | `useCriticallyAcclaimed` | — | — |
| 7 | Need a Good Laugh? | `useComedyMovies` | — | — |
| 8 | Sci-Fi & Fantasy Movies | `useSciFiFantasyMovies` | — | — |
| 9 | Movies Based on Real Life | `useRealLifeMovies` | — | — |
| 10 | Anime & Animation Movies | `useAnimationMovies` | — | — |
| 11 | Romantic Movies | `useRomanceMovies` | — | — |
| 12 | Action & Adventure Movies | `useActionAdventureMovies` | — | — |
| 13 | Award-Winning Movies | `useAwardWinningMovies` | — | — |
| 14 | Inspiring Movies | `useInspiringMovies` | — | — |
| 15 | Chilling Thriller Movies | `useThrillerMovies` | — | — |
