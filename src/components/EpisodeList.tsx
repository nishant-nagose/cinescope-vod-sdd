import { useState } from 'react'
import { Episode } from '../types/tmdb'
import { getImageUrl } from '../services/tmdbApi'

interface EpisodeListProps {
  episodes: Episode[]
  loading?: boolean
}

export const EpisodeList = ({ episodes, loading }: EpisodeListProps) => {
  const [expandedId, setExpandedId] = useState<number | null>(null)

  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-14 bg-gray-700 rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  if (episodes.length === 0) {
    return <p className="text-gray-400 text-sm py-4">No episodes available.</p>
  }

  return (
    <div className="space-y-2">
      {episodes.map(ep => {
        const isExpanded = expandedId === ep.id
        const stillUrl = getImageUrl(ep.still_path, 'w300')

        return (
          <div key={ep.id} className="bg-gray-800 rounded-lg overflow-hidden">
            <button
              onClick={() => setExpandedId(isExpanded ? null : ep.id)}
              className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-750 transition-colors"
            >
              <span className="text-gray-500 text-xs font-mono w-8 flex-shrink-0">
                {ep.episode_number}
              </span>
              <span className="flex-1 text-white text-sm font-medium line-clamp-1">{ep.name}</span>
              <div className="flex items-center gap-2 flex-shrink-0">
                {ep.air_date && (
                  <span className="text-gray-400 text-xs hidden sm:block">
                    {ep.air_date.slice(0, 7)}
                  </span>
                )}
                {ep.runtime && (
                  <span className="text-gray-400 text-xs">{ep.runtime}m</span>
                )}
                <svg
                  className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>

            {isExpanded && (
              <div className="px-3 pb-3 flex gap-3">
                {stillUrl && (
                  <img
                    src={stillUrl}
                    alt={ep.name}
                    className="w-32 sm:w-40 flex-shrink-0 rounded object-cover aspect-video"
                    loading="lazy"
                  />
                )}
                <div>
                  <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                    {ep.overview || 'No synopsis available.'}
                  </p>
                  {ep.vote_average > 0 && (
                    <span className="mt-2 inline-block px-2 py-0.5 bg-yellow-500 text-black text-xs font-bold rounded">
                      ★ {ep.vote_average.toFixed(1)}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
