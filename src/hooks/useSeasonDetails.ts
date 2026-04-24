import { useState, useEffect } from 'react'
import { SeasonDetails } from '../types/tmdb'
import { getSeasonDetails } from '../services/tmdbApi'

interface SeasonDetailsState {
  season: SeasonDetails | null
  loading: boolean
  error: string | null
}

export const useSeasonDetails = (showId: number, seasonNumber: number | null) => {
  const [state, setState] = useState<SeasonDetailsState>({ season: null, loading: false, error: null })

  useEffect(() => {
    if (seasonNumber === null) return
    let cancelled = false
    setState({ season: null, loading: true, error: null })

    getSeasonDetails(showId, seasonNumber)
      .then(season => { if (!cancelled) setState({ season, loading: false, error: null }) })
      .catch(err => { if (!cancelled) setState({ season: null, loading: false, error: err instanceof Error ? err.message : 'Failed to load season' }) })

    return () => { cancelled = true }
  }, [showId, seasonNumber])

  return state
}
