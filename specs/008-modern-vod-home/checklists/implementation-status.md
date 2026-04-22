# Implementation Status Checklist: Modern VOD Home Page

**Purpose**: Validate that Spec 008 implementation is complete and meets all requirements
**Created**: 2026-04-22
**Feature**: [spec.md](../spec.md)
**Status**: FULLY IMPLEMENTED ✓

## New Files Created

- [x] **`src/pages/HomePage.tsx`** — Main home page with 5 carousel sections
- [x] **`src/components/MovieCarousel.tsx`** — Reusable horizontal 2-row scroll carousel
- [x] **`src/components/CategoryDropdown.tsx`** — Genre selection dropdown
- [x] **`src/hooks/useGenres.ts`** — Genre list via `/genre/movie/list`
- [x] **`src/hooks/useMoviesByGenre.ts`** — Movies filtered by genre via `/discover/movie`
- [x] **`src/hooks/useNewReleases.ts`** — New releases via `/discover/movie?sort_by=release_date.desc`
- [x] **`src/hooks/useCriticallyAcclaimed.ts`** — Acclaimed movies via `/discover/movie?sort_by=vote_average.desc`
- [x] **`tests/pages/HomePage.test.tsx`** — 10 tests for HomePage
- [x] **`tests/components/MovieCarousel.test.tsx`** — 10 tests for MovieCarousel

## Files Updated

- [x] **`src/services/tmdbApi.ts`** — Added `getGenres`, `getMoviesByGenre`, `getNewReleases`, `getCriticallyAcclaimed`
- [x] **`src/types/tmdb.ts`** — Added `GenresResponse`, `DiscoverResponse`
- [x] **`src/routes.tsx`** — `HomePage` at `/`; `TrendingPage` moved to `/trending`
- [x] **`src/components/Layout.tsx`** — "Trending" nav links updated to `/trending` (header, mobile menu, footer)

## Component Implementation

### `MovieCarousel` (`src/components/MovieCarousel.tsx`)

- [x] `title` prop — renders `<h2>` section heading
- [x] `titleExtra` prop — renders adjacent to title (used for CategoryDropdown)
- [x] `movies` prop — splits into row1 (0–9) and row2 (10–19)
- [x] Two-row horizontal scroll: `overflow-x-auto` container, `flex flex-col gap-3 sm:gap-4 w-max` inner
- [x] Card widths: `w-[150px] sm:w-[165px] md:w-[190px] lg:w-[210px] xl:w-[225px]`
- [x] Scroll arrows: hidden on mobile (`hidden md:flex`), appear on parent hover (`group-hover:opacity-100`)
- [x] `aria-label={title}` on `<section>`, `aria-label="Scroll left/right"` on arrow buttons
- [x] `loading` prop → animated skeleton (2 rows × 6 placeholder cards, `animate-pulse`)
- [x] `error` prop → red message + Retry button (`onRetry` callback)
- [x] Empty state → "No movies available for this section."
- [x] Custom scrollbar styling via Tailwind arbitrary variants (`[&::-webkit-scrollbar]`)
- [x] `min-h-[44px] min-w-[44px]` on arrow buttons (touch target spec)

### `CategoryDropdown` (`src/components/CategoryDropdown.tsx`)

- [x] `genres` prop — renders all TMDB genres as `<option>` elements
- [x] `selectedGenreId` prop — controlled select value
- [x] `onChange` prop — calls with `Number(e.target.value)` on change
- [x] `aria-label="Select movie genre"` for accessibility
- [x] `min-h-[44px]` — minimum touch target size
- [x] `focus:ring-2 focus:ring-blue-500` — visible focus indicator

### `HomePage` (`src/pages/HomePage.tsx`)

- [x] Welcome heading and "Browse all trending →" link to `/trending`
- [x] **Top & Latest Movies** — `useTrendingMovies()` → `MovieCarousel`
- [x] **Top 10 Movies Today** — `useTopRatedMovies()` → first 20 movies → `MovieCarousel`
- [x] **Movies by Category** — `useGenres()` + `useState(ACTION_GENRE_ID=28)` + `useMoviesByGenre(selectedGenreId)` + `CategoryDropdown` via `titleExtra`
- [x] **New on CineScope** — `useNewReleases()` → `MovieCarousel`
- [x] **Critically Acclaimed** — `useCriticallyAcclaimed()` → `MovieCarousel`
- [x] Footer nav links: All Trending →, All Top Rated →, Search Movies →

