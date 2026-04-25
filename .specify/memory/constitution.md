<!--
Version change: 1.0.1 → 1.1.0
List of modified principles: III (component list updated), IV (TV endpoints added), VII (new — Modular Architecture)
Added sections: POC Completion Notice, updated architecture to reflect DynamicCarousel + carouselPool pattern, updated hook inventory, updated component list with Show components
Removed sections: none
Templates requiring updates: plan-template.md (✅ reviewed), spec-template.md (✅ reviewed), tasks-template.md (✅ reviewed)
Amendment rationale: POC fully implemented across 11 specs (001–011). Codebase modernized: 35 unused hooks removed, direct-fetch carousel architecture replaces hook-per-genre pattern.
-->
# CineScope - VOD Discovery Platform - Constitution

**Document Version:** 1.1.0
**Last Updated:** 2026-04-25
**Status:** APPROVED — POC COMPLETE

## 0. POC Completion Notice

> **CineScope POC is fully implemented as of 2026-04-25.**
> All 11 feature specs (001–011) are complete. The application is live at https://nishant-nagose.github.io/cinescope-vod-sdd/
> Codebase cleanup completed: 35 obsolete hooks removed, carousels.ts removed, architecture consolidated to `carouselPool.ts` + `DynamicCarousel` + `useInfiniteMovies`/`useInfiniteShows`.

---

## 1. Executive Summary

**CineScope** is a frontend-only VOD discovery platform that provides a premium movie and TV show browsing experience, comparable to modern streaming platforms. The application integrates with the TMDB API to fetch real-time data and presents it through a polished, responsive interface with hero slider, infinite-scroll carousels, detailed media pages, and content filtering.

**Focus:** Browsing and discovery only — no streaming, no auth  
**POC Status:** Complete — 11 specs implemented, deployed to GitHub Pages

## 2. Problem Statement

Users need a single platform to:
- Discover and browse trending movies **and TV shows**
- Access highly-rated content across both media types
- Search for specific movies or shows by title
- View comprehensive detail pages (synopsis, cast, ratings, episodes/seasons for shows)
- Filter content by type (movies/shows), genre, region, and language
- Get a seamless, responsive browsing experience comparable to commercial OTT platforms

## 3. Project Scope

### In Scope ✓
- **Modern VOD home page** (dynamic, infinite-loading carousel pool):
  - Hero slider (movies + shows, auto-advance, trailers, swipe, 70vh)
  - 60+ dynamic carousels loaded progressively via IntersectionObserver
  - Carousels grouped into tiers: New, Trending Top-10, Genre, Quality, Upcoming, Mood, Time-based, Language, Regional
  - Content Type toggle (Movies / Shows / All) filters all carousels + hero slider
  - Category filter, Country filter, Language filter integrated in header
- **Dedicated Trending page** (movies + shows, infinite scroll, content type filter)
- **Dedicated Top Rated page** (movies + shows, infinite scroll, content type filter)
- **Unified search** (movies + shows together, Movie/Show type badges)
- **Movie Detail page**: backdrop → auto-trailer (10s), Trailers & Clips section, Cast & Crew, Filmography, Watch Providers (OTT deep links), similar movies
- **Show Detail page**: backdrop, season/episode accordion, Cast & Crew, similar shows, Watch Providers
- **Country/Language/Region filtering** with regional and language-specific carousels
- **OTT provider navigation** (direct app launch on mobile, web fallback)
- Premium responsive UI (mobile-first, Tailwind, touch-swipe support)
- Client-side TTL caching, error handling, and retry

### Out of Scope ✗
- Video streaming functionality
- User authentication/login
- Payment processing
- Watchlist/favorites (saved to backend)
- Reviews/ratings submission
- Backend API development
- Database design/management
- User profiles
- Social features

## 4. Core Principles & Constraints

### I. Specification-First Development
All features begin with an approved `spec.md` before any implementation. No code is written without a specification. `plan.md` and `task.md` must exist before implementation starts. Spec quality is validated via `checklists/requirements.md` before planning proceeds.

### II. Type Safety
TypeScript strict mode is enforced across all source files. No `any` types in production code. All TMDB API responses have typed interfaces defined in `src/types/`. Runtime safety is the responsibility of the type system, not defensive checks.

### III. Component-Driven Architecture
UI is built from small, reusable components in `src/components/`. Pages in `src/pages/` compose components — they do not duplicate UI logic. Each component has a single, clear responsibility. State lives in custom hooks in `src/hooks/`, not in components.

