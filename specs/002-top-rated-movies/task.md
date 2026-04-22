# Tasks: Top Rated Movies

**Branch**: `002-top-rated-movies` | **Spec**: [./spec.md](./spec.md) | **Plan**: [./plan.md](./plan.md)
**Input**: Design documents from `/specs/002-top-rated-movies/`
**Prerequisites**: spec.md (required), plan.md (required), checklists/requirements.md (passed)
**Status**: COMPLETED (2026-04-21)

## Format: `[ID] [P?] [USn] Description`

- **[P]**: Can run in parallel (different files, no shared dependencies)
- **[USn]**: User story this task belongs to (US1, US2...)
- Include exact file paths in task descriptions

---

## Phase 2: Foundational (Shared Prerequisites)

- [x] T1 [US1] Create `src/components/PaginationControls.tsx` — accept currentPage/totalPages/onPageChange, display up to 5 page numbers, Previous/Next buttons, disable states, responsive styling, 44px+ touch targets
  - [x] Create `src/components/PaginationControls.tsx`
  - [x] Accept currentPage, totalPages, onPageChange props
  - [x] Display page numbers (up to 5 visible)
  - [x] Add Previous/Next buttons
  - [x] Implement pagination logic
  - [x] Responsive styling
    - [x] Mobile: smaller buttons, vertical-friendly
    - [x] Tablet+: horizontal layout
    - [x] Touch-friendly 44px+ buttons
  - [x] Disable Previous on page 1
  - [x] Disable Next on last page
  - [x] Show current page indicator
  - [x] Responsive text sizing

---

## Phase 3: Top Rated Movies (US1) — Priority: P1 🎯 MVP

- [x] T2 [US1] Create `src/hooks/useTopRatedMovies.ts` — accept optional page param, fetch TMDB `/movie/top_rated` with pagination, manage pagination state, expose full interface, handle API errors
  - [x] Create `src/hooks/useTopRatedMovies.ts`
  - [x] Accept optional page parameter
  - [x] Fetch from TMDB `/movie/top_rated` with page param
  - [x] Manage pagination state
  - [x] Expose interface:
    ```typescript
    {
      movies: Movie[]
      currentPage: number
      totalPages: number
      loading: boolean
      error: string | null
      loadPage: (page: number) => Promise<void>
      refetch: () => Promise<void>
    }
    ```
  - [x] Implement page change handler
  - [x] Handle API errors gracefully

- [x] T3 [US1] Create `src/pages/TopRatedPage.tsx` — use useTopRatedMovies, responsive page header, MovieGrid + PaginationControls, page change handler, loading/error states, responsive layout
  - [x] Create `src/pages/TopRatedPage.tsx`
  - [x] Use useTopRatedMovies hook
  - [x] Manage currentPage state locally
  - [x] Render responsive page header
    - [x] Heading: text-xl sm:text-2xl md:text-3xl lg:text-4xl
    - [x] Description: text-xs sm:text-sm md:text-base
  - [x] Render MovieGrid with movies
  - [x] Render PaginationControls below grid
  - [x] Handle page changes via loadPage
  - [x] Show loading/error states
  - [x] Responsive page layout
    - [x] Padding: px-3 sm:px-4 md:px-6 lg:px-8
    - [x] Spacing: py-4 sm:py-6 md:py-8

- [x] T4 [P] [US1] Add route `/top-rated` to `src/routes.tsx` — import TopRatedPage, test route navigation
  - [x] Add route in `src/routes.tsx`
  - [x] Path: `/top-rated`
  - [x] Import TopRatedPage component
  - [x] Test route navigation

---

## Phase 4: Polish, Responsive & Accessibility

- [x] T5 [P] [US1] Responsive styling for PaginationControls — compact mobile buttons, full-size desktop, space-x-2 md:space-x-3, text-sm md:text-base, 44px height, prominent current page indicator
  - [x] Button styling responsive
    - [x] Mobile: compact with padding
    - [x] Desktop: full-size buttons
  - [x] Button spacing responsive (space-x-2 md:space-x-3)
  - [x] Text sizing: text-sm md:text-base
  - [x] Touch targets minimum 44px height
  - [x] Current page indicator prominent
  - [x] Navigation buttons obvious (Previous/Next)

