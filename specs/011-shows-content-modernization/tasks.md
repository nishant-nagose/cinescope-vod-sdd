# Tasks: Shows Content Modernization

**Input**: Design documents from `/specs/011-shows-content-modernization/`
**Branch**: `021-shows-modernization`
**Prerequisites**: plan.md ✅ | spec.md ✅ | research.md ✅ | data-model.md ✅ | contracts/ ✅
**Updated**: 2026-04-24 — Phase 2 tasks (T059–T097) added for bug fixes and feature enhancements

**Tests**: Not TDD-mandated by spec. Test tasks are limited to new page tests and relocated test files only.

**Organization**: Phases 1–10 = original implementation (all complete). Phases 11–16 = Phase 2 bug fixes and feature enhancements (all complete). Post-Phase-16 = Parts 9–11 regression patches.

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

---

---

# Phase 2: Bug Fixes & Feature Enhancements (2026-04-24)

**Context**: Phases 1–10 above are fully complete. The tasks below (T059–T097) implement the 7 bug fixes and 5 feature enhancements added in the spec update of 2026-04-24.

**Format**: Same as above — `[P]` = can run in parallel; `[USn]` = maps to user story.

---

## Phase 11: Bug Fixes — Dropdown, Backdrop, Video & Carousel Stability (Priority: P1)

**Goal**: Fix 7 identified UI/UX bugs across dropdown UX, image/video cropping, carousel scroll stability, and show carousel loading.

**Requirements**: FR-035, FR-036, FR-037, FR-037b, FR-038, FR-039, FR-039b, FR-040, FR-041

**Independent Test**: (a) Open Country dropdown and type a query — selected item stays visible; all options are alphabetically sorted A→Z. (b) Open a Movie or Show Details page — backdrop fills container without top/bottom cropping; play trailer — full video frame visible, not cropped. (c) Navigate the Hero Slider — no top/bottom image cropping. (d) Scroll a carousel right then wait for more items to load — scroll position is preserved (does not jump to position 0). (e) Show carousels render card images correctly.

### Bug Fix Group 1: Dropdown Selected-State & Sort Order (FR-035, FR-036)

- [ ] T059 [P] [US6] In `src/components/ContentFilterBar.tsx` (or the dedicated Country/Language dropdown component), sort the full `options` array alphabetically by `label` using `options.sort((a, b) => a.label.localeCompare(b.label))` before rendering; this must happen once on data load, not per keystroke (FR-036)
- [ ] T060 [P] [US6] In the same dropdown components, when the user types a search query, keep selected options always visible at the top of the filtered results — filter logic: `isSelected(option) || option.label.toLowerCase().includes(query.toLowerCase())`; selected items rendered in a pinned "selected" group above the filtered list (FR-035)

### Bug Fix Group 2: Backdrop & Video Cropping on Details Pages (FR-037, FR-037b, FR-039, FR-039b)

- [ ] T061 [P] [US5] In `src/pages/MovieDetailPage.tsx`: wrap the backdrop `<img>` in an `aspect-ratio: 16/9` container div with `width: 100%; overflow: hidden;` and set `object-fit: cover; width: 100%; height: 100%` on the `<img>`; remove any fixed `height: Npx` or `max-height` constraint that clips the image (FR-037)
- [ ] T062 [P] [US5] In `src/pages/MovieDetailPage.tsx`: wrap the trailer `<iframe>` in an `aspect-ratio: 16/9` container div with `width: 100%; position: relative;`; set `position: absolute; top: 0; left: 0; width: 100%; height: 100%;` on the `<iframe>`; remove any fixed height that clips the video (FR-039)
- [ ] T063 [P] [US4] In `src/pages/ShowDetailPage.tsx`: apply the same backdrop fix as T061 — `aspect-ratio: 16/9` container + `object-fit: cover` on the `<img>`; remove fixed-height constraints (FR-037b)
- [ ] T064 [P] [US4] In `src/pages/ShowDetailPage.tsx`: apply the same trailer fix as T062 — `aspect-ratio: 16/9` container with absolutely-positioned `<iframe>` inside (FR-039b)

### Bug Fix Group 3: Hero Slider Image Cropping (FR-038)

- [ ] T065 [US1] In `src/components/HeroSlider.tsx`: wrap the slide `<img>` element in an `aspect-ratio: 21/9` container on desktop (or `16/9` if 21/9 looks too wide); add `sm:aspect-[4/3]` breakpoint for mobile; set `object-fit: cover; object-position: center; width: 100%; height: 100%;` on the `<img>`; remove any `max-h-[Npx]` or fixed-height class that forces cropping (FR-038)

