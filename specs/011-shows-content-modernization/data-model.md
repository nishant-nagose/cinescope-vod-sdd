# Data Model: Shows Content Modernization

**Branch**: `021-shows-modernization` | **Date**: 2026-04-23

All types are additions or extensions to `src/types/tmdb.ts`. Existing movie types (`Movie`, `MovieDetails`, etc.) are unchanged.

---

## New Types

### `TVShow` (base)

Returned by list endpoints (`/trending/tv`, `/discover/tv`, `/tv/top_rated`, `/search/multi`).

```typescript
interface TVShow {
  id: number;
  name: string;                    // TV show title (vs Movie.title)
  original_name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
  popularity: number;
  first_air_date: string;          // ISO date (vs Movie.release_date)
  origin_country: string[];
  original_language: string;
  genre_ids: number[];
  media_type?: 'tv';               // Present in /search/multi results
}
```

### `TVShowDetails` (extends TVShow)

Returned by `GET /tv/{id}`. Contains full season/episode metadata.

```typescript
interface TVShowDetails extends Omit<TVShow, 'genre_ids'> {
  genres: Genre[];
  tagline: string;
  status: string;                  // e.g., "Returning Series", "Ended"
  type: string;                    // e.g., "Scripted", "Reality"
  number_of_seasons: number;
  number_of_episodes: number;
  seasons: SeasonSummary[];        // Lightweight list (no episodes)
  networks: Network[];
  production_companies: ProductionCompany[];
  episode_run_time: number[];
  homepage: string;
  in_production: boolean;
  languages: string[];
  last_air_date: string;
  last_episode_to_air: EpisodeSummary | null;
  next_episode_to_air: EpisodeSummary | null;
}
```

### `SeasonSummary`

Part of `TVShowDetails.seasons` list — lightweight, no episodes.

```typescript
interface SeasonSummary {
  id: number;
  name: string;
  season_number: number;
  episode_count: number;
  air_date: string | null;
  poster_path: string | null;
  overview: string;
}
```

### `SeasonDetails`

Returned by `GET /tv/{id}/season/{season_number}`. Contains full episode list.

```typescript
interface SeasonDetails {
  id: number;
  name: string;
  season_number: number;
  air_date: string | null;
  poster_path: string | null;
  overview: string;
  episodes: Episode[];
}
```

### `Episode`

Individual episode within a season.

```typescript
interface Episode {
  id: number;
  name: string;
  episode_number: number;
  season_number: number;
  overview: string;
  air_date: string | null;
  still_path: string | null;      // Episode thumbnail image
  vote_average: number;
  vote_count: number;
  runtime: number | null;         // Minutes
}
```

### `EpisodeSummary`

Lightweight episode reference (used in `TVShowDetails.last_episode_to_air`, etc.).

```typescript
interface EpisodeSummary {
  id: number;
  name: string;
  episode_number: number;
  season_number: number;
  air_date: string | null;
}
```

### `Network`

Broadcaster/streaming platform for a TV show.

```typescript
interface Network {
  id: number;
  name: string;
  logo_path: string | null;
  origin_country: string;
}
```

---

## Updated Types

### `ContentFilterParams` (extend existing)

Add `contentType` and `activeCategory` to the existing type.

```typescript
interface ContentFilterParams {
  country: string;
  language: string;
  contentType: 'movies' | 'shows' | 'all';   // NEW
  activeCategory: number | null;              // NEW — genre ID, null = all
}
```

---

## Updated Response Types

```typescript
// List responses — same shape as existing movie list responses
interface TVShowListResponse {
  page: number;
  results: TVShow[];
  total_pages: number;
  total_results: number;
}

interface SeasonDetailsResponse extends SeasonDetails {}  // alias for clarity

// Search multi — used by unified search
interface MultiSearchResult {
  page: number;
  results: (Movie | TVShow | Person)[];       // Person filtered out client-side
  total_pages: number;
  total_results: number;
}

interface Person {
  id: number;
  name: string;
  media_type: 'person';
  // ... (only id + media_type needed for filtering)
}
```

---

## Entity Relationships

```
TVShowDetails
  └── seasons: SeasonSummary[]         (lightweight, no episodes)
       └── (fetch on demand) → SeasonDetails
                                └── episodes: Episode[]

ContentFilterParams
  ├── contentType → drives which carousel set renders (movies / shows / all)
  └── activeCategory → genre ID filter applied to all visible carousels

HeroSlider content
  └── (Movie | TVShow)[]  tagged with mediaType: 'movie' | 'tv'
```

---

## Validation Rules

| Field | Rule |
|-------|------|
| `TVShow.id` | Unique positive integer; TMDB-assigned |
| `TVShow.name` | Non-empty string |
| `Episode.episode_number` | 1-based integer within a season |
| `SeasonSummary.season_number` | 0 = Specials (valid); ≥ 1 = regular seasons |
| `ContentFilterParams.contentType` | Exactly one of: `'movies'`, `'shows'`, `'all'` |
| `ContentFilterParams.activeCategory` | `null` (all) or a valid TMDB genre ID integer |
| Hero slider items | Deduplicated by `id + mediaType`; max 10 items |
