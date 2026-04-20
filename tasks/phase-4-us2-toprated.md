# Phase 4: User Story 2 - Browse Top Rated Movies (P2)

**Goal**: Provide a top-rated movie discovery page sorted by rating with load-more support

**Independent Test**: Open the top-rated page and verify movies display sorted highest to lowest with a rating badge and pagination control

## Tasks

- [ ] T028 [P] [US2] Create `src/pages/TopRatedPage.tsx` to fetch `/movie/top_rated` and display results with `MovieGrid`
- [ ] T029 [P] [US2] Create `src/components/RatingBadge.tsx` to render Gold/Silver/Gray rating categories
- [ ] T030 [US2] Create `src/components/PaginationControls.tsx` for loading more pages of top-rated results
- [ ] T031 [US2] Update `src/hooks/useApi.ts` or create `src/hooks/useTopRatedMovies.ts` to support next-page loading
- [ ] T032 [US2] Add load-more behavior and error handling in `TopRatedPage.tsx`
- [ ] T033 [US2] Create `tests/TopRatedPage.test.tsx` to verify sorting, rating badge rendering, and pagination

## Checkpoint

User Story 2 should be independently testable with top-rated discovery behavior
