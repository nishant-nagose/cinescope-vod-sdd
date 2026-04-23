import { useState, useEffect } from 'react'
import { getMovieDetails, getMovieCredits, getSimilarMovies } from '../services/tmdbApi'
import { MovieDetails, CastMember, CrewMember, Movie, CreditsResponse, SimilarMoviesResponse } from '../types/tmdb'

interface UseMovieDetailsResult {
  movie: MovieDetails | null
  cast: CastMember[]
  crew: CrewMember[]
  similar: Movie[]
  loading: boolean
  error: string | null
}

export const useMovieDetails = (id: string): UseMovieDetailsResult => {
  const [movie, setMovie] = useState<MovieDetails | null>(null)
  const [cast, setCast] = useState<CastMember[]>([])
  const [crew, setCrew] = useState<CrewMember[]>([])
  const [similar, setSimilar] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    let cancelled = false

    setLoading(true)
    setError(null)

    Promise.all([
      getMovieDetails(Number(id)),
      getMovieCredits(Number(id)),
      getSimilarMovies(Number(id)),
    ])
      .then(([movieData, creditsData, similarData]: [MovieDetails, CreditsResponse, SimilarMoviesResponse]) => {
        if (!cancelled) {
          setMovie(movieData)
          setCast((creditsData.cast || []).slice(0, 10))
          setCrew(creditsData.crew || [])
          setSimilar((similarData.results || []).slice(0, 5))
          setLoading(false)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError('Something went wrong')
          setLoading(false)
        }
      })

    return () => { cancelled = true }
  }, [id])

  return { movie, cast, crew, similar, loading, error }
}
