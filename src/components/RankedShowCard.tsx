import { memo, useState, useRef, useCallback, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { TVShow } from '../types/tmdb'
import { getImageUrl, getShowVideos } from '../services/tmdbApi'
import { HoverPreviewCard } from './HoverPreviewCard'

interface RankedShowCardProps {
  show: TVShow
  rank: number
}

export const RankedShowCard = memo(({ show, rank }: RankedShowCardProps) => {
  const posterUrl = getImageUrl(show.poster_path, 'w342')

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
      className="group relative flex-shrink-0"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        to={`/show/${show.id}`}
        className={`block transition-opacity duration-200 ${previewRect ? 'opacity-0' : ''}`}
        aria-label={`${show.name} - Rank ${rank}`}
      >
        <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-gray-700">
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={show.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-700">
              <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.069A1 1 0 0121 8.876V15.12a1 1 0 01-1.447.894L15 14M3 8a1 1 0 011-1h8a1 1 0 011 1v8a1 1 0 01-1 1H4a1 1 0 01-1-1V8z" />
              </svg>
            </div>
          )}
          <span
            className="absolute bottom-0 left-0 text-6xl font-black leading-none select-none"
            style={{
              color: 'transparent',
              WebkitTextStroke: '2px white',
              textShadow: '0 2px 8px rgba(0,0,0,0.8)',
              lineHeight: '1',
              paddingBottom: '2px',
              paddingLeft: '4px',
            }}
            aria-hidden="true"
          >
            {rank}
          </span>
        </div>
        <p className="mt-1.5 text-xs text-white font-medium truncate">{show.name}</p>
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
