# Tasks: Shows Content Modernization

**Input**: Design documents from `/specs/011-shows-content-modernization/`
**Branch**: `021-shows-modernization`
**Prerequisites**: plan.md ✅ | spec.md ✅ | research.md ✅ | data-model.md ✅ | contracts/ ✅

**Tests**: Not TDD-mandated by spec. Test tasks are limited to new page tests and relocated test files only.

**Organization**: Tasks grouped by user story. Phase 2 (Foundational) MUST complete before any user story phase begins.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no shared dependencies)
- **[Story]**: Maps to user stories US1–US7 from spec.md

---

## Phase 1: Setup

**Purpose**: Verify environment and baseline

- [X] T001 Confirm branch is `021-shows-modernization` and run `npx tsc --noEmit` to establish a clean TypeScript baseline before any changes

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Type system, API layer, and shared UI components that every user story depends on

**⚠️ CRITICAL**: No user story phase can begin until this phase is complete

- [X] T002 [P] Add TV show types to `src/types/tmdb.ts`: `TVShow`, `TVShowDetails`, `SeasonSummary`, `SeasonDetails`, `Episode`, `EpisodeSummary`, `Network`, `TVShowListResponse`, `MultiSearchResult`, `Person`; extend `ContentFilterParams` with `contentType: 'movies' | 'shows' | 'all'` and `activeCategory: number | null` (see data-model.md)
- [X] T003 Add all 20 TV service functions to `src/services/tmdbApi.ts`: `getTrendingTVDaily`, `getTrendingTVWeekly`, `getTopRatedTV`, `getNewShows`, `getRecommendedShows`, `getCriticallyAcclaimedShows`, `getShowsByGenre`, `getAwardWinningShows`, `getUpcomingShows`, `getUpcomingMovies`, `getShowDetails`, `getShowCredits`, `getSimilarShows`, `getSeasonDetails`, `searchMulti` — follow existing function pattern with typed responses and 5-min cache (see contracts/tmdb-tv-api.md); depends on T002
- [X] T004 [P] Fix `src/components/MovieCarousel.tsx`: add `singleRow?: boolean` prop that removes the two-row CSS grid and renders items in a single scrollable row; add `hasMore?: boolean` and `onLoadMore?: () => void` props; place an IntersectionObserver sentinel `<div>` at the right end of the scroll container that calls `onLoadMore` when it enters the viewport; confirm that a non-null `error` prop hides the carousel body and shows the existing retry button
- [X] T005 [P] Create `src/components/LazySection.tsx`: wraps children with an IntersectionObserver (rootMargin `'200px 0px'`); renders a fixed-height skeleton placeholder until the section nears the viewport; mounts and renders children on first intersection and never unmounts them again
- [X] T006 [P] Create `src/components/ShowCard.tsx`: same layout as `src/components/MovieCard.tsx` but typed for `TVShow`; uses `.name` for title, `.first_air_date` for year, `.poster_path` for image; navigates to `/show/:id` on click
- [X] T007 [P] Create `src/components/ShowCarousel.tsx`: mirrors `MovieCarousel.tsx` in structure and props (title, shows: TVShow[], loading, error, onRetry, rankDisplay, singleRow, hasMore, onLoadMore) but renders `ShowCard` items; reuses the same scroll container and navigation arrow logic
- [X] T008 Create `src/components/ScrollToTop.tsx`: subscribes to `useLocation` from react-router-dom; calls `window.scrollTo({ top: 0, behavior: 'instant' })` inside a `useEffect` only when `location.pathname` starts with `/movie/` or `/show/` (guard prevents scroll reset on home-page browsing); renders nothing (null)
- [X] T009 Register `<ScrollToTop />` inside `<BrowserRouter>` in `src/App.tsx` or `src/routes.tsx` so every route change scrolls to the top automatically
- [X] T010 TypeScript gate — run `npx tsc --noEmit`; resolve every error before proceeding to user story phases

**Checkpoint**: Foundation ready — all user story phases can now begin in priority order

