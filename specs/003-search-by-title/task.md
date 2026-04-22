# Tasks: Search by Title

**Branch**: `003-search-by-title` | **Spec**: [./spec.md](./spec.md) | **Plan**: [./plan.md](./plan.md)
**Input**: Design documents from `/specs/003-search-by-title/`
**Prerequisites**: spec.md (required), plan.md (required), checklists/requirements.md (passed)
**Status**: PLANNED

## Format: `[ID] [P?] [USn] Description`

- **[P]**: Can run in parallel (different files, no shared dependencies)
- **[USn]**: User story this task belongs to (US1, US2...)
- Include exact file paths in task descriptions

---

## Phase 1: Setup & Infrastructure

- [ ] T4 [US1] Add route `/search` with `?q=` param support to `src/routes.tsx`
  - [ ] Add route `/search` to router
  - [ ] Accept query parameter `?q=` for search term
  - [ ] Accept `?page=` parameter for pagination

---

## Phase 2: Foundational (Shared Prerequisites)

- [ ] T3 [US1] Create `src/components/SearchBar.tsx` — debounced controlled input, URL sync via useSearchParams, clear button, mobile-optimised sizing
  - [ ] Create responsive search input component
  - [ ] Mobile-optimized input sizing
  - [ ] Search submission handling
  - [ ] Debounce input by 300ms
  - [ ] Sync search value with `?q=` URL param via useSearchParams
  - [ ] Show clear button when input has value

---

## Phase 3: Search by Title — Core (US1) — Priority: P1 🎯 MVP

- [ ] T1 [US1] Create `src/hooks/useMovieSearch.ts` — accept query, debounce 300ms, call `tmdbApi.searchMovies(query, page)`, sync `?q=` and `?page=` URL params, expose full state interface
  - [ ] Create `src/hooks/useMovieSearch.ts`
  - [ ] Accept search query parameter
  - [ ] Fetch from TMDB `/search/movie` endpoint
  - [ ] Implement debouncing (300ms)
  - [ ] Handle pagination for search results
  - [ ] Expose search state and results
  - [ ] Implement debounce 300ms
  - [ ] Sync `?q=` URL param via useSearchParams
  - [ ] Skip API call when query < 3 chars
  - [ ] Handle pagination state
  - [ ] Expose interface:
    ```typescript
    {
      results: Movie[]
      loading: boolean
      error: string | null
      query: string
      page: number
      totalPages: number
      setQuery: (q: string) => void
      setPage: (p: number) => void
    }
    ```

- [ ] T2 [US1] Create `src/pages/SearchPage.tsx` — read `?q=` from URL, integrate SearchBar + MovieGrid + PaginationControls, empty state (no query), no-results state, error state with retry
  - [ ] Create `src/pages/SearchPage.tsx`
  - [ ] Integrate useMovieSearch hook
  - [ ] Render responsive search input
  - [ ] Display search results using MovieGrid
  - [ ] Show pagination controls
  - [ ] Handle empty search state
  - [ ] Show "Type at least 3 characters" when query < 3
  - [ ] Show "No movies found for 'X'" when 0 results
  - [ ] Show error state with retry button on API failure

---

## Phase 4: Sort & Filter Results (US2)

- [ ] T-US2-1 [US2] Add sort controls to SearchPage — relevance / rating / release date toggle buttons
  - [ ] Render sort toggle (relevance / rating / release date)
  - [ ] Persist selected sort in component state

- [ ] T-US2-2 [US2] Implement client-side sort of results array — sort by relevance (default), vote_average, or release_date in useMovieSearch or SearchPage
  - [ ] Sort results by vote_average when "rating" selected
  - [ ] Sort results by release_date when "release date" selected
  - [ ] Default to API relevance order

---

## Phase 5: Testing

- [ ] T5 [US1] Test search functionality — debounce (no API call < 3 chars), empty query, pagination, no-results state, error retry
  - [ ] Test search functionality
  - [ ] Test pagination on search results
  - [ ] Test responsive layout
  - [ ] Test debounce — no API call triggered for query < 3 chars
  - [ ] Test empty query shows prompt state
  - [ ] Test no-results state renders correct message
  - [ ] Test error state shows retry button

- [ ] T5b [P] [US2] Test sort reordering — verify each sort criterion reorders results array correctly
  - [ ] Test sort by rating reorders movies by vote_average descending
  - [ ] Test sort by release date reorders by date descending
  - [ ] Test relevance returns to original API order

---

## Acceptance Criteria

- [ ] Search returns relevant movies for queries ≥ 3 characters
- [ ] Results display in responsive grid matching Trending/TopRated layout
- [ ] Pagination works on search results
- [ ] No API call for queries shorter than 3 characters
- [ ] Search term persisted in URL query string (?q=)
- [ ] Results sortable by relevance, rating, release date
- [ ] Mobile-optimised search bar and results grid
- [ ] Error state with retry on API failure

---

## Dependencies & Execution Order

### Phase Dependencies
- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 — blocks all user story work
- **User Stories (Phase 3+)**: All depend on Phase 2 completion
- **Polish (Final Phase)**: Depends on all user story phases complete

### Parallel Opportunities
- T1 (useMovieSearch) and T3 (SearchBar) can run in parallel after Phase 1 (different files)
- T-US2-1 and T5b can run in parallel (sort UI vs sort tests, different concerns)

---

## Implementation Strategy

### MVP First
1. Complete Phase 1: Setup (T4)
2. Complete Phase 2: Foundational (T3)
3. Complete Phase 3: Search by Title — Core (T1, T2) 🎯
4. STOP and VALIDATE independently

### Incremental Delivery
- After Phase 3 (US1): Deploy and validate → MVP
- After Phase 4 (US2): Test sort independently → deploy
- Testing phase last

---

## Notes
- Lower priority than core browsing features
- Planned for later development phase
- [P] = different files, no shared dependencies — safe to parallelise
- [USn] label maps task to user story for traceability
- Commit after each phase checkpoint
- All sub-tasks within a parent task run sequentially unless marked [P]
