# Implementation Plan: Country & Language Content Filter

**Branch**: `018-country-language-options` | **Date**: 2026-04-23 | **Spec**: [spec.md](spec.md)  
**Input**: Feature specification from `specs/009-country-language-filter/spec.md`

## Summary

Add a global country + language filter to CineScope so users can personalise movie content across all pages. Two multi-select dropdowns (Country with globe icon, Language with translate icon) live in the persistent header. Default state is US + English. Selecting "Select All" removes filtering on that dimension. Filter state is held in a React Context and all carousel hooks consume it, passing `with_origin_country` and `with_original_language` parameters to the TMDB `/discover/movie` endpoint. All browse carousels switch to `/discover/movie` as the unified, filterable endpoint; the filter key is embedded in every `useApi` cache key so content refreshes automatically on filter change.

## Technical Context

**Language/Version**: TypeScript 5.0 / JavaScript  
**Primary Dependencies**: React 18, Vite 4, Tailwind CSS 3.3, React Router 6, Vitest + React Testing Library  
**Storage**: In-memory TTL cache (5-min TTL) — filter state in React Context (session-only, no localStorage)  
**Testing**: Vitest + React Testing Library  
**Target Platform**: Browser SPA (GitHub Pages static hosting)  
**Project Type**: Frontend web application (React SPA)  
**Performance Goals**: Content updates within 2 seconds of filter change; country/language list loads within 1 second  
**Constraints**: No localStorage persistence; TMDB free-tier rate limits (40 req/10s); bundle < 200 KB gzipped  
**Scale/Scope**: ~200 countries, ~180 languages from TMDB configuration endpoints; single global filter context

## Constitution Check

*GATE: Must pass before implementation proceeds.*

| Principle | Status | Notes |
|-----------|--------|-------|
| **I. Specification-First** | ✅ PASS | spec.md written and checklist approved before this plan |
| **II. Type Safety** | ✅ PASS | New types `TmdbCountry`, `TmdbLanguage`, `ContentFilterParams` added to `src/types/tmdb.ts`; no `any` types |
| **III. Component-Driven Architecture** | ✅ PASS | `ContentFilterBar` is a reusable component; filter state lives in Context/hooks, not in components |
| **IV. API Contract First** | ✅ PASS | TMDB `/configuration/countries` and `/configuration/languages` endpoints defined; `with_origin_country` / `with_original_language` params documented below |
| **V. Mobile-First Responsive Design** | ✅ PASS | Filter bar is visible and touch-friendly (min-h-[44px] targets) on mobile-first; dropdowns adapt to viewport |
| **VI. Automated Deployment** | ✅ PASS | No change to CI/CD pipeline; feature deploys automatically on merge to main |

## Research Findings

### TMDB API — Content Filtering

**Decision**: Use `/discover/movie` as the unified endpoint for all browse carousels (replacing `/trending/movie/week` and `/movie/top_rated`).

**Rationale**: `/trending/movie/week` and `/movie/top_rated` do not support `with_origin_country` or `with_original_language` parameters. `/discover/movie` is the only TMDB endpoint that supports both simultaneously. Switching all carousels to `/discover/movie` with appropriate `sort_by` parameters provides consistent, transparent filtering.

| Original Endpoint | Replacement via `/discover/movie` | Sort Param |
|---|---|---|
| `/trending/movie/week` | `/discover/movie` | `sort_by=popularity.desc` |
| `/movie/top_rated` | `/discover/movie` | `sort_by=vote_average.desc`, `vote_count.gte=200` |
| `/discover/movie` (genre, new releases, acclaimed) | No change | Existing params preserved |

**Alternatives considered**: Client-side post-filtering — rejected because search endpoint doesn't include origin country in basic Movie type; server-side filtering via `/discover/movie` is authoritative.

### TMDB API — Country and Language Lists

**Decision**: Fetch countries from `/configuration/countries` and languages from `/configuration/languages`.

**Rationale**: Both endpoints return exhaustive lists directly from TMDB — the same source that the content API uses. This ensures the filter options always match what the API can actually filter.

| Endpoint | Response Shape | Cache Key | TTL |
|---|---|---|---|
| `GET /configuration/countries` | `TmdbCountry[]` (flat array) | `'tmdb-countries'` | 5 min |
| `GET /configuration/languages` | `TmdbLanguage[]` (flat array) | `'tmdb-languages'` | 5 min |

### Multi-Select Filter UI

