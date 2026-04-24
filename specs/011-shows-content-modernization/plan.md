# Implementation Plan: Shows Content Modernization

**Branch**: `021-shows-modernization` | **Date**: 2026-04-23 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/011-shows-content-modernization/spec.md`

## Summary

Extend CineScope from a movie-only catalogue into a full Movies + Shows discovery platform. This requires adding TMDB TV show API support, introducing a ShowDetailPage with seasons/episodes, adding 14 show carousels to the home page, fixing the hero slider, enforcing single-row carousels with infinite horizontal scroll, adding a content-type toggle to the filter bar, fixing three known bugs (scroll position, welcome message, logo), and optimising performance across all pages. All changes are frontend-only against the existing TMDB API.

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
| I. Specification-First Development | spec.md complete and clarified; checklists/requirements.md all pass | ✅ PASS |
| II. Type Safety | New TV show types will be defined in `src/types/tmdb.ts`; no `any` types introduced | ✅ PASS |
| III. Component-Driven Architecture | ShowDetailPage composes existing components; new ShowCarousel reuses MovieCarousel pattern; state in hooks | ✅ PASS |
| IV. API Contract First | All TMDB TV endpoints documented in `contracts/tmdb-tv-api.md` before implementation | ✅ PASS |
| V. Mobile-First Responsive Design | All carousels use existing Tailwind breakpoints; single-row fix uses CSS not layout restructure; touch/swipe retained | ✅ PASS |
| VI. Automated Deployment | No CI/CD changes required; GitHub Actions pipeline unchanged | ✅ PASS |

**Violations**: FR-015 (single-row carousels) and FR-016 (no 20-item cap) directly contradict the Constitution §IV "2-row layout, 20 movies per section" design constraint. This deviation is intentional and authorised by the spec: carousels must be single-row with horizontal infinite scroll. This supersedes the prior constitution layout constraint for this feature. Tracked in Complexity Tracking below.

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
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/
│   └── tmdb-tv-api.md   # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit-tasks)
```

### Source Code Changes (repository root)

```text
src/
├── types/
│   └── tmdb.ts                        # ADD: TVShow, TVShowDetails, Season, Episode, TVShow* response types
├── services/
│   └── tmdbApi.ts                     # ADD: ~15 new TV show endpoints
├── hooks/
│   ├── useShowDetails.ts              # NEW: show metadata + season list
│   ├── useSeasonDetails.ts            # NEW: episodes for a selected season
│   ├── useTVDailyTrending.ts          # NEW: trending shows (day)
│   ├── useTVWeeklyTrending.ts         # NEW: trending shows (week)
│   ├── useNewShows.ts                 # NEW: recently released shows
│   ├── useTopRatedShows.ts            # NEW: top-rated shows
│   ├── useRecommendedShows.ts         # NEW: editorial recommended shows
│   ├── useCriticallyAcclaimedShows.ts # NEW
│   ├── useComedyShows.ts              # NEW
│   ├── useSciFiFantasyShows.ts        # NEW
│   ├── useRealLifeShows.ts            # NEW: documentary/biography shows
│   ├── useAnimationShows.ts           # NEW
│   ├── useRomanceShows.ts             # NEW
│   ├── useActionAdventureShows.ts     # NEW
│   ├── useAwardWinningShows.ts        # NEW
│   ├── useInspiringShows.ts           # NEW
│   ├── useThrillerShows.ts            # NEW: "Chilling Thriller Shows"
│   ├── useUpcomingMovies.ts           # NEW: upcoming movies carousel
│   ├── useUpcomingShows.ts            # NEW: upcoming shows carousel
│   ├── useContentSearch.ts            # NEW: unified search (movies + shows)
│   ├── useHeroSlider.ts               # MODIFY: support both movies and shows
│   └── useInfiniteMovies.ts           # REVIEW: rename/generalise for shows if needed
├── context/
│   └── ContentFilterContext.tsx       # MODIFY: add contentType ('movies'|'shows'|'all')
├── components/
│   ├── MovieCarousel.tsx              # MODIFY: add singleRow prop; add lazy viewport loading; add retry-on-fail
│   ├── ContentFilterBar.tsx           # MODIFY: add Movies/Shows toggle + Category dropdown
│   ├── HeroSlider.tsx                 # FIX: remove static logic; support TVShow items
│   ├── ShowCard.tsx                   # NEW: show card (poster, name, rating) — or extend MovieCard
│   └── EpisodeList.tsx                # NEW: expandable episode list for ShowDetailPage
├── pages/
│   ├── HomePage.tsx                   # MODIFY: add show carousels; fix welcome msg; wire content filter
│   ├── ShowDetailPage.tsx             # NEW: mirrors MovieDetailPage + seasons/episodes
│   ├── SearchPage.tsx                 # MODIFY: include TV show results; label type per result
│   ├── MovieDetailPage.tsx            # FIX: scroll-to-top on mount
│   └── ShowDetailPage.tsx             # NEW (same line as above — explicit)
└── App.tsx / routes.tsx               # ADD: /show/:id route; scroll-to-top on route change

tests/
├── pages/
│   ├── TopRatedPage.test.tsx          # MOVE from tests/ root
│   ├── TrendingPage.test.tsx          # MOVE from tests/ root
│   ├── ShowDetailPage.test.tsx        # NEW
│   └── (existing: HomePage, MovieDetailPage, SearchPage)
└── components/
    └── (existing tests retained)
```

## Complexity Tracking

> No violations — section left intentionally empty.
