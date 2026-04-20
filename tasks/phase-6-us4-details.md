# Phase 6: User Story 4 - Movie Detail Page (P4)

**Goal**: Display full movie details, cast, ratings, and related titles on a dedicated page

**Independent Test**: Select a movie and verify the detail page loads metadata, cast list, related movies, and back navigation

## Tasks

- [ ] T040 [P] [US4] Create `src/pages/MovieDetailPage.tsx` with route `/movie/:id`
- [ ] T041 [P] [US4] Create `src/components/DetailHeader.tsx` for poster, title, rating, and metadata
- [ ] T042 [P] [US4] Create `src/components/DetailInfo.tsx` for overview, runtime, genres, and vote stats
- [ ] T043 [P] [US4] Create `src/components/CastSection.tsx` and `src/components/ActorCard.tsx`
- [ ] T044 [US4] Create `src/components/RelatedMoviesSection.tsx` to render similar movies
- [ ] T045 [US4] Update `src/services/tmdbApi.ts` with `getMovieCredits` and `getSimilarMovies`
- [ ] T046 [US4] Implement parallel loading of movie detail, credits, and similar movies in `MovieDetailPage.tsx`
- [ ] T047 [US4] Create `tests/MovieDetailPage.test.tsx` to verify detail rendering, cast handling, and related movie display

## Checkpoint

User Story 4 should be independently testable with full movie detail behavior
