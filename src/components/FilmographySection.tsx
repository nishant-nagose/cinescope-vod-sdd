import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { CastMember, CrewMember } from '../types/tmdb'
import { usePersonCredits } from '../hooks/usePersonCredits'
import { getImageUrl } from '../services/tmdbApi'

interface FilmographySectionProps {
  cast: CastMember[]
  crew: CrewMember[]
}

interface PersonFilmographyProps {
  personId: number
  personName: string
  role: string
}

const PersonFilmography = ({ personId, personName, role }: PersonFilmographyProps) => {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { data, loading } = usePersonCredits(visible ? personId : 0)

  useEffect(() => {
    if (!ref.current) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { rootMargin: '100px' }
    )
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const topMovies = (data?.cast ?? [])
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 5)

  return (
    <div ref={ref} className="mb-6">
      <h3 className="text-sm font-semibold text-gray-300 mb-3">
        Films with <span className="text-white">{personName}</span>{' '}
        <span className="text-gray-500 font-normal">({role})</span>
      </h3>

      {loading && (
        <div className="flex gap-3">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="w-16 flex-shrink-0">
              <div className="aspect-[2/3] bg-gray-700 rounded animate-pulse" />
            </div>
          ))}
        </div>
      )}

      {!loading && topMovies.length > 0 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {topMovies.map(movie => {
            const posterUrl = getImageUrl(movie.poster_path, 'w154')
            return (
              <Link
                key={movie.id}
                to={`/movie/${movie.id}`}
                className="flex-shrink-0 w-16 group"
                title={movie.title}
              >
                <div className="aspect-[2/3] rounded overflow-hidden bg-gray-700">
                  {posterUrl ? (
                    <img
                      src={posterUrl}
                      alt={movie.title}
                      className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-700" />
                  )}
                </div>
                <p className="mt-1 text-xs text-gray-400 truncate">{movie.title}</p>
              </Link>
            )
          })}
        </div>
      )}

      {!loading && visible && topMovies.length === 0 && (
        <p className="text-xs text-gray-500">No films found.</p>
      )}
    </div>
  )
}

export const FilmographySection = ({ cast, crew }: FilmographySectionProps) => {
  const [expanded, setExpanded] = useState(false)

  const topCast = cast.slice(0, 5)
  const director = crew.find(c => c.job === 'Director')
  const producer = crew.find(c => c.job === 'Producer' || c.job === 'Executive Producer')

  const people: { id: number; name: string; role: string }[] = [
    ...topCast.map(m => ({ id: m.id, name: m.name, role: m.character || 'Actor' })),
    ...(director ? [{ id: director.id, name: director.name, role: 'Director' }] : []),
    ...(producer ? [{ id: producer.id, name: producer.name, role: producer.job }] : []),
  ]

  if (people.length === 0) return null

  const visiblePeople = expanded ? people : people.slice(0, 1)

  return (
    <section className="mt-8">
      <h2 className="text-lg sm:text-xl font-bold text-white mb-4">Filmography</h2>

      {visiblePeople.map(person => (
        <PersonFilmography
          key={person.id}
          personId={person.id}
          personName={person.name}
          role={person.role}
        />
      ))}

      {people.length > 1 && (
        <button
          onClick={() => setExpanded(e => !e)}
          className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
        >
          {expanded ? 'Show less' : `Show ${people.length - 1} more people`}
        </button>
      )}
    </section>
  )
}
