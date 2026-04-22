# Implementation Plan: Search by Title

**Branch**: `003-search-by-title` | **Date**: 2026-04-21 | **Spec**: [./spec.md](./spec.md) | **Status**: PLANNED
**Input**: Feature specification from `/specs/003-search-by-title/spec.md`

## Summary

This plan covers implementation of the Search by Title feature, allowing users to find movies by entering search terms with immediate results, pagination support, and responsive design.

## Technical Context

**Language/Version**: TypeScript 5.0 / React 18.2
**Primary Dependencies**: React Router 6.8, Tailwind CSS 3.3, Vite 4.3
**Storage**: N/A - search results not cached; queries hit TMDB live
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
specs/003-search-by-title/
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
- **Page Component**: `SearchPage.tsx` - Search UI and results display
- **Custom Hook**: `useMovieSearch.ts` - TMDB search API integration with debouncing
- **SearchBar Component**: `SearchBar.tsx` - Controlled debounced input with URL sync
- **API Integration**: TMDB `/search/movie` endpoint via `tmdbApi.searchMovies()`

### Data Flow

```
SearchBar (user types)
  ↓ debounced 300ms, min 3 chars
useMovieSearch hook
  ├─ Reads/writes ?q= URL param via React Router
  ├─ Calls tmdbApi.searchMovies(query, page)
  └─ Manages loading, error, results, pagination state
      ↓
SearchPage
  ├─ MovieGrid (search results)
  └─ PaginationControls
```

### Search Strategy
- Real-time search with debouncing (300ms)
- Minimum 2 characters before search
- Results with pagination support
- Clear search term handling

### URL State Strategy
- Search query persisted as `?q=query` in URL (shareable links)
- Page number persisted as `?page=n` in URL
- React Router `useSearchParams` for reading/writing URL params

## Implementation Strategy

### Phase 1: SearchBar Component
1. Create `src/components/SearchBar.tsx` with controlled debounced input
2. Sync query to URL `?q=` param on submit
3. Clear button to reset search
4. Mobile-optimised sizing

### Phase 2: useMovieSearch Hook
1. Create `src/hooks/useMovieSearch.ts`
2. Read `?q=` and `?page=` from URL params
3. Call `tmdbApi.searchMovies()` when query ≥ 3 chars
4. Expose: `{ results, loading, error, totalPages, query, page, setPage }`

### Phase 3: SearchPage Assembly
1. Create `src/pages/SearchPage.tsx`
2. Integrate SearchBar, MovieGrid, PaginationControls
3. Handle empty state (no query), no-results state, error state
4. Add route `/search` in `src/routes.tsx`

### Phase 4: Sort & Filter (US2)
1. Add sort controls to SearchPage (relevance, rating, release date)
2. Client-side sort of results array

### Phase 5: Polish & Testing
1. Responsive testing at all breakpoints
2. Write tests for hook, SearchPage, SearchBar

## Mobile Responsive Considerations
- Full-width search bar on mobile
- Results grid matches Trending/TopRated (2→3→4→5 cols)
- Responsive input font size (text-sm sm:text-base)
- Touch-friendly clear/submit buttons (44px+ targets)

## Success Metrics
- Search results appear for queries ≥ 3 characters
- URL reflects search query at all times
- Results sort correctly by all three criteria
- No API call for queries < 3 characters
- Responsive grid at all breakpoints

## Dependencies
- React 18+ (existing)
- React Router v6 useSearchParams (existing)
- Tailwind CSS (existing)
- tmdbApi.searchMovies() (existing in src/services/tmdbApi.ts)
- MovieGrid, MovieCard, PaginationControls components (reused)

## Notes
- Search uses TMDB /search/movie endpoint (already implemented in tmdbApi.ts)
- Debounce prevents excessive API calls while typing
- URL persistence enables bookmarkable/shareable search links
- Sort is client-side on the current page of results

## Complexity Tracking

> No constitution violations for this feature.
