import { memo } from 'react'
import { Link } from 'react-router-dom'
import { TVShow } from '../types/tmdb'
import { getImageUrl } from '../services/tmdbApi'

interface ShowCardProps {
  show: TVShow
}

export const ShowCard = memo(({ show }: ShowCardProps) => {
  const posterUrl = getImageUrl(show.poster_path, 'w342')
  const firstAirYear = show.first_air_date ? new Date(show.first_air_date).getFullYear() : 'TBA'

  return (
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
  )
})
