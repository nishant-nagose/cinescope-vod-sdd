# Feature Plan: Trending Movies Browser

**Feature Branch**: `001-trending-movies-browser`
**Related Spec**: [spec.md](./spec.md)
**Created**: 2026-04-21
**Status**: APPROVED

## Overview
This plan details the design and implementation approach for the Trending Movies Browser feature. The feature provides users with a homepage displaying trending movies with responsive layouts, loading/error states, and navigation to movie details.

## Design Approach

### Architecture
- **Page Component**: `TrendingPage.tsx` - Container component managing data fetching
- **Custom Hook**: `useTrendingMovies.ts` - Encapsulates API calls and state management
- **Reusable Components**: `MovieGrid`, `MovieCard`, `ErrorState`, `LoadingSkeleton`
- **API Integration**: Uses TMDB `/movie/trending` endpoint

### Data Flow
```
TrendingPage
  ├─ useTrendingMovies hook
  │  ├─ Call TMDB API
  │  ├─ Manage loading state
  │  ├─ Handle errors
  │  └─ Provide retry function
  └─ Render MovieGrid
     └─ Map over movies
        └─ Render MovieCard components
```

## Responsive Design Implementation

### Breakpoint Strategy
- **Mobile (default)**: 2-column grid, compact spacing (gap-3), small text (text-xs)
- **sm (640px+)**: 3 columns, medium spacing (gap-4), text-sm
- **md (768px+)**: 4 columns, larger spacing (gap-5)
- **lg (1024px+)**: 5 columns, full spacing (gap-6), text-base

### Components Responsiveness
- **MovieCard**: 
  - Padding: p-2 (mobile) → p-3 (sm+)
  - Title text: text-xs → text-sm
  - Rating badge: top-1 right-1 (mobile) → top-2 right-2 (sm+)
  
- **Page Header**:
  - Heading: text-xl (mobile) → text-4xl (lg)
  - Padding: px-3 sm:px-4 md:px-6 lg:px-8
  - Margins: py-4 sm:py-6 md:py-8

### States Implementation
1. **Loading**: Skeleton grid with animated placeholders
2. **Error**: Centered error message with retry button
3. **Empty**: "No movies found" message
4. **Success**: Full movie grid with navigation enabled

## Implementation Strategy

### Phase 1: Core Components
1. Create `MovieCard` component with responsive styling
2. Create `MovieGrid` wrapper for grid layout
3. Create responsive loading skeleton

### Phase 2: Data Layer
1. Create `useTrendingMovies` hook with API integration
2. Implement error handling and retry logic
3. Add loading state management

### Phase 3: Page Assembly
1. Create `TrendingPage` container
2. Integrate hook and components
3. Add responsive page layout and header

### Phase 4: Polish & Testing
1. Verify responsive behavior at all breakpoints
2. Test error states and retry
3. Add accessibility attributes
4. Write unit and integration tests

## Mobile Responsive Considerations

### Touch-Friendly
- Minimum tap target size: 44px (movie cards meet this requirement)
- Adequate spacing between cards for touch accuracy
- Easy-to-tap retry and navigation buttons

### Performance
- Lazy loading images with `loading="lazy"` attribute
- Skeleton loading prevents layout shift
- Optimized gap spacing reduces DOM size

### Navigation
- Clear visual hierarchy respects mobile screen real estate
- Movie cards scale appropriately without text overflow
- Rating badge visibility maintained on small screens

## GitHub Pages Deployment Notes

### Configuration
- Vite base path: `/cinescope-vod-sdd/`
- All assets served from subdirectory
- Image paths handled by Vite asset pipeline
- Responsive images scale with CSS classes

### Bundle Size Optimization
- Feature uses only necessary npm deps (React, React Router)
- Tailwind CSS utilities purged in production
- Lazy-loaded images via native browser support
- Targeting <200KB gzipped for this feature

## Success Metrics
- ✓ Trending page loads in <2s on 4G mobile
- ✓ Movies display in correct responsive grid at all breakpoints
- ✓ Loading state visible within 100ms
- ✓ Error retry succeeds after API recovery
- ✓ All acceptance criteria from spec.md met
- ✓ Lighthouse mobile score >85

## Dependencies
- React 18+ (existing)
- React Router v6 (existing)
- Tailwind CSS (existing)
- Custom hooks for state management

## Notes
- Responsive classes use Tailwind breakpoints (sm:, md:, lg:)
- No external component libraries needed (custom components)
- Cached images via TMDB CDN
- No database required (API-driven)
