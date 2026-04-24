import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useShowDetails } from '../hooks/useShowDetails'
import { useShowVideos } from '../hooks/useShowVideos'
import { useSeasonDetails } from '../hooks/useSeasonDetails'
import { EpisodeList } from '../components/EpisodeList'
import { ShowGrid } from '../components/ShowGrid'
import { TrailersSection } from '../components/TrailersSection'
import { WatchProvidersSection } from '../components/WatchProvidersSection'
import { FilmographySection } from '../components/FilmographySection'
import { TrailerPlayer } from '../components/TrailerPlayer'
import { RatingBadge } from '../components/RatingBadge'
import { getImageUrl } from '../services/tmdbApi'
import { CastMember, CrewMember, SeasonSummary } from '../types/tmdb'

const DetailSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-48 sm:h-64 md:h-80 bg-gray-700 w-full mb-6" />
    <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
      <div className="h-8 bg-gray-700 rounded w-1/2 mb-4" />
      <div className="h-4 bg-gray-700 rounded w-1/4 mb-6" />
      <div className="space-y-2">
        {[...Array(4)].map((_, i) => <div key={i} className="h-4 bg-gray-700 rounded" />)}
      </div>
    </div>
  </div>
)

// Same structure as MovieDetailPage — Actors, Director, Producer, Key Contributors
const CastSection = ({ cast, crew }: { cast: CastMember[]; crew: CrewMember[] }) => {
  const directors = crew.filter(c => c.job === 'Director' || c.known_for_department === 'Directing').slice(0, 5)
  const producers = crew.filter(c => c.job === 'Producer' || c.job === 'Executive Producer').slice(0, 4)
  const others = crew.filter(
    c => c.job !== 'Director' && c.known_for_department !== 'Directing' &&
         c.job !== 'Producer' && c.job !== 'Executive Producer'
  ).slice(0, 5)

  const photoUrl = (path: string | null) => getImageUrl(path, 'w185')

  const PersonCard = ({ name, sub, path }: { name: string; sub: string; path: string | null }) => (
    <div className="flex-shrink-0 w-24 md:w-auto text-center">
      {photoUrl(path) ? (
        <img src={photoUrl(path)!} alt={name} className="w-24 h-24 md:w-full md:h-28 object-cover rounded-lg bg-gray-700" loading="lazy" />
      ) : (
        <div className="w-24 h-24 md:w-full md:h-28 bg-gray-700 rounded-lg flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      )}
      <p className="mt-1 text-xs text-white font-medium truncate">{name}</p>
      <p className="text-xs text-gray-400 truncate">{sub}</p>
    </div>
  )

  return (
    <section className="mt-8 sm:mt-10">
      {cast.length > 0 && (
        <>
          <h2 className="text-lg sm:text-xl font-bold text-white mb-3">Actors</h2>
          <div className="flex gap-3 overflow-x-auto pb-3 md:grid md:grid-cols-5 lg:grid-cols-10 md:overflow-visible mb-6">
            {cast.map(m => (
              <PersonCard key={m.id} name={m.name} sub={m.character} path={m.profile_path} />
            ))}
          </div>
        </>
      )}
      {directors.length > 0 && (
        <>
          <h2 className="text-lg sm:text-xl font-bold text-white mb-3">Director</h2>
          <div className="flex gap-3 overflow-x-auto pb-3 mb-6">
            {directors.map(m => (
              <PersonCard key={m.id} name={m.name} sub={m.job || 'Director'} path={m.profile_path} />
            ))}
          </div>
        </>
      )}
      {producers.length > 0 && (
        <>
          <h2 className="text-lg sm:text-xl font-bold text-white mb-3">Producer</h2>
          <div className="flex gap-3 overflow-x-auto pb-3 mb-6">
            {producers.map(m => (
              <PersonCard key={m.id} name={m.name} sub={m.job} path={m.profile_path} />
            ))}
          </div>
        </>
      )}
      {others.length > 0 && (
        <>
          <h2 className="text-lg sm:text-xl font-bold text-white mb-3">Key Contributors</h2>
          <div className="flex gap-3 overflow-x-auto pb-3 mb-6">
            {others.map(m => (
              <PersonCard key={m.id} name={m.name} sub={`${m.job} (${m.known_for_department})`} path={m.profile_path} />
            ))}
          </div>
        </>
      )}
    </section>
  )
}

const SeasonTab = ({
  season,
  selected,
  onClick,
}: { season: SeasonSummary; selected: boolean; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
      selected ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
    }`}
  >
    {season.name}
    {season.episode_count > 0 && (
      <span className="ml-1.5 text-xs opacity-75">({season.episode_count})</span>
    )}
  </button>
)

export const ShowDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const showId = Number(id)
  const { show, credits, similarShows, loading, error } = useShowDetails(showId)
  const { data: videosData } = useShowVideos(showId)
  const [selectedSeason, setSelectedSeason] = useState<number | null>(null)
  const [showTrailer, setShowTrailer] = useState(false)
  const seasonDetails = useSeasonDetails(showId, selectedSeason)

  const trailer = videosData?.results.find(
    v => v.site === 'YouTube' && v.type === 'Trailer'
  ) ?? videosData?.results.find(v => v.site === 'YouTube')

  useEffect(() => {
    if (!show) return
    const timer = setTimeout(() => setShowTrailer(true), 10000)
    return () => clearTimeout(timer)
  }, [show?.id])

  if (loading) return <DetailSkeleton />

  if (error || !show) {
    return (
      <div className="text-center py-20">
        <p className="text-red-400 text-lg mb-4">{error ?? 'Show not found'}</p>
        <button onClick={() => navigate(-1)} className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600">
          Go Back
        </button>
      </div>
    )
  }

  const backdropUrl = getImageUrl(show.backdrop_path, 'original')
  const posterUrl = getImageUrl(show.poster_path, 'w342')
  const regularSeasons = show.seasons.filter(s => s.season_number > 0)
  const cast = credits?.cast.slice(0, 10) ?? []
  const crew = credits?.crew ?? []

  return (
    <article>
      {/* Backdrop / Trailer */}
      <div className="relative w-full mt-0">
        {showTrailer && trailer ? (
          <TrailerPlayer videoKey={trailer.key} autoplay muted title={show.name} />
        ) : (
          backdropUrl && (
            <div className="relative w-full aspect-video overflow-hidden max-h-[70vh]">
              <img
                src={backdropUrl}
                alt={show.name}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
            </div>
          )
        )}
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">
        {/* Poster + metadata */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 mt-4 md:mt-6 relative z-10">
          {posterUrl && (
            <div className="flex-shrink-0 self-start">
              <img src={posterUrl} alt={show.name} className="w-32 sm:w-40 md:w-48 lg:w-56 rounded-lg shadow-xl" loading="lazy" />
            </div>
          )}

          <div className="flex-1 pt-0 md:pt-16">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 bg-purple-600 text-white text-xs font-bold rounded uppercase">Show</span>
              <span className={`px-2 py-0.5 text-xs font-medium rounded ${show.in_production ? 'bg-green-700 text-green-100' : 'bg-gray-700 text-gray-300'}`}>
                {show.status}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 leading-tight">{show.name}</h1>

            {show.tagline && (
              <p className="text-gray-400 italic text-sm mb-3">"{show.tagline}"</p>
            )}

            <div className="flex flex-wrap items-center gap-3 mb-3 text-sm text-gray-400">
              {show.first_air_date && <span>{show.first_air_date.slice(0, 4)}</span>}
              {show.number_of_seasons > 0 && (
                <span>{show.number_of_seasons} Season{show.number_of_seasons !== 1 ? 's' : ''}</span>
              )}
              {show.number_of_episodes > 0 && (
                <span>{show.number_of_episodes} Episodes</span>
              )}
              {show.vote_average > 0 && (
                <div className="flex items-center gap-2">
                  <RatingBadge rating={show.vote_average} />
                </div>
              )}
            </div>

            {show.genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {show.genres.map(g => (
                  <span key={g.id} className="px-2 py-1 bg-gray-700 text-xs text-gray-300 rounded-full">{g.name}</span>
                ))}
              </div>
            )}

            {show.networks.length > 0 && (
              <p className="text-gray-400 text-sm">
                Network: <span className="text-gray-200">{show.networks.map(n => n.name).join(', ')}</span>
              </p>
            )}
          </div>
        </div>

        {/* Overview */}
        {show.overview && (
          <section className="mt-6 sm:mt-8">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-2">Overview</h2>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">{show.overview}</p>
          </section>
        )}

        {/* Trailers & Clips */}
        <TrailersSection contentId={showId} contentType="tv" />

        {/* Seasons & Episodes */}
        {regularSeasons.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-3">Seasons</h2>
            <div className="flex gap-2 flex-wrap mb-4">
              {regularSeasons.map(s => (
                <SeasonTab
                  key={s.id}
                  season={s}
                  selected={selectedSeason === s.season_number}
                  onClick={() => setSelectedSeason(s.season_number === selectedSeason ? null : s.season_number)}
                />
              ))}
            </div>
            {selectedSeason !== null ? (
              <EpisodeList
                episodes={seasonDetails.season?.episodes ?? []}
                loading={seasonDetails.loading}
              />
            ) : (
              <p className="text-gray-400 text-sm">Select a season to view episodes.</p>
            )}
          </div>
        )}

        {/* Cast & Crew */}
        <CastSection cast={cast} crew={crew} />

        {/* Filmography */}
        <FilmographySection cast={cast} crew={crew} />

        {/* Where to Watch */}
        <WatchProvidersSection contentId={showId} contentType="tv" contentTitle={show.name} />

        {/* Similar Shows */}
        {similarShows && similarShows.results.length > 0 && (
          <section className="mt-8 sm:mt-10">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-4">Similar Shows</h2>
            <ShowGrid
              shows={similarShows.results.slice(0, 20)}
              loading={false}
              error={null}
            />
          </section>
        )}
      </div>
    </article>
  )
}