### Bug Fix Group 4: Carousel Scroll-Position Reset (FR-040)

- [ ] T066 [P] [US2] In `src/components/MovieCarousel.tsx`: add a `scrollLeftRef = useRef(0)` to track the scroll container's `scrollLeft` before items update; add a `useLayoutEffect` that runs after the `items` array changes and restores `scrollContainerRef.current.scrollLeft = scrollLeftRef.current`; ensure `scrollLeftRef.current` is captured in a scroll event handler or just before the state update that triggers more items loading (FR-040)
- [ ] T067 [P] [US2] In `src/components/ShowCarousel.tsx`: apply the same scroll-position preservation pattern as T066 — `scrollLeftRef`, `useLayoutEffect` restore on `shows` array change (FR-040)

### Bug Fix Group 5: Show Carousels Not Loading Images/Content (FR-041)

- [ ] T068 [US2] Investigate `src/components/ShowCard.tsx`: confirm the TMDB image base URL is correctly prepended to `poster_path` (should be `https://image.tmdb.org/t/p/w500${show.poster_path}` with a null-guard); confirm the `shows` prop is not `undefined` when passed from `ShowCarousel`; add a `loading="lazy"` attribute to the `<img>` if missing (FR-041)
- [ ] T069 [US2] Investigate `src/components/ShowCarousel.tsx`: confirm it correctly passes the `shows` prop to `ShowCard` items; confirm there is no missing key prop or incorrect array mapping that causes silent failures; add a console warning (dev-only) if `shows` is empty but `loading` is false and `error` is null — this aids debugging in CI (FR-041)

### Phase 11 TypeScript Gate

- [ ] T070 Run `npx tsc --noEmit` — zero errors across all Bug Fix Group changes above; resolve every error before proceeding to Phase 12

**Checkpoint**: All 7 bugs fixed and TypeScript clean

---

## Phase 12: Header Redesign — 4-Zone CSS Grid Layout (Priority: P1)

**Goal**: Redesign the application header into 4 logical zones (Logo | Search | Content Toggle | Navigation+Filters) using CSS Grid. Navigation links (Trending, Top Rated, Search page link) are visually separated from filter controls (Categories, Country, Language) with a `border-l` divider. Three responsive breakpoints: Desktop / Tablet / Mobile.

**Requirements**: FR-042, FR-043, FR-044, FR-045, FR-046, FR-047, FR-048

**Independent Test**: Desktop — 4 zones clearly visible; nav text links and filter dropdowns have a visual separator between them. Tablet — Logo + Search + Toggle visible; Nav+Filters collapses to an overlay icon `⋮`. Mobile — Logo + search icon `🔍` + hamburger `☰` only; full nav slides in. Clicking Movies toggle highlights it; clicking again (or Shows is already highlighted) deselects.

- [ ] T071 [P] [US3] Replace the existing flex-based layout in `src/components/Header.tsx` (or the top-level layout/nav component) with a CSS Grid container: `grid-template-columns: auto minmax(280px, 1fr) auto auto` (Logo | Search | Toggle | Nav+Filters); add Tailwind classes `grid items-center gap-4` to the header root; ensure Logo occupies column 1, Search input column 2, Content Toggle column 3, and the Nav+Filters group column 4 (FR-042, FR-043)
- [ ] T072 [P] [US3] Inside the Nav+Filters zone (column 4 of the grid): create two visually grouped sub-sections separated by a `border-l border-white/20 pl-4 ml-4` divider — left sub-section: navigation text links (Trending, Top Rated, Search page link); right sub-section: compact filter dropdowns (Categories, Country, Language); both sub-sections are `flex items-center gap-3` rows (FR-044, FR-045)
- [ ] T073 [P] [US3] Add the Movies/Shows Content Toggle button group in column 3: two adjacent buttons (`Movies` and `Shows`); clicking one sets `contentType` to `'movies'` or `'shows'`; clicking the already-active button resets to `'all'`; default state (both off) = `'all'`; active button receives a distinct visual highlight (e.g., `bg-white text-black` vs `border border-white/50 text-white`) (FR-046, FR-047)
- [ ] T074 [P] [US3] In `src/components/Header.tsx`, implement responsive breakpoints for the grid: Desktop (`lg:` and above) — full 4-column grid with full search text input visible (`placeholder="🔍 Search movies, shows, genres..."`); Tablet (`md:` to `lg:`) — 3-column grid (`auto 1fr auto`), Nav+Filters collapses to a single `⋮` icon button that opens an overlay panel containing the nav links and filter controls; Mobile (below `md:`) — 2-column grid (`auto auto`), Logo left, a search icon `🔍` and hamburger `☰` button right, full nav slides in from the right on hamburger click (FR-042, FR-048)
- [ ] T075 TypeScript gate — run `npx tsc --noEmit` — zero errors after Header redesign; verify no prop-type errors in the updated Header component

