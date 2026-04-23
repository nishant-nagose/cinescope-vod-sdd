# Research: CineScope App Modernization

**Branch**: `019-modernization` | **Date**: 2026-04-23 | **Spec**: [spec.md](spec.md)

## 1. TMDB Movie Videos API

**Decision**: Use `GET /movie/{id}/videos` to source trailers and clips.

**Rationale**: TMDB returns a `results` array where each entry has `key` (YouTube video ID), `site` (YouTube or Vimeo), `type` (Trailer, Clip, Teaser, Behind the Scenes, etc.), and `official` boolean. Filter to `site === 'YouTube'` first for reliable embeds. For auto-play after 10s, use the first `official` Trailer; for the Trailers & Clips section, show all results ordered by type (Trailers first, then Clips, then Teasers).

**Alternatives considered**:
- Vimeo embeds: Fewer movies have Vimeo trailers; YouTube coverage is near-universal.
- Direct MP4 streaming: Not available via TMDB free tier.

**YouTube Embed URL Pattern**:
```
https://www.youtube.com/embed/{key}?autoplay=1&mute=1&playsinline=1&enablejsapi=1
```
Adding `mute=1` satisfies browser autoplay policies. The `enablejsapi=1` allows programmatic unmute via `postMessage`.

---

## 2. YouTube Autoplay Policy

**Decision**: Default all auto-playing video iframes to muted (`mute=1`). Provide a visible unmute toggle.

**Rationale**: Modern browsers (Chrome 66+, Safari 12.1+, Firefox 66+) block autoplay of audio-carrying video unless triggered by explicit user gesture. Muted autoplay is universally permitted. The hero slider and the 10-second movie detail auto-play both use muted defaults. Users can unmute with a single click.

**Alternatives considered**:
- Play only on user click: Too passive for a premium OTT-style experience.
- `<video>` tag with TMDB-hosted clips: Not available on free TMDB tier.

---

## 3. TMDB Watch Providers API

**Decision**: Use `GET /movie/{id}/watch/providers` and display provider logos with the `link` field as the navigation target.

**Rationale**: TMDB's Watch Providers endpoint (powered by JustWatch) returns streaming, rental, and purchase options per country code. The `link` field in each country's object is a JustWatch URL that redirects to the specific movie on the provider's platform. This is the closest available mechanism to "navigate to the provider's official movie page" without requiring each provider's internal movie ID.

**Response structure per country code**:
```typescript
{
  link: string           // JustWatch URL → redirects to provider's movie page
  flatrate?: Provider[]  // Streaming subscription options
  rent?: Provider[]      // Rental options
  buy?: Provider[]       // Purchase options
}
interface Provider {
  logo_path: string
  provider_id: number
  provider_name: string
  display_priority: number
}
```

**Implementation**: Display `flatrate` providers first, then `rent`, then `buy`. Use the active country filter (from `ContentFilterContext`) as the country code lookup key. If no providers exist for that country, show an empty state.

**Alternatives considered**:
- Show TMDB's own movie watch page: Available but doesn't send users directly to the provider.
- Custom provider database: Out of scope; requires maintenance.

---

## 4. TMDB Person Credits (Filmography)

**Decision**: Use `GET /person/{id}/movie_credits` for filmography data.

**Rationale**: For each key person on a movie's credit list (top 5 cast + director + producer), fetch their movie credits and display the top 10 by popularity. Filmography covers both `cast` (acting roles) and `crew` (directing/producing roles). Fetch is triggered on-demand when the user scrolls to the Filmography section (lazy loading via IntersectionObserver).

**Alternatives considered**:
- Fetch all cast filmography at page load: Too many API calls; deferred fetch is more efficient.
- Show filmography from the credits response alone: `/movie/{id}/credits` doesn't include other works.

---

## 5. Daily and Weekly Trending Endpoints

**Decision**: Use `/trending/movie/day` for "Today's Top 10" and `/trending/movie/week` for "Weekly Top 10".

**Rationale**: These dedicated trending endpoints return authentic trending data ranked by user engagement (views, searches, ratings interactions) over the day/week window. The existing `/discover/movie?sort_by=popularity.desc` is a good approximation for general popularity but does not reflect the same time-windowed trending signal.

**Note**: These endpoints do not support country/language filter params (`with_origin_country`, `with_original_language`). Client-side filtering will be applied using the active `ContentFilterContext` values, consistent with how the search page handles this limitation.

**Both sections**: Limit to exactly 10 results (slice after fetch, or `page_size` is fixed at 20 from TMDB — take `results.slice(0, 10)`).

---

## 6. Infinite Scroll — IntersectionObserver Pattern

**Decision**: Use the browser's `IntersectionObserver` API with a sentinel `<div>` at the bottom of each list.

**Rationale**: IntersectionObserver fires a callback when the sentinel element enters the viewport, triggering the next page fetch. This is performant (no scroll event listener polling), supported in all target browsers (Chrome 58+, Firefox 55+, Safari 12.1+), and cleanly composable as a custom hook `useInfiniteScroll`.

**Hook interface**:
```typescript
interface UseInfiniteScrollOptions {
  fetchMore: () => void
  hasMore: boolean
  loading: boolean
}
const { sentinelRef } = useInfiniteScroll({ fetchMore, hasMore, loading })
// Render: <div ref={sentinelRef} />
```

**Page accumulation**: Each page fetch appends to an existing `items` array. On filter change, reset `items = []` and `page = 1`.

**Alternatives considered**:
- `scroll` event listener: Polling-based; less performant; deprecated pattern.
- `react-infinite-scroll-component` library: Adds a dependency; native API is sufficient.
- `react-virtualized` / windowing: Overkill for this scale; adds complexity.