**Decision**: Custom dropdown component using `useState` + `useRef` for open/close control, not native `<select multiple>`.

**Rationale**: Native `<select multiple>` is unstyled across browsers and difficult to theme with Tailwind. A custom panel with checkboxes gives consistent styling, the "Select All" first-item requirement, and the count badge requirement.

**Pattern**: trigger button → overlay panel → `useRef` for click-outside detection → `useEffect` for document mousedown listener.

### Filter Combination Logic

- Multiple countries selected: `with_origin_country=US|FR|KR` (pipe-separated, TMDB OR logic within param)
- Multiple languages selected: `with_original_language=en|fr` (pipe-separated, TMDB OR logic within param)
- Both active simultaneously: TMDB interprets as AND between the two params
- "Select All" (empty array): omit the parameter entirely (no restriction)

### Search Page Limitation

`/search/movie` does not support `with_origin_country` or `with_original_language`. **Decision**: Apply language filter client-side to search results (using `movie.original_language` field, which is always present). Country filtering is intentionally omitted from search results and documented as a known limitation.

### Filter State — React Context

**Decision**: `ContentFilterContext` (React Context) wraps the full app via `App.tsx`. All hooks consume it via `useContentFilter()` custom hook.

**Why not prop-drilling**: Filter is global — affects 5+ carousel sections across 4+ pages. Context avoids threading props through Layout → Page → every carousel component.

**Why not localStorage**: Constitution section 4 Technical Constraints explicitly states "Client-side TTL cache (in-memory, 5-min TTL) — no localStorage persistence". Session-only persistence matches this constraint.

## Project Structure

### Documentation (this feature)

```text
specs/009-country-language-filter/
├── plan.md              ← This file
├── research.md          ← Research findings (inline above)
├── data-model.md        ← Entities and types (below)
└── tasks.md             ← Generated by /speckit-tasks
```

### Source Code Changes

```text
src/
├── context/
│   └── ContentFilterContext.tsx     NEW — Global filter state + provider + hook
├── components/
│   ├── ContentFilterBar.tsx         NEW — Two multi-select dropdowns in header
│   └── Layout.tsx                   MODIFIED — Add <ContentFilterBar /> to header
├── hooks/
│   ├── useCountries.ts              NEW — Fetch + cache country list
│   ├── useLanguages.ts              NEW — Fetch + cache language list
│   ├── useTrendingMovies.ts         MODIFIED — Consume filter context; switch to /discover
│   ├── useTopRatedMovies.ts         MODIFIED — Consume filter context; switch to /discover
│   ├── useMoviesByGenre.ts          MODIFIED — Consume filter context; add filter params
│   ├── useNewReleases.ts            MODIFIED — Consume filter context; add filter params
│   └── useCriticallyAcclaimed.ts   MODIFIED — Consume filter context; add filter params
├── services/
│   └── tmdbApi.ts                   MODIFIED — Add getCountries, getLanguages; update all browse fns with filter params
├── types/
│   └── tmdb.ts                      MODIFIED — Add TmdbCountry, TmdbLanguage, ContentFilterParams
└── App.tsx                          MODIFIED — Wrap with <ContentFilterProvider>

tests/
├── context/
│   └── ContentFilterContext.test.tsx  NEW — Context default state, setters, provider
├── components/
│   └── ContentFilterBar.test.tsx      NEW — Rendering, dropdown open/close, select all, count badge
└── pages/
    ├── HomePage.test.tsx              MODIFIED — Mock useContentFilter in addition to existing mocks
    └── (TrendingPage, TopRatedPage tests if affected by hook signature changes)
```

## Data Model

### New Types (`src/types/tmdb.ts`)

```typescript
export interface TmdbCountry {
  iso_3166_1: string     // e.g. "US", "FR", "KR"
  english_name: string   // e.g. "United States"
  native_name: string    // e.g. "United States"
}

export interface TmdbLanguage {
  iso_639_1: string      // e.g. "en", "fr", "ko"
  english_name: string   // e.g. "English"
  name: string           // e.g. "English" (native script)
}

export interface ContentFilterParams {
  countries: string[]    // ISO 3166-1 codes; empty = no restriction
  languages: string[]    // ISO 639-1 codes; empty = no restriction
}
```

### ContentFilter Context Value

