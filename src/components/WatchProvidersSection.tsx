import { useWatchProviders } from '../hooks/useWatchProviders'
import { useContentFilter } from '../context/ContentFilterContext'
import { WatchProvider } from '../types/tmdb'

interface WatchProvidersSectionProps {
  movieId: number
}

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w92'

const ProviderLogo = ({ provider, link }: { provider: WatchProvider; link: string }) => (
  <a
    href={link}
    target="_blank"
    rel="noopener noreferrer"
    title={provider.provider_name}
    aria-label={`Watch on ${provider.provider_name}`}
    className="flex-shrink-0"
  >
    <img
      src={`${TMDB_IMAGE_BASE}${provider.logo_path}`}
      alt={provider.provider_name}
      className="w-12 h-12 rounded-xl object-cover hover:opacity-80 transition-opacity"
    />
  </a>
)

export const WatchProvidersSection = ({ movieId }: WatchProvidersSectionProps) => {
  const { data, loading } = useWatchProviders(movieId)
  const { countries } = useContentFilter()
  const countryCode = countries[0] ?? 'US'

  if (loading) {
    return (
      <section className="mt-8">
        <h2 className="text-lg sm:text-xl font-bold text-white mb-4">Where to Watch</h2>
        <div className="flex gap-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="w-12 h-12 bg-gray-700 rounded-xl animate-pulse" />
          ))}
        </div>
      </section>
    )
  }

  const countryData = data?.results?.[countryCode]
  const flatrate = countryData?.flatrate ?? []
  const rent = countryData?.rent ?? []
  const allProviders = [...flatrate, ...rent]
  const link = countryData?.link ?? ''

  if (!countryData || allProviders.length === 0) {
    return (
      <section className="mt-8">
        <h2 className="text-lg sm:text-xl font-bold text-white mb-4">Where to Watch</h2>
        <p className="text-gray-400 text-sm">Not available for streaming in your region.</p>
      </section>
    )
  }

  return (
    <section className="mt-8">
      <h2 className="text-lg sm:text-xl font-bold text-white mb-4">Where to Watch</h2>
      <div className="flex flex-wrap gap-3">
        {allProviders.map(provider => (
          <ProviderLogo key={provider.provider_id} provider={provider} link={link} />
        ))}
      </div>
      <p className="mt-2 text-xs text-gray-500">Powered by JustWatch</p>
    </section>
  )
}
