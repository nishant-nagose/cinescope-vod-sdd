# Research: Shows Content Modernization

**Branch**: `021-shows-modernization` | **Date**: 2026-04-23

## 1. TMDB TV Show API Endpoints

**Decision**: Use TMDB `/tv/*` and `/discover/tv` endpoints, mirroring the existing `/movie/*` pattern already in `tmdbApi.ts`.

**Rationale**: TMDB Free API fully supports TV shows with equivalent endpoints to movies. The existing service layer pattern (typed fetch + cache + error handling) maps directly. No new external service or API key required.

**Alternatives considered**:
- A separate aggregator API — rejected; unnecessary complexity for a single-source app.
- GraphQL wrapper — rejected; TMDB REST is already established in codebase.

### TV Endpoints to Implement

| Function | TMDB Endpoint | Notes |
|----------|---------------|-------|
| `getTrendingTVDaily(page)` | `GET /trending/tv/day` | Daily trending |
| `getTrendingTVWeekly(page)` | `GET /trending/tv/week` | Weekly trending |
| `getTopRatedTV(page, filter?)` | `GET /tv/top_rated` | vote_average ≥ 7.5, vote_count ≥ 100 |
| `getNewShows(page, filter?)` | `GET /discover/tv?sort_by=first_air_date.desc` | Released in last 90 days |
| `getShowsByGenre(genreId, page, filter?)` | `GET /discover/tv?with_genres=<id>` | Mirrors getMoviesByGenre |
| `getCriticallyAcclaimedShows(page)` | `GET /discover/tv?vote_average.gte=8&vote_count.gte=200` | High-quality threshold |
| `getRecommendedShows(page)` | `GET /discover/tv?sort_by=popularity.desc&vote_count.gte=100` | Editorial proxy |
| `getComedyShows(page)` | `/discover/tv?with_genres=35` | Genre ID 35 |
| `getSciFiFantasyShows(page)` | `/discover/tv?with_genres=10765` | TV Sci-Fi & Fantasy genre ID |
| `getDocumentaryShows(page)` | `/discover/tv?with_genres=99` | Documentary (real-life) |
| `getAnimationShows(page)` | `/discover/tv?with_genres=16` | Animation genre ID 16 |
| `getRomanceShows(page)` | `/discover/tv?with_genres=10749` | Romance genre ID |
| `getActionAdventureShows(page)` | `/discover/tv?with_genres=10759` | TV Action & Adventure |
| `getAwardWinningShows(page)` | `/discover/tv?vote_count.gte=500&vote_average.gte=8` | Proxy for award quality |
| `getInspiringShows(page)` | `/discover/tv?with_genres=18,10751` | Drama + Family |
| `getThrillerShows(page)` | `/discover/tv?with_genres=9648,80` | Mystery + Crime |
| `getUpcomingShows(page)` | `/discover/tv?air_date.gte=<today>&sort_by=first_air_date.asc` | Future air dates |
| `getUpcomingMovies(page)` | `GET /movie/upcoming` | TMDB native upcoming endpoint |
| `getShowDetails(id)` | `GET /tv/{id}` | Includes seasons array |
| `getShowCredits(id)` | `GET /tv/{id}/credits` | Same shape as movie credits |
| `getSimilarShows(id, page)` | `GET /tv/{id}/similar` | Similar shows |
| `getSeasonDetails(showId, seasonNum)` | `GET /tv/{showId}/season/{seasonNum}` | Episodes list |
| `searchMulti(query, page)` | `GET /search/multi` | Returns movies + TV + people; filter to movie/tv |

**Note on `getHeroSliderContent()`**: The hero slider should fetch from trending (daily), top-rated, and upcoming endpoints for both movies and TV, merge results, deduplicate, and cap at 10. The existing `useHeroSlider.ts` hook needs to be updated to call both movie and TV trending endpoints.

---

## 2. Hero Slider Fix

**Decision**: The hero slider is broken due to static/hardcoded fallback data or a filter that returns empty. Fix by ensuring `useHeroSlider.ts` dynamically fetches from live API and merges movie + show results.

**Rationale**: `HeroSlider.tsx` component exists and renders correctly when given data. The issue is in `useHeroSlider.ts` which likely either: (a) has a hardcoded movie list, (b) uses a filter that returns 0 results, or (c) has a timing/state issue. Confirmed fix: replace any static data with live API calls; add a `mediaType` discriminator field to each item.

**Approach**:
1. `useHeroSlider.ts` fetches from `getTrendingMovies`, `getTrendingTVDaily`, and `getUpcomingMovies` in parallel
2. Merges results, tags each with `mediaType: 'movie' | 'tv'`
3. Limits to 10 items by popularity score
4. HeroSlider renders a "Movie" or "Show" badge per slide

---

## 3. Single-Row Carousel Fix

**Decision**: Add a `singleRow?: boolean` prop to `MovieCarousel.tsx`. When `true`, the CSS grid/flex changes from 2 rows to 1 row.

**Rationale**: The current implementation uses `grid-rows-2` or wraps content in a 2-row flex container. A boolean prop is the least-invasive change and allows the existing ranked carousels to keep their layout if needed. All new show carousels will pass `singleRow={true}`; home page movie carousels will also be migrated to `singleRow={true}` per FR-015.