---

## Phase 3: User Story 1 — Hero Slider + Welcome Message (Priority: P1) 🎯 MVP

**Goal**: The hero slider is visible, full-width, auto-rotating, and shows up to 10 mixed Movie + Show items; the welcome message is restored

**Independent Test**: Load the home page — a large, full-width slider must be visible and auto-advancing with at least 1 item; the welcome message text must appear; navigating to a details page from the slider must scroll the destination to the top

- [X] T011 [US1] Update `src/hooks/useHeroSlider.ts`: fetch trending movies (daily) and trending TV (daily) in parallel using `getTrendingMovies` and `getTrendingTVDaily`; tag each item with `mediaType: 'movie' | 'tv'`; merge and deduplicate by `id + mediaType`; sort by popularity descending; return the top 10 items
- [X] T012 [US1] Fix `src/components/HeroSlider.tsx`: accept `items: (Movie & { mediaType: 'movie' } | TVShow & { mediaType: 'tv' })[]` instead of only `Movie[]`; render a 'Movie' or 'Show' badge per slide using existing badge/pill styling; ensure existing auto-rotate timer is active; ensure rotation pauses on mouse hover; ensure left/right navigation arrows and keyboard navigation work; enforce full viewport width and a minimum height of `70vh` so the slider is visually dominant
- [X] T013 [US1] Restore the welcome message in `src/pages/HomePage.tsx`: locate the removed or hidden welcome JSX element and re-add it at its original position above the carousel sections; ensure it is always visible on load
- [X] T014 [US1] TypeScript check — `npx tsc --noEmit` must pass with zero errors

**Checkpoint**: Hero slider visible with movies + shows; welcome message present; scroll-to-top active on navigation (from T009)

---

## Phase 4: User Story 2 — Show Carousels (Priority: P1)

**Goal**: 14 show-specific carousels plus 2 upcoming carousels appear on the home page, each in a single row with horizontal infinite scroll; empty carousels are never rendered

**Independent Test**: Scroll the home page — all 14 show carousels must be visible in editorial order; each renders exactly one row; scrolling right past the initial items loads more; a carousel with zero results is absent (no header)

