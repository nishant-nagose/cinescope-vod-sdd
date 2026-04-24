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

---

## Phase 2 Research (2026-04-24 — Bug Fixes & Feature Enhancements)

---

## 14. Dropdown Selected-State Preservation During Search (FR-035, FR-036)

**Decision**: Always render selected options at the top of the filtered dropdown list (pinned to top), regardless of the search query. Sort the full unfiltered options array alphabetically ascending before rendering. The selected options bypass the search filter; unselected options are filtered normally.

**Rationale**: Standard multiselect dropdown UX pattern. When a user searches within a dropdown, they should always be able to confirm what's already selected without clearing the search. Pinning selected items at the top is simpler to implement than an "always match selected items" filter and matches the pattern used by React-Select, Headless UI Select, and similar libraries.

**Alternatives considered**:
- Always include selected items in the filtered list (match them even if they don't match the query) — same visual result but more complex filter logic than pinning.
- Show selected items in a separate "chips" row above the dropdown — more UI surface to maintain; unnecessary for this feature scope.

**Implementation**: Sort `options.sort((a, b) => a.label.localeCompare(b.label))` before rendering. In the filter function: `return isSelected(option) || option.label.toLowerCase().includes(query)`.

---

## 15. Image & Video Cropping Fix — Backdrop and Trailer (FR-037, FR-037b, FR-038, FR-039, FR-039b)

**Decision**: Use CSS `aspect-ratio` containers for all backdrop images and trailer iframes. Set `object-fit: cover` with `object-position: center` for backdrop images. Set `width: 100%; height: 100%` on the iframe/video inside an `aspect-ratio: 16/9` container.

**Rationale**: The cropping issue is caused by fixed-height containers (e.g., `height: 300px`) forcing `overflow: hidden` to clip image/video content. The fix is to let the container be driven by the content's natural aspect ratio instead of a fixed height.

**Approach by element type**:
- **Backdrop `<img>`**: Wrap in `<div style={{ aspectRatio: '16/9' }}>` with `width: 100%`. Set `img { width: 100%; height: 100%; object-fit: cover; object-position: center }`. Remove any `height: Npx` or `max-height` that clips the image.
- **Trailer `<iframe>` (YouTube embed)**: Wrap in `<div style={{ aspectRatio: '16/9', width: '100%' }}>`. Set `iframe { width: 100%; height: 100%; border: 0 }`. This replaces the common padding-top hack (`padding-top: 56.25%`) with the modern native `aspect-ratio` property (supported in all target browsers: Chrome, Firefox, Safari latest 2 versions).
- **Hero Slider image**: Same `aspect-ratio: 16/9` container approach. On mobile, use `aspect-ratio: 4/3` for more vertical space.

**Alternatives considered**:
- `padding-top: 56.25%` hack with `position: absolute` child — deprecated pattern; replaced by `aspect-ratio` in modern CSS.
- Fixed viewport-height containers (`height: 50vh`) — inconsistent across screen sizes; can still cause cropping at extreme viewports.

---

## 16. Carousel Scroll-Position Preservation (FR-040)

**Decision**: Capture the scroll container's `scrollLeft` value before a React state update adds new items. Restore it after the update using `useLayoutEffect` (fires synchronously after DOM mutations, before paint).

**Rationale**: React's reconciliation algorithm resets the DOM's `scrollLeft` to 0 when the list of items changes (items appended). `useLayoutEffect` fires after the DOM update but before the browser paints, making it the correct hook to restore scroll position without a visible flash.

**Approach**:
```typescript
const scrollRef = useRef<HTMLDivElement>(null);
const scrollLeftRef = useRef<number>(0);

// Before loadMore:
scrollLeftRef.current = scrollRef.current?.scrollLeft ?? 0;

// After items update (in useLayoutEffect):
useLayoutEffect(() => {
  if (scrollRef.current) {
    scrollRef.current.scrollLeft = scrollLeftRef.current;
  }
}, [items]); // fires after items array changes
```

**Alternatives considered**:
- `useEffect` (fires after paint) — causes a visible flash/jump before scroll is restored.
- `key` prop trick (don't change the key) — already the case; the issue is that appending items shifts the scroll container's content width, causing browser recalculation that may reset `scrollLeft`.
- Virtualised list libraries (e.g., `react-virtual`) — overkill for this use case; introduces a new dependency.

---

## 17. CSS Grid Header — 4-Zone Layout (FR-042 to FR-048)

**Decision**: Replace the current flex-based header with a 4-column CSS Grid layout. Use Tailwind CSS grid utilities (`grid`, `grid-cols-[...]`, `gap-`) with a responsive column configuration.

**Rationale**: CSS Grid provides stable, two-dimensional control over the header layout. It eliminates the "floating" alignment issues that flex-based headers exhibit when content sizes vary (logo width vs. nav width vs. search width). Grid is now fully supported in all target browsers.

**Column definition**:
```css
grid-template-columns: auto minmax(280px, 1fr) auto auto;
/* Logo | Search | Toggle | Nav+Filters */
```

**Responsive breakpoints**:
- **Desktop (lg+)**: 4-column grid; full search visible (`<input>`); all nav items and filter dropdowns shown inline.
- **Tablet (md to lg)**: 3-column grid (`auto 1fr auto`); Logo | Search | Hamburger. Nav+Filters opens as a full-width overlay panel on hamburger click.
- **Mobile (<md)**: 2-column grid (`auto auto`); Logo | (SearchIcon + Hamburger). Full menu slides in from hamburger.

**Nav/Filter visual separation**: Inside the Nav+Filters zone, use a `flex` row with a `border-l` (1px vertical divider) or a `gap-4` + subtle background-color change to visually separate Navigation links from Filter dropdowns. Do NOT use `|` text characters — use CSS border.

**Content Toggle (Movies/Shows)**: Two adjacent `<button>` elements with shared border-radius group styling. Active button: `bg-white/20 ring-2 ring-white` (example — match existing design tokens). Inactive: `bg-transparent`.

**Alternatives considered**:
- Continued flex layout with explicit `flex-shrink: 0` on logo — still causes reflow issues when dropdowns expand; rejected.
- CSS subgrid — not necessary for this use case; standard 4-column grid is sufficient.

---

## 18. OTT Direct Deep-Link Navigation (FR-054, FR-055)

**Decision**: Build a provider URL mapping (`src/config/ottProviders.ts`) that maps TMDB `provider_id` to a known `webUrlPattern` and mobile `appScheme`. For desktop, open `window.open(webUrl, '_blank')`. For mobile, attempt the app scheme URL; fall back to the web URL via a `setTimeout` safety net.

**Rationale**: TMDB's watch providers API returns a `link` field pointing to `themoviedb.org/movie/{id}/watch` — a TMDB-branded page that requires the user to click again to reach the actual OTT platform. Constructing direct URLs from known provider patterns eliminates this friction. For providers without a known pattern, the TMDB link is used as-is (graceful fallback — no regression).

**Provider URL patterns (major providers)**:
| Provider | TMDB `provider_id` | Web URL Pattern | Mobile App Scheme |
|----------|--------------------|-----------------|-------------------|
| Netflix | 8 | `https://www.netflix.com/search?q={title}` | `nflx://www.netflix.com/search?q={title}` |
| Disney+ | 337 | `https://www.disneyplus.com/search` | `disneyplus://` |
| Amazon Prime Video | 9 | `https://www.amazon.com/gp/video/search?phrase={title}` | `aiv://aiv/search?phrase={title}` |
| Apple TV+ | 350 | `https://tv.apple.com/search?term={title}` | `videos://` |
| Hulu | 15 | `https://www.hulu.com/search?q={title}` | `hulu://search?q={title}` |
| HBO Max / Max | 1899 | `https://www.max.com/search` | `max://` |
| Paramount+ | 531 | `https://www.paramountplus.com/search/` | `cbsaa://` |

**Note**: Direct content-ID-based URLs (e.g., `netflix.com/title/12345`) require knowing the provider's internal ID for the content, which TMDB does not expose. Search-based fallback URLs (using title) are the practical approach for a frontend-only app without a backend mapping service.

**Mobile detection**: Use `window.matchMedia('(pointer: coarse)').matches` — true for touch-primary devices (mobile, tablet). Do not use `navigator.userAgent` parsing (brittle).

**Mobile app-launch pattern**:
```typescript
function navigateToOTT(webUrl: string, appScheme?: string) {
  const isMobile = window.matchMedia('(pointer: coarse)').matches;
  if (isMobile && appScheme) {
    window.location.href = appScheme;
    setTimeout(() => window.open(webUrl, '_blank'), 300);
  } else {
    window.open(webUrl, '_blank');
  }
}
```
The `setTimeout` fires if the app scheme didn't intercept (device doesn't have the app installed). If the app did open, the page is no longer active and the timeout fires but has no effect.

**Alternatives considered**:
- Using TMDB's `link` as-is (current behaviour) — rejected; adds an extra step (TMDB page → OTT site).
- Backend proxy to resolve content-specific deep links — requires a backend; out of scope for this project.
- Universal Links / App Links (iOS/Android) — requires server-side `apple-app-site-association` / `assetlinks.json` file hosted on the OTT provider's domain; not controllable from a third-party app.

---

## 19. Dynamic Carousel Configuration (FR-052, FR-053)

**Decision**: Create `src/config/carousels.ts` exporting an ordered array of `CarouselConfig` objects. `HomePage.tsx` maps over this array to render carousels, eliminating all hardcoded title strings from the page component.

**Rationale**: Carousel titles are currently inlined as JSX string literals in `HomePage.tsx`. Moving them to a config file means: (a) titles are editable without touching component code, (b) ordering is explicit and auditable in one place, (c) adding/removing a carousel is a one-line config change, not a page refactor. This matches the "editorial priority defined in configuration" requirement from the original spec clarification.

**Config shape**:
```typescript
// src/config/carousels.ts
export const CAROUSEL_CONFIG: CarouselConfig[] = [
  { id: 'new-shows',        title: 'New Shows on CineScope',      type: 'shows', hookKey: 'newShows',        rankDisplay: false },
  { id: 'top10-today',      title: "Today's Top 10 Shows",        type: 'shows', hookKey: 'tvDailyTrending', rankDisplay: true  },
  { id: 'top10-weekly',     title: 'Weekly Top 10 Shows',         type: 'shows', hookKey: 'tvWeeklyTrending',rankDisplay: true  },
  { id: 'recommended',      title: 'Recommended Shows',           type: 'shows', hookKey: 'recommended',     rankDisplay: false },
  // ... etc.
  { id: 'upcoming-movies',  title: 'Upcoming Movies',             type: 'movies',hookKey: 'upcomingMovies',  rankDisplay: false },
  { id: 'upcoming-shows',   title: 'Upcoming Shows',              type: 'shows', hookKey: 'upcomingShows',   rankDisplay: false },
];
```

**Hook mapping**: `HomePage.tsx` maintains a `hookMap: Record<string, UseCarouselHookReturn>` that maps `hookKey` to the instantiated hook result. The config array drives the render order; the hook map provides the data. This keeps type safety (all hooks still called unconditionally at the top of the component, as per React's rules of hooks).

**Alternatives considered**:
- Runtime AI inference to generate titles — rejected per clarification session (build-time config is the chosen approach; no runtime inference per user session).
- CMS-driven titles (external API) — out of scope; no backend.
- Hardcoded titles remain in JSX — current state; fails FR-052.
