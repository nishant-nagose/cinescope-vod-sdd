# Implementation Plan: CineScope App Modernization

**Branch**: `019-modernization` | **Date**: 2026-04-23 | **Spec**: [spec.md](spec.md)  
**Input**: Feature specification from `specs/010-modernization/spec.md`

## Summary

Modernize the CineScope VOD browsing app to match premium OTT platform standards. The modernization covers seven functional areas: (1) a full-width hero slider with auto-playing trailers at the top of the home page; (2) a redesigned home page with 15 ordered carousel sections including ranked Top 10 rows; (3) enhanced movie detail page with 10-second trailer auto-play, Trailers & Clips, Filmography, Watch Providers, and enriched Cast & Crew; (4) infinite scrolling replacing all pagination on Trending, Top Rated, and Search pages; (5) searchable and repositioned Country/Language filter dropdowns; (6) premium branded launch animation with a one-time-per-session play; and (7) GitHub Pages SPA routing fix to eliminate 404 errors on hard refresh.

The implementation adds 8 new TMDB service functions, 9 new components, 10 new hooks, modifies 4 existing hooks, 4 pages, 3 components, and adds 2 static files for the 404 fix.

## Technical Context

**Language/Version**: TypeScript 5.0 / JavaScript  
**Primary Dependencies**: React 18, Vite, Tailwind CSS, React Router 6, Vitest + React Testing Library  
**Storage**: Client-side in-memory TTL cache (5-min TTL) — unchanged  
**Testing**: Vitest + React Testing Library  
**Target Platform**: GitHub Pages (static SPA, `/cinescope-vod-sdd/` base path)  
**Project Type**: Frontend web application (SPA)  
**Performance Goals**: Initial load < 2s, hero slider visible within 4s, infinite scroll delivers next batch within 2s, filter dropdown search response < 300ms  
**Constraints**: TMDB free API (40 req/10s rate limit), no backend, public access only, GitHub Pages static hosting  
**Scale/Scope**: 15 carousel sections, 3 infinite-scroll pages, 1 hero slider, 1 launch animation, 9 new integration test scenarios

## Constitution Check

*GATE: Must pass before implementation. Re-checked post-design (below).*

| Principle | Status | Notes |
|---|---|---|
| I. Specification-First | ✅ PASS | spec.md complete and validated; plan.md in place before any code |
| II. Type Safety | ✅ PASS | 5 new interfaces added to `src/types/tmdb.ts`; all new hooks/components typed |
| III. Component-Driven Architecture | ✅ PASS | 9 new components, each with single responsibility; pages compose only |
| IV. API Contract First | ✅ PASS | All 8 new TMDB functions defined in contracts/new-tmdb-endpoints.md |
| V. Mobile-First Responsive Design | ✅ PASS | Hero slider, ranked cards, infinite scroll all use mobile-first Tailwind breakpoints |
| VI. Automated Deployment | ✅ PASS | CI/CD pipeline unchanged; 404 fix adds static files only |

**Post-design re-check**: All 6 principles still pass after data-model.md and contracts/ design.

### Complexity Tracking

