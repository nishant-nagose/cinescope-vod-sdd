# Tasks: CineScope App Modernization

**Input**: Design documents from `specs/010-modernization/`  
**Branch**: `019-modernization`  
**Prerequisites**: spec.md ✓, plan.md ✓, research.md ✓, data-model.md ✓, contracts/ ✓, quickstart.md ✓

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no blocking dependencies)
- **[Story]**: Which user story this task belongs to (US1–US7)
- All file paths are relative to repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Add new TypeScript types and all new TMDB service functions that every user story depends on.

- [X] T001 Add 5 new TypeScript interfaces (MovieVideo, WatchProvider, WatchProvidersForCountry, PersonMovieCredit, PersonMovieCredits) to src/types/tmdb.ts per data-model.md
- [X] T002 Add 5 new service functions (getMovieVideos, getWatchProviders, getPersonMovieCredits, getDailyTrending, getWeeklyTrending) to src/services/tmdbApi.ts per contracts/new-tmdb-endpoints.md
- [X] T003 Add 9 genre-based discover service functions (getComedyMovies, getSciFiFantasyMovies, getRealLifeMovies, getAnimationMovies, getRomanceMovies, getActionAdventureMovies, getAwardWinningMovies, getInspiringMovies, getThrillerMovies) to src/services/tmdbApi.ts per contracts/new-tmdb-endpoints.md genre ID table

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core hooks and the TrailerPlayer component used by multiple user stories. Must complete before US1, US2, US3.

**⚠️ CRITICAL**: US1, US2, and US3 all depend on tasks in this phase.

- [X] T004 [P] Create useMovieVideos hook in src/hooks/useMovieVideos.ts (wraps getMovieVideos via useApi, cacheKey: `movie-videos-${id}`, enabled when id > 0)
- [X] T005 [P] Create useWatchProviders hook in src/hooks/useWatchProviders.ts (wraps getWatchProviders via useApi, cacheKey: `watch-providers-${id}`, enabled when id > 0)
- [X] T006 [P] Create usePersonCredits hook in src/hooks/usePersonCredits.ts (wraps getPersonMovieCredits via useApi, cacheKey: `person-credits-${personId}`, enabled when personId > 0)
- [X] T007 [P] Create useDailyTrending hook in src/hooks/useDailyTrending.ts (wraps getDailyTrending with useContentFilter filterKey in cacheKey: `daily-trending-${filterKey}`; applies client-side country/language filter on results; slices to 10 items)
- [X] T008 [P] Create useWeeklyTrending hook in src/hooks/useWeeklyTrending.ts (wraps getWeeklyTrending with useContentFilter filterKey in cacheKey: `weekly-trending-${filterKey}`; applies client-side country/language filter; slices to 10 items)
- [X] T009 Create TrailerPlayer component in src/components/TrailerPlayer.tsx (renders `<iframe>` with YouTube embed URL `https://www.youtube.com/embed/{videoKey}?autoplay={1|0}&mute={1|0}&playsinline=1`; 16:9 responsive container; accepts videoKey, autoplay, muted, title props per contracts/ui-components.md)

**Checkpoint**: Foundational complete — US1, US2, US3 can now proceed.

---

## Phase 3: User Story 1 — Immersive Hero Slider (Priority: P1) 🎯 MVP

**Goal**: Full-width hero slider at top of home page showing 10 daily trending movies with auto-playing trailers per slide.

**Independent Test**: Load home page → verify full-width slider above carousels → confirm video plays for active slide → use nav arrows to switch slides.

