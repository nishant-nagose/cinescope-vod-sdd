# Tasks: Modern Netflix-Like Home Page

**Feature**: 008-modern-netflix-home  
**Version**: 1.0  
**Created**: 2026-04-22  
**Status**: READY FOR IMPLEMENTATION

## Task Breakdown & Dependency Tree

### Foundation Tasks (Phase 1) - No dependencies

```
TASK-001: Create MovieCard Component (Carousel Style)
├─ Input: Movie object with ID, poster, title, rating
├─ Output: Reusable card component for horizontal carousels
├─ Acceptance: Card renders image, title, rating; clickable navigation to `/movie/:id`
├─ Priority: P0 (blocker)
└─ Effort: 1 day

TASK-002: Create MovieCarousel Component (Horizontal Scroll Container)
├─ Input: Array of movies, carousel title, onClick handler
├─ Output: Reusable 2-row horizontal scrollable carousel
├─ Acceptance: Smooth horizontal scroll, 2 rows visible, responsive card sizing
├─ Priority: P0 (blocker)
└─ Effort: 1.5 days

TASK-003: Create CategoryDropdown Component
├─ Input: List of genres, selected genre, onChange handler
├─ Output: Dropdown menu to select movie genres
├─ Acceptance: Dropdown renders genres, onChange fires with selected genre ID
├─ Priority: P1
└─ Effort: 0.5 days

TASK-004: Update TMDB Service with Genre Endpoints
├─ Input: Existing tmdbApi.ts service
├─ Output: Add methods for genres, discover-by-genre, new-releases, critically-acclaimed
├─ Acceptance: New endpoints return typed Movie[] data, caching works
├─ Priority: P0 (blocker)
├─ Methods to add:
│   ├─ getGenres() → Genre[]
│   ├─ getMoviesByGenre(genreId: number) → Movie[]
│   ├─ getNewReleases() → Movie[]
│   ├─ getCriticallyAcclaimed() → Movie[]
│   └─ getTrendingMovies() → Movie[] (may already exist)
└─ Effort: 1 day
```

### Home Page Implementation Tasks (Phase 2) - Depends on Phase 1

```
TASK-005: Create HomePage Component Structure
├─ Depends on: TASK-001, TASK-002, TASK-004
├─ Input: HomePage will host all carousels
├─ Output: Page component with state management for 5 carousels
├─ Acceptance: Page structure in place with loading/error states
├─ Priority: P0 (blocker)
└─ Effort: 1 day

TASK-006: Implement TopLatestCarousel (Trending Movies)
├─ Depends on: TASK-002, TASK-004, TASK-005
├─ Input: Trending movies from TMDB API
├─ Output: TopLatestCarousel renders with getTrendingMovies()
├─ Acceptance: Carousel loads trending movies, horizontal scroll works, responsive
├─ Priority: P1
├─ Steps:
│   ├─ Call tmdbApi.getTrendingMovies()
│   ├─ Pass to MovieCarousel component
│   ├─ Add loading skeleton
│   └─ Add error state with retry
└─ Effort: 0.5 days

TASK-007: Implement Top10TodayCarousel (Top Rated)
├─ Depends on: TASK-002, TASK-004, TASK-005
├─ Input: Top-rated movies from TMDB API
├─ Output: Top10TodayCarousel renders with getTopRatedMovies()
├─ Acceptance: Carousel loads top-rated, horizontal scroll works, responsive
├─ Priority: P1
├─ Steps:
│   ├─ Call tmdbApi.getTopRatedMovies()
│   ├─ Sort by rating (descending, limit 10 for \"Top 10\")
│   └─ Add to MovieCarousel
└─ Effort: 0.5 days

TASK-008: Implement CategoryFilterSection
├─ Depends on: TASK-003, TASK-004, TASK-005
├─ Input: Genre list, selected genre ID
├─ Output: Dropdown + CarouselCarousel for category browsing
├─ Acceptance: Dropdown shows genres, selecting genre updates carousel, responsive
├─ Priority: P1
├─ Steps:
│   ├─ Implement CategoryDropdown with genres
│   ├─ useState for selectedGenreId
│   ├─ Call getMoviesByGenre(selectedGenreId) on selection
│   ├─ Pass movies to MovieCarousel
│   └─ Add loading/error states
└─ Effort: 1 day

TASK-009: Implement NewOnCineScopeCarousel (Latest Releases)
├─ Depends on: TASK-002, TASK-004, TASK-005
├─ Input: Latest movie releases from TMDB
├─ Output: NewOnCineScopeCarousel with newest releases
├─ Acceptance: Carousel loads new releases (by release date desc), responsive
├─ Priority: P2
├─ Steps:
│   ├─ Call tmdbApi.getNewReleases() (discover sort by release_date.desc)
│   └─ Pass to MovieCarousel
└─ Effort: 0.5 days

TASK-010: Implement CriticallyAcclaimedCarousel (Highly Rated)
├─ Depends on: TASK-002, TASK-004, TASK-005
├─ Input: Highly-rated movies from TMDB
├─ Output: CriticallyAcclaimedCarousel with top-rated movies
├─ Acceptance: Carousel loads critically acclaimed (by vote average desc), responsive
├─ Priority: P2
├─ Steps:
│   ├─ Call tmdbApi.getCriticallyAcclaimed() (discover sort by vote_average.desc)
│   └─ Pass to MovieCarousel
└─ Effort: 0.5 days
```

### Responsive Design & Polish Tasks (Phase 3) - Depends on Phase 2