**Checkpoint**: Header displays 4 zones on desktop; collapses correctly on tablet and mobile; content toggle present and functional

---

## Phase 13: Global Content Filtering + Hero Slider Sync (Priority: P1)

**Goal**: The Movies/Shows Content Toggle (added in Phase 12) now governs the hero slider as well as carousels (Phase 5) and search (Phase 8). When "Movies" is selected, the hero slider shows only movie items. When "Shows" is selected, only TV show items. When neither is selected ("All"), the existing mixed behaviour applies.

**Requirements**: FR-049, FR-050, FR-051

**Independent Test**: Select Movies toggle → hero slider cycles through movie slides only; no TV show slides visible. Select Shows toggle → only TV show slides in the slider. Deselect both → mixed movie + show slides (original behaviour).

- [ ] T076 [US3] Update `src/hooks/useHeroSlider.ts`: import `useContentFilter` context hook; read `contentType` from context; when `contentType === 'movies'`, fetch from movie trending endpoint only and skip TV trending fetch; when `contentType === 'shows'`, fetch from TV trending endpoint only and skip movie fetch; when `contentType === 'all'`, retain existing parallel fetch + merge behaviour; deduplicate and sort by popularity in all branches (FR-049, FR-050)
- [ ] T077 [US3] Verify that `src/pages/HomePage.tsx` passes or exposes context correctly so `useHeroSlider.ts` can consume `ContentFilterContext` without prop-drilling; if the hook does not already have access to the context, ensure `HomePage.tsx` either passes `contentType` as a prop to the hook or that `ContentFilterContext.Provider` wraps the component tree above `useHeroSlider` (FR-051)
- [ ] T078 TypeScript gate — run `npx tsc --noEmit` — zero errors; confirm `useHeroSlider` TypeScript return type still matches `HeroSlider` component's expected props

**Checkpoint**: Hero slider content respects content type toggle; TypeScript clean

---

## Phase 14: Dynamic Carousel Configuration (Priority: P2)

**Goal**: Remove all hardcoded carousel title strings from `src/pages/HomePage.tsx`. Every carousel's title and order is defined in `src/config/carousels.ts` as an ordered `CarouselConfig[]` array. The home page renders carousels by iterating over this array via a `hookMap` lookup.

**Requirements**: FR-052, FR-053

**Independent Test**: Open `src/pages/HomePage.tsx` — zero carousel title string literals present. Open `src/config/carousels.ts` — all carousel titles and their order are declared there. Change one title string in the config file and run `npm run build` — the changed title appears on the home page.

- [ ] T079 [P] Add `CarouselConfig` interface to `src/types/tmdb.ts` (fields: `id: string`, `title: string`, `type: 'movies' | 'shows' | 'both'`, `hookKey: string`, `rankDisplay: boolean`) — see data-model.md for the full definition (FR-052)
- [ ] T080 [P] Create `src/config/carousels.ts`: export a `CAROUSEL_CONFIG: CarouselConfig[]` array listing all carousels in editorial display order, each entry containing `id` (stable kebab-case key), `title` (display label — the single source of truth), `type`, `hookKey` (must match a key in the `hookMap` in `HomePage.tsx`), and `rankDisplay` (boolean); include entries for all existing movie and show carousels from Phases 3–4; add "Upcoming Movies" and "Upcoming Shows" entries (FR-052, FR-053)
- [ ] T081 Update `src/pages/HomePage.tsx`: define a `hookMap` object whose keys are the `hookKey` values from `CAROUSEL_CONFIG` and whose values are the corresponding hook call results (all hooks are still called unconditionally at the top of the component to comply with React hooks rules); replace the current explicit carousel JSX list with a `CAROUSEL_CONFIG.map(config => { const hookData = hookMap[config.hookKey]; return config.type includes 'movies' ? <MovieCarousel title={config.title} ... /> : <ShowCarousel title={config.title} ... /> })` render (FR-053); wrap each rendered carousel in `<LazySection>` as before
- [ ] T082 TypeScript gate — run `npx tsc --noEmit` — zero errors; in particular confirm `hookMap` keys are fully typed against `CAROUSEL_CONFIG` `hookKey` values (use `Record<CarouselConfig['hookKey'], ...>` pattern or a discriminated union)

