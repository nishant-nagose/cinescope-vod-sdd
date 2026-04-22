# Implementation Plan: Movie Detail Page

**Branch**: `004-movie-detail-page` | **Date**: 2026-04-21 | **Spec**: [./spec.md](./spec.md) | **Status**: PLANNED
**Input**: Feature specification from `/specs/004-movie-detail-page/spec.md`

## Summary

Implementation of detailed movie information page accessible from movie cards, showing synopsis, cast, ratings, and other metadata with responsive layout.

## Technical Context

**Language/Version**: TypeScript 5.0 / React 18.2
**Primary Dependencies**: React Router 6.8, Tailwind CSS 3.3, Vite 4.3
**Storage**: N/A - detail pages not cached; fetched on demand
**Testing**: Vitest + React Testing Library
**Target Platform**: Web browsers (Chrome, Firefox, Safari latest 2), GitHub Pages
**Project Type**: Web application (React SPA)
**Performance Goals**: LCP <2.5s, Lighthouse mobile >85, bundle <200KB gzipped
**Constraints**: No backend, no auth, public API only, static hosting
**Scale/Scope**: Single-user public app, 7 features, TMDB free tier

## Constitution Check

- ✅ Specification-First: spec.md exists and is approved
- ✅ Type Safety: TypeScript strict mode enforced
- ✅ Component-Driven: Reusable components from src/components/
- ✅ API Contract First: TMDB endpoints defined in spec before implementation
- ✅ Mobile-First Responsive: Tailwind breakpoints applied throughout
- ✅ Automated Deployment: GitHub Actions handles CI/CD to GitHub Pages

## Project Structure

### Documentation (this feature)

```text
specs/004-movie-detail-page/
├── spec.md              # Feature requirements and acceptance criteria
├── plan.md              # This file - implementation approach
├── task.md              # Actionable task breakdown
└── checklists/
    └── requirements.md  # Spec quality gate
```

### Source Code

```text
src/
├── components/          # Reusable UI components
├── pages/               # Route-level page components
├── hooks/               # Custom React hooks
├── services/            # API and utility services
├── types/               # TypeScript interfaces
└── styles/              # Global CSS

tests/                   # Vitest test files
```

## Design Approach

### Architecture
- **Page Component**: `MovieDetailPage.tsx` - Full detail layout
- **Custom Hook**: `useMovieDetails.ts` - Fetches details, cast, and similar movies in parallel
- **Cast Component**: `CastSection.tsx` - Actor grid with responsive layout
- **API Integration**: `tmdbApi.getMovieDetails()`, `tmdbApi.getMovieCredits()`, `tmdbApi.getSimilarMovies()`

### Data Flow

```
React Router useParams (/:id)
  ↓
useMovieDetails hook
  ├─ tmdbApi.getMovieDetails(id)    → movie metadata
  ├─ tmdbApi.getMovieCredits(id)    → cast array
  └─ tmdbApi.getSimilarMovies(id)   → related movies
      ↓
MovieDetailPage
  ├─ Hero (backdrop image + poster + title + metadata)
  ├─ Overview section (synopsis)
  ├─ CastSection (actor grid)
  └─ Similar Movies (MovieGrid, 3-5 items)
```

### Responsive Layout
- **Mobile**: Single column — poster top, metadata below, stacked sections
- **Tablet (md+)**: Two-column hero — poster left, metadata right
- **Desktop (lg+)**: Full-width backdrop, expanded grid, 5-col similar movies

### Responsive Design
- Mobile: Single column layout, stacked sections
- Tablet: Two-column layout where appropriate
- Desktop: Full detail display with optimal spacing

## Implementation Strategy

### Phase 1: useMovieDetails Hook
1. Create `src/hooks/useMovieDetails.ts`
2. Accept `id: string` from URL params
3. Call all three TMDB endpoints in parallel (Promise.all)
4. Expose: `{ movie, cast, similar, loading, error }`

### Phase 2: MovieDetailPage Layout
1. Create `src/pages/MovieDetailPage.tsx`
2. Extract `:id` via `useParams()`
3. Hero section: backdrop image + poster + title, rating, genres, runtime
4. Overview section: synopsis text
5. Add route `/movie/:id` in `src/routes.tsx`

### Phase 3: CastSection Component
1. Create `src/components/CastSection.tsx`
2. Show top 10 cast members
3. Horizontal scroll on mobile, grid on desktop
4. Actor profile photo + name + character name
5. Fallback for missing profile images

### Phase 4: Similar Movies Section
1. Render `MovieGrid` with similar movies (3-5 items)
2. Hide section if no similar movies returned
3. Add back navigation button (browser history or Link to previous route)

### Phase 5: Polish & Testing
1. Skeleton loading states for all sections
2. 404-style error state for invalid movie ID
3. Handle all missing data fields gracefully
4. Responsive testing at all breakpoints
5. Write tests for hook, page component, CastSection

## Mobile Responsive Considerations
- Hero poster: responsive height (h-48 sm:h-64 md:h-80)
- Metadata text: text-sm sm:text-base md:text-lg
- Cast section: horizontal scroll on mobile, grid on desktop
- Similar movies: 2-col mobile → 4-col desktop (reuses MovieGrid)
- Touch-friendly back button (44px+ target)

## Success Metrics
- Detail page loads within 2s on 4G mobile
- All metadata fields visible and legible
- Cast section shows min 5 actors (when available)
- Similar movies shown (when available)
- All breakpoints tested and passing
- Invalid movie ID shows friendly error state

## Dependencies
- React 18+ (existing)
- React Router v6 useParams (existing)
- Tailwind CSS (existing)
- tmdbApi.getMovieDetails(), getMovieCredits(), getSimilarMovies() (all existing in tmdbApi.ts)
- MovieGrid, MovieCard components (reused)

## Notes
- All three TMDB calls fetched in parallel via Promise.all for performance
- Similar movies is supplementary — page works without it
- Cast section hidden when no cast data returned
- Back navigation uses browser history (window.history.back or useNavigate(-1))

## Complexity Tracking

> No constitution violations for this feature.
