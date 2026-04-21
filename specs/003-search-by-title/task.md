# Feature Tasks: Search by Title

**Feature**: Search Movies by Title (P2)  
**Related Spec**: [spec.md](./spec.md)  
**Related Plan**: [plan.md](./plan.md)  
**Status**: PLANNED

## Task Breakdown

### T1: Create useMovieSearch Hook
**Priority**: P1 | **Effort**: 1.5h | **Status**: NOT STARTED
- [ ] Create `src/hooks/useMovieSearch.ts`
- [ ] Accept search query parameter
- [ ] Fetch from TMDB `/search/movie` endpoint
- [ ] Implement debouncing (300ms)
- [ ] Handle pagination for search results
- [ ] Expose search state and results

### T2: Create SearchPage Component
**Priority**: P1 | **Effort**: 1.5h | **Status**: NOT STARTED
- [ ] Create `src/pages/SearchPage.tsx`
- [ ] Integrate useMovieSearch hook
- [ ] Render responsive search input
- [ ] Display search results using MovieGrid
- [ ] Show pagination controls
- [ ] Handle empty search state

### T3: Create SearchBar Component
**Priority**: P2 | **Effort**: 1h | **Status**: NOT STARTED
- [ ] Create responsive search input component
- [ ] Mobile-optimized input sizing
- [ ] Search submission handling

### T4: Router Integration
**Priority**: P1 | **Effort**: 0.5h | **Status**: NOT STARTED
- [ ] Add route `/search` to router
- [ ] Accept query parameter for search term

### T5: Testing
**Priority**: P2 | **Effort**: 1.5h | **Status**: NOT STARTED
- [ ] Test search functionality
- [ ] Test pagination on search results
- [ ] Test responsive layout

## Acceptance Criteria
- [ ] Search returns relevant movies
- [ ] Results display in responsive grid
- [ ] Pagination works on search results
- [ ] Mobile-optimized layout
- [ ] Error handling included

## Notes
- Lower priority than core browsing features
- Planned for later development phase
