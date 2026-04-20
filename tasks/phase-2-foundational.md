# Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before any user story implementation

## Tasks

- [ ] T011 [P] Create `src/types/tmdb.ts` with interfaces for trending movie, search result, movie details, cast, and related movies
- [ ] T012 [P] Create `src/services/tmdbApi.ts` with API client functions for `/trending/movie/week`, `/movie/top_rated`, `/search/movie`, `/movie/{id}`, `/movie/{id}/credits`, and `/movie/{id}/similar`
- [ ] T013 [P] Create `src/services/cache.ts` with a reusable TTL cache for API responses
- [ ] T014 [P] Create `src/services/errorHandling.ts` with standardized API error mapping and timeout support
- [ ] T015 [P] Create `src/hooks/useApi.ts` to wrap TMDB API calls with loading, error, and retry behavior
- [ ] T016 [P] Create `src/routes.tsx` and configure React Router routes for `/`, `/top-rated`, `/search`, `/movie/:id`, and fallback 404
- [ ] T017 [P] Create `src/components/Layout.tsx` with header, search bar placeholder, and footer shell
- [ ] T018 [P] Create `src/components/LoadingSkeleton.tsx` and `src/components/ErrorState.tsx` for global loading/error UI
- [ ] T019 [P] Create `src/components/MovieCard.tsx` and `src/components/MovieGrid.tsx` for reusable movie listing UI
- [ ] T020 [P] Create `src/styles/tailwind.css` and integrate Tailwind utilities in app styles

## Checkpoint

Foundation ready - user story implementation can now begin
