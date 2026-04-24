import { memo } from 'react'
import { Link } from 'react-router-dom'
import { TVShow } from '../types/tmdb'
import { getImageUrl } from '../services/tmdbApi'

interface RankedShowCardProps {
  show: TVShow
  rank: number
}

export const RankedShowCard = memo(({ show, rank }: RankedShowCardProps) => {
  const posterUrl = getImageUrl(show.poster_path, 'w342')

  return (
    <Link
      to={`/show/${show.id}`}
      className="group relative flex-shrink-0 block"
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

        {/* Rank number — bottom-left large outlined numeral */}
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
  )
})
