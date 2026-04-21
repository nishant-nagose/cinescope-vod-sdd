import { Link } from 'react-router-dom'
import { Movie } from '../types/tmdb'
import { getImageUrl } from '../services/tmdbApi'

interface MovieCardProps {
  movie: Movie
}

export const MovieCard = ({ movie }: MovieCardProps) => {
  const posterUrl = getImageUrl(movie.poster_path, 'w500')
  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'TBA'

  return (
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
  )
}