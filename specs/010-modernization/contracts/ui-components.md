# UI Component Contracts: CineScope App Modernization

**Feature**: CineScope App Modernization  
**Branch**: `019-modernization`

Defines props interfaces for all new and significantly modified React components.

---

## HeroSlider

`src/components/HeroSlider.tsx`

```typescript
interface HeroSliderProps {
  movies: Movie[]         // Exactly 10 movies from daily trending
  loading: boolean
}
```

- Auto-advances every 6 seconds
- Each slide: full-width backdrop, gradient overlay, title, rating, CTA button → `/movie/{id}`
- Loads trailer for active slide on mount/slide-change (lazy)
- Video: YouTube iframe, muted, autoplay, with unmute toggle

---

## RankedMovieCard

`src/components/RankedMovieCard.tsx`

```typescript
interface RankedMovieCardProps {
  movie: Movie
  rank: number    // 1–10; displayed bottom-left of poster
}
```

- Extends existing `MovieCard` styling
- Rank number: large text with outline/stroke style (e.g. `text-6xl font-black text-white [text-stroke]` or SVG gradient numeral)
- Positioned absolute, bottom-left corner of the poster image
- Links to `/movie/{id}`

---

## TrailerPlayer

`src/components/TrailerPlayer.tsx`

```typescript
interface TrailerPlayerProps {
  videoKey: string          // YouTube video ID
  autoplay?: boolean        // default false
  muted?: boolean           // default true
  title?: string            // accessible label
  onClose?: () => void      // optional close handler for modal use
}
```

- Renders `<iframe>` with YouTube embed URL
- Supports both inline (Trailers section) and autoplay (detail page hero) modes
- Aspect ratio: 16:9 (responsive)

---

## TrailersSection

`src/components/TrailersSection.tsx`

```typescript
interface TrailersSectionProps {
  movieId: number
}
```

- Fetches `useMovieVideos(movieId)` internally
- Shows loading skeleton while fetching
- Renders a horizontal scrollable list of trailer thumbnail cards
- Clicking a thumbnail opens `TrailerPlayer` in an inline expanded state or modal

---

## FilmographySection

`src/components/FilmographySection.tsx`

```typescript
interface FilmographySectionProps {
  cast: CastMember[]    // top 5 cast from existing CreditsResponse
  crew: CrewMember[]    // director + producer from existing CreditsResponse
}
```

- Shows sub-sections per person: "Films with [Name]"
- Each person's section fetches `usePersonCredits(personId)` lazily (IntersectionObserver trigger)
- Shows top 5 movies per person (by popularity), linking to `/movie/{id}`
- Collapses to show first person by default; expand to show others

---

## WatchProvidersSection

`src/components/WatchProvidersSection.tsx`

```typescript
interface WatchProvidersSectionProps {
  movieId: number
}
```

- Fetches `useWatchProviders(movieId)` internally
- Uses `ContentFilterContext.countries[0]` (or `'US'` as default) as country key
- Displays provider logos only (no text), in a row
- Clicking a logo opens `provider.link` in a new tab
- If no providers: show "Not available for streaming in your region"

---

## LaunchScreen

`src/components/LaunchScreen.tsx`

```typescript
interface LaunchScreenProps {
  onComplete: () => void    // called when animation finishes
}
```

- Full-screen dark overlay
- CineScope logo centered, animated (fade-in + scale-up + glow, ~3s total)
- Calls `onComplete()` after animation via `onAnimationEnd` or `setTimeout`

---

## InfiniteScrollTrigger

`src/components/InfiniteScrollTrigger.tsx`

```typescript
interface InfiniteScrollTriggerProps {
  onIntersect: () => void
  hasMore: boolean
  loading: boolean
}
```

- Renders a `<div ref={sentinelRef}>` observed by IntersectionObserver
- When intersecting AND `hasMore` AND NOT `loading`: calls `onIntersect`
- Shows loading spinner when `loading === true`
- Shows "You've reached the end" message when `hasMore === false`

---

## MovieCarousel (modified)

`src/components/MovieCarousel.tsx`

Added prop:
```typescript
rankDisplay?: boolean   // if true, renders RankedMovieCard instead of MovieCard
maxItems?: number       // slices movies array to this length before rendering
```

---

## ContentFilterBar (modified)

`src/components/ContentFilterBar.tsx`

Position change: moved to right of search bar (Layout.tsx update).  
New prop:
```typescript
compact?: boolean  // default true — reduces dropdown button size
```

New internal feature:
- Search input inside each dropdown panel, with real-time filtering of options list
