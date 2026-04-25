# Quickstart: Shows Content Modernization

**Branch**: `021-shows-modernization` | **Date**: 2026-04-23

## Prerequisites

- Node.js 18+ and npm installed
- TMDB API key in `.env.local` as `VITE_TMDB_API_KEY=<your_key>`
- Current branch: `021-shows-modernization`

## Local Development

```bash
# Install dependencies (already installed — run only if package.json changed)
npm install

# Start dev server
npm run dev
# → App available at http://localhost:5173/cinescope-vod-sdd/

# Run tests
npm test

# Run tests with coverage
npm run coverage

# Type check only (no emit)
npx tsc --noEmit

# Build for production
npm run build
```

## Implementation Order

Follow this order to avoid merge conflicts and broken intermediate states:

### Step 1 — Types & API Layer (no UI changes)
1. Add TV show types to `src/types/tmdb.ts` (see `data-model.md`)
2. Add TV endpoints to `src/services/tmdbApi.ts` (see `contracts/tmdb-tv-api.md`)
3. Run `npx tsc --noEmit` — must pass with zero errors

### Step 2 — Hooks (no UI changes)
4. Create all new TV show hooks in `src/hooks/` (one file per carousel)
5. Update `useHeroSlider.ts` to merge movies + shows
6. Update `ContentFilterContext.tsx` to add `contentType` + `activeCategory`
7. Create `useContentSearch.ts` (unified search)
8. Run `npx tsc --noEmit` — must pass

### Step 3 — Component Fixes (isolated changes)
9. Fix `MovieCarousel.tsx`: add `singleRow` prop; add horizontal sentinel for infinite scroll; confirm `onRetry` renders retry button when `error` is set
10. Create `LazySection.tsx` (viewport-triggered render wrapper)
11. Fix `HeroSlider.tsx`: accept mixed `(Movie | TVShow)[]` with `mediaType` tag
12. Create `ShowCard.tsx` (or extend `MovieCard` for shows)
13. Create `EpisodeList.tsx` (accordion episode list)
14. Fix `ContentFilterBar.tsx`: add Movies/Shows toggle + Category dropdown

### Step 4 — New Page
15. Create `src/pages/ShowDetailPage.tsx`
16. Add `/show/:id` route in `src/App.tsx` / `src/routes.tsx`
17. Add `ScrollToTop` component and wire into router

### Step 5 — Home Page Updates
18. Update `HomePage.tsx`: add all show carousels; fix welcome message; wire content filter toggle; wrap all carousels in `<LazySection>`; remove "Shows by Category" carousel

### Step 6 — Logo Fix
19. Update `Layout.tsx` (or wherever logo renders): replace old static `<img>` with premium logo asset

### Step 7 — Search Update
20. Update `SearchPage.tsx` to use `searchMulti` + type badge + correct routing

### Step 8 — Tests & Relocation
21. `git mv tests/TopRatedPage.test.tsx tests/pages/TopRatedPage.test.tsx`
22. `git mv tests/TrendingPage.test.tsx tests/pages/TrendingPage.test.tsx`
23. Create `tests/pages/ShowDetailPage.test.tsx`
24. Run full test suite: `npm test` — all tests must pass

## Key File Locations

| File | Purpose |
|------|---------|
| `src/types/tmdb.ts` | All TMDB TypeScript interfaces |
| `src/services/tmdbApi.ts` | TMDB API service (sole gateway to external data) |
| `src/services/cache.ts` | In-memory 5-min TTL cache |
| `src/hooks/useApi.ts` | Base data-fetching hook (caching, retry, error) |
| `src/context/ContentFilterContext.tsx` | Global filter state (country, language, contentType, category) |
| `src/components/MovieCarousel.tsx` | Reusable horizontal carousel |
| `src/pages/HomePage.tsx` | Home page — most changes land here |
| `src/App.tsx` / `src/routes.tsx` | Route definitions |
| `tests/` | All test files (Vitest + React Testing Library) |

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_TMDB_API_KEY` | Yes | TMDB Free API key — get from themoviedb.org |

## Verification Checklist (Before PR)

### Phase 1 — Core Implementation

- [X] `npx tsc --noEmit` passes with zero errors
- [X] `npm test` — all tests pass (11 test files, 90 tests, 0 failures)
- [X] Hero slider visible on home page load (HeroSlider.tsx accepts mixed Movie+Show items)
- [X] At least 3 show carousels visible on home page (14 show carousels implemented)
- [X] Each carousel renders one row (singleRow prop enforced)
- [X] Empty carousels are not rendered (header absent) (returns null when no movies/shows)
- [X] Clicking a show card opens ShowDetailPage scrolled to top (ScrollToTop + /show/:id route)
- [X] Season list renders; selecting a season shows episode list (useSeasonDetails + EpisodeList)
- [X] Clicking an episode expands metadata inline (no navigation) (EpisodeList accordion)
- [X] Content type toggle (Movies/Shows) filters all carousels (ContentFilterContext + ContentFilterBar)
- [X] Welcome message visible on home page (restored in HomePage.tsx)
- [X] Premium logo visible in top-right; no old logo image (cinescope-logo-black.png in Layout.tsx)
- [X] Navigating to any details page scrolls to top (ScrollToTop component registered in routes)
- [X] Search returns both movies and shows; each result has a type label (SearchPage + useContentSearch)
- [X] `tests/pages/TopRatedPage.test.tsx` exists and passes
- [X] `tests/pages/TrendingPage.test.tsx` exists and passes
- [X] `tests/pages/ShowDetailPage.test.tsx` exists and passes
- [X] `npm run build` succeeds (89 modules, 78.64 kB gzipped bundle)

### Phase 2 — Bug Fixes & Feature Enhancements

- [X] Country and Language dropdowns show options in ascending alphabetical order
- [X] Country and Language dropdowns show selected option pinned at top when user types a search query
- [X] Movie Details page backdrop fills container — no top/bottom cropping
- [X] Movie Details page trailer plays without top/bottom cropping
- [X] Show Details page backdrop fills container — no top/bottom cropping
- [X] Show Details page trailer plays without top/bottom cropping
- [X] Hero Slider slide images display without top/bottom cropping
- [X] Carousel scroll position is preserved when additional content loads (cross-browser: Desktop, iOS, Android Chrome)
- [X] Show carousel card images load and display correctly on every page load
- [X] Header renders 4 logical zones on desktop (Logo | Search | Content Toggle | Nav+Filters) via CSS Grid
- [X] Header Navigation links (Trending, Top Rated, Search) visually separated from filter controls (Categories, Country, Language)
- [X] Header responsive: 4 zones on desktop; overlay `⋮` on tablet; Logo + icons + hamburger on mobile
- [X] Movies/Shows Content Toggle drives hero slider content (Movies only / Shows only / All)
- [X] No carousel title strings hardcoded in `src/pages/HomePage.tsx`; all titles from `src/config/carousels.ts`
- [X] OTT provider icons in "Where to Watch" navigate directly to OTT platform (no TMDB redirect)
- [X] Desktop: OTT icon click opens OTT platform page in new tab
- [X] Mobile: OTT icon tap attempts app deep-link; falls back to OTT web page in new tab

### Post-Phase-16 Patches

- [X] RegionDropdown search input font-size 16px — no zoom-on-focus on iOS/Android
- [X] Trailer auto-advances hero slider when YouTube video ends (enablejsapi + postMessage handler)
- [X] Hero slider swipe navigation works on mobile browsers (onTouchStart/onTouchEnd, 50px threshold)
- [X] Hero slider shows regional content (lowered vote_count thresholds in getHeroMovies/getHeroShows)
