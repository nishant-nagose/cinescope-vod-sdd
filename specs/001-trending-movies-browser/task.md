# Tasks: Trending Movies Browser

**Branch**: `001-trending-movies-browser` | **Spec**: [./spec.md](./spec.md) | **Plan**: [./plan.md](./plan.md)
**Input**: Design documents from `/specs/001-trending-movies-browser/`
**Prerequisites**: spec.md (required), plan.md (required), checklists/requirements.md (passed)
**Status**: COMPLETED (2026-04-21)

## Format: `[ID] [P?] [USn] Description`

- **[P]**: Can run in parallel (different files, no shared dependencies)
- **[USn]**: User story this task belongs to (US1, US2...)
- Include exact file paths in task descriptions

---

## Phase 2: Foundational (Shared Prerequisites)

- [x] T1 [P] [US1] Create `src/components/MovieCard.tsx` — accept Movie prop, display poster, title, year, rating badge, clickable navigation, missing poster fallback
  - [x] Create `src/components/MovieCard.tsx`
  - [x] Accept Movie prop from TMDB API
  - [x] Display poster image with lazy loading
  - [x] Show title, release year, rating badge
  - [x] Implement responsive styling
    - [x] Mobile: p-2, text-xs, top-1 right-1 badge
    - [x] Tablet+: p-3 sm:p-3, text-xs sm:text-sm
    - [x] Desktop: top-2 right-2 badge
  - [x] Make card clickable and navigable
  - [x] Handle missing poster image gracefully

- [x] T2 [P] [US1] Create `src/components/MovieGrid.tsx` — accept movies array and UI state props, responsive 2/3/4/5 column grid, loading skeleton, error state, empty state
  - [x] Create `src/components/MovieGrid.tsx`
  - [x] Accept movies array and UI state props
  - [x] Implement responsive grid layout
    - [x] 2 columns (mobile, default)
    - [x] 3 columns (sm: 640px+)
    - [x] 4 columns (md: 768px+)
    - [x] 5 columns (lg: 1024px+)
  - [x] Responsive gap scaling (gap-3 sm:gap-4 md:gap-5 lg:gap-6)
  - [x] Map MovieCard components
  - [x] Handle loading state with skeleton
  - [x] Handle error state with retry button
  - [x] Handle empty state message

- [x] T3 [P] [US1] Add skeleton loading state to `src/components/MovieGrid.tsx` — 10 placeholder cards, animated pulse, responsive spacing
  - [x] Add skeleton loading state to MovieGrid
  - [x] Display 10 placeholder cards while loading
  - [x] Animated pulse effect on skeletons
  - [x] Proper responsive skeleton sizing
    - [x] Mobile: p-2 spacing
    - [x] Tablet: p-3 spacing
    - [x] Desktop: p-4 spacing

---

## Phase 3: Trending Movies Browser (US1) — Priority: P1 🎯 MVP

- [x] T4 [US1] Create `src/hooks/useTrendingMovies.ts` — fetch TMDB `/movie/trending`, manage loading/error/data states, refetch/retry, cache results
  - [x] Create `src/hooks/useTrendingMovies.ts`
  - [x] Fetch from TMDB `/movie/trending` endpoint
  - [x] Manage loading, error, data states
  - [x] Implement refetch/retry function
  - [x] Expose interface:
    ```typescript
    {
      data?: MovieResponse
      loading: boolean
      error: string | null
      refetch: () => Promise<void>
    }
    ```
  - [x] Handle network errors gracefully
  - [x] Cache results appropriately

- [x] T5 [US1] Create `src/pages/TrendingPage.tsx` — use useTrendingMovies hook, responsive page header, pass data to MovieGrid, responsive page padding, integrate with Layout, add to router
  - [x] Create `src/pages/TrendingPage.tsx`
  - [x] Use useTrendingMovies hook for data
  - [x] Render responsive page header
    - [x] Heading: text-xl sm:text-2xl md:text-3xl lg:text-4xl
    - [x] Description: text-xs sm:text-sm md:text-base
    - [x] Responsive margins: mb-6 sm:mb-8
  - [x] Pass data to MovieGrid component
  - [x] Responsive page padding
    - [x] Mobile: px-3 py-4
    - [x] Tablet: px-4 py-6
    - [x] Desktop: px-6 lg:px-8 py-8
  - [x] Integrate with Layout wrapper
  - [x] Add to router configuration

- [x] T6 [P] [US1] Apply Tailwind responsive classes across all components — verify at 375px/768px/1024px+, touch targets min 44px, text readability
  - [x] All components use Tailwind responsive classes
  - [x] No CSS files needed (Tailwind-based)
  - [x] Tested at mobile (375px), tablet (768px), desktop (1024px+)
  - [x] Verified touch target sizes (min 44px)
  - [x] Verified text readability at all sizes

