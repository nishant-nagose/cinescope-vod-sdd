import { memo, useState, useRef, useCallback, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { TVShow } from '../types/tmdb'
import { getImageUrl, getShowVideos } from '../services/tmdbApi'
import { HoverPreviewCard } from './HoverPreviewCard'

interface ShowCardProps {
  show: TVShow
}

export const ShowCard = memo(({ show }: ShowCardProps) => {
  const posterUrl = getImageUrl(show.poster_path, 'w342')
  const firstAirYear = show.first_air_date ? new Date(show.first_air_date).getFullYear() : 'TBA'

  const [previewRect, setPreviewRect] = useState<DOMRect | null>(null)
  const hoverTimerRef   = useRef<ReturnType<typeof setTimeout> | null>(null)
  const dismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const videoKeyRef     = useRef<string | null | undefined>(undefined)
  const cardRef         = useRef<HTMLDivElement>(null)

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

    if (videoKeyRef.current === undefined) {
      videoKeyRef.current = null
      getShowVideos(show.id)
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
  }, [show.id, cancelDismiss])

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
        to={`/show/${show.id}`}
        className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 block"
      >
        <div className="aspect-[2/3] relative">
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={show.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gray-700 flex items-center justify-center">
              <span className="text-gray-400 text-sm">No Image</span>
            </div>
          )}
          <div className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-black bg-opacity-75 text-white px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-xs sm:text-sm font-medium">
            {show.vote_average.toFixed(1)}
          </div>
        </div>
        <div className="p-2 sm:p-3">
          <h3 className="font-semibold text-white mb-1 line-clamp-2 text-xs sm:text-sm">{show.name}</h3>
          <p className="text-gray-400 text-xs sm:text-sm">{firstAirYear}</p>
        </div>
      </Link>

      {previewRect && (
        <HoverPreviewCard
          id={show.id}
          title={show.name}
          overview={show.overview}
          posterPath={show.poster_path}
          backdropPath={show.backdrop_path}
          voteAverage={show.vote_average}
          year={show.first_air_date?.slice(0, 4) ?? ''}
          mediaType="tv"
          videoKey={videoKeyRef.current ?? null}
          targetRect={previewRect}
          onMouseEnter={cancelDismiss}
          onMouseLeave={scheduleDismiss}
        />
      )}
    </div>
  )
})
