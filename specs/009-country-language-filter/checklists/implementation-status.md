# Implementation Status Checklist: Country & Language Content Filter

**Purpose**: Validate that Spec 009 implementation is complete and meets all requirements
**Created**: 2026-04-23
**Feature**: [spec.md](../spec.md)
**Status**: FULLY IMPLEMENTED ✓

## New Files Created

- [x] **`src/context/ContentFilterContext.tsx`** — ContentFilterProvider, ContentFilterContextValue, useContentFilter hook; default state US + English; computed filterKey
- [x] **`src/components/ContentFilterBar.tsx`** — Two multi-select dropdowns (country + language) with globe/translate icons, count badges, Select All toggle, click-outside close
- [x] **`src/hooks/useCountries.ts`** — useApi wrapper for GET /configuration/countries; cacheKey 'tmdb-countries'
- [x] **`src/hooks/useLanguages.ts`** — useApi wrapper for GET /configuration/languages; cacheKey 'tmdb-languages'
- [x] **`tests/context/ContentFilterContext.test.tsx`** — 7 tests for context default state, setters, filterKey computation, provider, and hook guard
- [x] **`tests/components/ContentFilterBar.test.tsx`** — 11 tests for render, dropdown open/close, checkbox toggle, Select All logic, count badges, mutual exclusion

## Files Updated

- [x] **`src/types/tmdb.ts`** — Added TmdbCountry, TmdbLanguage, ContentFilterParams interfaces
- [x] **`src/services/tmdbApi.ts`** — Added buildFilterParams (internal), getCountries, getLanguages; migrated getTrendingMovies and getTopRatedMovies to /discover/movie; added filter?: ContentFilterParams to getMoviesByGenre, getNewReleases, getCriticallyAcclaimed
- [x] **`src/App.tsx`** — Wrapped root in ContentFilterProvider
- [x] **`src/hooks/useTrendingMovies.ts`** — Calls useContentFilter(); passes filter; cacheKey 'trending-${filterKey}'
- [x] **`src/hooks/useTopRatedMovies.ts`** — Calls useContentFilter(); passes filter; cacheKey 'top-rated-${page}-${filterKey}'; useEffect resets page to 1 on filterKey change
- [x] **`src/hooks/useMoviesByGenre.ts`** — Calls useContentFilter(); passes filter; cacheKey 'movies-genre-${genreId}-${filterKey}'
- [x] **`src/hooks/useNewReleases.ts`** — Calls useContentFilter(); passes filter; cacheKey 'new-releases-${filterKey}'
- [x] **`src/hooks/useCriticallyAcclaimed.ts`** — Calls useContentFilter(); passes filter; cacheKey 'critically-acclaimed-${filterKey}'
- [x] **`src/components/Layout.tsx`** — Added ContentFilterBar as second row within sticky header
- [x] **`src/components/MovieCarousel.tsx`** — Added optional emptyMessage prop (default: "No movies available for this section.")
- [x] **`src/pages/HomePage.tsx`** — Passes emptyMessage="No movies found for the selected filters." to all 5 MovieCarousel instances
- [x] **`src/pages/SearchPage.tsx`** — Client-side language filter via movie.original_language; country filter omitted (TMDB limitation)
- [x] **`tests/pages/HomePage.test.tsx`** — Added vi.mock for useContentFilter
- [x] **`tests/pages/SearchPage.test.tsx`** — Added vi.mock for useContentFilter
- [x] **`tests/TrendingPage.test.tsx`** — Added vi.mock for useContentFilter
- [x] **`tests/TopRatedPage.test.tsx`** — Added vi.mock for useContentFilter
- [x] **`tests/services/tmdbApi.test.ts`** — Updated trending/top-rated tests for new /discover/movie endpoint; added tests for getCountries, getLanguages, filter params (with_origin_country, with_original_language), empty array omission

## Component Implementation

### `ContentFilterContext` (`src/context/ContentFilterContext.tsx`)

- [x] ContentFilterContextValue interface with countries, languages, setCountries, setLanguages, filterKey
- [x] ContentFilterProvider with useState for countries (default ['US']) and languages (default ['en'])
- [x] filterKey computed as `${countries.join(',')}-${languages.join(',')}`
- [x] useContentFilter hook throws if used outside ContentFilterProvider

### `ContentFilterBar` (`src/components/ContentFilterBar.tsx`)

- [x] No external props — reads/writes via useContentFilter()
- [x] useCountries() and useLanguages() called internally
- [x] Country dropdown: globe SVG icon, trigger button with "All Countries" / "N Country/Countries" badge
- [x] Country panel: max-h-64 overflow-y-auto, "Select All" checkbox first, all TmdbCountry as checkboxes
- [x] Language dropdown: translate SVG icon, trigger button with "All Languages" / "N Language/Languages" badge
- [x] Language panel: same structure as country panel
- [x] Select All logic: clicking it calls setCountries([]) / setLanguages([])
- [x] Individual select when Select All active: sets single-item array [code]
- [x] Individual toggle: adds/removes code from existing array
- [x] Click-outside via useRef + document mousedown listener — closes whichever panel is open
- [x] Opening one dropdown closes the other
- [x] min-h-[36px] touch-friendly trigger buttons

### API Endpoint Migration (`src/services/tmdbApi.ts`)

