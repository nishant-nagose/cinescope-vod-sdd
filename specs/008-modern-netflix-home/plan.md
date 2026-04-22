# Implementation Plan: Modern Netflix-Like Home Page

**Feature**: 008-modern-netflix-home  
**Version**: 1.0  
**Created**: 2026-04-22  
**Status**: READY FOR IMPLEMENTATION

## 1. Design Approach

### Architecture Principles (Constitution Compliance)
- ✓ **Specification-First**: Spec_completed, now designing implementation approach
- ✓ **Type Safety**: All components will use TypeScript interfaces for carousel data, genres, movie cards
- ✓ **Component-Driven**: Separate reusable components for carousel, movie card, category filter
- ✓ **API Contract First**: TMDB endpoints for trending, top-rated, genres, new releases, search
- ✓ **Mobile-First Responsive**: Horizontal scrolling adapted for mobile (1.5-2 visible cards) to desktop (4-5 visible)
- ✓ **Automated Deployment**: GitHub Actions CI/CD unchanged

### Technology Decisions
- **Carousel Implementation**: React-based horizontal scroll component (use `react-scroll-horizontal` or custom `overflow-x-auto` with Tailwind)
- **State Management**: React hooks `useState` for carousel data, `useEffect` for API calls
- **Styling**: Tailwind CSS with custom horizontal scroll utilities
- **Animation**: Smooth scroll behavior via CSS and React transitions
- **API Caching**: Existing tmdbApi service will handle caching (5-min TTL)

### Component Architecture
```
HomePage
├── TopLatestCarousel (trending movies, 2-row, 20 items)
│   └── MovieCarousel (reusable scrollable carousel)
│       └── MovieCard (individual card: image, title, rating)
├── Top10TodayCarousel (top-rated, 2-row, 20 items)
│   └── MovieCarousel
│       └── MovieCard
├── CategoryFilterSection (2-row carousel with genre selector)
│   ├── CategoryDropdown (genre selection)
│   └── CategoryCarousel
│       └── MovieCarousel
│           └── MovieCard
├── NewOnCineScopeCarousel (latest releases, 2-row, 20 items)
│   └── MovieCarousel
│       └── MovieCard
└── CriticallyAcclaimedCarousel (high-rated, 2-row, 20 items)
    └── MovieCarousel
        └── MovieCard
```

## 2. Implementation Strategy

### Phase 1: Foundation (Days 1-2)
- [x] Create spec (complete)
- [ ] Create reusable MovieCard component for carousel display
- [ ] Create MovieCarousel component (horizontal scrollable container with 2-row layout)
- [ ] Create CategoryDropdown component for genre selection
- [ ] Update TMDB service to include genre endpoints

### Phase 2: Build Home Page Sections (Days 2-3)
- [ ] Create HomePage component structure
- [ ] Implement TopLatestCarousel (use trending endpoint)
- [ ] Implement Top10TodayCarousel (use top-rated endpoint, sort by rating)
- [ ] Implement CategoryFilterSection with CategoryCarousel
- [ ] Implement NewOnCineScopeCarousel (use discover with sort_by=release_date.desc)
- [ ] Implement CriticallyAcclaimedCarousel (use discover with sort_by=vote_average.desc)

### Phase 3: Responsive Design & Polish (Day 4)
- [ ] Test horizontal scrolling on mobile (1.5-2 cards visible)
- [ ] Test carousel responsiveness (tablet: 3 cards, desktop: 4-5 cards)
- [ ] Add skeleton loaders for better UX during data fetching
- [ ] Add error states and retry logic for each carousel
- [ ] Add smooth scroll animations and transitions
- [ ] Ensure touch/swipe gestures work on mobile

### Phase 4: Integration & Testing (Day 5)
- [ ] Wire up navigation links (Trending, Top Rated, Search pages)
- [ ] Test routing to dedicated pages from home page
- [ ] Test movie card clicks navigate to `/movie/:id`
- [ ] Verify category filtering updates carousel smoothly
- [ ] Performance testing: Lighthouse score >85 mobile
- [ ] Accessibility testing: Keyboard navigation, ARIA labels
- [ ] End-to-end testing across browsers and devices

## 3. Data Flow & API Calls

### HomePage API Integration
```
HomePage Load
├── Fetch Trending Movies → TopLatestCarousel
├── Fetch Top Rated → Top10TodayCarousel
├── Fetch Genres (static cache) → CategoryDropdown
├── Fetch Movies by Default Genre (e.g., Action) → CategoryCarousel
├── Fetch New Releases (sort by release date desc) → NewOnCineScopeCarousel
└── Fetch Critically Acclaimed (sort by vote average desc) → CriticallyAcclaimedCarousel

User Selects Genre
├── Update selected genre state
└── Fetch Movies for Selected Genre → CategoryCarousel (updates)

User Clicks Movie Card
└── Navigate to /movie/:id
```