- [X] T015 [P] [US2] Create `src/hooks/useTVDailyTrending.ts`: wraps `getTrendingTVDaily` with `useApi`; manages `page` state and `hasMore` flag; exposes `shows`, `loading`, `error`, `loadMore`, `refetch`
- [X] T016 [P] [US2] Create `src/hooks/useTVWeeklyTrending.ts`: wraps `getTrendingTVWeekly` — same pattern as T015
- [X] T017 [P] [US2] Create `src/hooks/useNewShows.ts`: wraps `getNewShows` — same pattern
- [X] T018 [P] [US2] Create `src/hooks/useTopRatedShows.ts`: wraps `getTopRatedTV` — same pattern
- [X] T019 [P] [US2] Create `src/hooks/useRecommendedShows.ts`: wraps `getRecommendedShows` — same pattern
- [X] T020 [P] [US2] Create `src/hooks/useCriticallyAcclaimedShows.ts`: wraps `getCriticallyAcclaimedShows` — same pattern
- [X] T021 [P] [US2] Create `src/hooks/useComedyShows.ts`: wraps `getShowsByGenre(35)` — same pattern
- [X] T022 [P] [US2] Create `src/hooks/useSciFiFantasyShows.ts`: wraps `getShowsByGenre(10765)` — same pattern
- [X] T023 [P] [US2] Create `src/hooks/useRealLifeShows.ts`: wraps `getShowsByGenre(99)` (Documentary) — same pattern
- [X] T024 [P] [US2] Create `src/hooks/useAnimationShows.ts`: wraps `getShowsByGenre(16)` — same pattern
- [X] T025 [P] [US2] Create `src/hooks/useRomanceShows.ts`: wraps `getShowsByGenre(10749)` — same pattern
- [X] T026 [P] [US2] Create `src/hooks/useActionAdventureShows.ts`: wraps `getShowsByGenre(10759)` — same pattern
- [X] T027 [P] [US2] Create `src/hooks/useAwardWinningShows.ts`: wraps `getAwardWinningShows` — same pattern
- [X] T028 [P] [US2] Create `src/hooks/useInspiringShows.ts`: wraps `getShowsByGenre('18,10751')` (Drama + Family, multi-genre string) — same pattern
- [X] T029 [P] [US2] Create `src/hooks/useThrillerShows.ts`: wraps `getShowsByGenre('9648,80')` (Mystery + Crime, multi-genre string) — same pattern
- [X] T030 [P] [US2] Create `src/hooks/useUpcomingShows.ts`: wraps `getUpcomingShows` — same pattern
- [X] T031 [P] [US2] Create `src/hooks/useUpcomingMovies.ts`: wraps `getUpcomingMovies` — same pattern as existing movie hooks
- [X] T032 [US2] Update `src/pages/HomePage.tsx`: add all 14 show carousels using `ShowCarousel` + their hooks in this editorial order — "New Shows on CineScope", "Today's Top 10 Shows" (rankDisplay), "Weekly Top 10 Shows" (rankDisplay), "Recommended Shows", "Critically Acclaimed Shows", "Need a Good Laugh?", "Sci‑Fi & Fantasy Shows", "Shows Based on Real Life", "Anime & Animation Shows", "Romantic Shows", "Action & Adventure Shows", "Award‑Winning Shows", "Inspiring Shows", "Chilling Thriller Shows"; add "Upcoming Movies" and "Upcoming Shows" carousels; remove the "Shows by Category" carousel; wrap every carousel section (movies and shows) in `<LazySection>`; pass `singleRow={true}` and `onRetry={refetch}` to every carousel; pass `hasMore` and `onLoadMore={loadMore}` to every carousel
- [X] T033 [US2] TypeScript check — `npx tsc --noEmit` must pass with zero errors

**Checkpoint**: All show carousels visible; single row; lazy loaded; infinite horizontal scroll works; empty carousels absent

---

## Phase 5: User Story 3 — Content Type Toggle + Category Filter (Priority: P2)

**Goal**: The content selection header has Movies/Shows toggle buttons and a Category dropdown; selecting either updates all visible carousels dynamically

**Independent Test**: Click "Shows" toggle — all movie-only carousels disappear and show-only carousels remain; select a genre category — all visible carousels filter by that category; click "Movies" — show carousels disappear

- [X] T034 [US3] Update `src/context/ContentFilterContext.tsx`: add `contentType: 'movies' | 'shows' | 'all'` (default `'all'`) and `activeCategory: number | null` (default `null`) to context state; expose setter functions `setContentType` and `setActiveCategory`; ensure existing `country` and `language` state is unchanged
- [X] T035 [US3] Update `src/components/ContentFilterBar.tsx`: add a Movies/Shows toggle button group (two mutually exclusive buttons) that calls `setContentType`; add a Category dropdown using `useGenres` hook that calls `setActiveCategory` on selection (null option = "All Categories"); retain existing Country and Language dropdowns
- [X] T036 [US3] Update `src/pages/HomePage.tsx`: read `contentType` and `activeCategory` from `ContentFilterContext`; render movie-only carousel sections only when `contentType === 'movies' || contentType === 'all'`; render show-only carousel sections only when `contentType === 'shows' || contentType === 'all'`; pass `activeCategory` as a genre filter argument to all carousel hooks that support it
- [X] T037 [US3] TypeScript check — `npx tsc --noEmit` must pass with zero errors

**Checkpoint**: Content type toggle and category filter control all carousel sections dynamically

---

## Phase 6: User Story 4 — Show Details Page (Priority: P2)

**Goal**: Clicking a show card anywhere opens a Show Details page with metadata, seasons accordion, and inline episode list

**Independent Test**: Click any show card — a ShowDetailPage opens scrolled to the top; show title, genres, and status are displayed; a Seasons section lists all seasons; selecting a season shows its episode list; clicking an episode expands its metadata inline

