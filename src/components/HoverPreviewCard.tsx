import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { getImageUrl } from '../services/tmdbApi'
import { TrailerPlayer } from './TrailerPlayer'

interface HoverPreviewCardProps {
  id: number
  title: string
  overview: string
  posterPath: string | null
  backdropPath: string | null
  voteAverage: number
  year: string
  mediaType: 'movie' | 'tv'
  videoKey: string | null
  targetRect: DOMRect
  onMouseEnter: () => void
  onMouseLeave: () => void
}

const CARD_WIDTH = 340

export const HoverPreviewCard = ({
  id, title, overview, posterPath, backdropPath, voteAverage, year, mediaType,
  videoKey, targetRect, onMouseEnter, onMouseLeave,
}: HoverPreviewCardProps) => {
  const centerX = targetRect.left + targetRect.width / 2
  const left = Math.max(8, Math.min(window.innerWidth - CARD_WIDTH - 8, centerX - CARD_WIDTH / 2))
  const top = targetRect.top > 340
    ? targetRect.top - 340 - 8
    : targetRect.bottom + 8

  const imageUrl = getImageUrl(backdropPath ?? posterPath, 'w780')
  const linkPath = mediaType === 'movie' ? `/movie/${id}` : `/show/${id}`

  return createPortal(
    <div
      className="hover-card-enter fixed z-[9999] rounded-xl overflow-hidden ring-1 ring-white/10 bg-gray-900/97 shadow-2xl shadow-black/70 backdrop-blur-sm"
      style={{ left, top, width: CARD_WIDTH }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* 16:9 media area */}
      {videoKey ? (
        <TrailerPlayer videoKey={videoKey} autoplay muted />
      ) : (
        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
              <span className="text-gray-500 text-xs">No Preview</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent pointer-events-none" />
        </div>
      )}

      {/* Content details */}
      <div className="p-3 space-y-1.5">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-xs font-bold px-1.5 py-0.5 rounded uppercase tracking-wide ${
            mediaType === 'movie' ? 'bg-blue-600 text-white' : 'bg-purple-600 text-white'
          }`}>
            {mediaType === 'movie' ? 'Movie' : 'Show'}
          </span>
          {voteAverage > 0 && (
            <span className="text-xs bg-yellow-500/90 text-black font-bold px-1.5 py-0.5 rounded">
              ★ {voteAverage.toFixed(1)}
            </span>
          )}
          {year && <span className="text-gray-400 text-xs">{year}</span>}
        </div>

        <h3 className="text-white font-bold text-sm line-clamp-1">{title}</h3>

        {overview && (
          <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed">{overview}</p>
        )}

        <Link
          to={linkPath}
          className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors font-medium pt-0.5"
        >
          View Details →
        </Link>
      </div>
    </div>,
    document.body
  )
}