**Active components (post-cleanup):** HeroSlider, DynamicCarousel, MovieCarousel, ShowCarousel, MovieCard, ShowCard, RankedMovieCard, RankedShowCard, HoverPreviewCard, MovieGrid, ShowGrid, Layout, LazySection, ScrollToTop, InfiniteScrollTrigger, LoadingSkeleton, ErrorState, RatingBadge, ContentFilterBar, CategoryDropdown, RegionDropdown, SearchBar, LaunchScreen, CastSection, FilmographySection, TrailersSection, TrailerPlayer, WatchProvidersSection, EpisodeList.

**Active hooks (15, post-cleanup):** `useApi`, `useInfiniteMovies`, `useInfiniteShows`, `useContentSearch`, `useMovieDetails`, `useShowDetails`, `useSeasonDetails`, `usePersonCredits`, `useMovieVideos`, `useShowVideos`, `useWatchProviders`, `useShowWatchProviders`, `useGenres`, `useCountries`, `useHeroSlider`.

### IV. API Contract First
TMDB API endpoints and response shapes are defined in specs before implementation. The service layer (`src/services/tmdbApi.ts`) is the sole gateway to external data. No direct API calls from components or pages. Caching and error handling are centralised in the service layer.

### V. Mobile-First Responsive Design & Horizontal Scrolling
All UI is designed for mobile first, then progressively enhanced for larger screens using Tailwind CSS breakpoints: `sm:640px`, `md:768px`, `lg:1024px`, `xl:1280px`. Touch targets minimum 44×44px. Horizontal scrolling is intentional for movie carousels on home page and collection sections. Lighthouse mobile score must exceed 85. Carousel behavior includes:
- Touch/swipe gesture support for mobile
- Visible scroll indicators for better UX
- Responsive card sizing within carousels

### VI. Automated Deployment
All production releases go through GitHub Actions CI/CD (`.github/workflows/deploy.yaml`). No manual deployments. The `main` branch is always deployable. Environment secrets are managed exclusively via GitHub Secrets — never committed to source code.

### Technical Constraints
- **Language**: TypeScript 5.0 / JavaScript
- **Framework**: React 18+ with functional components and hooks
- **API**: TMDB Free API (no additional backend required)
- **Storage**: Client-side TTL cache (in-memory, 5-min TTL) — no localStorage persistence
- **No Authentication**: Public/unauthenticated access
- **Deployment**: GitHub Pages via GitHub Actions CI/CD

### Design Constraints
- Premium modern VOD UI with clean design language
- Responsive design (mobile-first approach with breakpoints: mobile, sm, md, lg, xl)
- Horizontal scrolling carousels for content discovery (2-row layout, 20 movies per section)
- Accessibility standards (WCAG 2.1 - Level AA)
- Performance: Initial load < 2s, API calls <500ms, search results < 1s, bundle < 200KB gzipped
- No external payment integrations
- GitHub Pages deployment via GitHub Actions CI/CD pipeline
- Clean gradients, smooth animations, and polished interactions

## 5. Success Criteria

| Criterion | Target | Validation |
|-----------|--------|-----------|
| All features spec'd | 100% | Specification document complete |
| API integration | Trending, Top-rated, Search, Details working | Manual testing |
| Component tests | >80% coverage | Jest/Vitest coverage reports |
| Responsive design | Desktop, Tablet, Mobile | Device testing |
| Search latency | <1s for user input | Performance monitoring |
| API error handling | Graceful degradation | Error state testing |
| User experience | Intuitive navigation | UX review |

## 6. User Personas

### Primary: Movie Enthusiast
- **Goal**: Discover new movies
- **Pain Point**: Too many options, hard to find quality content
- **Interaction**: Browse trending, explore categories, read details

### Secondary: Casual Viewer
- **Goal**: Find something specific to watch
- **Pain Point**: Doesn't remember exact title
- **Interaction**: Use search, filter by ratings

## 7. Architecture Decisions

### Technology Stack
```
Frontend:  React 18 + TypeScript 5 + Vite 4
State:     React Context (ContentFilterContext) + in-memory TTL cache
Styling:   Tailwind CSS 3 (mobile-first, custom animations)
API:       TMDB REST API (free tier, 40 req/10s)
Build:     Vite (base: /cinescope-vod-sdd/)
Testing:   Vitest + React Testing Library + jsdom
Deploy:    GitHub Pages via GitHub Actions
```