**Checkpoint**: No hardcoded carousel titles in HomePage.tsx; all titles live in carousels.ts; TypeScript clean

---

## Phase 15: Direct OTT Navigation (Priority: P2)

**Goal**: "Where to Watch" provider icons navigate users directly to the OTT platform's content or search page — no TMDB redirect. Desktop: new tab to the provider's web URL. Mobile: attempt app deep-link first (300ms timeout), fall back to web URL in new tab.

**Requirements**: FR-054, FR-055

**Independent Test**: Desktop — click a Netflix icon on a Movie/Show Details page → new tab opens at `netflix.com` (or a Netflix search URL for the title); `themoviedb.org` URL does not appear. Mobile viewport — click the icon → OTT app opens if installed; if not installed within 300ms, fallback tab opens to the web URL.

- [ ] T083 [P] Add `OTTPlatform` interface to `src/types/tmdb.ts` (fields: `provider_id: number`, `provider_name: string`, `logo_path: string | null`, `webUrl: string`, `appScheme?: string`) — see data-model.md (FR-054)
- [ ] T084 [P] Create `src/config/ottProviders.ts`: export an `OTT_PROVIDERS` map of `provider_id → { appScheme, webUrlPattern }` for the major providers supported by TMDB watch-providers (Netflix `8`, Disney+ `337`, Amazon Prime `9`, Apple TV+ `350`, Hulu `15`, HBO Max `384`, Paramount+ `531`, Peacock `386`); `webUrlPattern` is a URL string containing `{title}` placeholder that is replaced at runtime with the content's title (URL-encoded); `appScheme` is the mobile deep-link scheme (e.g., `netflix://` for Netflix) — mark as `undefined` for providers without a known scheme (FR-054)
- [ ] T085 Create `src/utils/ottNavigation.ts`: export `navigateToOTT(provider: OTTPlatform, isMobile: boolean): void`; on desktop (`isMobile === false`): call `window.open(provider.webUrl, '_blank', 'noopener,noreferrer')`; on mobile (`isMobile === true`): set `window.location.href = provider.appScheme` (deep-link attempt), then `setTimeout(() => window.open(provider.webUrl, '_blank', 'noopener,noreferrer'), 300)` as fallback; export `isMobileDevice(): boolean` that returns `window.matchMedia('(pointer: coarse)').matches` (FR-054, FR-055)
- [ ] T086 Update `src/components/WatchProviders.tsx` (or equivalent component that renders provider icons): import `navigateToOTT`, `isMobileDevice`, and `OTT_PROVIDERS`; in the click handler for each provider icon, construct an `OTTPlatform` object by looking up the provider's `provider_id` in `OTT_PROVIDERS` and substituting the content title into `webUrlPattern`; if `provider_id` is not found in `OTT_PROVIDERS`, fall back to the existing TMDB `link` field behaviour; call `navigateToOTT(platform, isMobileDevice())` (FR-054, FR-055)
- [ ] T087 TypeScript gate — run `npx tsc --noEmit` — zero errors; confirm `OTTPlatform` is used consistently across config, utility, and component

**Checkpoint**: Direct OTT navigation works on desktop (new tab) and mobile (app-first + fallback); TypeScript clean

---

## Phase 16: Polish & Validation (Phase 2)

**Purpose**: Final TypeScript gate, regression test run, production build, and manual smoke tests for all Phase 11–15 changes.

- [X] T088 Run `npx tsc --noEmit` — zero errors
- [X] T089 Run `npm test` — all tests pass (1 test updated for config-driven carousel title)
- [X] T090 Run `npm run build` — 89 modules, 78.64 kB gzipped; zero errors
- [X] T091 Manual desktop smoke test — all items verified: dropdowns sorted + selected pinned; backdrops uncropped; trailers full-frame; hero slider uncropped + region-aware; carousel scroll preserved; show carousels load images; 4-zone header; Movies/Shows toggle works; carousel titles from config; OTT direct navigation
- [X] T092 Manual mobile viewport smoke test — header collapses correctly; RegionDropdown no zoom-on-focus (font-size 16px fix); hero slider touch swipe works; OTT deep-link with web fallback confirmed
- [X] T093 All Phase 2 changes committed on branch `021-shows-modernization` (multiple commits, Parts 1–11)

**Checkpoint**: All Phase 2 tests pass, build succeeds, smoke tests complete — ready for PR merge

---

## Phase 2 Dependencies & Execution Order

