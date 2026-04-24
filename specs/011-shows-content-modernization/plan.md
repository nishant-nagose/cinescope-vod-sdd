# Implementation Plan: Shows Content Modernization

**Branch**: `021-shows-modernization` | **Date**: 2026-04-23 | **Updated**: 2026-04-24 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/011-shows-content-modernization/spec.md`

## Summary

Extend CineScope from a movie-only catalogue into a full Movies + Shows discovery platform. Phase 1 (original) implemented TMDB TV show API support, ShowDetailPage with seasons/episodes, 14 show carousels, hero slider fix, single-row carousels with infinite horizontal scroll, content-type toggle, and performance optimisations — all complete.

Phase 2 (2026-04-24 update) addresses 7 UI/UX bugs and 5 feature enhancements: dropdown selected-state visibility and sorting, backdrop/video cropping on details pages and hero slider, carousel scroll-position reset, show carousel image loading, header redesign (4-zone CSS Grid), global Movies/Shows content filtering (including hero slider), dynamic AI-assisted carousel configuration, and direct OTT deep-link navigation.

## Technical Context

**Language/Version**: TypeScript 5.0 / JavaScript (React 18+)
**Primary Dependencies**: React 18, Vite, TanStack Query (via `useApi`), Tailwind CSS, Vitest + React Testing Library
**Storage**: Client-side TTL cache (`src/services/cache.ts`, 5-min TTL) — no persistence
**Testing**: Vitest + React Testing Library (existing suite in `tests/`)
**Target Platform**: Web browsers (Chrome, Firefox, Safari — latest 2 versions); GitHub Pages static hosting
**Project Type**: Frontend web application (React SPA)
**Performance Goals**: Initial load <2s, API calls <500ms, Lighthouse mobile >85, smooth 60fps scrolling
**Constraints**: TMDB Free API rate limit (40 req/10s); bundle <200KB gzipped; no backend; no auth; WCAG 2.1 AA
**Scale/Scope**: ~30 screens/sections on home page (14 show carousels + existing movie carousels); single-user client-side only

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-checked after Phase 1 design.*

| Principle | Check | Status |
|-----------|-------|--------|
| I. Specification-First Development | spec.md updated and clarified (2026-04-24); checklists/requirements.md all pass | ✅ PASS |
| II. Type Safety | New types (`CarouselConfig`, `OTTPlatform`) will be added to `src/types/`; no `any` types introduced | ✅ PASS |
| III. Component-Driven Architecture | Header redesign composes existing layout components; carousel config driven by a config object; OTT navigation logic isolated in a utility | ✅ PASS |
| IV. API Contract First | OTT provider URL patterns documented in `contracts/tmdb-tv-api.md` (extended); TMDB watch-providers endpoint already in use | ✅ PASS |
| V. Mobile-First Responsive Design | Header CSS Grid implements 3 responsive breakpoints (desktop/tablet/mobile); OTT deep-link handles mobile app-first fallback | ✅ PASS |
| VI. Automated Deployment | No CI/CD changes required; GitHub Actions pipeline unchanged | ✅ PASS |

**Violations**: FR-015 (single-row carousels) and FR-016 (no 20-item cap) directly contradict the Constitution §IV "2-row layout, 20 movies per section" design constraint. This deviation is intentional and authorised by the spec. No new violations introduced in the 2026-04-24 update.

## Complexity Tracking

| Constraint Deviated | Constitution Section | Justification |
|---|---|---|
| 2-row carousel layout | §IV — API Contract First | FR-015 mandates single-row; spec explicitly replaces the 2-row layout with horizontal-scroll single-row carousels |
| 20-item carousel cap | §IV — API Contract First | FR-016 removes the hard cap; all available items must be accessible via horizontal scrolling |

## Project Structure

### Documentation (this feature)

```text
specs/011-shows-content-modernization/
├── plan.md              # This file
├── research.md          # Phase 0 output (updated 2026-04-24)
├── data-model.md        # Phase 1 output (updated 2026-04-24)
├── quickstart.md        # Phase 1 output
├── contracts/
│   └── tmdb-tv-api.md   # Phase 1 output (extended 2026-04-24)
└── tasks.md             # Phase 2 output (/speckit-tasks)
```

### Source Code Changes (repository root)

```text
src/
├── types/
│   └── tmdb.ts                        # EXTEND: CarouselConfig, OTTPlatform types (Phase 2)
├── config/
│   └── carousels.ts                   # NEW: carousel title/order configuration (Phase 14)
├── utils/
│   └── ottNavigation.ts               # NEW: direct OTT deep-link builder + mobile detection (Phase 15)
├── services/
│   └── tmdbApi.ts                     # VERIFY: watch-providers endpoint available (Phase 15)
├── hooks/
│   └── (all original hooks — complete)
├── context/
│   └── ContentFilterContext.tsx       # EXTEND: hero slider content type sync (Phase 13)
├── components/
│   ├── Header.tsx                     # REDESIGN: 4-zone CSS Grid layout (Phase 12)
│   ├── ContentFilterBar.tsx           # UPDATE: visual separation of nav vs filters (Phase 12)
│   ├── HeroSlider.tsx                 # FIX: image aspect-ratio container, no cropping (Phase 11)
│   ├── MovieCarousel.tsx              # FIX: carousel scroll-position preservation (Phase 11)
│   ├── ShowCarousel.tsx               # FIX: image/content loading bug (Phase 11)
│   ├── MovieCard.tsx                  # VERIFY: images not cropped
│   ├── ShowCard.tsx                   # VERIFY: images not cropped
│   └── WatchProviders.tsx             # MODIFY: direct OTT navigation (Phase 15)
├── pages/
│   ├── HomePage.tsx                   # UPDATE: hero slider syncs to content toggle (Phase 13)
│   │                                  # UPDATE: carousel titles from config (Phase 14)
│   ├── MovieDetailPage.tsx            # FIX: backdrop + video not cropped (Phase 11)
│   └── ShowDetailPage.tsx             # FIX: backdrop + video not cropped (Phase 11)
└── (all other original files — complete)