- [X] T038 [P] [US4] Create `src/hooks/useShowDetails.ts`: calls `getShowDetails(id)`, `getShowCredits(id)`, and `getSimilarShows(id)` in parallel using `Promise.all`; returns `{ show, credits, similarShows, loading, error }` state; accepts `showId: number` param
- [X] T039 [P] [US4] Create `src/hooks/useSeasonDetails.ts`: calls `getSeasonDetails(showId, seasonNumber)` on demand when both params are provided; returns `{ season, loading, error }`; refetches when `seasonNumber` changes
- [X] T040 [P] [US4] Create `src/components/EpisodeList.tsx`: renders an accordion list of `Episode[]`; each row shows episode number, title, air date, and runtime; clicking a row toggles an expanded section below showing the full synopsis and `still_path` thumbnail image (lazy loaded); no navigation, no playback; handles loading and empty states
- [X] T041 [US4] Create `src/pages/ShowDetailPage.tsx`: mirrors `MovieDetailPage.tsx` in overall layout; sections in order — (1) backdrop/header with back button, (2) show metadata (name, first_air_date, number_of_seasons, number_of_episodes, status, networks, genres, tagline, vote_average), (3) overview/synopsis, (4) Seasons accordion (renders `SeasonSummary[]` from `useShowDetails`; clicking a season tab calls `useSeasonDetails` and renders `EpisodeList` below), (5) cast/crew using existing `CastSection`, (6) Similar Shows using `ShowCarousel` with `getSimilarShows` data; uses `useShowDetails` and `useSeasonDetails`
- [X] T042 [US4] Add `/show/:id` route to `src/routes.tsx`: import `ShowDetailPage`; add `<Route path="/show/:id" element={<ShowDetailPage />} />`; verify route works in browser
- [X] T043 [US4] TypeScript check — `npx tsc --noEmit` must pass with zero errors

**Checkpoint**: ShowDetailPage accessible at /show/:id; seasons selectable; episodes expand inline; page always opens at top

---

## Phase 7: User Story 5 — Performance (Priority: P2)

**Goal**: Images load without layout shift; carousels outside the viewport do not load until approached; no UI freeze during rapid scrolling

**Independent Test**: Open the home page and observe the network tab — fewer than 10 API calls on initial load; scroll rapidly — no UI freeze; click a show card — no layout shift as the details page loads; inspect images in MovieCard and ShowCard — all have loading="lazy" and an aspect-ratio placeholder

- [X] T044 [P] [US5] Add `loading="lazy"` attribute and a fixed CSS aspect-ratio wrapper (16:9 for backdrops, 2:3 for posters) to all `<img>` elements in `src/components/MovieCard.tsx`, `src/components/ShowCard.tsx`, `src/components/RankedMovieCard.tsx`, and `src/pages/ShowDetailPage.tsx` to eliminate layout shift during image load
- [X] T045 [P] [US5] Wrap `MovieCarousel`, `ShowCarousel`, `MovieCard`, and `ShowCard` with `React.memo` to prevent unnecessary re-renders; add `useCallback` to carousel `onLoadMore` and `onRetry` handlers in `src/pages/HomePage.tsx` so they are not recreated on every render
- [X] T046 [US5] Audit `src/pages/HomePage.tsx`: confirm every carousel section is wrapped in `<LazySection>`; confirm `hasMore` and `onLoadMore` are wired to every carousel hook; open the app in a browser and scroll slowly to verify carousels mount progressively (network requests should appear only as sections near the viewport)
- [X] T047 [US5] TypeScript check — `npx tsc --noEmit` must pass with zero errors

**Checkpoint**: Lazy loading verified in browser; image placeholders prevent layout shift; memoization reduces re-renders

---

## Phase 8: User Story 6 — Unified Search (Priority: P3)

**Goal**: Searching returns both Movies and Shows; each result shows its content type; clicking a show result opens ShowDetailPage

