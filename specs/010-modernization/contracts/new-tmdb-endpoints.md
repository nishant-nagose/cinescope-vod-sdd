# API Contracts: New TMDB Endpoints

**Feature**: CineScope App Modernization  
**Branch**: `019-modernization`

These contracts define the new TMDB API endpoints added to `src/services/tmdbApi.ts` and the TypeScript function signatures that wrap them.

---

## getMovieVideos

**Purpose**: Fetch all trailers, clips, and teasers for a movie.

```typescript
getMovieVideos(movieId: number): Promise<MovieVideosResponse>
```

**TMDB Endpoint**: `GET /movie/{movieId}/videos`  
**Params**: `api_key` only  
**Response**: `MovieVideosResponse` (`{ id, results: MovieVideo[] }`)

**Consumer ordering**:
- Hero auto-play: first `official Trailer` where `site === 'YouTube'`
- Trailers & Clips section: all results where `site === 'YouTube'`, ordered Trailers → Clips → Teasers

---

## getWatchProviders

**Purpose**: Fetch streaming, rental, and purchase providers for a movie in a specific country.

```typescript
getWatchProviders(movieId: number): Promise<WatchProvidersResponse>
```

**TMDB Endpoint**: `GET /movie/{movieId}/watch/providers`  
**Params**: `api_key` only  
**Response**: `WatchProvidersResponse` (`{ id, results: Record<string, WatchProvidersForCountry> }`)

**Consumer usage**: Caller selects country key from `ContentFilterContext.countries[0]` (defaulting to `'US'` if empty). Display `flatrate` first, then `rent`, then `buy`.

---

## getPersonMovieCredits

**Purpose**: Fetch a person's full filmography (movies they acted in or worked on as crew).

```typescript
getPersonMovieCredits(personId: number): Promise<PersonMovieCredits>
```

**TMDB Endpoint**: `GET /person/{personId}/movie_credits`  
**Params**: `api_key` only  
**Response**: `PersonMovieCredits` (`{ id, cast: PersonMovieCredit[], crew: PersonMovieCredit[] }`)

**Consumer usage**: Filmography section shows top 10 by popularity from `cast` (for actors) or from `crew` (for director/producer, filtered by relevant `job`).

---

## getDailyTrending

**Purpose**: Fetch daily trending movies (source for "Today's Top 10 Movies").

```typescript
getDailyTrending(page?: number): Promise<DiscoverResponse>
```

**TMDB Endpoint**: `GET /trending/movie/day`  
**Params**: `api_key`, `page` (default 1)  
**Response**: `DiscoverResponse`

**Consumer usage**: Take `results.slice(0, 10)`. Country/language filter applied client-side (endpoint does not support filter params).

---

## getWeeklyTrending

**Purpose**: Fetch weekly trending movies (source for "Weekly Top 10 Movies").

```typescript
getWeeklyTrending(page?: number): Promise<DiscoverResponse>
```

**TMDB Endpoint**: `GET /trending/movie/week`  
**Params**: `api_key`, `page` (default 1)  
**Response**: `DiscoverResponse`

**Consumer usage**: Take `results.slice(0, 10)`. Country/language filter applied client-side.

---

## New Discover Variants (genre-based carousels)

All use the existing `apiRequest('/discover/movie', params)` helper. Each exported function follows this signature:

```typescript
(page?: number, filter?: ContentFilterParams) => Promise<DiscoverResponse>
```

| Function | `with_genres` | Additional Params |
|---|---|---|
| `getComedyMovies` | `35` | — |
| `getSciFiFantasyMovies` | `878,14` | — |
| `getRealLifeMovies` | `36,99` | — |
| `getAnimationMovies` | `16` | — |
| `getRomanceMovies` | `10749` | — |
| `getActionAdventureMovies` | `28,12` | — |
| `getAwardWinningMovies` | — | `sort_by=vote_average.desc`, `vote_count.gte=500` |
| `getInspiringMovies` | `18,10751` | — |
| `getThrillerMovies` | `53` | — |