- [X] T010 [US1] Create useHeroSlider hook in src/hooks/useHeroSlider.ts (uses useDailyTrending for 10 movies; manages activeIndex state; lazily fetches video key for current active slide via getMovieVideos on index change; caches results in Map<movieId, string|null> to avoid repeat fetches; exposes movies, activeIndex, setActiveIndex, currentVideoKey, videoLoading)
- [X] T011 [US1] Create HeroSlider component in src/components/HeroSlider.tsx (full-width layout with backdrop image + gradient overlay for each slide; shows movie title, rating badge, and "View Details" link to /movie/{id}; auto-advances every 6 seconds via setInterval; renders left/right arrow buttons and dot indicator row; mounts TrailerPlayer with autoplay+muted when currentVideoKey is set; shows backdrop image when videoKey is null; includes unmute toggle button; accepts movies and loading props per contracts/ui-components.md)
- [X] T012 [US1] Update src/pages/HomePage.tsx to render `<HeroSlider movies={...} loading={...} />` as the first element inside the page div, above all MovieCarousel sections
- [X] T013 [P] [US1] Write tests for useHeroSlider hook in tests/hooks/useHeroSlider.test.ts (mock useDailyTrending returning 10 movies; mock getMovieVideos; verify activeIndex starts at 0; setActiveIndex triggers video fetch for new index; videoKey cached after first fetch; null videoKey when no trailers returned)
- [X] T014 [P] [US1] Write tests for HeroSlider component in tests/components/HeroSlider.test.tsx (mock useHeroSlider; use vi.useFakeTimers; verify slider container renders; after 6s interval fires activeIndex increments; clicking right arrow changes slide; clicking dot indicator jumps to index; TrailerPlayer rendered when videoKey present; backdrop shown when videoKey null)
- [X] T015 [P] [US1] Write tests for TrailerPlayer component in tests/components/TrailerPlayer.test.tsx (verify iframe renders with correct src containing videoKey; URL params include mute=1 and autoplay=1 when props set; playsinline=1 always present; accessible title attribute set)

**Checkpoint**: Hero slider visible and functional on home page independently of carousel changes.

---

## Phase 4: User Story 2 — Redesigned Home Page Carousels (Priority: P2)

**Goal**: Home page shows 15 carousel sections in exact order with single-row layout; Today's Top 10 shows exactly 10 ranked cards.

**Independent Test**: Load home page → scroll through all 15 sections in correct order → verify Top 10 section has exactly 10 cards each with visible rank number.

