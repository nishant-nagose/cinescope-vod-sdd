# Tasks: Responsive Design & UI Polish

**Branch**: `006-responsive-design-ui` | **Spec**: [./spec.md](./spec.md) | **Plan**: [./plan.md](./plan.md)
**Input**: Design documents from `/specs/006-responsive-design-ui/`
**Prerequisites**: spec.md (required), plan.md (required), checklists/requirements.md (passed)
**Status**: COMPLETED (2026-04-21)

## Format: `[ID] [P?] [USn] Description`

- **[P]**: Can run in parallel (different files, no shared dependencies)
- **[USn]**: User story this task belongs to (US1, US2...)
- Include exact file paths in task descriptions

---

## Phase 2: Foundational (Shared Prerequisites)

- [x] T1 [US1] Update `src/components/Layout.tsx` — mobile menu state hook, hamburger button (md:hidden), mobile dropdown, sticky header with z-index, responsive header height (h-14 sm:h-16), responsive logo sizing (h-6 sm:h-8)
  - [x] Add React state hook for mobile menu
  - [x] Implement hamburger button (md:hidden)
  - [x] Create mobile menu dropdown
  - [x] Make header sticky with z-index
  - [x] Responsive header height (h-14 sm:h-16)
  - [x] Logo responsive sizing (h-6 sm:h-8)

- [x] T2 [P] [US1] Update Footer component — responsive grid layout (1 sm:2 lg:3), responsive text sizing, responsive padding, mobile-friendly link layout, proper spacing on all breakpoints
  - [x] Responsive grid layout (1 sm:2 lg:3)
  - [x] Responsive text sizing
  - [x] Responsive padding
  - [x] Mobile-friendly link layout
  - [x] Proper spacing on all breakpoints

---

## Phase 3: Responsive Components (US1) — Priority: P1 🎯 MVP

- [x] T3 [P] [US1] Update `src/components/MovieCard.tsx` — responsive padding (p-2 sm:p-3), responsive text sizes (text-xs sm:text-sm), responsive rating badge positioning and sizing
  - [x] Responsive padding (p-2 sm:p-3)
  - [x] Responsive text sizes (text-xs sm:text-sm)
  - [x] Rating badge positioning (top-1 right-1, sm:top-2 sm:right-2)
  - [x] Badge sizing responsive

- [x] T4 [P] [US1] Update `src/components/MovieGrid.tsx` — responsive columns (2 sm:3 md:4 lg:5), responsive gaps (gap-3 sm:gap-4 md:gap-5 lg:gap-6), responsive loading and error states
  - [x] Responsive columns (2 sm:3 md:4 lg:5)
  - [x] Responsive gaps (gap-3 sm:gap-4 md:gap-5 lg:gap-6)
  - [x] Grid loading state responsive
  - [x] Error message responsive

- [x] T5 [P] [US1] Update page headers in TrendingPage and TopRatedPage — responsive heading sizes (text-xl sm:text-2xl ... lg:text-4xl), responsive description text (text-xs sm:text-sm ... md:text-base), responsive spacing (mb-6 sm:mb-8)
  - [x] Responsive heading sizes (text-xl sm:text-2xl ... lg:text-4xl)
  - [x] Responsive description text (text-xs sm:text-sm ... md:text-base)
  - [x] Responsive spacing (mb-6 sm:mb-8)
  - [x] TrendingPage updated
  - [x] TopRatedPage updated

- [x] T6 [P] [US1] Update Search Bar responsiveness — hidden on mobile/tablet (hidden lg:block), full-width on desktop, responsive sizing
  - [x] Hidden on mobile/tablet (hidden lg:block)
  - [x] Full-width on desktop
  - [x] Responsive sizing

- [x] T7 [P] [US1] Update Navigation — desktop nav hidden on mobile (hidden md:flex), responsive nav item text (text-sm lg:text-base), full-width mobile menu items, 44px+ tap targets on mobile
  - [x] Desktop nav hidden on mobile (hidden md:flex)
  - [x] Nav items responsive text (text-sm lg:text-base)
  - [x] Mobile menu items full-width
  - [x] Easy tap targets on mobile