```
TASK-011: Responsive Testing & Breakpoint Adjustments
├─ Depends on: TASK-005, TASK-006, TASK-007, TASK-008, TASK-009, TASK-010
├─ Input: HomePage with all carousels
├─ Output: Tested & optimized responsive layout
├─ Acceptance: All breakpoints working (mobile: 1.5-2 cards, tablet: 3, desktop: 4-5)
├─ Priority: P0 (blocker)
└─ Effort: 1 day

TASK-012: Implement Skeleton Loaders
├─ Depends on: TASK-002, TASK-005
├─ Input: Loading states for each carousel
├─ Output: Skeleton screen components for better UX
├─ Acceptance: Skeletons appear while data loads, disappear on success/error
├─ Priority: P2
└─ Effort: 0.5 days

TASK-013: Add Error States & Retry Logic
├─ Depends on: TASK-005, TASK-006, TASK-007, TASK-008, TASK-009, TASK-010
├─ Input: API error handling in HomePage
├─ Output: Error messages with retry buttons per carousel
├─ Acceptance: Errors display correctly, retry fetches new data
├─ Priority: P1
└─ Effort: 0.5 days

TASK-014: Add Smooth Scroll Animations
├─ Depends on: TASK-002
├─ Input: MovieCarousel component
├─ Output: CSS transitions for smooth horizontal scroll
├─ Acceptance: Scroll is smooth, no jank, animations 60 FPS
├─ Priority: P2
└─ Effort: 0.5 days

TASK-015: Touch/Swipe Gesture Support
├─ Depends on: TASK-002
├─ Input: Mobile carousel interaction
├─ Output: Swipe gestures to scroll carousels
├─ Acceptance: Touch scroll works on mobile, desktop mouse scroll works
├─ Priority: P2
└─ Effort: 1 day
```

### Integration & Testing Tasks (Phase 4) - Depends on Phase 3

```
TASK-016: Wire Navigation Links
├─ Depends on: TASK-005
├─ Input: HomePage with navigation buttons
├─ Output: Links to /trending, /top-rated, /search pages
├─ Acceptance: Navigation links present and functional
├─ Priority: P1
└─ Effort: 0.5 days

TASK-017: Test Movie Card Navigation
├─ Depends on: TASK-001, TASK-005
├─ Input: HomePage with clickable movie cards
├─ Output: Verified navigation to /movie/:id pages
├─ Acceptance: Movie clicks navigate correctly, detail page loads
├─ Priority: P0 (blocker)
└─ Effort: 0.5 days

TASK-018: Category Filter End-to-End Testing
├─ Depends on: TASK-008
├─ Input: CategoryFilterSection with genre selection
├─ Output: Verified smooth transitions, no page refresh, carousel updates
├─ Acceptance: Genre selection works, carousel updates without refresh
├─ Priority: P0 (blocker)
└─ Effort: 0.5 days

TASK-019: Performance Optimization
├─ Depends on: TASK-011
├─ Input: HomePage with all carousels
├─ Output: Optimized for Lighthouse score >85 mobile
├─ Acceptance: Initial load < 2s, API responses cached, bundle <200KB gzipped
├─ Priority: P0 (blocker)
├─ Steps:
│   ├─ Analyze Lighthouse score
│   ├─ Optimize images (lazy loading, WebP)
│   ├─ Minify CSS/JS
│   └─ Cache API responses
└─ Effort: 1 day

TASK-020: Accessibility Testing
├─ Depends on: TASK-011
├─ Input: HomePage with all interactive elements
├─ Output: WCAG 2.1 AA compliance verified
├─ Acceptance: Keyboard navigation works, ARIA labels present, screen reader compatible
├─ Priority: P1
├─ Steps:
│   ├─ Test keyboard Tab navigation
│   ├─ Add ARIA labels to carousels
│   ├─ Verify focus indicators
│   └─ Test with screen reader
└─ Effort: 1 day

TASK-021: Cross-Browser Testing
├─ Depends on: TASK-019
├─ Input: HomePage on all supported browsers
├─ Output: Compatibility verified
├─ Acceptance: Works on Chrome, Firefox, Safari, Edge (latest 2 versions)
├─ Priority: P1
└─ Effort: 1 day

TASK-022: Deploy to Production
├─ Depends on: TASK-021
├─ Input: Tested HomePage code
├─ Output: Merged to main, deployed via GitHub Actions
├─ Acceptance: Live on https://nishant-nagose.github.io/cinescope-vod-sdd/
├─ Priority: P0 (blocker)
└─ Effort: 0.5 days
```

## Summary Statistics

| Phase | Task Count | Total Effort | Blocker Tasks |
|-------|----------|--------------|--------------|
| 1: Foundation | 4 | 3.5 days | 3 (001, 002, 004) |
| 2: Implementation | 6 | 4 days | 1 (005) |
| 3: Polish | 5 | 4 days | 1 (011) |
| 4: Testing & Deploy | 7 | 5 days | 6 (017, 018, 019, 022) |
| **TOTAL** | **22** | **~16 days** | **11** |

## Dependency Quick Reference

```
Blocker Path: TASK-001 → TASK-002 → TASK-004 → TASK-005 → TASK-006/007/008/009/010 → TASK-011 → TASK-019 → TASK-021 → TASK-022

Parallel Opportunities:
- TASK-001, TASK-002, TASK-003, TASK-004 (no dependencies - do together)
- TASK-006, TASK-007, TASK-008, TASK-009, TASK-010 (depends on phase 1, can parallelize)
- TASK-012, TASK-013, TASK-014, TASK-015 (polish, can parallelize)
```

## Acceptance Criteria Verification

All tasks must verify:
- [ ] Code compiles with TypeScript strict mode
- [ ] No console errors in browser
- [ ] Responsive design tested on mobile, tablet, desktop
- [ ] Click/interaction works as specified
- [ ] Performance targets met (Lighthouse >85, load <2s)
- [ ] Component reusable for future features
- [ ] ARIA labels and accessibility met