- [X] T016 [P] [US2] Create RankedMovieCard component in src/components/RankedMovieCard.tsx (renders movie poster image with rank number positioned absolute at bottom-left corner; rank number uses large font-black text with white color and text-stroke/outline effect matching modern VOD style; links entire card to /movie/{id}; accepts movie and rank props per contracts/ui-components.md)
- [X] T017 [P] [US2] Update MovieCarousel component in src/components/MovieCarousel.tsx to accept two new optional props: `rankDisplay?: boolean` (renders RankedMovieCard instead of MovieCard when true) and `maxItems?: number` (slices movies array to this count before render); existing behavior unchanged when props omitted
- [X] T018 [P] [US2] Create comedy and animation genre hooks: src/hooks/useComedyMovies.ts (wraps getComedyMovies with useContentFilter; cacheKey: `comedy-${filterKey}`) and src/hooks/useAnimationMovies.ts (wraps getAnimationMovies; cacheKey: `animation-${filterKey}`)
- [X] T019 [P] [US2] Create romance, action/adventure, and thriller genre hooks: src/hooks/useRomanceMovies.ts (cacheKey: `romance-${filterKey}`), src/hooks/useActionAdventureMovies.ts (cacheKey: `action-adventure-${filterKey}`), src/hooks/useThrillerMovies.ts (cacheKey: `thriller-${filterKey}`)
- [X] T020 [P] [US2] Create sci-fi/fantasy, real-life, award-winning, and inspiring genre hooks: src/hooks/useSciFiFantasyMovies.ts (cacheKey: `scifi-fantasy-${filterKey}`), src/hooks/useRealLifeMovies.ts (cacheKey: `real-life-${filterKey}`), src/hooks/useAwardWinningMovies.ts (cacheKey: `award-winning-${filterKey}`), src/hooks/useInspiringMovies.ts (cacheKey: `inspiring-${filterKey}`)
- [X] T021 [US2] Rebuild src/pages/HomePage.tsx with HeroSlider (preserved from T012) at top then exactly 15 MovieCarousel sections in this order: "New Movies on CineScope" (useNewReleases), "Today's Top 10 Movies" (useDailyTrending, rankDisplay maxItems=10), "Weekly Top 10 Movies" (useWeeklyTrending, maxItems=10), "Movies by Category" (useMoviesByGenre + CategoryDropdown), "Recommended Movies" (useTrendingMovies), "Critically Acclaimed Movies" (useCriticallyAcclaimed), "Need a Good Laugh?" (useComedyMovies), "Sci-Fi & Fantasy Movies" (useSciFiFantasyMovies), "Movies Based on Real Life" (useRealLifeMovies), "Anime & Animation Movies" (useAnimationMovies), "Romantic Movies" (useRomanceMovies), "Action & Adventure Movies" (useActionAdventureMovies), "Award-Winning Movies" (useAwardWinningMovies), "Inspiring Movies" (useInspiringMovies), "Chilling Thriller Movies" (useThrillerMovies); each with emptyMessage prop
- [X] T022 [P] [US2] Write tests for RankedMovieCard component in tests/components/RankedMovieCard.test.tsx (verify rank number 1-10 visible in rendered output; poster image present; link href = /movie/{id}; rank positioned over image)
- [X] T023 [P] [US2] Write tests for updated HomePage in tests/pages/HomePage.test.tsx (mock HeroSlider and all 15 hooks + ContentFilterContext; verify all 15 section titles rendered in correct order; Today's Top 10 section shows exactly 10 ranked cards; Weekly Top 10 shows maxItems=10; Movies by Category shows dropdown)

**Checkpoint**: Home page shows hero slider + all 15 ordered carousels with ranked Top 10 sections working independently.

---

## Phase 5: User Story 3 — Enhanced Movie Details Page (Priority: P3)

**Goal**: Movie detail page auto-plays trailer at 10s; includes Trailers & Clips, Filmography, and Watch Providers sections; Cast & Crew clearly labels roles.

**Independent Test**: Open any movie detail page → wait 10 seconds → verify backdrop replaced by trailer → scroll to find all 4 new sections present and functional.

- [X] T024 [P] [US3] Create TrailersSection component in src/components/TrailersSection.tsx (calls useMovieVideos(movieId) internally; filters to YouTube results only; shows loading skeleton; renders horizontal scrollable row of thumbnail cards (poster + type label); clicking a card expands TrailerPlayer inline below the thumbnails; Trailers shown first, then Clips, then Teasers; empty state if no videos found)
- [X] T025 [P] [US3] Create WatchProvidersSection component in src/components/WatchProvidersSection.tsx (calls useWatchProviders(movieId) internally; reads ContentFilterContext.countries[0] or defaults to 'US' as country key; displays flatrate providers first then rent providers as clickable logo images (no text labels); each logo click opens provider.link in new tab; shows "Not available for streaming in your region" when no providers exist for selected country)
- [X] T026 [P] [US3] Create FilmographySection component in src/components/FilmographySection.tsx (accepts cast: CastMember[] and crew: CrewMember[] as props; identifies top-5 cast members + director + producer; renders one collapsible sub-section per person showing their name and role; each sub-section lazily fetches usePersonCredits(personId) when scrolled into view via IntersectionObserver; shows top-5 movies by popularity as small cards linking to /movie/{id})
- [X] T027 [US3] Update src/pages/MovieDetailPage.tsx: add useMovieVideos(movie.id) call; add useEffect that starts a 10-second setTimeout on mount (when movie loaded); on timeout, set showTrailer=true state; cleanup clears timeout on unmount; render TrailerPlayer with autoplay+muted when showTrailer=true (replacing the backdrop image area), else render existing backdrop image
- [X] T028 [US3] Add TrailersSection, WatchProvidersSection, and FilmographySection to src/pages/MovieDetailPage.tsx below the existing Overview section and above Similar Movies (in order: Trailers & Clips → Cast & Crew → Filmography → Watch Providers → Similar Movies)
- [X] T029 [US3] Update src/components/CastSection.tsx to clearly separate and label Actors (cast array), Director (crew filtered by job='Director'), Producer (crew filtered by job='Producer' or job='Executive Producer'), and Other Key Contributors (remaining crew with known_for_department displayed); each role group has a sub-heading
- [X] T030 [P] [US3] Write tests for TrailersSection in tests/components/TrailersSection.test.tsx (mock useMovieVideos; verify trailer thumbnails rendered; clicking thumbnail shows TrailerPlayer; empty state shown when results empty)
- [X] T031 [P] [US3] Write tests for WatchProvidersSection in tests/components/WatchProvidersSection.test.tsx (mock useWatchProviders + ContentFilterContext with countries=['US']; verify provider logos rendered; link href matches provider.link; empty state shown when no US providers)
- [X] T032 [P] [US3] Write tests for FilmographySection in tests/components/FilmographySection.test.tsx (mock usePersonCredits; verify person sub-sections render; movie cards link to /movie/{id})
- [X] T033 [P] [US3] Write tests for MovieDetailPage trailer timer in tests/pages/MovieDetailPage.test.tsx (mock useMovieVideos returning a trailer; use vi.useFakeTimers; verify backdrop shown initially; after vi.advanceTimersByTime(10000) verify TrailerPlayer rendered; verify timer cleared on unmount via vi.clearAllTimers)

**Checkpoint**: Movie detail page with all new sections fully functional independently of other stories.

---

## Phase 6: User Story 4 — Infinite Scrolling (Priority: P4)

**Goal**: Trending, Top Rated, and Search pages use infinite scroll instead of pagination; no Next/Previous buttons visible anywhere.

**Independent Test**: Open Trending page → verify no pagination controls → scroll to bottom → verify new movies appear automatically.

- [X] T034 [US4] Create InfiniteScrollTrigger component in src/components/InfiniteScrollTrigger.tsx (renders a sentinel `<div ref={sentinelRef}>` at bottom of list; uses useEffect to create IntersectionObserver that calls onIntersect() when sentinel enters viewport AND hasMore=true AND loading=false; renders loading spinner below sentinel when loading=true; renders "You've reached the end" message when hasMore=false; disconnects observer on unmount)
- [X] T035 [US4] Create useInfiniteMovies hook in src/hooks/useInfiniteMovies.ts (accepts fetcher: `(page: number, filter: ContentFilterParams) => Promise<DiscoverResponse>` and cacheKeyPrefix string; maintains items: Movie[], page: number, hasMore: boolean, loading: boolean, error: string|null state; useEffect([filterKey]) resets items=[], page=1; fetchMore() increments page and appends new results; sets hasMore=false when page >= totalPages; exposes all state + fetchMore)
- [X] T036 [US4] Refactor src/pages/TrendingPage.tsx to use useInfiniteMovies with getTrendingMovies as fetcher and cacheKeyPrefix='trending-infinite'; render InfiniteScrollTrigger below movie list; remove all PaginationControls usage and page state
- [X] T037 [US4] Refactor src/pages/TopRatedPage.tsx to use useInfiniteMovies with getTopRatedMovies as fetcher and cacheKeyPrefix='top-rated-infinite'; render InfiniteScrollTrigger below movie list; remove all PaginationControls usage
- [X] T038 [US4] Refactor src/pages/SearchPage.tsx to accumulate results using useInfiniteMovies pattern with searchMovies as fetcher; reset accumulated list when query changes; render InfiniteScrollTrigger below results; remove pagination controls; keep existing sort controls
- [X] T039 [P] [US4] Write tests for InfiniteScrollTrigger in tests/components/InfiniteScrollTrigger.test.tsx (mock IntersectionObserver via vi.fn(); verify onIntersect called when intersecting+hasMore; spinner shown when loading; end message shown when !hasMore; observer disconnected on unmount)
- [X] T040 [P] [US4] Write tests for useInfiniteMovies hook in tests/hooks/useInfiniteMovies.test.ts (mock fetcher; verify items array starts empty; fetchMore appends page 2 results; filterKey change resets to page 1; hasMore=false when page=totalPages)

**Checkpoint**: All three list pages use infinite scroll; no pagination controls visible on any page.

---

## Phase 7: User Story 5 — Searchable Country/Language Filters (Priority: P5)

**Goal**: Filter dropdowns moved to right of search bar, compact size, with real-time search inside each dropdown.

**Independent Test**: Click Country dropdown → type a country name → verify list filters instantly → clear text → verify full list restored.

- [X] T041 [US5] Update src/components/ContentFilterBar.tsx to add a text search input inside each dropdown panel: add `countrySearch` and `languageSearch` state strings; filter visible options list using `option.english_name.toLowerCase().includes(search.toLowerCase())`; reset search string to '' when that dropdown closes; keep existing multi-select and Select All logic unchanged
- [X] T042 [US5] Update src/components/Layout.tsx to move ContentFilterBar from its current position (below header) to inside the header bar, positioned to the right of SearchBar; reduce ContentFilterBar trigger button size with `compact` styling (smaller padding, smaller font); ensure header stays single-row on all breakpoints
- [X] T043 [P] [US5] Update tests for ContentFilterBar in tests/components/ContentFilterBar.test.tsx (add test: search input is visible when dropdown is open; typing 'united' filters to matching entries only; clearing search input restores full list; search resets when dropdown closes)

**Checkpoint**: Filter dropdowns compact and repositioned; in-dropdown search narrows options list instantly.

---

## Phase 8: User Story 6 — Launch Animation (Priority: P6)

**Goal**: Premium logo animation plays once on first app load then transitions automatically to home page; does not replay on in-app navigation.

**Independent Test**: Open app in fresh tab → verify full-screen animation plays → verify automatic transition to home page without clicking.

- [X] T044 [US6] Create LaunchScreen component in src/components/LaunchScreen.tsx (renders full-screen dark overlay `bg-gray-950`; centers CineScope logo with CSS keyframe animation defined in src/index.css or inline style: opacity 0→1 over 0.5s, scale 0.8→1 over 0.5s, hold 1.5s, opacity 1→0 over 1s — total 3s; calls onComplete() prop via setTimeout(onComplete, 3000) or animation end event; accessible aria-label="CineScope loading")
- [X] T045 [US6] Update src/App.tsx to: check `sessionStorage.getItem('cinescope_launched')` inside useState initializer; if null, render `<LaunchScreen onComplete={() => { sessionStorage.setItem('cinescope_launched', '1'); setLaunched(true) }} />`; once launched=true, render the existing `<ContentFilterProvider><BrowserRouter>...</BrowserRouter></ContentFilterProvider>` app tree; skip animation when sessionStorage key already set

**Checkpoint**: Launch animation plays once per browser tab session; home page appears automatically after animation.

---

## Phase 9: User Story 7 — Route Stability on Hard Refresh (Priority: P7)

**Goal**: Direct URLs and hard refreshes to /trending, /top-rated, /search, /movie/{id} load correctly with no 404 error.

**Independent Test**: In a fresh browser tab, enter `https://nishant-nagose.github.io/cinescope-vod-sdd/trending` → verify Trending page loads, no 404.

- [X] T046 [US7] Create public/404.html with GitHub Pages SPA redirect script: `segmentCount=1`; script reads window.location and encodes the path after the base segment as `?/path` query string (replacing `&` with `~and~`); calls `window.location.replace` to redirect to the app root index.html with encoded path; copy the minimal script from research.md section 7 verbatim; include a `<meta charset="utf-8">` and `<title>CineScope</title>` in the HTML
- [X] T047 [US7] Add SPA path-restore script inside `<head>` of index.html (before all other scripts): script reads `window.location.search` for `?/` prefix; if found, decodes path by splitting on `&`, restoring `~and~` to `&`, then calls `window.history.replaceState(null, null, decoded_path + query + hash)`; copy script from research.md section 7 verbatim; no changes to any React or Vite config

**Checkpoint**: After deploying to GitHub Pages, hard refresh on any route loads the correct page with no 404.

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Test coverage for new service functions, cleanup of removed pagination, and final integration verification.

- [X] T048 [P] Update src/services/tmdbApi.test.ts with tests for all 5 new service functions: getMovieVideos (expect /movie/{id}/videos URL), getWatchProviders (expect /movie/{id}/watch/providers URL), getPersonMovieCredits (expect /person/{id}/movie_credits URL), getDailyTrending (expect /trending/movie/day URL with page param), getWeeklyTrending (expect /trending/movie/week URL with page param)
- [X] T049 [P] Write tests for LaunchScreen component in tests/components/LaunchScreen.test.tsx (mock sessionStorage; verify animation container and logo text render; verify onComplete called after vi.advanceTimersByTime(3000))
- [X] T050 [P] Update tests/pages/TrendingPage.test.tsx: remove old pagination tests (Previous/Next button clicks calling loadPage); add test mocking useInfiniteMovies; verify no pagination controls rendered; verify InfiniteScrollTrigger component present in output
- [X] T051 [P] Update tests/pages/TopRatedPage.test.tsx: remove old pagination tests; mock useInfiniteMovies; verify no pagination controls; verify InfiniteScrollTrigger rendered
- [X] T052 [P] Update tests/pages/SearchPage.test.tsx: remove pagination-related tests; add test verifying InfiniteScrollTrigger rendered when results present; existing sort and empty-state tests should remain
- [X] T053 Delete src/components/PaginationControls.tsx (component no longer used after T036–T038 replaced pagination with infinite scroll) and remove its export from any index files if present
- [X] T054 Run full test suite with `npx vitest run` and fix any failing tests caused by new hook dependencies requiring ContentFilterContext mock (add `vi.mock('../../src/context/ContentFilterContext', ...)` to any test files for hooks that now call useContentFilter)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 (types needed by hooks and components) — **BLOCKS US1, US2, US3**
- **Phase 3 (US1)**: Depends on Phase 2 (needs TrailerPlayer T009, useDailyTrending T007, useMovieVideos T004)
- **Phase 4 (US2)**: Depends on Phase 2 (needs useDailyTrending T007, useWeeklyTrending T008, genre service functions T003); depends on Phase 3 T012 (HeroSlider already added to HomePage)
- **Phase 5 (US3)**: Depends on Phase 2 (needs useMovieVideos T004, useWatchProviders T005, usePersonCredits T006, TrailerPlayer T009)
- **Phase 6 (US4)**: Depends on Phase 1 types only; independent of US1/US2/US3
- **Phase 7 (US5)**: Independent of all other stories; depends only on Phase 1
- **Phase 8 (US6)**: Independent; depends only on Phase 1 for ContentFilterProvider in App.tsx
- **Phase 9 (US7)**: Fully independent; no code dependencies — static file additions only
- **Phase 10 (Polish)**: Depends on all previous phases complete

### User Story Dependencies

- **US1 (P1)**: Requires Phase 2 complete (T004, T007, T009)
- **US2 (P2)**: Requires Phase 2 complete (T003, T007, T008) + US1 Phase 3 T012 (HeroSlider in HomePage)
- **US3 (P3)**: Requires Phase 2 complete (T004, T005, T006, T009); independent of US1/US2
- **US4 (P4)**: Requires Phase 1 only; independent of US1/US2/US3
- **US5 (P5)**: Independent; no story dependencies
- **US6 (P6)**: Independent; no story dependencies
- **US7 (P7)**: Independent; no story dependencies

### Within-Story Dependencies

- US1: T010 (hook) → T011 (component) → T012 (page integration) | T013/T014/T015 parallel after respective implementations
- US2: T016/T017/T018/T019/T020 parallel → T021 (HomePage rebuild, depends on all) | T022/T023 parallel after implementations
- US3: T024/T025/T026 parallel → T027 (timer, independent) → T028 (add sections to page) → T029 (CastSection) | T030/T031/T032/T033 parallel after implementations
- US4: T034 (trigger component) → T035 (hook) → T036/T037/T038 parallel (refactor pages) | T039/T040 parallel after implementations
- US5: T041 (search logic) → T042 (layout reposition) → T043 (tests)
- US6: T044 (component) → T045 (App.tsx integration)
- US7: T046 → T047 (sequential; 404.html must exist before testing index.html restore)

### Parallel Opportunities

```bash
# Phase 2 — all parallel (different files):
T004 useMovieVideos.ts  +  T005 useWatchProviders.ts  +  T006 usePersonCredits.ts
T007 useDailyTrending.ts  +  T008 useWeeklyTrending.ts  +  T009 TrailerPlayer.tsx

# Phase 4 US2 — all parallel (different files):
T016 RankedMovieCard  +  T017 MovieCarousel  +  T018 comedy/animation hooks
T019 romance/action/thriller hooks  +  T020 scifi/reallife/award/inspiring hooks

# Phase 5 US3 — all parallel:
T024 TrailersSection  +  T025 WatchProvidersSection  +  T026 FilmographySection
```

---

## Implementation Strategy

### MVP First (US1 — Hero Slider Only)

1. Complete Phase 1: Setup (T001–T003)
2. Complete Phase 2: Foundational (T004–T009)
3. Complete Phase 3: US1 Hero Slider (T010–T015)
4. **STOP and VALIDATE**: Hero slider visible, auto-plays trailers, nav controls work
5. Deploy and demo if ready

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. US1 Hero Slider → Visible on home page (MVP)
3. US2 Home Carousels → 15 ordered sections + ranked Top 10
4. US3 Movie Details → Trailer timer + new sections
5. US4 Infinite Scroll → No more pagination
6. US5 Filter UI → Searchable dropdowns repositioned
7. US6 Launch Animation → Premium brand entry
8. US7 Route Fix → Hard refresh works
9. Polish → Full test coverage

---

## Notes

- [P] tasks touch different files and have no blocking dependencies within their phase
- [USN] label maps every task to its user story for traceability
- Phase 2 foundational hooks all follow the same `useApi` pattern from the existing codebase
- All new genre hooks follow the same template as `useCriticallyAcclaimed.ts` (existing)
- TrailerPlayer (T009) is in Foundational because both US1 (HeroSlider) and US3 (TrailersSection, detail page) require it
- The 404 fix (T046–T047) is entirely static — no React/Vite changes; safest to ship early
- After T036–T038 remove pagination, T053 cleans up the now-unused PaginationControls component
- Run `npx vitest run` after T054 to confirm all 100+ tests pass before closing the story