### Carousel Architecture (Implemented)
The home page uses a **pool-based dynamic carousel system** — there are no per-genre hooks. Instead:
- `src/config/carouselPool.ts` — 60+ `DynamicCarouselConfig` objects, each with a `fetch` function that calls `discoverMovies`/`discoverTV` directly
- `src/components/DynamicCarousel.tsx` — renders any config item using `useInfiniteMovies` or `useInfiniteShows`
- `src/pages/HomePage.tsx` — selects from the pool based on content type, active category, and region; renders via `<LazySection>` + `<DynamicCarousel>`

### Component Structure (Implemented)
- **Pages**: HomePage, TrendingPage, TopRatedPage, SearchPage, MovieDetailPage, ShowDetailPage
- **Components**: 29 components (see Principle III for full list)
- **Hooks**: 15 active hooks — see Principle III; no per-genre hooks exist
- **Services**: `tmdbApi.ts` (sole API gateway, 40+ functions), `cache.ts` (TTL cache), `errorHandling.ts`
- **Config**: `carouselPool.ts` (carousel definitions + regional/language/genre builders), `ottProviders.ts`
- **Utils**: `genreKeyMap.ts`, `carouselTitles.ts`, `ottNavigation.ts`

### Data Flow
1. User interaction → Component state update
2. State change → Component re-render
3. Effect hook → Fetch from API (cached)
4. Response → Update component state

## 8. API Integration Strategy

### TMDB API Usage
- **Endpoint**: TheMovieDatabase.org (TMDB)
- **Authentication**: API Key (free tier)
- **Rate Limiting**: 40 requests/10 seconds (managed locally)
- **Caching**: 5-minute cache for listing endpoints

### Key Endpoints (Movies)
- `GET /trending/movie/day` — Daily trending movies (hero slider + Top 10)
- `GET /trending/movie/week` — Weekly trending movies
- `GET /movie/top_rated` — Top-rated movies page
- `GET /discover/movie` — Flexible discover with sort, genre, date, region, language filters
- `GET /search/multi` — Unified search (movies + shows)
- `GET /movie/{id}` — Movie details + credits + similar (append_to_response)
- `GET /movie/{id}/videos` — Trailers and clips
- `GET /movie/{id}/watch/providers` — OTT platform availability
- `GET /person/{id}/movie_credits` — Filmography for cast/crew

### Key Endpoints (TV Shows)
- `GET /trending/tv/day` — Daily trending shows
- `GET /trending/tv/week` — Weekly trending shows
- `GET /tv/top_rated` — Top-rated shows page
- `GET /discover/tv` — Flexible TV discover (genre, region, language, dates)
- `GET /tv/{id}` — Show details + credits + similar
- `GET /tv/{id}/season/{n}` — Season details with episode list
- `GET /tv/{id}/videos` — Show trailers
- `GET /tv/{id}/watch/providers` — OTT platform availability

### Key Endpoints (Metadata)
- `GET /genre/movie/list` — Movie genre list (for CategoryDropdown)
- `GET /configuration/countries` — Country list (for RegionDropdown)
- `GET /configuration/languages` — Language list (unused, removed)

## 9. Non-Functional Requirements

| Requirement | Target | Priority |
|-------------|--------|----------|
| Accessibility (WCAG 2.1 AA) | 100% | High |
| Performance: LCP | <2.5s | High |
| Performance: FID | <100ms | Medium |
| Mobile responsiveness | All common sizes | High |
| Browser support | Chrome, Firefox, Safari | Medium |
| Code coverage | >70% | Medium |

## 10. Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|-----------|
| TMDB API downtime | Users can't browse | Fallback UI + cached data |
| Rate limit exceeded | API calls blocked | Client-side rate limiting |
| Large image files | Slow load times | Image optimization + CDN |
| Complex state | Bugs and maintenance | TanStack Query for caching |

## 11. Definitions & Terminology

| Term | Definition |
|------|-----------|
| **Trending** | Most viewed/popular movies in recent days |
| **Top Rated** | Highest rated movies overall (by avg rating) |
| **Movie Detail** | Comprehensive information about a specific movie |
| **Cast** | Actors and crew associated with the movie |
| **SDD** | Spec-Driven Development - Plan specs before code |

## 12. Out-of-Scope Clarifications

### Streaming
The application uses TMDB for metadata only. No video files are hosted or streamed.

### Authentication
All features are publicly accessible. No login or user accounts.