---

## Phase 4: Validation & Polish

- [x] T8 [US1] Responsive testing — iPhone SE (375px), iPad (768px), MacBook (1280px), verify touch targets, text readability, no layout shifts, image loading
  - [x] Test on iPhone SE (375px)
  - [x] Test on iPad (768px)
  - [x] Test on MacBook (1280px)
  - [x] Verify touch targets (44px+)
  - [x] Check text readability
  - [x] Verify no layout shifts
  - [x] Test image loading

- [x] T9 [P] [US1] Performance optimization — lazy load images, Tailwind CSS purge, minimize bundle, remove unused classes, verify <200KB gzipped
  - [x] Lazy load images
  - [x] Optimize CSS with Tailwind purge
  - [x] Minimize bundle size
  - [x] Remove unused classes
  - [x] Verify <200KB gzipped

- [x] T10 [P] [US1] Accessibility — WCAG AA color contrast, focus indicators, ARIA labels on buttons, semantic HTML structure
  - [x] Color contrast WCAG AA
  - [x] Focus indicators on interactive elements
  - [x] ARIA labels on buttons
  - [x] Semantic HTML structure

---

## Quality Checklist

### Responsiveness
- [x] 2 columns mobile (default)
- [x] 3 columns sm:640px+
- [x] 4 columns md:768px+
- [x] 5 columns lg:1024px+
- [x] Full layout xl:1280px+
- [x] No horizontal scroll
- [x] No text overflow

### Mobile UX
- [x] Touch targets 44px+ height
- [x] Adequate spacing between touches
- [x] Menu easy to access
- [x] Content readable without zoom
- [x] Fast page load
- [x] Smooth interactions

### Typography
- [x] xs text on mobile
- [x] sm text on tablet
- [x] base text on desktop
- [x] Proper line height
- [x] Good contrast
- [x] Scalable fonts

### Images
- [x] Native lazy loading
- [x] Proper aspect ratios
- [x] No layout shift
- [x] CDN delivery
- [x] Responsive sizing

### Deployment
- [x] GitHub Pages compatible
- [x] All assets load
- [x] CSS bundles correctly
- [x] Images accessible
- [x] Navigation works
- [x] Responsive on live site

## Acceptance Criteria Status

| Criterion | Status | Notes |
|-----------|--------|-------|
| Mobile layout (2 cols) | ✅ | Default layout |
| Tablet layout (3 cols) | ✅ | 640px+ |
| Desktop layout (4 cols) | ✅ | 768px+ |
| Large desktop (5 cols) | ✅ | 1024px+ |
| Touch-friendly buttons | ✅ | 44px+ targets |
| Hamburger menu | ✅ | Mobile hidden nav |
| Responsive text | ✅ | All sizes scaling |
| Image optimization | ✅ | Lazy loaded |
| Mobile Lighthouse >85 | ✅ | Performance optimized |
| Deployed working | ✅ | Live on GitHub Pages |

## Checkpoint
✅ Responsive design complete across all components. Mobile-first approach fully implemented. Feature tested at all breakpoints.

## Notes
- No external component libraries - all Tailwind utilities
- GitHub Actions deployment not impacted
- Mobile responsiveness improves user retention
- Touch-first design benefits all users

---

## Dependencies & Execution Order

### Phase Dependencies
- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 — blocks all user story work
- **User Stories (Phase 3+)**: All depend on Phase 2 completion
- **Polish (Final Phase)**: Depends on all user story phases complete

### Parallel Opportunities
- T2 (Footer) can run in parallel with T1 (Layout) — different files
- T3/T4/T5/T6/T7 in Phase 3 can all run in parallel — each targets a different component file
- T9 (Performance) and T10 (Accessibility) in Phase 4 can run in parallel

---

## Implementation Strategy

### MVP First
1. Complete Phase 2: Foundational (T1, T2)
2. Complete Phase 3: Responsive Components (T3, T4, T5, T6, T7) 🎯
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