| Phase | Depends On | Can Run In Parallel With |
|-------|-----------|--------------------------|
| Phase 11 (Bug Fixes) | Phases 1–10 complete | Phase 12, 14, 15 |
| Phase 12 (Header Redesign) | Phases 1–10 complete | Phase 11, 14, 15 |
| Phase 13 (Hero Slider Sync) | Phase 12 complete (toggle must exist in header) | Phase 14, 15 |
| Phase 14 (Dynamic Carousel Config) | Phases 1–10 complete | Phase 11, 12, 15 |
| Phase 15 (OTT Navigation) | Phases 1–10 complete | Phase 11, 12, 14 |
| Phase 16 (Polish) | All of Phases 11–15 complete | — |

### Within Phase 11 (Bug Fixes)

All 5 Bug Fix Groups are independent — T059–T069 can be addressed in any order or in parallel (each touches different files). T070 (TypeScript gate) must run after all groups are done.

### Within Phase 12 (Header)

T071, T072, T073, T074 all touch `src/components/Header.tsx` — do them sequentially in task order. T075 (TypeScript gate) after all four.

### Within Phase 15 (OTT Navigation)

T083 and T084 can run in parallel (different files). T085 depends on T083 (needs `OTTPlatform` type). T086 depends on T084 and T085. T087 (TypeScript gate) after T086.

---

## Phase 2 Notes

- Bug Fix Groups 1–5 in Phase 11 are fully independent; tackle in any order that makes sense given the files being edited
- Phase 12 (header) must be fully merged before Phase 13 (hero slider sync) starts, because Phase 13's toggle reads the `contentType` state that the Phase 12 Movies/Shows button group writes
- Phase 14 (dynamic carousel config) is a pure refactor — zero user-visible behaviour change; its sole purpose is to remove hardcoded title strings from `HomePage.tsx`
- Phase 15 OTT deep-linking is best-effort on mobile; the `setTimeout` fallback ensures the user is never stranded without a navigation path
- `src/services/cache.ts` and `src/services/errorHandling.ts` remain untouched — existing patterns reused as-is
- After Phase 16 smoke tests pass, raise a PR; do not merge directly to `main`

---

## Post-Phase-16 Regression Patches (2026-04-25)

Applied after Phase 16 completion during real-device testing. All committed on branch `021-shows-modernization`.

### Part 10 — Cross-Browser Carousel Scroll, Hero Region, Mobile Zoom, Trailer End

- [X] **P10-A** `src/components/MovieCarousel.tsx` — made `useLayoutEffect` scroll restore conditional: `if (container.scrollLeft === 0 && savedScrollLeft.current > 0)`. Fixes Desktop/iOS regression caused by the unconditional restore introduced in Phase 11 T066; Android Chrome reset still corrected.
- [X] **P10-B** `src/components/ShowCarousel.tsx` — same conditional restore pattern applied (mirrors P10-A).
- [X] **P10-C** `src/services/tmdbApi.ts` — `getHeroMovies`: lowered `vote_count.gte` from `'30'` to `'3'`, removed `vote_average.gte: '5.5'`; `getHeroShows`: lowered from `'20'` to `'2'`, same removal. Small-market regional content often has few votes; strict thresholds caused `mergeWithRegionalPriority` to receive empty regional arrays and fall back to global content. The `withBackdrop` filter already provides sufficient visual quality control.
- [X] **P10-D** `src/components/RegionDropdown.tsx` — removed `text-xs` (12px) from search `<input>`; added `style={{ fontSize: '16px' }}`. iOS Safari and Android Chrome zoom in on any input with font-size < 16px and do not zoom back out after blur.
- [X] **P10-E** `src/components/TrailerPlayer.tsx` — added `onEnded?: () => void` prop; `useRef`+`useEffect` pattern for stable YouTube postMessage handler; added `enablejsapi: '1'` and `origin: window.location.origin` URL params to iframe src. YouTube only emits `postMessage` events when `enablejsapi=1` is set; state `info: 0` = video ended.
- [X] **P10-F** `src/components/HeroSlider.tsx` — added `onEnded={goNext}` to `<TrailerPlayer>`. Hero slider now advances to the next slide when a trailer finishes, matching the 2.5-min fallback timer behaviour.

### Part 11 — Hero Slider Mobile Touch Swipe

- [X] **P11-A** `src/components/HeroSlider.tsx` — added `touchStartXRef = useRef<number | null>(null)`; `onTouchStart` records `touches[0].clientX`; `onTouchEnd` computes delta, ignores < 50px, calls `goNext()` on swipe-left and `goPrev()` on swipe-right. Users on mobile browsers can now swipe horizontally through hero slider slides.
