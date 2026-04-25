import { memo, useState, useRef, useCallback, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Movie } from '../types/tmdb'
import { getImageUrl, getMovieVideos } from '../services/tmdbApi'
import { HoverPreviewCard } from './HoverPreviewCard'

interface MovieCardProps {
  movie: Movie
}

export const MovieCard = memo(({ movie }: MovieCardProps) => {
  const posterUrl = getImageUrl(movie.poster_path, 'w342')
  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'TBA'

  const [previewRect, setPreviewRect] = useState<DOMRect | null>(null)
  const hoverTimerRef   = useRef<ReturnType<typeof setTimeout> | null>(null)
  const dismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const videoKeyRef     = useRef<string | null | undefined>(undefined) // undefined = not yet fetched
  const cardRef         = useRef<HTMLDivElement>(null)

  // Dismiss preview on scroll to avoid stale positions
  useEffect(() => {
    if (!previewRect) return
    const onScroll = () => setPreviewRect(null)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [previewRect])

  const cancelDismiss = useCallback(() => {
    if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current)
  }, [])

  const scheduleDismiss = useCallback(() => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current)
    dismissTimerRef.current = setTimeout(() => setPreviewRect(null), 150)
  }, [])

  const handleMouseEnter = useCallback(() => {
    if (window.innerWidth < 1024) return
    cancelDismiss()

    // Pre-fetch trailer key (once per card mount)
    if (videoKeyRef.current === undefined) {
      videoKeyRef.current = null
      getMovieVideos(movie.id)
        .then(resp => {
          const t = resp.results.find(v => v.site === 'YouTube' && v.type === 'Trailer' && v.official)
            ?? resp.results.find(v => v.site === 'YouTube' && v.type === 'Trailer')
          videoKeyRef.current = t?.key ?? null
        })
        .catch(() => { videoKeyRef.current = null })
    }

    hoverTimerRef.current = setTimeout(() => {
      if (!cardRef.current) return
      setPreviewRect(cardRef.current.getBoundingClientRect())
    }, 3500)
  }, [movie.id, cancelDismiss])

  const handleMouseLeave = useCallback(() => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current)
    scheduleDismiss()
  }, [scheduleDismiss])

  return (
    <div
      ref={cardRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        to={`/movie/${movie.id}`}
        className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 block"
      >
        <div className="aspect-[2/3] relative">
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={movie.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gray-700 flex items-center justify-center">
              <span className="text-gray-400 text-sm">No Image</span>
            </div>
          )}
          <div className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-black bg-opacity-75 text-white px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-xs sm:text-sm font-medium">
            {movie.vote_average.toFixed(1)}
          </div>
        </div>
        <div className="p-2 sm:p-3">
          <h3 className="font-semibold text-white mb-1 line-clamp-2 text-xs sm:text-sm">{movie.title}</h3>
          <p className="text-gray-400 text-xs sm:text-sm">{releaseYear}</p>
        </div>
      </Link>

      {previewRect && (
        <HoverPreviewCard
          id={movie.id}
          title={movie.title}
          overview={movie.overview}
          posterPath={movie.poster_path}
          backdropPath={movie.backdrop_path}
          voteAverage={movie.vote_average}
          year={movie.release_date?.slice(0, 4) ?? ''}
          mediaType="movie"
          videoKey={videoKeyRef.current ?? null}
          targetRect={previewRect}
          onMouseEnter={cancelDismiss}
          onMouseLeave={scheduleDismiss}
        />
      )}
    </div>
  )
})
