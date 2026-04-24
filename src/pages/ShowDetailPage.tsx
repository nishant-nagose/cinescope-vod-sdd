import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useShowDetails } from '../hooks/useShowDetails'
import { useSeasonDetails } from '../hooks/useSeasonDetails'
import { EpisodeList } from '../components/EpisodeList'
import { ShowCarousel } from '../components/ShowCarousel'
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

const CastSection = ({ cast, crew }: { cast: CastMember[]; crew: CrewMember[] }) => {
  const directors = crew.filter(c => c.job === 'Director')
  const producers = crew.filter(c => c.job === 'Producer' || c.job === 'Executive Producer')

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
          <h2 className="text-lg sm:text-xl font-bold text-white mb-3">Cast</h2>
          <div className="flex gap-3 overflow-x-auto pb-3 md:grid md:grid-cols-5 lg:grid-cols-10 md:overflow-visible mb-6">
            {cast.map(m => <PersonCard key={m.id} name={m.name} sub={m.character} path={m.profile_path} />)}
          </div>
        </>
      )}
      {(directors.length > 0 || producers.length > 0) && (
        <>
          <h2 className="text-lg sm:text-xl font-bold text-white mb-3">Crew</h2>
          <div className="flex gap-3 overflow-x-auto pb-3 md:grid md:grid-cols-5 lg:grid-cols-10 md:overflow-visible">
            {directors.map(m => <PersonCard key={m.id} name={m.name} sub="Director" path={m.profile_path} />)}
            {producers.slice(0, 4).map(m => <PersonCard key={m.id} name={m.name} sub={m.job} path={m.profile_path} />)}
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
  const [selectedSeason, setSelectedSeason] = useState<number | null>(null)
  const seasonDetails = useSeasonDetails(showId, selectedSeason)

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

  return (
    <div>
      {/* Backdrop */}
      <div className="relative w-full aspect-video bg-gray-900 overflow-hidden max-h-[70vh]">
        {backdropUrl && (
          <img src={backdropUrl} alt={show.name} className="absolute inset-0 w-full h-full object-cover opacity-60" loading="lazy" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 bg-black bg-opacity-60 text-white rounded-lg hover:bg-opacity-80 text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <span className="absolute top-4 right-4 z-10 px-2 py-0.5 bg-purple-600 text-white text-xs font-bold rounded uppercase">Show</span>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6">
        <div className="flex gap-4 sm:gap-6 md:gap-8">
          {/* Poster */}
          {posterUrl && (
            <div className="flex-shrink-0 w-24 sm:w-32 md:w-40 lg:w-48">
              <img src={posterUrl} alt={show.name} className="w-full rounded-lg shadow-xl" loading="lazy" />
            </div>
          )}

          {/* Metadata */}
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 leading-tight">
              {show.name}
            </h1>

            {show.tagline && (
              <p className="text-gray-400 italic mb-3 text-sm sm:text-base">"{show.tagline}"</p>
            )}

            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4">
              {show.vote_average > 0 && (
                <span className="px-2 py-0.5 bg-yellow-500 text-black text-xs font-bold rounded">
                  ★ {show.vote_average.toFixed(1)}
                </span>
              )}
              {show.first_air_date && (
                <span className="text-gray-300 text-sm">{show.first_air_date.slice(0, 4)}</span>
              )}
              <span className={`px-2 py-0.5 text-xs font-medium rounded ${show.in_production ? 'bg-green-700 text-green-100' : 'bg-gray-700 text-gray-300'}`}>
                {show.status}
              </span>
              {show.number_of_seasons > 0 && (
                <span className="text-gray-400 text-sm">{show.number_of_seasons} Season{show.number_of_seasons !== 1 ? 's' : ''}</span>
              )}
              {show.number_of_episodes > 0 && (
                <span className="text-gray-400 text-sm">{show.number_of_episodes} Episodes</span>
              )}
            </div>

            {show.genres.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {show.genres.map(g => (
                  <span key={g.id} className="px-2 py-0.5 bg-gray-700 text-gray-300 text-xs rounded">
                    {g.name}
                  </span>
                ))}
              </div>
            )}

            {show.networks.length > 0 && (
              <p className="text-gray-400 text-sm mb-2">
                Network: <span className="text-gray-200">{show.networks.map(n => n.name).join(', ')}</span>
              </p>
            )}
          </div>
        </div>

        {/* Overview */}
        {show.overview && (
          <div className="mt-6">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-2">Overview</h2>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">{show.overview}</p>
          </div>
        )}

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
            {selectedSeason !== null && (
              <EpisodeList
                episodes={seasonDetails.season?.episodes ?? []}
                loading={seasonDetails.loading}
              />
            )}
            {selectedSeason === null && (
              <p className="text-gray-400 text-sm">Select a season to view episodes.</p>
            )}
          </div>
        )}

        {/* Cast & Crew */}
        {credits && (
          <CastSection cast={credits.cast.slice(0, 10)} crew={credits.crew} />
        )}

        {/* Similar Shows */}
        {similarShows && similarShows.results.length > 0 && (
          <div className="mt-8 sm:mt-10">
            <ShowCarousel
              title="Similar Shows"
              shows={similarShows.results}
              singleRow
            />
          </div>
        )}
      </div>
    </div>
  )
}