## API Endpoints Added (`src/services/tmdbApi.ts`)

| Function | Endpoint | Sort/Filter | Return Type |
|----------|----------|-------------|-------------|
| `getGenres()` | `/genre/movie/list` | — | `GenresResponse` |
| `getMoviesByGenre(id, page)` | `/discover/movie` | `with_genres={id}`, `sort_by=popularity.desc` | `DiscoverResponse` |
| `getNewReleases(page)` | `/discover/movie` | `sort_by=release_date.desc`, `vote_count.gte=50` | `DiscoverResponse` |
| `getCriticallyAcclaimed(page)` | `/discover/movie` | `sort_by=vote_average.desc`, `vote_count.gte=300` | `DiscoverResponse` |

## Hook Cache Keys

| Hook | Cache Key | TTL |
|------|-----------|-----|
| `useGenres` | `'genres'` | 5 min |
| `useMoviesByGenre(id)` | `'movies-genre-{id}'` | 5 min |
| `useNewReleases` | `'new-releases'` | 5 min |
| `useCriticallyAcclaimed` | `'critically-acclaimed'` | 5 min |

## Routing Change

| Route | Before | After |
|-------|--------|-------|
| `/` | `TrendingPage` | `HomePage` |
| `/trending` | (none) | `TrendingPage` |

## Success Criteria Verification

- [x] **SC-001**: All 5 carousel sections render with movie data
  - ✓ Verified via `HomePage.test.tsx` — all 5 headings present, movies render
- [x] **SC-002**: Horizontal scrolling works (`overflow-x-auto`, native touch support)
  - ✓ Native browser scroll; arrows for desktop
- [x] **SC-003**: Category filtering without page refresh
  - ✓ `useState(selectedGenreId)` + `useMoviesByGenre(genreId)` — no navigation
  - ✓ Verified: `fireEvent.change` on select calls `useMoviesByGenre` with new id
- [x] **SC-004**: Movie cards navigate to `/movie/:id`
  - ✓ `<Link to={'/movie/${movie.id}'}>` in `MovieCard`
  - ✓ Verified: `MovieCarousel.test.tsx` checks `href="/movie/42"`
- [x] **SC-005**: Responsive design — breakpoint card widths set
  - ✓ `w-[150px] sm:w-[165px] md:w-[190px] lg:w-[210px] xl:w-[225px]`
- [x] **SC-006**: Loading states — skeleton loaders per carousel
  - ✓ Verified: `MovieCarousel.test.tsx` "renders skeleton when loading"
- [x] **SC-007**: Error states — message + retry per carousel
  - ✓ Verified: `HomePage.test.tsx` error + retry tests
- [x] **SC-008**: Navigation links to `/trending`, `/top-rated`, `/search`
  - ✓ Layout nav updated; HomePage footer links present

## Testing

- [x] `tests/components/MovieCarousel.test.tsx` — 10 tests
  - heading render, movie cards, 2-row layout, skeleton, error+retry, empty state, arrows, titleExtra, link href
- [x] `tests/pages/HomePage.test.tsx` — 10 tests (all mocking hooks, not raw API)
  - welcome heading, 5 section headings, movie cards, genre dropdown, genre options, genre change, nav links, loading, error, retry
- [x] All existing tests unaffected: 75/75 passing across 9 files in 3.07s

## Notes

- `TrendingPage` moved from `/` to `/trending` — existing `TrendingPage.test.tsx` unaffected (route-agnostic)
- `useMoviesByGenre` passes `enabled: genreId > 0` to skip fetch if no genre selected
- `vote_count.gte` filters on discover endpoints prevent low-quality results corrupting carousels
- Arrow buttons hidden on mobile (`hidden md:flex`) — mobile uses native touch scroll

---

## Final Status: ✅ FULLY IMPLEMENTED

**Implementation Date**: 2026-04-22
**Branch**: `017-modern-vod-home`
**All Success Criteria Met**: 8/8 (code-level)
**Tests**: 75/75 passing (9 test files, 3.07s)
**TypeScript**: Clean (0 errors)
**New Components**: MovieCarousel, CategoryDropdown, HomePage
**New Hooks**: useGenres, useMoviesByGenre, useNewReleases, useCriticallyAcclaimed
**New API Methods**: getGenres, getMoviesByGenre, getNewReleases, getCriticallyAcclaimed
**Ready for Production**: Yes
