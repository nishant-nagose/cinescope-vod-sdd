# Requirements Checklist: Modern VOD Home Page

**Feature**: 008-modern-vod-home  
**Created**: 2026-04-22  
**Status**: READY FOR PLANNING

## Functional Requirements

### Carousel Sections
- [ ] **Top & Latest Movies**: Horizontal scroll, 2 rows, 20 movies from trending endpoint
- [ ] **Top 10 Movies Today**: Horizontal scroll, 2 rows, 10 highest-rated + 10 trending = 20 total
- [ ] **Movies by Category**: Dropdown genre selector, horizontal scroll, 2 rows, 20 movies
  - [ ] Genres include: Romantic, Thriller, Action, Comedy, Drama, Horror, Sci-Fi
  - [ ] Default genre selected on load
  - [ ] Carousel updates when genre changes without page refresh
- [ ] **New on CineScope**: Horizontal scroll, 2 rows, 20 newest releases (sorted by release date desc)
- [ ] **Critically Acclaimed**: Horizontal scroll, 2 rows, 20 highest-rated movies (sorted by vote average desc)

### Movie Card Display
- [ ] Movie card shows: Poster image, title, rating badge
- [ ] Card dimensions responsive: mobile calc(50%-gap), tablet calc(33%-gap), desktop calc(25%-gap)
- [ ] Card clickable with `cursor-pointer` and hover effects
- [ ] Click navigates to `/movie/:id` detail page

### Carousel Interaction
- [ ] Horizontal scroll smooth and responsive (mouse + touch)
- [ ] Visible scroll indicators or arrows for desktop navigation
- [ ] Touch/swipe gestures work on mobile
- [ ] Scroll direction: left-right, no page scroll through carousel
- [ ] Initial load per carousel: 20 movies (all visible after scroll)

### Category Filter
- [ ] Dropdown menu displays all available TMDB genres
- [ ] Genre selection updates carousel without page reload
- [ ] Selected genre highlighted in dropdown
- [ ] Default genre (e.g., Action) selected on first load

### Layout & Spacing
- [ ] Two-row layout with consistent card sizing
- [ ] Gap between cards: 12px (mobile) → 16px (tablet+)
- [ ] Gap between rows: 12px (mobile) → 16px (tablet+)
- [ ] Carousel padding: px-3 (mobile) → px-4 (sm) → px-6 (md) → px-8 (lg)
- [ ] Section spacing: mb-6 sm:mb-8 md:mb-10 lg:mb-12

### Loading, Error & Empty States
- [ ] Skeleton loaders display for each carousel while loading (2 rows, 10 cards each)
- [ ] Loading state cleared on success
- [ ] Error state shows: Error message + Retry button per carousel
- [ ] Empty state shows: "No movies available for this category / section"
- [ ] Empty states don't break layout

### Navigation Links
- [ ] Link to dedicated `/trending` page visible in header/nav
- [ ] Link to dedicated `/top-rated` page visible in header/nav
- [ ] Link to `/search` search functionality visible
- [ ] Navigation links are clickable and functional

### Route & Accessibility
- [ ] Home page accessible at `/` route (root)
- [ ] All movie cards accessible via keyboard (Tab, Enter)
- [ ] ARIA labels on carousels: `role=\"region\" aria-label=\"Movie carousel\"`
- [ ] Buttons have accessible labels and tab order

## Non-Functional Requirements

### Responsive Design
- [ ] Mobile (<640px): 1.5-2 cards visible per row, full-width carousel
- [ ] Tablet (768px+): 3 cards visible, adjusted gap
- [ ] Desktop (1024px+): 4-5 cards visible, larger gap
- [ ] All breakpoints tested: 375px, 640px, 768px, 1024px, 1280px, 1920px
- [ ] No horizontal page scrollbar on any breakpoint
- [ ] Carousel scrollable without affecting page layout

### Performance
- [ ] Initial page load < 2 seconds
- [ ] API responses cached (5-minute TTL)
- [ ] Lighthouse mobile score ≥ 85
- [ ] Lighthouse desktop score ≥ 90
- [ ] Images lazy-loaded where possible
- [ ] Bundle size remains < 200KB gzipped (after new components)

### Accessibility
- [ ] WCAG 2.1 AA compliance verified
- [ ] Keyboard navigation: Tab through carousels and buttons
- [ ] Focus indicators visible on all interactive elements
- [ ] Screen reader compatibility tested
- [ ] Color contrast ratios meet standards (4.5:1 for text)
- [ ] No color information alone to convey meaning

### Code Quality
- [ ] TypeScript strict mode enabled
- [ ] No `any` types in components
- [ ] All movie/carousel data typed with interfaces
- [ ] Components have proper prop typing
- [ ] ESLint rules enforced (no linting errors)

### Browser Support
- [ ] Chrome (latest 2 versions)
- [ ] Firefox (latest 2 versions)
- [ ] Safari (latest 2 versions)
- [ ] Edge (latest 2 versions)
- [ ] Mobile browsers (iOS Safari, Chrome Android)

## Data & API Contracts

### TMDB API Endpoints Required
- [ ] `GET /trending/movie/week` - Trending movies for Top & Latest
- [ ] `GET /movie/top_rated` - Top-rated movies for Top 10 Today
- [ ] `GET /genre/movie/list` - Genre list for dropdown
- [ ] `GET /discover/movie?with_genres={id}` - Movies by genre
- [ ] `GET /discover/movie?sort_by=release_date.desc` - New releases
- [ ] `GET /discover/movie?sort_by=vote_average.desc` - Critically acclaimed

### Data Types
- [ ] Movie type: `{ id, title, poster_path, vote_average, release_date }`
- [ ] Genre type: `{ id, name }`
- [ ] Carousel data paginated: limit 20 movies per carousel

### Caching Strategy
- [ ] API responses cached for 5 minutes
- [ ] Genre list cached for session (static data)
- [ ] Cache invalidated on user action (genre selection)

## Testing Coverage

### Unit Tests
- [ ] MovieCard component renders correctly
- [ ] MovieCarousel handles responsive sizing
- [ ] CategoryDropdown dispatches genre selection
- [ ] Navigation links work

### Integration Tests
- [ ] HomePage loads all carousels successfully
- [ ] Movie click navigates to detail page
- [ ] Genre selection updates carousel
- [ ] Error states handled gracefully

### E2E Tests
- [ ] Full user flow: Open home → Browse category → Click movie → See details
- [ ] Responsive layout tested across breakpoints
- [ ] Carousel scroll works on mobile and desktop

### Performance Tests
- [ ] Lighthouse mobile score checked
- [ ] Initial load time measured (<2s target)
- [ ] Smooth scroll animations (60 FPS)

## Acceptance Criteria Summary

✓ All five carousel sections render with data  
✓ Horizontal scrolling smooth and responsive  
✓ Category filtering works without page refresh  
✓ Movie cards clickable and navigate correctly  
✓ Responsive design works across all devices  
✓ Loading/error/empty states display properly  
✓ Lighthouse score >85 mobile, >90 desktop  
✓ Accessibility compliance (WCAG 2.1 AA)  
✓ TypeScript strict mode, no linting errors  
✓ Navigation links to dedicated pages functional  

---

**Checklist Status**: Ready for implementation planning ✓
