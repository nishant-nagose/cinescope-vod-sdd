# Phase 3: User Story 1 - Discover Trending Movies (P1) 🎯 MVP

**Goal**: Show trending movie discovery on the homepage with responsive cards and detail navigation

**Independent Test**: Open the homepage and verify at least 10 trending movies display with a clickable card and loading/error states

## Tasks

- [ ] T021 [P] [US1] Create `src/pages/TrendingPage.tsx` to fetch trending movies and render `MovieGrid`
- [ ] T022 [P] [US1] Create `src/hooks/useTrendingMovies.ts` to load trending movie data and expose loading, error, and retry
- [ ] T023 [US1] Update `src/components/MovieCard.tsx` to display poster, title, release year, and average rating
- [ ] T024 [US1] Create `src/pages/TrendingPage.css` or add styles to support 2-column mobile, 3-column tablet, and 4-column desktop grid layout
- [ ] T025 [US1] Add retry behavior and user-friendly error message in `TrendingPage.tsx`
- [ ] T026 [US1] Add empty state handling for no trending movies in `TrendingPage.tsx`
- [ ] T027 [US1] Create `tests/TrendingPage.test.tsx` to verify trending movie cards render, loading state displays, and click navigation works

## Checkpoint

User Story 1 should be fully functional and testable independently