**Alternative considered**: Remove 2-row layout entirely — rejected because it could break ranked carousels (Top 10 Today) which currently rely on the 2-row display. The prop approach is safer for the migration.

---

## 4. Horizontal Infinite Scroll (Carousel)

**Decision**: Implement scroll-triggered loading within the carousel using an `IntersectionObserver` on a sentinel element at the right edge of the scroll container. Load the next page when the sentinel becomes visible.

**Rationale**: The app already has `IntersectionObserver`-based infinite scroll in `InfiniteScrollTrigger.tsx` for vertical pagination. The same pattern applies horizontally for carousels. This avoids a third-party dependency and matches existing conventions.

**Implementation**:
- `MovieCarousel.tsx` receives `onLoadMore?: () => void` and `hasMore?: boolean` props
- A sentinel `<div>` is appended inside the scroll container
- When it intersects (right-side viewport), `onLoadMore` is called
- Each carousel hook manages its own `page` counter and `hasMore` flag

---

## 5. Lazy Carousel Loading (Viewport)

**Decision**: Wrap each carousel section on the home page in a `LazySection` component that uses `IntersectionObserver` to delay rendering until the section is near the viewport (rootMargin: `200px`).

**Rationale**: The home page has 25+ carousels after this feature. Fetching all on mount would fire 25+ API calls simultaneously, blowing the TMDB rate limit (40/10s) and causing slow first load. Viewport-based lazy loading limits concurrent calls to 3-5 at most.

**Implementation**:
- New `LazySection.tsx` wrapper: renders a fixed-height placeholder until in viewport, then mounts the real carousel
- All carousel sections in `HomePage.tsx` wrapped with `<LazySection>`

---

## 6. Content Type Toggle + Category Filter

**Decision**: Add `contentType: 'movies' | 'shows' | 'all'` to `ContentFilterContext`. The `ContentFilterBar.tsx` gains two toggle buttons (Movies / Shows) and a Category dropdown.

**Rationale**: `ContentFilterContext` already provides country/language state globally. Extending it with `contentType` and `activeCategory` keeps all filter state co-located and avoids prop-drilling through 25+ carousel sections.

**Category dropdown**: Uses existing `useGenres.ts` hook — the same genre IDs apply for both movies and TV in TMDB.

---

## 7. Show Details Page

**Decision**: Create `ShowDetailPage.tsx` as a new page, mirroring `MovieDetailPage.tsx` in layout, with an additional Seasons accordion and Episodes list.

**Rationale**: Code duplication is acceptable here given the structural similarity and the risk of over-abstracting a shared details-page component. The Movie and Show pages will diverge (episodes vs. similar movies sections) — a shared base would add complexity without proportional benefit.

**Episode expand behaviour**: Clicking a season expands its episode list inline (accordion pattern). Clicking an individual episode expands its synopsis/metadata below the episode row. No navigation, no playback.

---

## 8. Search — Unified Movies + Shows

**Decision**: Replace `searchMovies()` usage in `SearchPage.tsx` with `searchMulti()`, filter results to `media_type: 'movie' | 'tv'`, display a type badge per result, and route clicks to `/movie/:id` or `/show/:id` accordingly.

**Rationale**: TMDB `/search/multi` returns movies, TV shows, and people in one call. Filtering out `media_type: 'person'` gives a clean merged result set without an extra API call.

---

## 9. Scroll-to-Top on Navigation

**Decision**: Add a `ScrollToTop` component in `App.tsx` / `routes.tsx` that calls `window.scrollTo(0, 0)` on every route change via `useEffect` + `useLocation`.

**Rationale**: React Router does not reset scroll position on navigation by default. A single small component at the router root is the standard fix with zero impact on other behaviour.

---

## 10. Logo Fix

**Decision**: Locate the old static logo `<img>` in `Layout.tsx` or `Header` area and replace it with the existing premium logo asset (already in `src/images/`).

**Rationale**: The premium logo was created in Spec 010 and is already available as an asset. This is a one-line change — no design work needed.

---

## 11. Welcome Message

**Decision**: Restore the welcome message markup in `HomePage.tsx`. It was likely removed or hidden by a style change in the Spec 010 implementation.

**Rationale**: The message is a simple JSX text element — restoring it requires locating where it was removed and adding it back. No new component needed.

---

## 12. API Failure & Retry (FR-034)

**Decision**: Extend `MovieCarousel.tsx` to accept an `onRetry` callback (already in the props!) and display a minimal retry button when `error` is non-null and the carousel is hidden. The parent hook's `refetch` is passed as `onRetry`.

**Rationale**: `MovieCarousel.tsx` already has `onRetry?: () => void` and `error?: string | null` props but the hidden-section-with-retry behaviour needs to be confirmed/enforced in all carousel usages on `HomePage.tsx`.

---

## 13. Test File Relocation

**Decision**: Move `tests/TopRatedPage.test.tsx` → `tests/pages/TopRatedPage.test.tsx` and `tests/TrendingPage.test.tsx` → `tests/pages/TrendingPage.test.tsx`. Update any import paths if needed.

**Rationale**: Simple `git mv` operation. `tests/pages/` already exists and contains `MovieDetailPage.test.tsx`, `HomePage.test.tsx`, `SearchPage.test.tsx`. This aligns all page tests under the same directory.