```typescript
interface ContentFilterContextValue {
  countries: string[]              // ISO 3166-1 codes; [] = Select All
  languages: string[]              // ISO 639-1 codes; [] = Select All
  setCountries: (v: string[]) => void
  setLanguages: (v: string[]) => void
  filterKey: string                // Computed: `${countries.join(',')}-${languages.join(',')}`
                                   // Embedded in all useApi cacheKeys for automatic invalidation
}

// Default state (US + English)
const DEFAULT_COUNTRIES = ['US']
const DEFAULT_LANGUAGES = ['en']
```

## API Contracts

### New Service Functions

```typescript
// GET /configuration/countries → TmdbCountry[]
export const getCountries = async (): Promise<TmdbCountry[]>

// GET /configuration/languages → TmdbLanguage[]
export const getLanguages = async (): Promise<TmdbLanguage[]>
```

### Updated Service Functions (filter-aware)

All browse functions add optional `filter` parameter that appends TMDB filter params:

```typescript
// Helper (internal)
const buildFilterParams = (filter: ContentFilterParams): Record<string, string> => {
  // countries non-empty → with_origin_country: "US|FR|KR"
  // languages non-empty → with_original_language: "en|fr"
}

// Trending: was /trending/movie/week, now /discover/movie?sort_by=popularity.desc
export const getTrendingMovies = async (
  page?: number,
  filter?: ContentFilterParams
): Promise<DiscoverResponse>

// Top Rated: was /movie/top_rated, now /discover/movie?sort_by=vote_average.desc
export const getTopRatedMovies = async (
  page?: number,
  filter?: ContentFilterParams
): Promise<DiscoverResponse>

// Existing discover functions — add filter param:
export const getMoviesByGenre = async (
  genreId: number,
  page?: number,
  filter?: ContentFilterParams
): Promise<DiscoverResponse>

export const getNewReleases = async (
  page?: number,
  filter?: ContentFilterParams
): Promise<DiscoverResponse>

export const getCriticallyAcclaimed = async (
  page?: number,
  filter?: ContentFilterParams
): Promise<DiscoverResponse>
```

### Updated Hooks (filter-aware cache keys)

All browse hooks consume `useContentFilter()` and embed `filterKey` in their cache key:

```typescript
// useTrendingMovies — cache key: 'trending-${filterKey}'
// useTopRatedMovies — cache key: 'top-rated-${page}-${filterKey}'
// useMoviesByGenre  — cache key: 'movies-genre-${id}-${filterKey}'
// useNewReleases    — cache key: 'new-releases-${filterKey}'
// useCriticallyAcclaimed — cache key: 'critically-acclaimed-${filterKey}'
```

### ContentFilterBar Component Interface

```typescript
interface ContentFilterBarProps {
  // No external props — reads from ContentFilterContext internally
}

// Internally renders:
// 1. Country dropdown trigger (globe icon + label + count badge)
// 2. Country dropdown panel (Select All + scrollable country list with checkboxes)
// 3. Language dropdown trigger (translate icon + label + count badge)
// 4. Language dropdown panel (Select All + scrollable language list with checkboxes)
```

## Complexity Tracking

No constitution violations. All principles satisfied as documented in the Constitution Check section.

## Implementation Notes

### Filter → Cache → Refetch Flow

When the user changes filter:
1. `setCountries(newCodes)` or `setLanguages(newCodes)` updates Context state
2. `filterKey` recomputes → all `useApi` calls see a different cache key
3. Cache miss → triggers new API fetch with updated filter params
4. Components re-render with filtered content

### useTopRatedMovies — Page Reset on Filter Change

When filter changes, the pagination should reset to page 1. Implementation: `useEffect([filterKey], () => setCurrentPage(1))` inside `useTopRatedMovies`.

### ContentFilterBar Positioning

The filter bar is added as a second row within the existing `<header>` in `Layout.tsx`, below the main nav row. It is always visible across all viewport sizes (responsive padding matches main header: `px-3 sm:px-4 md:px-6 lg:px-8`).

### Known Limitations

1. **Search results**: Language filter applied client-side via `movie.original_language`; country filtering not applied to search results (TMDB `/search/movie` doesn't support `with_origin_country`).
2. **Trending quality change**: Switching from `/trending/movie/week` to `/discover/movie?sort_by=popularity.desc` changes the trending algorithm slightly (time-windowed trending vs global popularity). Acceptable trade-off for consistent filter support.
3. **Large country/language lists**: ~200 countries and ~180 languages — dropdowns require vertical scroll. No search-within-dropdown for v1.