**Independent Test**: Search for a known TV show title — it appears in results with a "Show" badge; clicking it navigates to `/show/:id`; searching for a movie still shows a "Movie" badge and navigates to `/movie/:id`

- [X] T048 [US6] Create `src/hooks/useContentSearch.ts`: wraps `searchMulti(query, page)`; filters results to `media_type === 'movie' || media_type === 'tv'` (excludes persons); returns `{ results: (Movie | TVShow)[], loading, error, loadMore, hasMore }`
- [X] T049 [US6] Update `src/pages/SearchPage.tsx`: replace `useMovieSearch` with `useContentSearch`; render a 'Movie' or 'Show' type badge on each result card using the item's `media_type` field; route card click to `/movie/:id` for movies and `/show/:id` for shows; retain existing search bar debounce and empty/loading/error states
- [X] T050 [US6] TypeScript check — `npx tsc --noEmit` must pass with zero errors

**Checkpoint**: Search returns mixed results; type badges visible; routing correct for both content types

---

## Phase 9: User Story 7 — Logo Fix (Priority: P3)

**Goal**: The premium CineScope logo is displayed in the top-right on every page; no old static logo image remains

**Independent Test**: Load any page — the premium logo from `src/images/` appears in the top-right; browser DevTools shows no broken image requests for any old logo file

- [X] T051 [US7] Locate the old static logo `<img>` element in `src/components/Layout.tsx` (or Header component); remove it; import the premium logo asset from `src/images/` and render it at the same top-right position using the same sizing/positioning styles
- [X] T052 [US7] TypeScript check — `npx tsc --noEmit` must pass with zero errors

**Checkpoint**: Premium logo visible on all pages; old logo image absent

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Test file relocation, final test run, and build validation

- [X] T053 Run `git mv tests/TopRatedPage.test.tsx tests/pages/TopRatedPage.test.tsx` and fix any import paths inside the file if needed; run the test alone to confirm it passes in its new location
- [X] T054 Run `git mv tests/TrendingPage.test.tsx tests/pages/TrendingPage.test.tsx` and fix any import paths inside the file if needed; run the test alone to confirm it passes in its new location
- [X] T055 [P] Create `tests/pages/ShowDetailPage.test.tsx`: mock `useShowDetails` to return a fake `TVShowDetails` with two seasons; mock `useSeasonDetails` to return fake episodes; assert that the show title renders, the Seasons section lists both seasons, and selecting a season renders the episode list; assert the page does not render a video player
- [X] T056 Run full test suite `npm test` — all tests must pass; fix any broken import paths or mock mismatches caused by file relocations or new components
- [X] T057 Run `npm run build` — production bundle must compile with zero TypeScript or Vite errors
- [X] T058 Execute the verification checklist in `specs/011-shows-content-modernization/quickstart.md` — manually check every item; all 17 checklist items must be marked complete

**Checkpoint**: All tests pass, build succeeds, quickstart checklist complete

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 — **BLOCKS all user story phases**
- **Phase 3 (US1 — P1)**: Depends on Phase 2 complete
- **Phase 4 (US2 — P1)**: Depends on Phase 2 complete — can run in parallel with Phase 3
- **Phase 5 (US3 — P2)**: Depends on Phase 4 complete (carousels must exist before filter wiring)
- **Phase 6 (US4 — P2)**: Depends on Phase 2 complete — can run in parallel with Phases 3–5
- **Phase 7 (US5 — P2)**: Depends on Phases 3, 4, 6 complete (performance wraps existing sections)
- **Phase 8 (US6 — P3)**: Depends on Phase 2 and Phase 6 complete (needs /show/:id route)
- **Phase 9 (US7 — P3)**: Depends only on Phase 2 — can run any time after foundation
- **Phase 10 (Polish)**: Depends on all user story phases complete

### User Story Dependencies

