# Requirements Checklist: Modern VOD Home Page

**Feature**: 008-modern-vod-home  
**Created**: 2026-04-22  
**Status**: IMPLEMENTED ✓

## Functional Requirements

### Carousel Sections
- [x] **Top & Latest Movies**: Horizontal scroll, 2 rows, 20 movies from trending endpoint
- [x] **Top 10 Movies Today**: Horizontal scroll, 2 rows, 10 highest-rated + 10 trending = 20 total
- [x] **Movies by Category**: Dropdown genre selector, horizontal scroll, 2 rows, 20 movies
  - [x] Genres include: Romantic, Thriller, Action, Comedy, Drama, Horror, Sci-Fi (all TMDB genres via `/genre/movie/list`)
  - [x] Default genre selected on load (Action, id: 28)
  - [x] Carousel updates when genre changes without page refresh (React state + `useMoviesByGenre(genreId)`)
- [x] **New on CineScope**: Horizontal scroll, 2 rows, 20 newest releases (sorted by release date desc)
- [x] **Critically Acclaimed**: Horizontal scroll, 2 rows, 20 highest-rated movies (sorted by vote average desc)

### Movie Card Display
- [x] Movie card shows: Poster image, title, rating badge
- [x] Card dimensions responsive: `w-[150px] sm:w-[165px] md:w-[190px] lg:w-[210px] xl:w-[225px]`
- [x] Card clickable with hover effects (`hover:shadow-xl transition-shadow`)
- [x] Click navigates to `/movie/:id` detail page

### Carousel Interaction
- [x] Horizontal scroll smooth and responsive (native `overflow-x-auto` with `scroll-smooth`)
- [x] Visible scroll indicators or arrows for desktop navigation (left/right arrow buttons, `hidden md:flex`)
- [x] Touch/swipe gestures work on mobile (native browser touch scroll)
- [x] Scroll direction: left-right, no page scroll through carousel (`overflow-x-auto` on container)
- [x] Initial load per carousel: 20 movies (all visible after scroll)

### Category Filter
- [x] Dropdown menu displays all available TMDB genres (via `getGenres()` → `CategoryDropdown`)
- [x] Genre selection updates carousel without page reload (React state `selectedGenreId`)
- [x] Selected genre highlighted in dropdown (native `<select>` value binding)
- [x] Default genre (Action) selected on first load (`ACTION_GENRE_ID = 28`)

### Layout & Spacing
- [x] Two-row layout with consistent card sizing (`flex flex-col gap-3 sm:gap-4`)
- [x] Gap between cards: 12px mobile → 16px tablet+ (`gap-3 sm:gap-4`)
- [x] Gap between rows: 12px mobile → 16px tablet+ (`gap-3 sm:gap-4`)
- [x] Carousel padding: `px-3 sm:px-4 md:px-6 lg:px-8`
- [x] Section spacing: `mb-8 sm:mb-10 md:mb-12`

### Loading, Error & Empty States
- [x] Skeleton loaders display for each carousel while loading (2 rows, 6 cards each, animated pulse)
- [x] Loading state cleared on success
- [x] Error state shows: Error message + Retry button per carousel
- [x] Empty state shows: "No movies available for this section."
- [x] Empty states don't break layout

### Navigation Links
- [x] Link to dedicated `/trending` page visible in header/nav (updated Layout.tsx nav)
- [x] Link to dedicated `/top-rated` page visible in header/nav
- [x] Link to `/search` search functionality visible
- [x] Navigation links are clickable and functional

### Route & Accessibility
- [x] Home page accessible at `/` route (root) — `routes.tsx` updated
- [x] All movie cards accessible via keyboard (Tab, Enter via `<Link>` element)
- [x] ARIA labels on carousels: `<section aria-label={title}>`
- [x] Buttons have accessible labels (`aria-label="Scroll left/right"`, `aria-label="Select movie genre"`)

## Non-Functional Requirements

### Responsive Design
- [x] Mobile (<640px): ~2 cards visible per row (`w-[150px]` → 375/150 ≈ 2.3 visible)
- [x] Tablet (768px+): ~3-4 cards visible (`w-[190px]` → 768/190 ≈ 4 visible)
- [x] Desktop (1024px+): 4-5 cards visible (`w-[210px]` → 1024/210 ≈ 4.9 visible)
- [ ] All breakpoints tested: 375px, 640px, 768px, 1024px, 1280px, 1920px — *manual verification needed*
- [x] No horizontal page scrollbar (`overflow-x-auto` contained within carousel, `max-w-7xl mx-auto` on layout)
- [x] Carousel scrollable without affecting page layout

### Performance
- [ ] Initial page load < 2 seconds — *Lighthouse verification needed*
- [x] API responses cached (5-minute TTL via `useApi` + `TTLCache`)
- [ ] Lighthouse mobile score ≥ 85 — *manual Lighthouse run needed*
- [ ] Lighthouse desktop score ≥ 90 — *manual Lighthouse run needed*
- [x] Images lazy-loaded (`loading="lazy"` on all movie poster `<img>` elements)
- [x] Bundle size remains < 200KB gzipped (no new external dependencies added)