| Deviation | Why Needed | Simpler Alternative Rejected Because |
|---|---|---|
| Single-row carousels (overrides constitution "2-row" spec) | Modernization goal requires single-row per section for a cleaner layout | Two-row was specified in the old constitution scope; this spec explicitly supersedes it |
| Trailer video embeds (constitution says "No streaming") | Auto-playing YouTube iframes are embeds from external platform, not CineScope-hosted streams | The constitution's "No streaming" refers to hosting video files; YouTube iframes do not host content on CineScope |
| Client-side trending filter (trending endpoints don't support params) | Spec requires country/language filter consistency across all sections | Cannot add server-side params to TMDB trending endpoints; client-side is the only option |

## Project Structure

### Documentation (this feature)

```text
specs/010-modernization/
├── spec.md                         ← Feature spec (7 user stories, 36 FRs)
├── plan.md                         ← This file
├── research.md                     ← Phase 0: 10 research decisions
├── data-model.md                   ← Phase 1: 5 new interfaces, carousel registry
├── quickstart.md                   ← Phase 1: 9 integration scenarios
├── contracts/
│   ├── new-tmdb-endpoints.md       ← 8 new service functions + 9 discover variants
│   └── ui-components.md            ← Props contracts for 8 new/modified components
└── tasks.md                        ← Phase 2 output (created by /speckit-tasks)
```

### Source Code Changes

```text
src/
├── types/
│   └── tmdb.ts                  MODIFY — add MovieVideo, WatchProvider, PersonMovieCredit, etc.
│
├── services/
│   └── tmdbApi.ts               MODIFY — add 8 new functions (videos, providers, person credits,
│                                          trending day/week, 9 genre-based discover functions)
│
├── hooks/
│   ├── useMovieVideos.ts         NEW — fetches trailer/clip list for a movie
│   ├── useWatchProviders.ts      NEW — fetches streaming/rental providers
│   ├── usePersonCredits.ts       NEW — fetches a person's filmography
│   ├── useInfiniteMovies.ts      NEW — generic infinite-scroll list hook
│   ├── useHeroSlider.ts          NEW — daily trending top-10 + lazy trailer fetch per slide
│   ├── useDailyTrending.ts       NEW — wraps getDailyTrending (top-10 slice)
│   ├── useWeeklyTrending.ts      NEW — wraps getWeeklyTrending (top-10 slice)
│   ├── useComedyMovies.ts        NEW — genre 35
│   ├── useSciFiFantasyMovies.ts  NEW — genres 878,14
│   ├── useRealLifeMovies.ts      NEW — genres 36,99
│   ├── useAnimationMovies.ts     NEW — genre 16
│   ├── useRomanceMovies.ts       NEW — genre 10749
│   ├── useActionAdventureMovies.ts NEW — genres 28,12
│   ├── useAwardWinningMovies.ts  NEW — vote_average.desc + vote_count.gte=500
│   ├── useInspiringMovies.ts     NEW — genres 18,10751
│   ├── useThrillerMovies.ts      NEW — genre 53
│   ├── useTrendingMovies.ts      MODIFY — unchanged (used as "Recommended Movies")
│   ├── useTopRatedMovies.ts      MODIFY — switch to infinite-scroll (remove internal page state)
│   └── useMovieSearch.ts         MODIFY — switch to infinite-scroll accumulation
│
├── context/
│   └── ContentFilterContext.tsx  NO CHANGE — already implemented in spec 009
│
├── components/
│   ├── HeroSlider.tsx            NEW — full-width 10-slide auto-playing hero
│   ├── TrailerPlayer.tsx         NEW — YouTube iframe embed (inline + autoplay modes)
│   ├── TrailersSection.tsx       NEW — horizontal list of trailer thumbnails
│   ├── FilmographySection.tsx    NEW — per-person filmography with lazy load
│   ├── WatchProvidersSection.tsx NEW — provider logo row with deep links
│   ├── LaunchScreen.tsx          NEW — full-screen CSS animated logo intro
│   ├── InfiniteScrollTrigger.tsx NEW — IntersectionObserver sentinel
│   ├── RankedMovieCard.tsx       NEW — movie card with bold rank numeral
│   ├── MovieCarousel.tsx         MODIFY — add rankDisplay, maxItems props
│   ├── ContentFilterBar.tsx      MODIFY — add search field inside dropdowns; compact mode
│   └── Layout.tsx                MODIFY — move ContentFilterBar to right of SearchBar
│
├── pages/
│   ├── HomePage.tsx              MODIFY — add HeroSlider + all 15 ordered carousels
│   ├── MovieDetailPage.tsx       MODIFY — add trailer timer, TrailersSection,
│   │                                       FilmographySection, WatchProvidersSection
│   ├── TrendingPage.tsx          MODIFY — replace pagination with infinite scroll
│   └── TopRatedPage.tsx          MODIFY — replace pagination with infinite scroll
│
├── App.tsx                       MODIFY — add LaunchScreen gate (sessionStorage check)
│
└── main.tsx                      NO CHANGE

public/
└── 404.html                      NEW — GitHub Pages SPA redirect script

index.html                        MODIFY — add path-restore script in <head>

tests/
├── components/
│   ├── HeroSlider.test.tsx       NEW
│   ├── TrailerPlayer.test.tsx    NEW
│   ├── TrailersSection.test.tsx  NEW
│   ├── WatchProvidersSection.test.tsx NEW
│   ├── FilmographySection.test.tsx    NEW
│   ├── LaunchScreen.test.tsx     NEW
│   ├── InfiniteScrollTrigger.test.tsx NEW
│   └── RankedMovieCard.test.tsx  NEW
├── hooks/
│   ├── useMovieVideos.test.ts    NEW
│   ├── useWatchProviders.test.ts NEW
│   ├── useInfiniteMovies.test.ts NEW
│   └── usePersonCredits.test.ts  NEW
├── pages/
│   ├── TrendingPage.test.tsx     MODIFY — remove pagination tests, add infinite scroll
│   └── TopRatedPage.test.tsx     MODIFY — remove pagination tests, add infinite scroll
└── services/
    └── tmdbApi.test.ts           MODIFY — add tests for 8 new functions
```

**Structure Decision**: Single-project SPA (Option 1). All changes are additive to the existing `src/` directory structure following the established component/hook/page/service pattern. No new top-level directories required beyond `contracts/` in the spec.

## New Hook Architecture

### useInfiniteMovies (generic)

```typescript
function useInfiniteMovies<T>(
  fetcher: (page: number, filter: ContentFilterParams) => Promise<DiscoverResponse>,
  options: { cacheKeyPrefix: string }
): {
  movies: Movie[]
  loading: boolean
  error: string | null
  hasMore: boolean
  fetchMore: () => void
}
```

All three infinite-scroll pages (Trending, Top Rated, Search) compose this hook with their specific fetcher function. On `filterKey` change: reset movies to `[]` and page to 1.

### useHeroSlider

```typescript
function useHeroSlider(): {
  movies: Movie[]          // top 10 from daily trending
  activeIndex: number
  setActiveIndex: (i: number) => void
  currentVideoKey: string | null
  videoLoading: boolean
}
```

Fetches daily trending on mount. On `activeIndex` change: calls `getMovieVideos(movie.id)` and caches result in a `Map<movieId, videoKey | null>` to avoid repeat fetches per slide.

## Implementation Sequence

### Phase 1: Foundation (Prerequisite for all)
1. New TypeScript types in `src/types/tmdb.ts`
2. New TMDB service functions in `src/services/tmdbApi.ts`
3. GitHub Pages 404 fix: `public/404.html` + `index.html` script
4. `LaunchScreen` component + `App.tsx` gate

### Phase 2: Home Page Rebuild
5. 10 new genre-based hooks (comedy, sci-fi, etc.)
6. `useDailyTrending`, `useWeeklyTrending` hooks
7. `RankedMovieCard` component
8. `MovieCarousel` props extension
9. `HeroSlider` + `useHeroSlider`
10. `TrailerPlayer` component
11. `HomePage.tsx` — full rebuild with 15 sections + hero

### Phase 3: Movie Detail Enhancements
12. `useMovieVideos`, `useWatchProviders`, `usePersonCredits` hooks
13. `TrailersSection`, `WatchProvidersSection`, `FilmographySection` components
14. `MovieDetailPage.tsx` — add timer, new sections

### Phase 4: Infinite Scroll
15. `useInfiniteMovies` hook + `InfiniteScrollTrigger` component
16. `TrendingPage.tsx` — infinite scroll
17. `TopRatedPage.tsx` — infinite scroll
18. `SearchPage.tsx` — infinite scroll (if applicable)

### Phase 5: Filter UI Improvements
19. `ContentFilterBar.tsx` — add search field; compact mode
20. `Layout.tsx` — move filter bar to right of search bar

### Phase 6: Tests
21. Tests for all new hooks, components, and updated pages

## API Rate Limit Considerations

- Home page load: up to 16 API calls (15 carousels + hero slider) — staggered by React render order
- Hero slider: 1 call per slide activation (10 max total, lazy)
- Movie detail: 5 calls (details + credits + similar + videos + providers) — all parallel
- TMDB limit: 40 req/10s — well within range for typical single-user browsing
- All existing caching via `useApi` cache keys unchanged for genre hooks
