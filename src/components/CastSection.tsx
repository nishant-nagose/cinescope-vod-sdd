import { CastMember } from '../types/tmdb'
import { getImageUrl } from '../services/tmdbApi'

interface CastSectionProps {
  cast: CastMember[]
}

export const CastSection = ({ cast }: CastSectionProps) => {
  if (!cast.length) return null

  return (
    <section className="mt-8 sm:mt-10">
      <h2 className="text-lg sm:text-xl font-bold text-white mb-4">Cast</h2>
      <div className="flex gap-3 overflow-x-auto pb-3 md:grid md:grid-cols-5 lg:grid-cols-10 md:overflow-visible">
        {cast.map((member) => {
          const photoUrl = getImageUrl(member.profile_path, 'w185')
          return (
            <div key={member.id} className="flex-shrink-0 w-24 md:w-auto text-center">
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt={member.name}
                  className="w-24 h-24 md:w-full md:h-28 object-cover rounded-lg bg-gray-700"
                  loading="lazy"
                />
              ) : (
                <div className="w-24 h-24 md:w-full md:h-28 bg-gray-700 rounded-lg flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
              <p className="mt-1 text-xs text-white font-medium truncate">{member.name}</p>
              <p className="text-xs text-gray-400 truncate">{member.character}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