| Story | Depends On | Can Parallel With |
|-------|-----------|-------------------|
| US1 (Hero Slider) | Phase 2 | US2, US4, US7 |
| US2 (Show Carousels) | Phase 2 | US1, US4, US7 |
| US3 (Content Filter) | US2 (carousels must exist) | US4, US7 |
| US4 (Show Details) | Phase 2 | US1, US2, US7 |
| US5 (Performance) | US1, US2, US4 | US6, US7 |
| US6 (Unified Search) | Phase 2 + US4 | US7 |
| US7 (Logo Fix) | Phase 2 | US1, US2, US3, US4, US6 |

### Within Each User Story

- Foundation tasks (types, services, shared components) before hooks
- Hooks before UI components that consume them
- Page component after hooks and sub-components
- TypeScript gate at end of each phase

---

## Parallel Example: Phase 4 (US2 — Show Carousels)

All T015–T031 hooks can be launched simultaneously since each writes a different file:

```bash
# All the following can run in parallel (different files):
Create src/hooks/useTVDailyTrending.ts      # T015
Create src/hooks/useTVWeeklyTrending.ts     # T016
Create src/hooks/useNewShows.ts             # T017
Create src/hooks/useTopRatedShows.ts        # T018
Create src/hooks/useRecommendedShows.ts     # T019
Create src/hooks/useCriticallyAcclaimedShows.ts  # T020
Create src/hooks/useComedyShows.ts          # T021
Create src/hooks/useSciFiFantasyShows.ts    # T022
Create src/hooks/useRealLifeShows.ts        # T023
Create src/hooks/useAnimationShows.ts       # T024
Create src/hooks/useRomanceShows.ts         # T025
Create src/hooks/useActionAdventureShows.ts # T026
Create src/hooks/useAwardWinningShows.ts    # T027
Create src/hooks/useInspiringShows.ts       # T028
Create src/hooks/useThrillerShows.ts        # T029
Create src/hooks/useUpcomingShows.ts        # T030
Create src/hooks/useUpcomingMovies.ts       # T031

# Then (sequential, depends on all above):
Update src/pages/HomePage.tsx               # T032
```

## Parallel Example: Phase 2 (Foundational)

```bash
# T002, T004, T005, T006, T007, T008 can all run in parallel:
Add types to src/types/tmdb.ts              # T002 [P]
Fix src/components/MovieCarousel.tsx        # T004 [P]
Create src/components/LazySection.tsx       # T005 [P]
Create src/components/ShowCard.tsx          # T006 [P]
Create src/components/ShowCarousel.tsx      # T007 [P]
Create src/components/ScrollToTop.tsx       # T008 [P]

# Then (sequential, depends on T002):
Add TV endpoints to src/services/tmdbApi.ts # T003

# Then (sequential, depends on all above):
Register ScrollToTop in src/App.tsx         # T009
TypeScript gate                             # T010
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 2 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (**critical blocker**)
3. Complete Phase 3: US1 — Hero Slider + Welcome Message
4. Complete Phase 4: US2 — Show Carousels
5. **STOP and VALIDATE**: hero slider visible, 14+ show carousels visible, single row, lazy loading active
6. Demo / deploy MVP

### Incremental Delivery

1. Setup + Foundational → foundation ready
2. US1 + US2 (P1) → hero + show discovery → **MVP**
3. US3 (P2) → content type filtering → deploy
4. US4 (P2) → show details → deploy
5. US5 (P2) → performance pass → deploy
6. US6 + US7 (P3) → search + logo → deploy
7. Polish → test relocation + final validation → PR

---

## Notes

- [P] tasks operate on different files with no shared dependencies
- [USn] label maps each task to the user story it delivers
- Each user story phase ends with a TypeScript gate — do not skip
- `npm test` is run once at the end (Phase 10), not after every phase
- Commit after each phase (or after each logical group within a phase)
- The `LazySection` wrapper is the single most impactful performance improvement — ensure it covers every carousel on `HomePage.tsx`
- Do not modify `src/services/cache.ts` or `src/services/errorHandling.ts` — the existing patterns are reused as-is
