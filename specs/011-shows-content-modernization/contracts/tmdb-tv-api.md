# API Contracts: TMDB TV Show Endpoints

**Branch**: `021-shows-modernization` | **Date**: 2026-04-23

All endpoints are additions to `src/services/tmdbApi.ts`. Authentication uses the existing `VITE_TMDB_API_KEY` env variable. Caching uses the existing `src/services/cache.ts` TTL cache (5-min TTL). Error handling follows the existing `src/services/errorHandling.ts` pattern.

Base URL: `https://api.themoviedb.org/3`

---

## TV Show List Endpoints

### `getTrendingTVDaily(page?: number, filter?: ContentFilterParams): Promise<TVShowListResponse>`

```
GET /trending/tv/day?page={page}&language={filter.language}
```

Cache key: `trending-tv-daily-{page}-{language}`
Rate limit: shared 40 req/10s pool

---

### `getTrendingTVWeekly(page?: number, filter?: ContentFilterParams): Promise<TVShowListResponse>`

```
GET /trending/tv/week?page={page}&language={filter.language}
```

Cache key: `trending-tv-weekly-{page}-{language}`

---

### `getTopRatedTV(page?: number, filter?: ContentFilterParams): Promise<TVShowListResponse>`

```
GET /tv/top_rated?page={page}&language={filter.language}&region={filter.country}
```

Cache key: `top-rated-tv-{page}-{language}-{country}`

---

### `getNewShows(page?: number, filter?: ContentFilterParams): Promise<TVShowListResponse>`

```
GET /discover/tv
  ?sort_by=first_air_date.desc
  &first_air_date.lte={today}
  &first_air_date.gte={90 days ago}
  &vote_count.gte=10
  &page={page}
  &language={filter.language}
  &with_origin_country={filter.country}
```

Cache key: `new-shows-{page}-{language}-{country}`

---

### `getRecommendedShows(page?: number, filter?: ContentFilterParams): Promise<TVShowListResponse>`

```
GET /discover/tv
  ?sort_by=popularity.desc
  &vote_count.gte=100
  &vote_average.gte=7
  &page={page}
  &language={filter.language}
```

Cache key: `recommended-shows-{page}-{language}`

---

### `getCriticallyAcclaimedShows(page?: number, filter?: ContentFilterParams): Promise<TVShowListResponse>`

```
GET /discover/tv
  ?sort_by=vote_average.desc
  &vote_count.gte=200
  &vote_average.gte=8
  &page={page}
  &language={filter.language}
```

Cache key: `critically-acclaimed-shows-{page}-{language}`

---

### `getShowsByGenre(genreId: number | string, page?: number, filter?: ContentFilterParams): Promise<TVShowListResponse>`

```
GET /discover/tv
  ?with_genres={genreId}
  &sort_by=popularity.desc
  &vote_count.gte=50
  &page={page}
  &language={filter.language}
  &with_original_language={filter.language}
```

Cache key: `shows-genre-{genreId}-{page}-{language}`

**Genre IDs for show carousels**:

| Carousel | Genre ID(s) |
|----------|-------------|
| Need a Good Laugh (Comedy) | 35 |
| Sci-Fi & Fantasy | 10765 |
| Shows Based on Real Life (Documentary) | 99 |
| Anime & Animation | 16 |
| Romantic | 10749 |
| Action & Adventure | 10759 |
| Inspiring (Drama + Family) | 18, 10751 |
| Chilling Thriller (Mystery + Crime) | 9648, 80 |

---

### `getAwardWinningShows(page?: number, filter?: ContentFilterParams): Promise<TVShowListResponse>`

```
GET /discover/tv
  ?sort_by=vote_average.desc
  &vote_count.gte=500
  &vote_average.gte=8
  &page={page}
  &language={filter.language}
```

Cache key: `award-winning-shows-{page}-{language}`

---

### `getUpcomingShows(page?: number): Promise<TVShowListResponse>`

```
GET /discover/tv
  ?sort_by=first_air_date.asc
  &first_air_date.gte={tomorrow}
  &page={page}
```

Cache key: `upcoming-shows-{page}`

---

### `getUpcomingMovies(page?: number): Promise<TrendingResponse>`

```
GET /movie/upcoming?page={page}&language=en-US
```

Cache key: `upcoming-movies-{page}`

---

## TV Show Detail Endpoints

### `getShowDetails(id: number): Promise<TVShowDetails>`

```
GET /tv/{id}?language=en-US
```

Cache key: `show-details-{id}`

**Response includes**: `seasons` (SeasonSummary[]) but NOT episode lists.

---

### `getShowCredits(id: number): Promise<CreditsResponse>`

```
GET /tv/{id}/credits?language=en-US
```

Cache key: `show-credits-{id}`

Response shape identical to movie credits — reuse existing `CreditsResponse` type.

---

### `getSimilarShows(id: number, page?: number): Promise<TVShowListResponse>`

```
GET /tv/{id}/similar?page={page}&language=en-US
```

Cache key: `similar-shows-{id}-{page}`

---

### `getSeasonDetails(showId: number, seasonNumber: number): Promise<SeasonDetails>`

```
GET /tv/{showId}/season/{seasonNumber}?language=en-US
```

Cache key: `season-{showId}-{seasonNumber}`

**Note**: Fetched on demand (user selects a season) — do NOT prefetch all seasons.

---

## Unified Search Endpoint

### `searchMulti(query: string, page?: number): Promise<MultiSearchResult>`

```
GET /search/multi?query={query}&page={page}&language=en-US
```

Cache key: `search-multi-{query}-{page}`

**Client-side filtering**: Filter results where `media_type !== 'person'`. Return only `movie` and `tv` results.

---

## Hero Slider Endpoint Strategy

The hero slider content is assembled client-side from three parallel calls:

```
1. GET /trending/movie/day          → top 5 by popularity
2. GET /trending/tv/day             → top 5 by popularity
Merge → deduplicate by id+mediaType → sort by popularity → cap at 10
```

All three calls use existing cache keys. No new endpoint required.

---

## Error Handling Contract

All new functions follow the existing pattern in `tmdbApi.ts`:

- Network/HTTP errors → rethrow with descriptive message
- Empty results (`results.length === 0`) → return empty response (not an error)
- TMDB 404 → throw `Error('Show not found')`
- Rate limit (429) → handled by existing retry logic in `useApi.ts`

When a carousel's API call fails:
- The hook returns `error: string` (non-null)
- `MovieCarousel` receives `error` prop → hides carousel → shows subtle retry button
- `onRetry` prop calls the hook's `refetch` function (FR-034)