### Backend Services
No custom backend. TMDB API is the sole external service.

### Data Persistence
Client-side caching only. No user data storage beyond session.

## 12a. Deployment Strategy

### GitHub Pages Hosting
- **Platform**: GitHub Pages (https://nishant-nagose.github.io/cinescope-vod-sdd/)
- **Build Process**: Automated via GitHub Actions CI/CD pipeline
- **Base Path**: `/cinescope-vod-sdd/` for production builds
- **Build Command**: `npm run build` (TypeScript compilation + Vite bundling)
- **Environment Variables**: VITE_TMDB_API_KEY managed via GitHub Secrets

### CI/CD Pipeline
**Workflow**: `.github/workflows/deploy.yaml`
- **Trigger**: Automatic on push to main branch or manual via workflow_dispatch
- **Steps**:
  1. Checkout repository (Node.js: v18)
  2. Install dependencies (`npm ci`)
  3. Build application with environment variables
  4. Upload artifacts to GitHub Pages
  5. Deploy to GitHub Pages using official deploy-pages action
- **Concurrency**: Prevents simultaneous deployments
- **Output**: Production-ready static site

### Configuration Files
- **vite.config.ts**: Base path set to `/cinescope-vod-sdd/`
- **src/App.tsx**: React Router basename configured for subdirectory routing
- **.env**: VITE_TMDB_API_KEY loaded from GitHub Secrets during build

## 12b. Responsive Design Implementation

### Mobile-First Approach
- **Default breakpoints**: Mobile → sm:640px → md:768px → lg:1024px → xl:1280px
- **Design philosophy**: Start with mobile constraints, progressively enhance for larger screens

### Component Responsiveness
- **Header**: 
  - Mobile: h-14 with hamburger menu, sticky positioning
  - Desktop: h-16 with full navigation visible
- **Navigation**: 
  - Mobile: Hamburger menu with slide-down options
  - Desktop (md+): Horizontal navigation bar
- **Search bar**: Hidden on mobile/tablet, visible on lg+ screens
- **Grid layouts**: 
  - 2 columns (mobile) → 3 (sm) → 4 (md) → 5 (lg)
  - Gap scaling: 3px (mobile) → 4px (sm) → 5px (md) → 6px (lg)
- **Typography**: text-xs (mobile) → text-sm (tablet) → text-base (desktop)
- **Footer**: 1 column (mobile) → 2 columns (sm) → 3 columns (lg)

### Spacing Strategy
- **Padding**: px-3 (mobile) → px-4 (sm) → px-6 (md) → px-8 (lg)
- **Margins**: Adaptive spacing (py-4 sm:py-6 md:py-8)
- **Touch targets**: Minimum 44px height for interactive elements

### Performance Optimization
- **Image lazy loading**: Implemented on all `img` elements
- **CSS optimization**: Tailwind CSS purges unused styles in production
- **Bundle analysis**: ~176KB gzipped (optimized for mobile)

### Browser Support
- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Android)

## 13. Governance

This constitution supersedes all other development practices for CineScope. All feature work must comply with the Core Principles defined in Section 4.

### Compliance Requirements
- All specs must pass the `checklists/requirements.md` quality gate before planning proceeds
- All `plan.md` files must include a Constitution Check section with all six principles verified
- All PRs must be traceable to a spec — no unspecified features merged to `main`
- Complexity violations (e.g. skipping a principle) must be justified in `plan.md` Complexity Tracking section

### Amendment Process
1. Proposed amendments must be documented with clear rationale
2. Amendment must reference which principle or section is affected
3. Developer sign-off required before the amendment takes effect
4. All dependent spec-kit templates (`spec-template.md`, `plan-template.md`, `tasks-template.md`) must be reviewed after any amendment

### SDD Workflow Order
Features MUST follow this sequence — no skipping steps:
1. `/speckit-specify` → produces `spec.md`
2. `/speckit-clarify` → refines `spec.md`
3. `/speckit-checklist` → validates `checklists/requirements.md`
4. `/speckit-plan` → produces `plan.md`
5. `/speckit-tasks` → produces `task.md`
6. `/speckit-implement` → executes tasks
7. `/speckit-analyze` → cross-artifact consistency check

**Version**: 1.1.0 | **Ratified**: 2026-04-21 | **Last Amended**: 2026-04-25 — POC complete; architecture updated to reflect pool-based carousel system and 15-hook inventory

---