- [x] T6 [P] [US1] Loading and error states — reuse MovieGrid skeleton, error with retry, disable pagination while loading, show loading on page changes, handle page-specific errors
  - [x] Reuse MovieGrid loading skeleton
  - [x] Show error message with retry
  - [x] Disable pagination while loading
  - [x] Show loading indicator on page changes
  - [x] Handle page-specific errors gracefully

- [x] T7 [P] [US1] Accessibility — ARIA labels on pagination, button semantics, keyboard navigation, visible focus states, screen reader page announcement
  - [x] ARIA labels on pagination buttons
  - [x] Proper button semantics (`<button>` tags)
  - [x] Keyboard navigation for pagination
  - [x] Focus states visible on all buttons
  - [x] Current page announced to screen readers

---

## Phase 5: Testing

- [x] T8 [US1] Component testing — `tests/components/PaginationControls.test.tsx`, `tests/pages/TopRatedPage.test.tsx`, pagination buttons, disabled states, page changes, responsive layout, error retry
  - [x] Create `tests/components/PaginationControls.test.tsx`
  - [x] Create `tests/pages/TopRatedPage.test.tsx`
  - [x] Test pagination button functionality
  - [x] Test next/previous disabled states
  - [x] Test page changes load different movies
  - [x] Test responsive layout
  - [x] Test error retry

---

## Quality Checklist

### Code Quality
- [x] TypeScript types on all components
- [x] PropTypes defined and validated
- [x] No console errors or warnings
- [x] Consistent with Trending feature
- [x] Comments on pagination logic

### Responsive Design
- [x] Pagination buttons responsive on mobile
- [x] Movie grid identical to Trending (2/3/4/5 cols)
- [x] Text sizing appropriate for all screens
- [x] Touch targets minimum 44px
- [x] No overflow or text wrapping issues

### Pagination Functionality
- [x] Page numbers displayed (max 5)
- [x] Next/Previous navigation works
- [x] Current page highlighted
- [x] Disabled states work correctly
- [x] Page changes trigger new API calls

### Performance
- [x] Movies load within 2s
- [x] Lazy loading on images
- [x] Pagination reduces memory usage
- [x] No unnecessary re-renders
- [x] Smooth page transitions

### Mobile UX
- [x] Touch-friendly buttons
- [x] Easy pagination navigation
- [x] Clear current page indication
- [x] Movies grid optimized for mobile
- [x] No layout shifts when loading

### Deployment
- [x] Works on GitHub Pages
- [x] Base path handled correctly
- [x] Assets load properly
- [x] Responsive CSS included
- [x] Navigation functional in production

## Acceptance Criteria Status

| Criterion | Status | Notes |
|-----------|--------|-------|
| Top-rated movies display | ✅ | 20 per page from TMDB |
| Pagination controls visible | ✅ | Previous/Next, page numbers |
| Page changes work | ✅ | Loads different movies |
| Responsive layout | ✅ | All breakpoints working |
| Touch-friendly controls | ✅ | 44px+ buttons |
| Loading state | ✅ | Skeleton on page change |
| Error handling | ✅ | Retry available |
| Accessibility | ✅ | ARIA labels implemented |
| Mobile optimized | ✅ | Tested on mobile sizes |
| Deployed successfully | ✅ | Live on GitHub Pages |

## Checkpoint
✅ Feature complete with pagination. All acceptance criteria met. Integrated with main app.

## Notes
- Pagination component reusable for other list features
- Consistent responsive styling with Trending feature
- TMDB provides total_pages in API response
- No external pagination libraries needed
- Feature naturally handles mobile constraints

---

## Dependencies & Execution Order

### Phase Dependencies
- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 — blocks all user story work
- **User Stories (Phase 3+)**: All depend on Phase 2 completion
- **Polish (Final Phase)**: Depends on all user story phases complete

### Parallel Opportunities
- T4 Router Integration can run in parallel with T2/T3 (different file: routes.tsx)
- T5, T6, T7 in Phase 4 can all run in parallel (different concerns, different files)

---

## Implementation Strategy

### MVP First
1. Complete Phase 2: Foundational (T1)
2. Complete Phase 3: Top Rated Movies (T2, T3) 🎯
3. STOP and VALIDATE independently

### Incremental Delivery
- After Phase 3 (US1): Deploy and validate → MVP
- Polish phase last

---

## Notes
- [P] = different files, no shared dependencies — safe to parallelise
- [USn] label maps task to user story for traceability
- Commit after each phase checkpoint
- All sub-tasks within a parent task run sequentially unless marked [P]