tests/
└── (all original tests — complete; new tests added per task list)
```

---

## ✅ Phase 1: Setup — COMPLETE

- [X] T001 Confirm branch is `021-shows-modernization` and run `npx tsc --noEmit` to establish a clean TypeScript baseline

---

## ✅ Phase 2: Foundational — COMPLETE

- [X] T002 Add TV show types to `src/types/tmdb.ts`
- [X] T003 Add all 20 TV service functions to `src/services/tmdbApi.ts`
- [X] T004 Fix `src/components/MovieCarousel.tsx`: singleRow, hasMore, onLoadMore, retry
- [X] T005 Create `src/components/LazySection.tsx`
- [X] T006 Create `src/components/ShowCard.tsx`
- [X] T007 Create `src/components/ShowCarousel.tsx`
- [X] T008 Create `src/components/ScrollToTop.tsx`
- [X] T009 Register `<ScrollToTop />` in `src/App.tsx`
- [X] T010 TypeScript gate

---

## ✅ Phase 3: User Story 1 — Hero Slider + Welcome Message — COMPLETE

- [X] T011 Update `src/hooks/useHeroSlider.ts`
- [X] T012 Fix `src/components/HeroSlider.tsx`
- [X] T013 Restore welcome message in `src/pages/HomePage.tsx`
- [X] T014 TypeScript gate

---

## ✅ Phase 4: User Story 2 — Show Carousels — COMPLETE

- [X] T015–T031 Create all show carousel hooks
- [X] T032 Update `src/pages/HomePage.tsx` with all 14 show carousels
- [X] T033 TypeScript gate

---

## ✅ Phase 5: User Story 3 — Content Type Toggle + Category Filter — COMPLETE

- [X] T034 Update `src/context/ContentFilterContext.tsx`
- [X] T035 Update `src/components/ContentFilterBar.tsx`
- [X] T036 Update `src/pages/HomePage.tsx` for content type filtering
- [X] T037 TypeScript gate

---

## ✅ Phase 6: User Story 4 — Show Details Page — COMPLETE

- [X] T038 Create `src/hooks/useShowDetails.ts`
- [X] T039 Create `src/hooks/useSeasonDetails.ts`
- [X] T040 Create `src/components/EpisodeList.tsx`
- [X] T041 Create `src/pages/ShowDetailPage.tsx`
- [X] T042 Add `/show/:id` route
- [X] T043 TypeScript gate

---

## ✅ Phase 7: User Story 5 — Performance — COMPLETE

- [X] T044 Add lazy loading + aspect-ratio wrappers to image elements
- [X] T045 Wrap components with `React.memo`; `useCallback` for handlers
- [X] T046 Audit `HomePage.tsx` for LazySection coverage
- [X] T047 TypeScript gate

---

## ✅ Phase 8: User Story 6 — Unified Search — COMPLETE

- [X] T048 Create `src/hooks/useContentSearch.ts`
- [X] T049 Update `src/pages/SearchPage.tsx`
- [X] T050 TypeScript gate

---

## ✅ Phase 9: User Story 7 — Logo Fix — COMPLETE

- [X] T051 Replace old logo with premium logo in Layout/Header
- [X] T052 TypeScript gate

---

## ✅ Phase 10: Polish & Cross-Cutting — COMPLETE

- [X] T053 Move `TopRatedPage.test.tsx` → `tests/pages/`
- [X] T054 Move `TrendingPage.test.tsx` → `tests/pages/`
- [X] T055 Create `tests/pages/ShowDetailPage.test.tsx`
- [X] T056 Full test suite `npm test`
- [X] T057 Production build `npm run build`
- [X] T058 Verify quickstart checklist

---

## Phase 11: Bug Fixes — Dropdown, Backdrop, Video & Carousel Stability (Priority: P1)

**Goal**: Fix 7 identified UI/UX bugs: dropdown selected-state visibility + ascending sort, backdrop/video cropping on Movie Details, Show Details, and Hero Slider, carousel scroll-position reset, and show carousel image loading failure.

**New Requirements**: FR-035, FR-036, FR-037, FR-037b, FR-038, FR-039, FR-039b, FR-040, FR-041

**Research**: See research.md sections 14 (Dropdown), 15 (Image/Video Cropping), 16 (Carousel Position)

**Independent Test**: (a) Open Country dropdown, type a query — selected item remains visible; all items are alphabetically sorted. (b) Open any Movie/Show Details page — backdrop fills the container without top/bottom cropping; play trailer — video frame fully visible. (c) Navigate the Hero Slider — no image cropping. (d) Scroll a carousel then wait for more items to load — scroll position is preserved. (e) Show carousels render with images.

### Bug 1: Dropdown Selected-State & Sort Order (FR-035, FR-036)

**Approach**: In the Country and Language dropdown components, always render selected options at the top of the filtered list (or mark them always-visible), and ensure the options array is sorted by `label` ascending before rendering. This is a data/render change only — no hook or API change required.

**Files affected**: The Country dropdown component and Language dropdown component (likely in `src/components/ContentFilterBar.tsx` or dedicated dropdown components).

### Bug 2: Backdrop & Video Cropping on Details Pages (FR-037, FR-037b, FR-039, FR-039b)

**Approach**: Add an `aspect-ratio` container div around backdrop `<img>` elements and trailer `<iframe>`/`<video>` elements. Use `object-fit: contain` or `width: 100%; height: auto` for backdrops; use `aspect-ratio: 16/9; width: 100%` for video players. Remove any fixed-height constraints that force cropping.

**Files affected**: `src/pages/MovieDetailPage.tsx`, `src/pages/ShowDetailPage.tsx`

### Bug 3: Hero Slider Image Cropping (FR-038)

**Approach**: Wrap the hero slider's `<img>` element in an `aspect-ratio` container (e.g., `aspect-ratio: 16/9` or `21/9` for cinematic feel). Use `object-fit: cover` with `object-position: center` and ensure the container height is not fixed in a way that clips the image. On mobile, adjust the aspect-ratio to `4/3` or `3/2` to retain vertical space.

**Files affected**: `src/components/HeroSlider.tsx`

### Bug 4: Carousel Scroll-Position Reset (FR-040)

**Approach**: Before a state update that loads more items into a carousel, capture the scroll container's `scrollLeft` value. After the React state update and re-render, restore `scrollLeft` to the saved value using a `useLayoutEffect` or `useEffect` with a `ref` to the scroll container. This prevents the DOM scroll position from jumping to 0 when new items are added to the item list.

**Files affected**: `src/components/MovieCarousel.tsx`, `src/components/ShowCarousel.tsx`

### Bug 5: Show Carousels Not Loading Images/Content (FR-041)

**Approach**: Investigate whether `ShowCarousel.tsx` or its `ShowCard.tsx` children have incorrect image URL construction (missing base URL, wrong path variable), or if the carousel's `shows` prop is receiving `undefined`/empty when it should not. Fix the root cause — either the image URL builder or the hook data mapping.

**Files affected**: `src/components/ShowCarousel.tsx`, `src/components/ShowCard.tsx`, possibly the show carousel hooks

---

## Phase 12: Header Redesign — 4-Zone CSS Grid Layout (Priority: P1)

**Goal**: Redesign the application header into 4 logical zones (Logo | Search | Content Toggle | Navigation/Filters) using CSS Grid. Navigation links (Trending, Top Rated, Search) are visually separated from filter controls (Categories, Country, Language). Implements 3 responsive breakpoints.

**New Requirements**: FR-042, FR-043, FR-044, FR-045, FR-046, FR-047, FR-048

**Research**: See research.md section 17 (CSS Grid Header)

**Independent Test**: On desktop — 4 zones clearly visible; nav links and filter controls have a visual separator. On tablet — Logo + Search + Toggle visible; Nav/Filters collapses to overlay icon. On mobile — Logo + Search icon + Hamburger only; full menu slides in. Active toggle state shows visual highlight.

**Approach**: Replace the current header's flex-based layout with a 4-column CSS Grid:
```
grid-template-columns: auto minmax(280px, 1fr) auto auto
```
Columns: Logo | Search | Content Toggle | Nav+Filters

The Nav+Filters zone is itself a flex row with a visual divider (`border-l` or `|` separator) separating the nav links group from the filter controls group.

Responsive behaviour:
- **Desktop (lg+)**: Full 4-column grid; full search input visible; all nav/filter controls visible
- **Tablet (md)**: 3-column grid (`auto 1fr auto`); Nav+Filters collapses to a single `⋮` icon that opens an overlay panel
- **Mobile (<md)**: 2-column grid (`auto auto`); Logo left, hamburger+search-icon right; full nav slides in from hamburger

**Files affected**: `src/components/Header.tsx` (or equivalent layout component), `src/components/ContentFilterBar.tsx`, `src/index.css` or Tailwind config if custom grid utilities needed

---

## Phase 13: Global Content Filtering + Hero Slider Sync (Priority: P1)

**Goal**: The Movies/Shows Content Toggle now governs ALL content in the application — hero slider, all carousels (already done in Phase 5 for carousels), and search results (already done in Phase 8). The hero slider must additionally respect the current content type selection.

**New Requirements**: FR-049, FR-050, FR-051

**Research**: See research.md section 13 (existing — ContentFilterContext)

**Independent Test**: Select Movies — hero slider shows only Movies; all carousels show only Movies; search returns only Movies. Select Shows — hero slider shows only Shows. Neither selected — mix of both.

**Approach**: Update `useHeroSlider.ts` to consume `contentType` from `ContentFilterContext`. When `contentType === 'movies'`, fetch only from movie trending endpoints. When `contentType === 'shows'`, fetch only from TV trending endpoints. When `contentType === 'all'`, merge both (existing behaviour).

The carousel and search filtering for content type was addressed in Phases 5 and 8; this phase adds the hero slider sync as the remaining gap.

**Files affected**: `src/hooks/useHeroSlider.ts`, `src/pages/HomePage.tsx` (to pass context to hook if not already)

---

## Phase 14: Dynamic Carousel Configuration (Priority: P2)

**Goal**: Remove all hardcoded carousel title strings from application code. Carousel titles and display order are defined in a configuration file (`src/config/carousels.ts`). The home page renders carousels by iterating over this configuration.

**New Requirements**: FR-052, FR-053

**Research**: See research.md section 19 (Dynamic Carousel Config)

**Independent Test**: Inspect `src/pages/HomePage.tsx` — no carousel title string literals present. Inspect `src/config/carousels.ts` — all carousel titles and ordering are defined here. Changing a title in config and rebuilding must reflect on the page.

**Approach**: 
1. Create `src/config/carousels.ts` exporting an ordered array of `CarouselConfig` objects, each with: `id`, `title`, `type` (movies/shows/both), `hookName` (maps to the data hook to use), `displayRank` (boolean — whether to show rank numbers).
2. Update `src/pages/HomePage.tsx` to render carousels by mapping over this config array rather than listing them one by one with inline title strings.
3. Each config entry maps to its corresponding data hook via a lookup map — this avoids dynamic imports and retains type safety.

**Files affected**: `src/config/carousels.ts` (NEW), `src/types/tmdb.ts` (add `CarouselConfig` type), `src/pages/HomePage.tsx`

---

## Phase 15: Direct OTT Navigation (Priority: P2)

**Goal**: The "Where to Watch" section on Movie and Show Details pages navigates users directly to the OTT platform's specific content page — bypassing the TMDB intermediary. Desktop: new tab to web URL. Mobile: attempt app deep-link first, fall back to web URL in new tab.

**New Requirements**: FR-054, FR-055

**Research**: See research.md section 18 (OTT Deep Linking)

**Independent Test**: On desktop, click a Netflix icon in "Where to Watch" — a new tab opens at `netflix.com` (or known Netflix URL pattern) for that content — no `themoviedb.org` URL appears. On mobile simulator, click the icon — OTT app opens (if installed) or web URL opens in new tab.

**Approach**:
1. Create `src/utils/ottNavigation.ts`: exports a `navigateToOTT(provider: OTTPlatform, isMobile: boolean)` function. On desktop (or unrecognised device): calls `window.open(provider.webUrl, '_blank')`. On mobile: attempts to redirect to `provider.appScheme` URL; uses a `setTimeout` (300ms) fallback to `window.open(provider.webUrl, '_blank')` in case the app scheme does not resolve.
2. Update `src/types/tmdb.ts` with `OTTPlatform` type (see data-model.md).
3. Build a provider URL mapping in `src/config/ottProviders.ts`: maps TMDB `provider_id` to `{ appScheme, webUrlPattern }` for major providers (Netflix, Disney+, Amazon Prime Video, Apple TV+, Hulu, HBO Max, Paramount+, etc.).
4. Construct `webUrl` by combining the provider's known URL pattern with the content's TMDB ID or title. For providers without a known pattern, use the TMDB watch-providers `link` field as-is (existing behaviour — acceptable fallback).
5. Update `WatchProviders.tsx` (or equivalent component): replace current link handler with `navigateToOTT()`; detect mobile via `window.navigator.userAgent` or a `matchMedia('(pointer: coarse)')` check.

**Files affected**: `src/utils/ottNavigation.ts` (NEW), `src/config/ottProviders.ts` (NEW), `src/types/tmdb.ts` (add `OTTPlatform`), `src/components/WatchProviders.tsx` (or equivalent)

---

## Phase 16: Polish & Validation (Phase 2)

**Purpose**: TypeScript gate, test additions, build validation for Phase 2 changes.

- [ ] T-P2-Final-01 Run `npx tsc --noEmit` — zero errors after all Phase 11–15 changes
- [ ] T-P2-Final-02 Run `npm test` — all existing tests pass; no regressions
- [ ] T-P2-Final-03 Run `npm run build` — production bundle compiles with zero errors
- [ ] T-P2-Final-04 Manual smoke test on desktop: dropdown sort + selected-state, uncropped backdrop/video on details pages, uncropped hero slider, carousel position stability, show carousel images, header zones, content toggle (hero + carousels), carousel titles from config, OTT direct navigation
- [ ] T-P2-Final-05 Manual smoke test on mobile viewport: header hamburger/search icon, OTT app deep-link or fallback

---

## Dependencies & Execution Order (Phase 2)

| Phase | Depends On | Can Parallel With |
|-------|-----------|-------------------|
| Phase 11 (Bug Fixes) | Phase 10 complete | Phase 12, 14, 15 |
| Phase 12 (Header Redesign) | Phase 10 complete | Phase 11, 13, 14, 15 |
| Phase 13 (Global Content Filter + Hero) | Phase 12 complete (header toggle must exist) | Phase 14, 15 |
| Phase 14 (Dynamic Carousel Config) | Phase 10 complete | Phase 11, 12, 15 |
| Phase 15 (OTT Navigation) | Phase 10 complete | Phase 11, 12, 14 |
| Phase 16 (Polish) | All of Phases 11–15 complete | — |

---

## Implementation Strategy (Phase 2)

### Priority Order
1. **Phase 11** (Bug Fixes) — P1 bugs; most visible to users; start immediately
2. **Phase 12** (Header Redesign) — P1; affects every page; do alongside bug fixes
3. **Phase 13** (Global Content Filtering) — P1; depends on header toggle (Phase 12)
4. **Phase 14** (Dynamic Carousel Config) — P2; refactor; lower urgency
5. **Phase 15** (OTT Navigation) — P2; user value but no pre-reqs
6. **Phase 16** (Polish) — final gate; blocking for PR

### Incremental Commits
- Commit after each Phase (or after each Bug Fix group within Phase 11)
- Each commit must pass `npx tsc --noEmit`
- Do not merge to `main` until Phase 16 is fully complete

---

## Notes

- Phases 1–10 are fully complete; do not re-implement
- Phase 11 bug fixes are independent of each other and can be addressed in any order
- Phase 12 (header) is a prerequisite for Phase 13 (hero slider syncs to toggle defined in header)
- `src/config/carousels.ts` (Phase 14) eliminates the need to update `HomePage.tsx` to add/reorder carousels in the future
- OTT app deep-linking on mobile is best-effort; fallback to web URL is always safe
- Do not modify `src/services/cache.ts` or `src/services/errorHandling.ts` — existing patterns reused as-is
- The constitution's "2-row / 20-item" carousel constraint remains formally superseded by FR-015/FR-016 (justified in Complexity Tracking above)