| Function | Old Endpoint | New Endpoint | Notes |
|----------|-------------|-------------|-------|
| `getTrendingMovies` | `/trending/movie/week` | `/discover/movie?sort_by=popularity.desc` | Filterable |
| `getTopRatedMovies` | `/movie/top_rated` | `/discover/movie?sort_by=vote_average.desc&vote_count.gte=200` | Filterable |
| `getMoviesByGenre` | `/discover/movie` (unchanged) | same | Added filter param |
| `getNewReleases` | `/discover/movie` (unchanged) | same | Added filter param |
| `getCriticallyAcclaimed` | `/discover/movie` (unchanged) | same | Added filter param |
| `getCountries` | (new) | `/configuration/countries` | Returns TmdbCountry[] |
| `getLanguages` | (new) | `/configuration/languages` | Returns TmdbLanguage[] |

### Filter Parameter Encoding (`buildFilterParams`)

- [x] countries non-empty → `with_origin_country=US|FR|KR` (pipe-joined ISO 3166-1)
- [x] languages non-empty → `with_original_language=en|fr|ko` (pipe-joined ISO 639-1)
- [x] empty array → param omitted entirely (no restriction = Select All)

### Updated Hook Cache Keys

| Hook | Cache Key |
|------|-----------|
| `useTrendingMovies` | `trending-${filterKey}` |
| `useTopRatedMovies` | `top-rated-${page}-${filterKey}` |
| `useMoviesByGenre` | `movies-genre-${genreId}-${filterKey}` |
| `useNewReleases` | `new-releases-${filterKey}` |
| `useCriticallyAcclaimed` | `critically-acclaimed-${filterKey}` |
| `useCountries` | `tmdb-countries` (static — list doesn't change) |
| `useLanguages` | `tmdb-languages` (static — list doesn't change) |

## Success Criteria Verification

- [x] **SC-001**: Users can change country/language within 3 interactions (click trigger → click item → close)
  - ✓ Trigger click → panel opens → checkbox click → panel closes on click-outside
- [x] **SC-002**: Content updates within 2 seconds of filter change
  - ✓ filterKey change → cache miss → new fetch with updated params → re-render
- [x] **SC-003**: Default US + English on first load
  - ✓ ContentFilterContext default state: countries=['US'], languages=['en']
  - ✓ Verified via ContentFilterContext.test.tsx — default filterKey 'US-en'
- [x] **SC-004**: Select All resets filter and content refreshes within 2 seconds
  - ✓ setCountries([]) / setLanguages([]) → filterKey changes → cache bust
  - ✓ Verified via ContentFilterBar.test.tsx — Select All calls setter with []
- [x] **SC-005**: Filter selections survive navigation between pages
  - ✓ ContentFilterProvider wraps entire app (App.tsx) — context persists across route changes
- [x] **SC-006**: Filter controls usable on mobile (375px+) with touch targets
  - ✓ ContentFilterBar in sticky header, visible all widths; min-h-[36px] buttons
- [x] **SC-007**: Empty-state message shown without layout breaks
  - ✓ MovieCarousel.emptyMessage prop set to "No movies found for the selected filters." in all carousel pages
- [x] **SC-008**: Count badge correctly reflects active selections
  - ✓ "All Countries" (0), "1 Country" (1), "N Countries" (N>1); same for languages
  - ✓ Verified via ContentFilterBar.test.tsx — count badge tests

## Known Limitations (from plan.md)

- **Search country filter**: `/search/movie` doesn't support `with_origin_country`; country filter not applied to search results (language filter applied client-side via `movie.original_language`)
- **Trending algorithm change**: Switched from `/trending/movie/week` (time-windowed) to `/discover/movie?sort_by=popularity.desc` (global popularity) — acceptable trade-off for filter support
- **No search-within-dropdown**: ~200 countries / ~180 languages listed without in-dropdown search (V2 enhancement)

## Testing

- [x] `tests/context/ContentFilterContext.test.tsx` — 7 tests (NEW)
- [x] `tests/components/ContentFilterBar.test.tsx` — 11 tests (NEW)
- [x] `tests/services/tmdbApi.test.ts` — updated: trending/top-rated endpoint assertions; +getCountries, +getLanguages, +filter param tests
- [x] `tests/pages/HomePage.test.tsx` — updated: useContentFilter mock added; all 10 existing tests pass
- [x] `tests/pages/SearchPage.test.tsx` — updated: useContentFilter mock added; all 9 existing tests pass
- [x] `tests/TrendingPage.test.tsx` — updated: useContentFilter mock added; all 3 existing tests pass
- [x] `tests/TopRatedPage.test.tsx` — updated: useContentFilter mock added; all 5 existing tests pass
- [x] All 99 tests passing across 11 test files

---

## Final Status: ✅ FULLY IMPLEMENTED

**Implementation Date**: 2026-04-23
**Branch**: `018-country-language-options`
**All Success Criteria Met**: 8/8
**Tests**: 99/99 passing (11 test files)
**New Files**: ContentFilterContext.tsx, ContentFilterBar.tsx, useCountries.ts, useLanguages.ts, ContentFilterContext.test.tsx, ContentFilterBar.test.tsx
**Modified Files**: tmdb.ts, tmdbApi.ts, App.tsx, 5 hooks, Layout.tsx, MovieCarousel.tsx, HomePage.tsx, SearchPage.tsx, 4 test files
**Ready for Production**: Yes
