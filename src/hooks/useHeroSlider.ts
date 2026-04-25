import { useState, useEffect } from 'react'
import { Movie, TVShow } from '../types/tmdb'
import { getHeroMovies, getHeroShows } from '../services/tmdbApi'
import { useContentFilter } from '../context/ContentFilterContext'

export type HeroItem = (Movie & { mediaType: 'movie' }) | (TVShow & { mediaType: 'tv' })

const mergeWithRegionalPriority = <T extends { id: number }>(
  global: T[],
  regional: T[]
): T[] => {
  const seen = new Set(regional.map(i => i.id))
  const extras = global.filter(i => !seen.has(i.id))
  return [...regional, ...extras]
}

export const useHeroSlider = () => {
  const [items, setItems] = useState<HeroItem[]>([])
  const [loading, setLoading] = useState(true)
  const { contentType, countries } = useContentFilter()
  const region = countries[0] ?? null

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    const fetchMovies = contentType !== 'shows'
    const fetchShows  = contentType !== 'movies'
    const regionFilter = region ? { countries: [region], languages: [] } : undefined

    Promise.all([
      fetchMovies ? getHeroMovies() : Promise.resolve({ results: [] }),
      fetchMovies && region ? getHeroMovies(regionFilter) : Promise.resolve({ results: [] }),
      fetchShows  ? getHeroShows()  : Promise.resolve({ results: [] }),
      fetchShows  && region ? getHeroShows(regionFilter)  : Promise.resolve({ results: [] }),
    ])
      .then(([globalMoviesResp, regionalMoviesResp, globalShowsResp, regionalShowsResp]) => {
        if (cancelled) return

        const globalMovies: HeroItem[]   = (globalMoviesResp.results   ?? []).map(m => ({ ...m, mediaType: 'movie' as const }))
        const regionalMovies: HeroItem[] = (regionalMoviesResp.results ?? []).map(m => ({ ...m, mediaType: 'movie' as const }))
        const globalShows: HeroItem[]    = (globalShowsResp.results    ?? []).map(s => ({ ...s, mediaType: 'tv' as const }))
        const regionalShows: HeroItem[]  = (regionalShowsResp.results  ?? []).map(s => ({ ...s, mediaType: 'tv' as const }))

        const movies = fetchMovies ? mergeWithRegionalPriority(globalMovies, regionalMovies) : []
        const shows  = fetchShows  ? mergeWithRegionalPriority(globalShows,  regionalShows)  : []

        // Interleave movies + shows, deduplicate by ID, cap at 10
        const seen = new Set<number>()
        const merged: HeroItem[] = []
        for (let i = 0; i < Math.max(movies.length, shows.length) && merged.length < 10; i++) {
          if (i < movies.length && !seen.has(movies[i].id)) {
            seen.add(movies[i].id)
            merged.push(movies[i])
          }
          if (merged.length < 10 && i < shows.length && !seen.has(shows[i].id)) {
            seen.add(shows[i].id)
            merged.push(shows[i])
          }
        }

        setItems(merged)
      })
      .catch(() => { if (!cancelled) setItems([]) })
      .finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [contentType, region])

  return { items, loading }
}
