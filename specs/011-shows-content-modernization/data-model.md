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

---

## Phase 2 Types (2026-04-24)

### `CarouselConfig`

Defines a single carousel's display properties and data source. Used in `src/config/carousels.ts` and consumed by `src/pages/HomePage.tsx`.

```typescript
interface CarouselConfig {
  id: string;              // Unique identifier (kebab-case, stable key for React)
  title: string;           // Display title — the single source of truth for carousel label
  type: 'movies' | 'shows' | 'both'; // Content type this carousel renders
  hookKey: string;         // Maps to the data hook in the hookMap lookup
  rankDisplay: boolean;    // Whether to show rank numbers (1, 2, 3...) on cards
}
```

### `OTTPlatform`

Represents a streaming service provider in the "Where to Watch" section. Combines TMDB provider data with direct navigation URLs.

```typescript
interface OTTPlatform {
  provider_id: number;     // TMDB provider_id (e.g., 8 for Netflix)
  provider_name: string;   // Display name
  logo_path: string | null; // TMDB logo path (used to construct image URL)
  webUrl: string;          // Direct URL to OTT platform content or search page
  appScheme?: string;      // Mobile app URL scheme for deep-linking (optional)
}
```

### `DropdownOption`

Represents a single option in the Country or Language dropdown. Used to enforce sorted display and selected-state visibility.

```typescript
interface DropdownOption {
  value: string;    // ISO code (e.g., 'US', 'en')
  label: string;    // Display name (e.g., 'United States', 'English')
}
```

---

## Updated Entity Relationships (Phase 2)

```
CarouselConfig[]  (src/config/carousels.ts)
  └── hookKey → hookMap[hookKey] → UseCarouselHookReturn
                                    └── { items, loading, error, loadMore, hasMore }

OTTPlatform
  └── derived from TMDB watch-providers response + ottProviders config mapping
  └── used by WatchProviders component → navigateToOTT() utility

DropdownOption[]
  └── sorted alphabetically by label before render
  └── selected options pinned to top during search filtering
```

---

## Updated Validation Rules (Phase 2)

| Field | Rule |
|-------|------|
| `CarouselConfig.id` | Non-empty, unique kebab-case string across all carousel configs |
| `CarouselConfig.hookKey` | Must match a key in the `hookMap` in `HomePage.tsx` |
| `CarouselConfig.type` | Exactly one of: `'movies'`, `'shows'`, `'both'` |
| `OTTPlatform.provider_id` | Positive integer matching TMDB provider_id |
| `OTTPlatform.webUrl` | Non-empty valid URL string |
| `OTTPlatform.appScheme` | Optional; must be a valid URL scheme if provided |
| `DropdownOption.value` | Non-empty ISO code string |
| `DropdownOption.label` | Non-empty display string; used for alphabetical sort |
