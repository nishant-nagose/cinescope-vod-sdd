# Phase 5: User Story 3 - Search by Title (P3)

**Goal**: Allow users to search movie titles with suggestions, result sorting, and URL persistence

**Independent Test**: Enter a search term and verify suggestion dropdown appears, results page loads with `?q=` in URL, and short queries do not trigger API calls

## Tasks

- [ ] T034 [P] [US3] Create `src/components/SearchBar.tsx` with input, debounce, and suggestion dropdown
- [ ] T035 [P] [US3] Create `src/hooks/useSearchMovies.ts` to call `/search/movie` only after 3 characters and 300ms debounce
- [ ] T036 [US3] Create `src/pages/SearchResultsPage.tsx` to render search results and sorting controls
- [ ] T037 [US3] Add URL sync for search query in `SearchResultsPage.tsx` and `SearchBar.tsx`
- [ ] T038 [US3] Add matching text highlight for suggestions in `SearchBar.tsx`
- [ ] T039 [US3] Create `tests/SearchFeature.test.tsx` to verify suggestions, query persistence, and no-call behavior for short input

## Checkpoint

User Story 3 should be independently testable with search and result behavior