---

## 7. GitHub Pages 404 / Hard Refresh Fix

**Decision**: Implement the spa-github-pages redirect pattern: `public/404.html` encodes the path into the URL query string; `index.html` decodes and restores the path via `window.history.replaceState`.

**Rationale**: GitHub Pages serves static files and returns a 404 for any path that doesn't map to a real file. For SPAs with React Router, paths like `/trending` or `/movie/123` don't correspond to files, causing 404 on refresh. The standard fix uses GitHub Pages' custom 404.html fallback: any 404 loads `404.html`, which immediately redirects to `index.html` with the original path encoded, and `index.html` restores it.

**`public/404.html`** (key script):
```html
<script>
  var segmentCount = 1; // = number of path segments in base path (cinescope-vod-sdd = 1)
  var l = window.location;
  l.replace(
    l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') +
    l.pathname.split('/').slice(0, 1 + segmentCount).join('/') + '/?/' +
    l.pathname.slice(1).split('/').slice(segmentCount).join('/').replace(/&/g, '~and~') +
    (l.search ? '&' + l.search.slice(1).replace(/&/g, '~and~') : '') +
    l.hash
  );
</script>
```

**`index.html`** (restore script, in `<head>`):
```html
<script>
  (function(l) {
    if (l.search[1] === '/') {
      var decoded = l.search.slice(1).split('&').map(function(s) {
        return s.replace(/~and~/g, '&');
      });
      window.history.replaceState(null, null,
        l.pathname.slice(0, -1) + decoded[0] +
        (decoded[1] ? '?' + decoded[1] : '') +
        l.hash
      );
    }
  }(window.location));
</script>
```

**Alternatives considered**:
- Server-side redirect rules (`_redirects`): Not supported on GitHub Pages.
- Hash-based routing (`/#/trending`): Would require rewriting all links and breaks bookmarkability.
- `vite-plugin-spa-fallback`: Only works in dev mode; doesn't affect GitHub Pages production.

---

## 8. Launch Animation Strategy

**Decision**: Implement a `LaunchScreen` component with CSS keyframe animation (fade-in + scale + glow). Track "has launched" in `sessionStorage` to prevent replay.

**Rationale**: `sessionStorage` persists for the browser tab session — it survives in-app navigation (React Router doesn't unload the page) but clears when the tab is closed or a new tab is opened. This matches the requirement: animation plays once per initial load, not on every navigate-to-home.

**Implementation**:
1. `App.tsx`: Check `sessionStorage.getItem('cinescope_launched')` on mount.
2. If not set: render `<LaunchScreen onComplete={() => { sessionStorage.setItem('cinescope_launched', '1'); setLaunched(true) }} />`
3. `LaunchScreen` runs a 3-second CSS animation (logo fade + scale + radial glow), then calls `onComplete`.
4. After `onComplete`, the main app renders normally with React Router.

**Animation duration**: 3 seconds total (0.5s fade-in, 1.5s hold, 1s fade-out with scale). Total experience ≤ 4 seconds per SC-008.

**Alternatives considered**:
- `localStorage`: Persists across sessions — animation would never play again after first visit.
- Route-based animation (`/launch` route): Complicates routing; back button could re-trigger.
- Framer Motion library: Adds ~30KB; CSS keyframes are sufficient for this use case.

---

## 9. Genre ID Mappings for New Carousel Sections

**Decision**: Map all 10 new genre-based carousels to TMDB genre IDs using the `/genre/movie/list` reference.

| Carousel Section | TMDB Strategy |
|---|---|
| New Movies on CineScope | `/discover/movie?sort_by=release_date.desc` (existing) |
| Today's Top 10 Movies | `/trending/movie/day` → slice top 10 |
| Weekly Top 10 Movies | `/trending/movie/week` → slice top 10 |
| Movies by Category | User-selected genre via dropdown (existing) |
| Recommended Movies | `/discover/movie?sort_by=popularity.desc` (existing trending) |
| Critically Acclaimed Movies | `/discover/movie?sort_by=vote_average.desc&vote_count.gte=300` (existing) |
| Need a Good Laugh? | `/discover/movie?with_genres=35` (Comedy) |
| Sci-Fi & Fantasy Movies | `/discover/movie?with_genres=878,14` (Sci-Fi + Fantasy) |
| Movies Based on Real Life | `/discover/movie?with_genres=36,99` (History + Documentary) |
| Anime & Animation Movies | `/discover/movie?with_genres=16` (Animation) |
| Romantic Movies | `/discover/movie?with_genres=10749` (Romance) |
| Action & Adventure Movies | `/discover/movie?with_genres=28,12` (Action + Adventure) |
| Award-Winning Movies | `/discover/movie?sort_by=vote_average.desc&vote_count.gte=500` |
| Inspiring Movies | `/discover/movie?with_genres=18,10751` (Drama + Family) |
| Chilling Thriller Movies | `/discover/movie?with_genres=53` (Thriller) |

**Note**: Daily/weekly trending endpoints don't support country/language filter params. Client-side filtering is applied for these two sections to maintain filter consistency.

---

## 10. Hero Slider Data Source

**Decision**: Source hero slider movies from `/trending/movie/day`, limited to 10 entries. Load trailer video keys lazily (one fetch per slide on activation) to avoid 10 simultaneous video API calls on page load.

**Rationale**: Daily trending movies are the most relevant featured content. Lazy trailer loading reduces initial API call count from 10+1 to 1+1 (list fetch + first slide trailer).

**Alternatives considered**:
- Pre-fetch all 10 trailers at load: 10 extra API calls; increases time to interactive.
- Use editorial/curated list: Requires backend; out of scope.
