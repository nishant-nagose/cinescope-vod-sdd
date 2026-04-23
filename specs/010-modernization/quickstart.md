# Quickstart: CineScope App Modernization

**Branch**: `019-modernization` | **Date**: 2026-04-23

Integration scenarios for key features — verifiable without running tests.

---

## Scenario 1: Hero Slider renders and auto-plays

**Setup**: Home page loaded with `useDailyTrending()` returning 10 movies.

**Flow**:
1. `HeroSlider` receives `movies[0..9]`, sets active slide index to 0
2. On mount, fetches trailer for `movies[0]` via `useMovieVideos(movies[0].id)`
3. If trailer found: renders `<iframe>` with YouTube embed, `mute=1&autoplay=1`
4. If no trailer: renders backdrop image for that slide
5. After 6s: advances to slide index 1, fetches trailer for `movies[1]`
6. User clicks dot/arrow: jumps to that index immediately

**Expected outcome**: Slider cycles through 10 movies; video plays for movies with trailers; no error for movies without.

---

## Scenario 2: Ranked Top 10 cards display rank numbers

**Setup**: "Today's Top 10 Movies" carousel renders 10 `RankedMovieCard` components.

**Flow**:
1. `MovieCarousel` receives `movies.slice(0, 10)`, `rankDisplay=true`
2. For index `i`, renders `<RankedMovieCard movie={movies[i]} rank={i + 1} />`
3. Each card shows the movie poster with rank number `1`–`10` at bottom-left
4. Numbers use large outlined/stroke typography

**Expected outcome**: Exactly 10 cards visible; rank 1 on leftmost card, rank 10 on rightmost.

---

## Scenario 3: Movie detail auto-plays trailer after 10 seconds

**Setup**: User opens `/movie/123`. Movie has a trailer on YouTube.

**Flow**:
1. Page loads: backdrop image displayed
2. `useMovieVideos(123)` fetches trailer data in background
3. 10-second timer starts on mount
4. At t=10s: backdrop replaced by `<TrailerPlayer videoKey="abc123" autoplay muted />`
5. If user navigates away at t=7s: `useEffect` cleanup cancels timer — no trailer load

**Expected outcome**: Trailer starts at exactly 10s; timer cleanup prevents errors on navigation.

---

## Scenario 4: Infinite scroll appends results

**Setup**: User on Trending page. 20 movies loaded (page 1).

**Flow**:
1. `InfiniteScrollTrigger` sentinel `<div>` is rendered below the movie list
2. User scrolls down; sentinel enters viewport
3. IntersectionObserver fires → `fetchMore()` called
4. `loading = true`: spinner shown at bottom
5. Page 2 results fetched; appended to `items` array
6. `loading = false`: spinner hidden
7. If `totalPages = 2`: `hasMore = false`; "You've reached the end" shown; no further fetch

**Expected outcome**: Seamless content append; no page reload; end state clearly communicated.

---

## Scenario 5: Filter change resets infinite scroll

**Setup**: User on Top Rated page at page 3, 60 movies loaded. Changes country filter.

**Flow**:
1. `ContentFilterContext.filterKey` changes
2. `useInfiniteMovies` `useEffect([filterKey])` fires: `setItems([])`, `setPage(1)`
3. First page of filtered results fetched and displayed
4. Scroll position resets to top

**Expected outcome**: Filter change resets list to beginning with filtered results.

---

## Scenario 6: Watch providers show for active country

**Setup**: User's country filter = `['FR']` (France). User opens a movie detail page.

**Flow**:
1. `WatchProvidersSection` fetches `getWatchProviders(movieId)`
2. Looks up `results['FR']` from response
3. If `flatrate` exists: renders Netflix/Disney+/etc. logos in a row
4. Clicking a logo: opens `results['FR'].link` in new tab

**Expected outcome**: French streaming providers shown; click navigates to JustWatch-powered provider page.

---

## Scenario 7: Launch animation plays once then never again

**Setup**: User opens CineScope for the first time (fresh tab, sessionStorage empty).

**Flow**:
1. `App.tsx` checks `sessionStorage.getItem('cinescope_launched')` → `null`
2. Renders `<LaunchScreen onComplete={...} />` (full-screen logo animation)
3. Animation completes (3s) → `onComplete()` called
4. `sessionStorage.setItem('cinescope_launched', '1')` → main app shown
5. User navigates Home → Trending → Home: no animation replay
6. User opens a new tab: sessionStorage is isolated → animation plays again

**Expected outcome**: Animation plays once per tab session; navigating in-app does not replay it.

---

## Scenario 8: Hard refresh on Trending page works

**Setup**: Production GitHub Pages deployment. User navigates to `https://nishant-nagose.github.io/cinescope-vod-sdd/trending` and hard-refreshes.

**Flow**:
1. GitHub Pages can't find `/cinescope-vod-sdd/trending` as a file → loads `404.html`
2. `404.html` script encodes `trending` into `?/trending` and redirects to `index.html?/trending`
3. `index.html` restore script decodes `?/trending` → calls `history.replaceState` to `/cinescope-vod-sdd/trending`
4. React app boots → React Router sees `/trending` → renders `TrendingPage`

**Expected outcome**: Trending page renders correctly; user sees no error; URL bar shows correct path.

---

## Scenario 9: Filter dropdown search narrows options

**Setup**: Country filter dropdown is open. Full list of ~200 countries shown.

**Flow**:
1. User types "Ger" into the search input inside the dropdown
2. Options list filters in real time to show "Germany", "German Democratic Republic" (if present)
3. User selects "Germany" → `DE` added to active countries
4. User clears search field → full 200-country list restored

**Expected outcome**: Typing narrows list instantly; clearing restores all options; no full-page interaction.