### Accessibility
- [ ] WCAG 2.1 AA compliance verified — *manual axe/screen reader audit needed*
- [x] Keyboard navigation: Tab through carousels and buttons (`<Link>`, `<button>`, `<select>` are all focusable)
- [x] Focus indicators visible (Tailwind `focus:ring-2` on dropdown, browser default on links/buttons)
- [ ] Screen reader compatibility tested — *manual testing needed*
- [x] Color contrast ratios meet standards (white on `gray-800`/`gray-900` backgrounds — WCAG AA)
- [x] No color information alone to convey meaning

### Code Quality
- [x] TypeScript strict mode enabled (`tsc --noEmit` passes with 0 errors)
- [x] No `any` types in components
- [x] All movie/carousel data typed with interfaces (`Movie`, `Genre`, `GenresResponse`, `DiscoverResponse`)
- [x] Components have proper prop typing (`MovieCarouselProps`, `CategoryDropdownProps`)
- [x] ESLint rules enforced (no linting errors)

### Browser Support
- [ ] Chrome (latest 2 versions) — *manual cross-browser testing*
- [ ] Firefox (latest 2 versions) — *manual cross-browser testing*
- [ ] Safari (latest 2 versions) — *manual cross-browser testing*
- [ ] Edge (latest 2 versions) — *manual cross-browser testing*
- [ ] Mobile browsers (iOS Safari, Chrome Android) — *manual testing*

## Data & API Contracts

### TMDB API Endpoints Required
- [x] `GET /trending/movie/week` — `getTrendingMovies()` (existing)
- [x] `GET /movie/top_rated` — `getTopRatedMovies()` (existing)
- [x] `GET /genre/movie/list` — `getGenres()` (new)
- [x] `GET /discover/movie?with_genres={id}` — `getMoviesByGenre(genreId)` (new)
- [x] `GET /discover/movie?sort_by=release_date.desc` — `getNewReleases()` (new)
- [x] `GET /discover/movie?sort_by=vote_average.desc` — `getCriticallyAcclaimed()` (new)

### Data Types
- [x] Movie type: `{ id, title, poster_path, vote_average, release_date, ... }` (in `src/types/tmdb.ts`)
- [x] Genre type: `{ id, name }` (in `src/types/tmdb.ts`)
- [x] Carousel data paginated: `DiscoverResponse.results` — 20 movies per carousel

### Caching Strategy
- [x] API responses cached for 5 minutes (`useApi` with `cacheKey` + `TTLCache`)
- [x] Genre list cached for session (`cacheKey: 'genres'` — persistent across route changes)
- [x] Cache per genre: `cacheKey: 'movies-genre-{genreId}'` — switching genres uses cache

## Testing Coverage

### Unit Tests
- [x] MovieCarousel component renders correctly (`tests/components/MovieCarousel.test.tsx` — 10 tests)
- [x] MovieCarousel handles responsive sizing (width classes tested via render)
- [x] CategoryDropdown dispatches genre selection (tested in `HomePage.test.tsx`)
- [x] Navigation links work (tested in `HomePage.test.tsx`)

### Integration Tests
- [x] HomePage loads all carousels successfully (5 carousel headings verified)
- [x] Movie click navigates to detail page (link href tested)
- [x] Genre selection updates carousel (fireEvent.change on select → mock called with new id)
- [x] Error states handled gracefully (error message + retry button tested)

### E2E Tests
- [ ] Full user flow: Open home → Browse category → Click movie → See details — *Playwright test needed*
- [ ] Responsive layout tested across breakpoints — *manual/Playwright*
- [ ] Carousel scroll works on mobile and desktop — *manual testing*

### Performance Tests
- [ ] Lighthouse mobile score checked — *manual run*
- [ ] Initial load time measured (<2s target) — *manual measurement*
- [ ] Smooth scroll animations (60 FPS) — *manual observation*

## Acceptance Criteria Summary

✓ All five carousel sections render with data  
✓ Horizontal scrolling smooth and responsive  
✓ Category filtering works without page refresh  
✓ Movie cards clickable and navigate correctly  
✓ Loading/error/empty states display properly  
✓ Responsive design implemented across breakpoints (code complete; visual verification pending)  
✓ TypeScript strict mode, no linting errors  
✓ Navigation links to dedicated pages functional  
○ Lighthouse score >85 mobile, >90 desktop — pending live deployment check  
○ Accessibility compliance (WCAG 2.1 AA) — pending manual audit  

---

**Implementation Date**: 2026-04-22  
**Branch**: `017-modern-vod-home`  
**Tests**: 75/75 passing (9 test files, 3.07s)  
**TypeScript**: Clean (0 errors)