- [x] T7 [P] [US1] Implement error handling and retry — MovieGrid error message, retry button, user-friendly messages, loading on retry
  - [x] MovieGrid displays error message component
  - [x] Retry button visible and functional
  - [x] Error messages are user-friendly
  - [x] Retry attempts API call again
  - [x] Loading state shows on retry

- [x] T8 [P] [US1] Implement empty state handling — "No movies found" message, responsive text sizing, clear call-to-action
  - [x] Display "No movies found" when results empty
  - [x] Responsive text sizing for empty message
  - [x] Clear call-to-action or explanation

---

## Phase 4: Polish & Accessibility

- [x] T9 [P] [US1] Accessibility and SEO — semantic HTML, alt text, ARIA labels, heading hierarchy, WCAG AA contrast, focus indicators
  - [x] Semantic HTML (page > section > article)
  - [x] Alt text on all images
  - [x] ARIA labels on buttons
  - [x] Proper heading hierarchy
  - [x] Color contrast meets WCAG AA on mobile
  - [x] Focus indicators on interactive elements

- [x] T10 [US1] Component testing — `tests/components/MovieCard.test.tsx`, `tests/components/MovieGrid.test.tsx`, `tests/pages/TrendingPage.test.tsx`, loading/error/navigation/grid tests
  - [x] Create `tests/components/MovieCard.test.tsx`
  - [x] Create `tests/components/MovieGrid.test.tsx`
  - [x] Create `tests/pages/TrendingPage.test.tsx`
  - [x] Test loading state displays
  - [x] Test error state displays with retry
  - [x] Test movie cards render
  - [x] Test navigation works on click
  - [x] Test responsive grid layout

---

## Quality Checklist

### Code Quality
- [x] TypeScript types on all components
- [x] PropTypes defined and validated
- [x] No console errors or warnings
- [x] Code formatted consistently
- [x] Comments on complex logic

### Responsive Design
- [x] 2 columns on small phones (<640px)
- [x] 3 columns on larger phones (640px+)
- [x] 4 columns on tablets (768px+)
- [x] 5 columns on desktop (1024px+)
- [x] Touch-friendly spacing maintained
- [x] No text overflow on any breakpoint

### Performance
- [x] Movies load visibly within 2s on 4G
- [x] Lazy loading images implemented
- [x] Skeleton provides perceived performance
- [x] Bundle size optimal
- [x] No unnecessary re-renders

### Mobile User Experience
- [x] Easy tap targets (minimum 44px)
- [x] No pinch zoom needed for readability
- [x] Touch gestures work naturally
- [x] No layout shifts when loading
- [x] Error retry accessible and clear

### Deployment (GitHub Pages)
- [x] Feature works at base path `/cinescope-vod-sdd/`
- [x] All assets load correctly
- [x] Images display on GitHub Pages
- [x] Navigation working in deployed version
- [x] Responsive CSS loads properly

## Acceptance Criteria Status

| Criterion | Status | Notes |
|-----------|--------|-------|
| At least 10 trending movies display | ✅ | API returns 20 results |
| Movie cards show poster, title, year, rating | ✅ | All fields displayed correctly |
| Cards are clickable and navigable | ✅ | Navigation to detail page works |
| Responsive grid (2/3/4/5 columns) | ✅ | All breakpoints working |
| Loading state visible | ✅ | Skeleton displays quickly |
| Error handling with retry | ✅ | Retry button functional |
| Empty state handling | ✅ | Proper message shown |
| Mobile-first responsive design | ✅ | Tested on all breakpoints |
| Touch-friendly interaction | ✅ | 44px+ tap targets |
| Deployment working | ✅ | Live on GitHub Pages |

## Checkpoint
✅ Feature complete and deployed. All acceptance criteria met. Ready for integration testing.

## Notes
- GitHub Actions automatically deployed changes on push to main
- Mobile responsive design follows Tailwind CSS best practices
- All Tailwind classes optimized for GitHub Pages bundle size
- Feature integrates seamlessly with Layout component
- Uses existing TMDB API integration layer

---

## Dependencies & Execution Order

### Phase Dependencies
- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 — blocks all user story work
- **User Stories (Phase 3+)**: All depend on Phase 2 completion
- **Polish (Final Phase)**: Depends on all user story phases complete

### Parallel Opportunities
- T1 MovieCard, T2 MovieGrid, T3 LoadingSkeleton can run in parallel (Phase 2)
- T6 Responsive Styling, T7 Error Handling, T8 Empty State can run in parallel (Phase 3, after T5)
- T9 Accessibility can run in parallel with T10 setup (Phase 4)

---

## Implementation Strategy

### MVP First
1. Complete Phase 2: Foundational (T1, T2, T3)
2. Complete Phase 3: Trending Movies Browser (T4, T5) 🎯
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
