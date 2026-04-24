import { useState, useEffect } from 'react'
import { TVShowDetails, CreditsResponse, TVShowListResponse } from '../types/tmdb'
import { getShowDetails, getShowCredits, getSimilarShows } from '../services/tmdbApi'

interface ShowDetailsState {
  show: TVShowDetails | null
  credits: CreditsResponse | null
  similarShows: TVShowListResponse | null
  loading: boolean
  error: string | null
}

export const useShowDetails = (showId: number) => {
  const [state, setState] = useState<ShowDetailsState>({
    show: null,
    credits: null,
    similarShows: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    let cancelled = false
    setState({ show: null, credits: null, similarShows: null, loading: true, error: null })

    Promise.all([
      getShowDetails(showId),
      getShowCredits(showId),
      getSimilarShows(showId),
    ])
      .then(([show, credits, similarShows]) => {
        if (!cancelled) setState({ show, credits, similarShows, loading: false, error: null })
      })
      .catch(err => {
        if (!cancelled) setState({ show: null, credits: null, similarShows: null, loading: false, error: err instanceof Error ? err.message : 'Failed to load show' })
      })

    return () => { cancelled = true }
  }, [showId])

  return state
}
