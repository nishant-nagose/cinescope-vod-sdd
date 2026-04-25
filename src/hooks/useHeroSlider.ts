import { useState, useEffect } from 'react'
import { Movie, TVShow } from '../types/tmdb'
import { getHeroMovies, getHeroShows, discoverMovies, discoverTV } from '../services/tmdbApi'
import { useContentFilter } from '../context/ContentFilterContext'
import { GENRE_KEY_MAP } from '../utils/genreKeyMap'
import { GENRE_MOVIE_IDS, GENRE_SHOW_IDS } from '../config/carouselPool'

export type HeroItem = (Movie & { mediaType: 'movie' }) | (TVShow & { mediaType: 'tv' })

const mergeWithRegionalPriority = <T extends { id: number }>(
  global: T[],
  regional: T[]
): T[] => {
  const seen = new Set(regional.map(i => i.id))
  const extras = global.filter(i => !seen.has(i.id))
  return [...regional, ...extras]
}

const interleave = (movies: HeroItem[], shows: HeroItem[], cap = 10): HeroItem[] => {
  const seen = new Set<number>()
  const merged: HeroItem[] = []
  for (let i = 0; i < Math.max(movies.length, shows.length) && merged.length < cap; i++) {
    if (i < movies.length && !seen.has(movies[i].id)) {
      seen.add(movies[i].id)
      merged.push(movies[i])
    }
    if (merged.length < cap && i < shows.length && !seen.has(shows[i].id)) {
      seen.add(shows[i].id)
      merged.push(shows[i])
    }
  }
  return merged
}

export const useHeroSlider = () => {
  const [items, setItems] = useState<HeroItem[]>([])
  const [loading, setLoading] = useState(true)
  const { contentType, countries, activeCategory } = useContentFilter()
  const region = countries[0] ?? null

  const activeGenreKey = activeCategory !== null ? (GENRE_KEY_MAP[activeCategory] ?? null) : null

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    const fetchMovies = contentType !== 'shows'
    const fetchShows  = contentType !== 'movies'
    const regionFilter = region ? { countries: [region], languages: [] } : undefined

    if (activeGenreKey) {
      // Genre active: fetch genre-specific popular content (2 calls)
      const movieId = GENRE_MOVIE_IDS[activeGenreKey]
      const showId  = GENRE_SHOW_IDS[activeGenreKey]
      const rFilter = regionFilter ?? { countries: [], languages: [] }

      Promise.all([
        fetchMovies && movieId
          ? discoverMovies({ with_genres: movieId, sort_by: 'popularity.desc', 'vote_count.gte': '50' }, 1, rFilter)
          : Promise.resolve({ results: [] }),
        fetchShows && showId
          ? discoverTV({ with_genres: showId, sort_by: 'popularity.desc', 'vote_count.gte': '20' }, 1, rFilter)
          : Promise.resolve({ results: [] }),
      ])
        .then(([moviesResp, showsResp]) => {
          if (cancelled) return
          const movies: HeroItem[] = fetchMovies
            ? (moviesResp.results ?? []).map((m: Movie) => ({ ...m, mediaType: 'movie' as const }))
            : []
          const shows: HeroItem[] = fetchShows
            ? (showsResp.results ?? []).map((s: TVShow) => ({ ...s, mediaType: 'tv' as const }))
            : []
          setItems(interleave(movies, shows))
        })
        .catch(() => { if (!cancelled) setItems([]) })
        .finally(() => { if (!cancelled) setLoading(false) })
    } else {
      // No genre: recent releases with regional priority (4 calls)
      Promise.all([
        fetchMovies ? getHeroMovies() : Promise.resolve({ results: [] }),
        fetchMovies && region ? getHeroMovies(regionFilter) : Promise.resolve({ results: [] }),
        fetchShows  ? getHeroShows()  : Promise.resolve({ results: [] }),
        fetchShows  && region ? getHeroShows(regionFilter)  : Promise.resolve({ results: [] }),
      ])
        .then(([globalMoviesResp, regionalMoviesResp, globalShowsResp, regionalShowsResp]) => {
          if (cancelled) return

          const globalMovies: HeroItem[]   = (globalMoviesResp.results   ?? []).map((m: Movie) => ({ ...m, mediaType: 'movie' as const }))
          const regionalMovies: HeroItem[] = (regionalMoviesResp.results ?? []).map((m: Movie) => ({ ...m, mediaType: 'movie' as const }))
          const globalShows: HeroItem[]    = (globalShowsResp.results    ?? []).map((s: TVShow) => ({ ...s, mediaType: 'tv' as const }))
          const regionalShows: HeroItem[]  = (regionalShowsResp.results  ?? []).map((s: TVShow) => ({ ...s, mediaType: 'tv' as const }))

          const movies = fetchMovies ? mergeWithRegionalPriority(globalMovies, regionalMovies) : []
          const shows  = fetchShows  ? mergeWithRegionalPriority(globalShows,  regionalShows)  : []

          setItems(interleave(movies, shows))
        })
        .catch(() => { if (!cancelled) setItems([]) })
        .finally(() => { if (!cancelled) setLoading(false) })
    }

    return () => { cancelled = true }
  }, [contentType, region, activeGenreKey])

  return { items, loading }
}
