import { useWatchProviders } from '../hooks/useWatchProviders'
import { useShowWatchProviders } from '../hooks/useShowWatchProviders'
import { useContentFilter } from '../context/ContentFilterContext'
import { WatchProvider } from '../types/tmdb'
import { OTT_PROVIDERS } from '../config/ottProviders'
import { navigateToOTT, isMobileDevice } from '../utils/ottNavigation'

interface WatchProvidersSectionProps {
  contentId: number
  contentType?: 'movie' | 'tv'
  contentTitle?: string
}

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w92'

const ProviderLogo = ({
  provider,
  fallbackLink,
  contentTitle,
}: {
  provider: WatchProvider
  fallbackLink: string
  contentTitle: string
}) => {
  const handleClick = () => {
    const config = OTT_PROVIDERS[provider.provider_id]
    if (config) {
      const encodedTitle = encodeURIComponent(contentTitle)
      const webUrl = config.webUrlPattern.replace('{title}', encodedTitle)
      navigateToOTT(
        { provider_id: provider.provider_id, provider_name: provider.provider_name, logo_path: provider.logo_path, webUrl, appScheme: config.appScheme },
        isMobileDevice()
      )
    } else {
      window.open(fallbackLink, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <button
      onClick={handleClick}
      title={provider.provider_name}
      aria-label={`Watch on ${provider.provider_name}`}
      className="flex-shrink-0 cursor-pointer"
    >
      <img
        src={`${TMDB_IMAGE_BASE}${provider.logo_path}`}
        alt={provider.provider_name}
        className="w-12 h-12 rounded-xl object-cover hover:opacity-80 transition-opacity"
      />
    </button>
  )
}

export const WatchProvidersSection = ({ contentId, contentType = 'movie', contentTitle = '' }: WatchProvidersSectionProps) => {
  const movieResult = useWatchProviders(contentType === 'movie' ? contentId : 0)
  const showResult  = useShowWatchProviders(contentType === 'tv' ? contentId : 0)
  const { data, loading } = contentType === 'movie' ? movieResult : showResult
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
          <ProviderLogo key={provider.provider_id} provider={provider} fallbackLink={link} contentTitle={contentTitle} />
        ))}
      </div>
      <p className="mt-2 text-xs text-gray-500">Powered by JustWatch</p>
    </section>
  )
}