### TMDB Endpoints Required
- `GET /trending/movie/week` - Trending/Latest movies
- `GET /movie/top_rated` - Top-rated movies (sorted)
- `GET /genre/movie/list` - Available genres
- `GET /discover/movie?with_genres={id}` - Movies by genre
- `GET /discover/movie?sort_by=release_date.desc` - New releases
- `GET /discover/movie?sort_by=vote_average.desc` - Critically acclaimed

## 4. Responsive Design Considerations

### Carousel Card Sizing by Breakpoint
| Breakpoint | Cards Visible | Card Width | Gap |
|-----------|---------------|-----------|-----|
| Mobile (<640px) | 1.5-2 | calc(50% - gap) | 12px |
| sm (640px+) | 2-2.5 | calc(50% - gap) | 12px |
| md (768px+) | 3 | calc(33% - gap) | 16px |
| lg (1024px+) | 4-5 | calc(25% - gap) | 16px |
| xl (1280px+) | 5-6 | calc(20% - gap) | 20px |

### Two-Row Layout
- Row 1: 10 cards horizontally scrollable
- Row 2: 10 cards horizontally scrollable
- Total per carousel: 20 cards (2 rows × 10 cards)
- Gap between cards: Responsive (12px mobile, 16px tablet+)
- Gap between rows: 12px (mobile) → 16px (tablet+)

## 5. State Management Plan

### HomePage Local State
```typescript
interface CarouselState {
  trending: Movie[];
  topRated: Movie[];
  categoryGenres: Genre[];
  selectedGenreId: number | null;
  moviesByCategory: Movie[];
  newReleases: Movie[];
  criticallyAcclaimed: Movie[];
  loading: {
    trending: boolean;
    topRated: boolean;
    byCategory: boolean;
    newReleases: boolean;
    criticallyAcclaimed: boolean;
  };
  errors: {
    [key: string]: string | null;
  };
}
```

## 6. Testing Strategy

### Functional Testing
- [ ] All carousels load data successfully
- [ ] Horizontal scroll works with mouse and touch
- [ ] Category filter updates carousel
- [ ] Movie cards are clickable and navigate correctly
- [ ] Error states display when API fails
- [ ] Skeleton loaders appear during loading

### Responsive Testing
- [ ] Desktop (1920px): 5-6 cards visible per carousel
- [ ] Laptop (1366px): 4-5 cards visible
- [ ] iPad (1024px): 3-4 cards visible
- [ ] Tablet (768px): 2-3 cards visible
- [ ] Mobile (375px): 1.5-2 cards visible

### Performance Testing
- [ ] Initial page load < 2 seconds
- [ ] API responses cached (5-min TTL)
- [ ] Lighthouse mobile score > 85
- [ ] Smooth scroll animations (60 FPS)
- [ ] Bundle size remains < 200KB gzipped

### Accessibility Testing
- [ ] Keyboard navigation (Tab through carousels, Enter to select)
- [ ] Screen reader support (ARIA labels for carousels, buttons)
- [ ] Focus indicators visible on all interactive elements
- [ ] Color contrast meets WCAG 2.1 AA standards

## 7. Complexity Tracking

### Moderate Complexity Areas
- **Horizontal Carousel Responsiveness**: Calculating visible cards dynamically per breakpoint
- **Touch Gesture Support**: Implementing smooth swipe gestures on mobile
- **State Management**: Coordinating loading states for 5+ simultaneous API calls
- **Category Filtering**: Smooth transition when switching genres without page reload

### Mitigation Strategies
- Use Tailwind CSS `overflow-x-auto` with utility classes for responsive scrolling
- Leverage React scrolling libraries if custom implementation is too complex
- Use React `useEffect` cleanup to prevent race conditions during genre switches
- Apply CSS transitions for smooth carousel updates

## 8. Configuration & Feature Flags

- **Initial Movie Load Per Carousel**: 20 movies (2 rows, 10 per row)
- **Category Filter Default**: Action (most popular genre)
- **Carousel Animation Duration**: 300ms smooth scroll
- **API Cache TTL**: 5 minutes (inherited from tmdbApi service)
- **Skeleton Loader Duration**: Until API response received

## 9. Deployment & Release Plan

- **Branch**: Merge to `main` after all tests pass
- **Deployment**: Automatic via GitHub Actions to GitHub Pages
- **Environment Variables**: VITE_TMDB_API_KEY (already configured)
- **Rollback Plan**: If issues arise, revert to previous main commit
- **Monitoring**: Check GitHub Pages deployment logs and application errors

## 10. Success Metrics

- ✓ All five carousel sections load successfully
- ✓ Horizontal scrolling smooth on all devices
- ✓ Category filtering works without page refresh
- ✓ Movie clicks navigate to detail page correctly
- ✓ Lighthouse mobile score > 85
- ✓ Initial load time < 2 seconds
- ✓ No accessibility violations (WCAG 2.1 AA)
- ✓ Responsive across mobile, tablet, desktop
