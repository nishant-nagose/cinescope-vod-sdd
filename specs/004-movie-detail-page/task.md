# Tasks: Movie Detail Page

**Branch**: `004-movie-detail-page` | **Spec**: [./spec.md](./spec.md) | **Plan**: [./plan.md](./plan.md)
**Input**: Design documents from `/specs/004-movie-detail-page/`
**Prerequisites**: spec.md (required), plan.md (required), checklists/requirements.md (passed)
**Status**: PLANNED

## Format: `[ID] [P?] [USn] Description`

- **[P]**: Can run in parallel (different files, no shared dependencies)
- **[USn]**: User story this task belongs to (US1, US2...)
- Include exact file paths in task descriptions

---

## Phase 2: Foundational (Shared Prerequisites)

- [ ] T1 [US1] Create `src/hooks/useMovieDetails.ts` — accept `id: string`, call `tmdbApi.getMovieDetails(id)` + `tmdbApi.getMovieCredits(id)` + `tmdbApi.getSimilarMovies(id)` in parallel via Promise.all, expose `{ movie, cast, similar, loading, error }`
  - [ ] Fetch movie details from TMDB
  - [ ] Fetch cast and crew information
  - [ ] Expose loading and error states
  - [ ] Use Promise.all for parallel fetches
  - [ ] Return loading: true while any fetch pending
  - [ ] Surface first error encountered

---

## Phase 3: Movie Detail Page (US1) — Priority: P1 🎯 MVP

- [ ] T2 [US1] Create `src/pages/MovieDetailPage.tsx` — extract `:id` via useParams(), hero section (backdrop + poster + title + rating + genres + runtime), overview section, add route `/movie/:id` in `src/routes.tsx`
  - [ ] Extract movie ID from URL params
  - [ ] Render responsive detail layout
  - [ ] Display synopsis and metadata
  - [ ] Show cast information
  - [ ] Display vote average with RatingBadge component
  - [ ] Display genres as pill tags
  - [ ] Display runtime in hours/minutes format

- [ ] T3 [US1] Implement responsive detail layout — mobile single-column stacked, tablet two-column hero (poster left / metadata right), desktop full-width backdrop, responsive image sizing, skeleton loading states
  - [ ] Mobile: Single column
  - [ ] Tablet: Two-column where appropriate
  - [ ] Desktop: Full layout
  - [ ] Responsive image sizing
  - [ ] Skeleton placeholder for hero image
  - [ ] Skeleton placeholder for cast section

---

## Phase 4: Cast & Similar Movies (US2)

- [ ] T4 [P] [US2] Create `src/components/CastSection.tsx` — show top 10 cast, horizontal scroll on mobile, grid on desktop, actor photo + name + character, fallback for missing photos
  - [ ] Create cast list component
  - [ ] Show actor photos and names
  - [ ] Responsive grid layout
  - [ ] Show top 10 cast members
  - [ ] Horizontal scroll on mobile
  - [ ] Grid layout on desktop
  - [ ] Fallback image for missing actor photos

- [ ] T4b [P] [US2] Add Similar Movies section to MovieDetailPage — render MovieGrid with 3-5 similar movies, hide section if API returns empty array
  - [ ] Render MovieGrid with similar movies from hook
  - [ ] Limit display to 3-5 results
  - [ ] Hide section entirely when similar array is empty

---

## Phase 5: Polish & Testing

- [ ] T5 [US1] Test detail page — valid ID loads correctly, invalid ID shows 404 error, skeleton loading visible, missing data fields hidden gracefully
  - [ ] Test detail page loads
  - [ ] Test responsive layout
  - [ ] Test error handling
  - [ ] Test detail page loads for valid ID
  - [ ] Test 404 error state for invalid ID
  - [ ] Test skeleton loading visible while fetching
  - [ ] Test missing data fields hidden gracefully (no broken UI)

- [ ] T5b [P] [US2] Test cast and similar movies — cast section renders, similar movies show/hide, responsive layout at all breakpoints
  - [ ] Test cast section renders correctly
  - [ ] Test similar movies section shows when data available
  - [ ] Test similar movies section hidden when API returns empty
  - [ ] Test responsive layout at all breakpoints

- [ ] T5c [P] [US1] Back navigation — add back button using useNavigate(-1), test back navigation returns to previous page
  - [ ] Add back navigation button (useNavigate(-1))
  - [ ] Test back navigation returns to previous page

---

## Acceptance Criteria

- [ ] Movie details display correctly (title, release date, runtime, genres, rating, overview)
- [ ] Cast section shows at least 5 actors when available
- [ ] Related/similar movies section shown if API provides them
- [ ] Responsive at all breakpoints (mobile stacked, tablet two-col, desktop full)
- [ ] Error handling with friendly message for invalid or missing movie
- [ ] Missing data fields hidden gracefully (no broken UI)
- [ ] Back button returns user to previous browsing context
- [ ] Skeleton loading state visible while fetching

---

## Dependencies & Execution Order

### Phase Dependencies
- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 — blocks all user story work
- **User Stories (Phase 3+)**: All depend on Phase 2 completion
- **Polish (Final Phase)**: Depends on all user story phases complete

### Parallel Opportunities
- T4 (CastSection) and T4b (Similar Movies section) can run in parallel (different files/concerns)
- T5b and T5c can run in parallel (different test concerns)

---

## Implementation Strategy

### MVP First
1. Complete Phase 2: Foundational (T1)
2. Complete Phase 3: Movie Detail Page (T2, T3) 🎯
3. STOP and VALIDATE independently

### Incremental Delivery
- After Phase 3 (US1): Deploy and validate → MVP
- After Phase 4 (US2): Test cast and similar independently → deploy
- Polish phase last

---

## Notes
- Later phase implementation
- Core feature for discovery experience
- [P] = different files, no shared dependencies — safe to parallelise
- [USn] label maps task to user story for traceability
- Commit after each phase checkpoint
- All sub-tasks within a parent task run sequentially unless marked [P]