## 14. Approval & Sign-Off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Developer | Nishant Nagose | 2026-04-21 | ✓ |
| Deployment | GitHub Actions CI/CD | 2026-04-21 | ✓ |

## 14. Appendices

### A. TMDB API Key Setup
1. Register at TheMovieDatabase.org
2. Generate API Key from settings
3. Add to GitHub Secrets: `VITE_TMDB_API_KEY=[REDACTED_AZURE_OPENAI_API_KEY_1]`
4. Configure in `.env.local` for local development

### B. SDD Organization
The project follows Specification-Driven Development (SDD) principles with organized artifacts:
- **constitution.md**: Project governance and decision framework
- **specs/{feature}/spec.md**: Feature requirements and acceptance criteria
- **specs/{feature}/plan.md**: Design and implementation approach
- **specs/{feature}/task.md**: Actionable tasks and checkpoints
- **src/**: Implementation files organized by components and pages
- **.github/workflows/**: CI/CD configuration for automated deployment

### C. Component Architecture (Implemented — post-POC)
```
App (ContentFilterProvider → BrowserRouter → AppRoutes)
├── LaunchScreen (full-screen intro, dismissed on completion)
└── Layout (4-zone responsive header via CSS Grid)
    ├── Header
    │   ├── Zone 1: Logo (SVG, h-6 sm:h-8)
    │   ├── Zone 2: SearchBar (desktop) / icon (mobile)
    │   ├── Zone 3: ContentToggle (Movies | Shows | All)
    │   └── Zone 4: Nav links + ContentFilterBar (Category, Country)
    │   └── Mobile: hamburger overlay
    ├── Pages (ScrollToTop + PageTransition on every route change)
    │   ├── HomePage
    │   │   ├── HeroSlider (movies+shows mixed, auto-advance, trailers, swipe)
    │   │   └── [8–60+ DynamicCarousel via carouselPool + LazySection]
    │   │       each = useInfiniteMovies|useInfiniteShows → MovieCarousel|ShowCarousel
    │   ├── TrendingPage (MovieGrid + ShowGrid, infinite scroll, content-type gated)
    │   ├── TopRatedPage (MovieGrid + ShowGrid, infinite scroll, content-type gated)
    │   ├── SearchPage (useContentSearch → SearchResultCard grid, Movie/Show badges)
    │   ├── MovieDetailPage
    │   │   ├── Backdrop → TrailerPlayer (auto at 10s)
    │   │   ├── TrailersSection (all clips)
    │   │   ├── CastSection + FilmographySection
    │   │   ├── WatchProvidersSection (OTT deep links)
    │   │   └── MovieCarousel (similar movies)
    │   └── ShowDetailPage
    │       ├── Backdrop + metadata (seasons, networks, status)
    │       ├── EpisodeList (season accordion, episode rows with synopsis)
    │       ├── TrailersSection
    │       ├── CastSection
    │       ├── WatchProvidersSection
    │       └── ShowCarousel (similar shows)
    └── Services
        ├── tmdbApi.ts (40+ functions — sole API gateway)
        ├── cache.ts (in-memory TTL, 5 min)
        └── errorHandling.ts (retry + timeout)
```

### D. Responsive Breakpoints Strategy
| Breakpoint | Width | Components |
|-----------|-------|-----------|
| Mobile | <640px | Hamburger nav, carousel: 1.5-2 cards visible |
| sm | 640px+ | 2 cards visible in carousel |
| md | 768px+ | Desktop nav visible, 3 cards in carousel |
| lg | 1024px+ | Full features, 4-5 cards in carousel, search bar |
| xl | 1280px+ | Large screens, 5-6 cards visible, optimized spacing |

### E. GitHub Pages & CI/CD Pipeline
**Deployment URL**: https://nishant-nagose.github.io/cinescope-vod-sdd/
- Automated builds on push to main via `.github/workflows/deploy.yaml`
- Environment variable: `VITE_TMDB_API_KEY` via GitHub Secrets
- Base path: `/cinescope-vod-sdd/` in all builds
- React Router basename: `/cinescope-vod-sdd/` for correct routing
- Home page (/) loads Netflix-like modern interface as landing experience
- All dedicated pages accessible via navigation

### F. Development Workflow
1. Create feature branch from main
2. Write/update spec.md in feature directory
3. Design & document in plan.md
4. Break down into tasks in task.md
5. Implement in src/
6. Test and commit
7. Push and create PR
8. Merge to main → GitHub Actions deploys automatically

