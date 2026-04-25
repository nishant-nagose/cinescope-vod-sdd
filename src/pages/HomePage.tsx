import { useContentFilter } from '../context/ContentFilterContext'
import { MovieCarousel } from '../components/MovieCarousel'
import { ShowCarousel } from '../components/ShowCarousel'
import { CAROUSEL_CONFIG } from '../config/carousels'
import { HeroSlider } from '../components/HeroSlider'
import { LazySection } from '../components/LazySection'
import { getCarouselTitle, extractCountFromTitle } from '../utils/carouselTitles'
import { GENRE_KEY_MAP } from '../utils/genreKeyMap'
import { useHeroSlider } from '../hooks/useHeroSlider'
import { useInfiniteMovies } from '../hooks/useInfiniteMovies'
import {
  getTrendingMovies, getNewReleases, getCriticallyAcclaimed,
  getComedyMovies, getSciFiFantasyMovies, getRealLifeMovies, getAnimationMovies,
  getRomanceMovies, getActionAdventureMovies, getAwardWinningMovies,
  getInspiringMovies, getThrillerMovies, getDailyTrending, getWeeklyTrending,
  getUpcomingMovies,
} from '../services/tmdbApi'
import { useTVDailyTrending } from '../hooks/useTVDailyTrending'
import { useTVWeeklyTrending } from '../hooks/useTVWeeklyTrending'
import { useNewShows } from '../hooks/useNewShows'
import { useRecommendedShows } from '../hooks/useRecommendedShows'
import { useCriticallyAcclaimedShows } from '../hooks/useCriticallyAcclaimedShows'
import { useComedyShows } from '../hooks/useComedyShows'
import { useSciFiFantasyShows } from '../hooks/useSciFiFantasyShows'
import { useRealLifeShows } from '../hooks/useRealLifeShows'
import { useAnimationShows } from '../hooks/useAnimationShows'
import { useRomanceShows } from '../hooks/useRomanceShows'
import { useActionAdventureShows } from '../hooks/useActionAdventureShows'
import { useAwardWinningShows } from '../hooks/useAwardWinningShows'
import { useInspiringShows } from '../hooks/useInspiringShows'
import { useThrillerShows } from '../hooks/useThrillerShows'
import { useUpcomingShows } from '../hooks/useUpcomingShows'

export const HomePage = () => {
  const heroSlider = useHeroSlider()
  const { contentType, activeCategory } = useContentFilter()

  // Resolve the active genreKey from the selected category ID
  const activeGenreKey = activeCategory !== null ? (GENRE_KEY_MAP[activeCategory] ?? null) : null

  // Movie hooks (infinite scroll)
  const newReleases = useInfiniteMovies(
    (page, f) => getNewReleases(page, f), { cacheKeyPrefix: 'new-releases' }
  )
  // Daily/weekly trending: regional when region is set (discover), global otherwise (trending endpoint)
  const dailyTrending = useInfiniteMovies(
    (page, f) => getDailyTrending(page, f), { cacheKeyPrefix: 'daily-trending' }
  )
  const weeklyTrending = useInfiniteMovies(
    (page, f) => getWeeklyTrending(page, f), { cacheKeyPrefix: 'weekly-trending' }
  )
  const trending = useInfiniteMovies(
    (page, f) => getTrendingMovies(page, f), { cacheKeyPrefix: 'trending' }
  )
  const acclaimed = useInfiniteMovies(
    (page, f) => getCriticallyAcclaimed(page, f), { cacheKeyPrefix: 'acclaimed' }
  )
  // Genre carousels: strip country filter so mixed global + any-regional content is shown
  const comedy = useInfiniteMovies(
    (page, f) => getComedyMovies(page, { ...f, countries: [] }), { cacheKeyPrefix: 'comedy' }
  )
  const sciFiFantasy = useInfiniteMovies(
    (page, f) => getSciFiFantasyMovies(page, { ...f, countries: [] }), { cacheKeyPrefix: 'sci-fi' }
  )
  const realLife = useInfiniteMovies(
    (page, f) => getRealLifeMovies(page, { ...f, countries: [] }), { cacheKeyPrefix: 'real-life' }
  )
  const animation = useInfiniteMovies(
    (page, f) => getAnimationMovies(page, { ...f, countries: [] }), { cacheKeyPrefix: 'animation' }
  )
  const romance = useInfiniteMovies(
    (page, f) => getRomanceMovies(page, { ...f, countries: [] }), { cacheKeyPrefix: 'romance' }
  )
  const actionAdventure = useInfiniteMovies(
    (page, f) => getActionAdventureMovies(page, { ...f, countries: [] }), { cacheKeyPrefix: 'action-adventure' }
  )
  const awardWinning = useInfiniteMovies(
    (page, f) => getAwardWinningMovies(page, { ...f, countries: [] }), { cacheKeyPrefix: 'award-winning' }
  )
  const inspiring = useInfiniteMovies(
    (page, f) => getInspiringMovies(page, { ...f, countries: [] }), { cacheKeyPrefix: 'inspiring' }
  )
  const thriller = useInfiniteMovies(
    (page, f) => getThrillerMovies(page, { ...f, countries: [] }), { cacheKeyPrefix: 'thriller' }
  )
  const upcomingMoviesHook = useInfiniteMovies(
    (page) => getUpcomingMovies(page), { cacheKeyPrefix: 'upcoming-movies' }
  )

  // Show hooks
  const tvDailyTrending = useTVDailyTrending()
  const tvWeeklyTrending = useTVWeeklyTrending()
  const newShows = useNewShows()
  const recommendedShows = useRecommendedShows()
  const criticallyAcclaimedShows = useCriticallyAcclaimedShows()
  const comedyShows = useComedyShows()
  const sciFiFantasyShows = useSciFiFantasyShows()
  const realLifeShows = useRealLifeShows()
  const animationShows = useAnimationShows()
  const romanceShows = useRomanceShows()
  const actionAdventureShows = useActionAdventureShows()
  const awardWinningShows = useAwardWinningShows()
  const inspiringShows = useInspiringShows()
  const thrillerShows = useThrillerShows()
  const upcomingShowsHook = useUpcomingShows()

  const showMovies = contentType === 'movies' || contentType === 'all'
  const showShows  = contentType === 'shows'  || contentType === 'all'

  const movieHookMap: Record<string, { movies: import('../types/tmdb').Movie[]; loading: boolean; error: string | null; refetch: () => void; hasMore: boolean; loadMore?: () => void }> = {
    newReleases:    { movies: newReleases.movies,         loading: newReleases.loading,         error: newReleases.error,         refetch: newReleases.refetch,         hasMore: newReleases.hasMore,         loadMore: newReleases.fetchMore },
    dailyTrending:  { movies: dailyTrending.movies,       loading: dailyTrending.loading,       error: dailyTrending.error,       refetch: dailyTrending.refetch,       hasMore: false },
    weeklyTrending: { movies: weeklyTrending.movies,      loading: weeklyTrending.loading,      error: weeklyTrending.error,      refetch: weeklyTrending.refetch,      hasMore: false },
    trending:       { movies: trending.movies,            loading: trending.loading,            error: trending.error,            refetch: trending.refetch,            hasMore: trending.hasMore,            loadMore: trending.fetchMore },
    acclaimed:      { movies: acclaimed.movies,           loading: acclaimed.loading,           error: acclaimed.error,           refetch: acclaimed.refetch,           hasMore: acclaimed.hasMore,           loadMore: acclaimed.fetchMore },
    comedy:         { movies: comedy.movies,              loading: comedy.loading,              error: comedy.error,              refetch: comedy.refetch,              hasMore: comedy.hasMore,              loadMore: comedy.fetchMore },
    sciFiFantasy:   { movies: sciFiFantasy.movies,        loading: sciFiFantasy.loading,        error: sciFiFantasy.error,        refetch: sciFiFantasy.refetch,        hasMore: sciFiFantasy.hasMore,        loadMore: sciFiFantasy.fetchMore },
    realLife:       { movies: realLife.movies,            loading: realLife.loading,            error: realLife.error,            refetch: realLife.refetch,            hasMore: realLife.hasMore,            loadMore: realLife.fetchMore },
    animation:      { movies: animation.movies,           loading: animation.loading,           error: animation.error,           refetch: animation.refetch,           hasMore: animation.hasMore,           loadMore: animation.fetchMore },
    romance:        { movies: romance.movies,             loading: romance.loading,             error: romance.error,             refetch: romance.refetch,             hasMore: romance.hasMore,             loadMore: romance.fetchMore },
    actionAdventure:{ movies: actionAdventure.movies,     loading: actionAdventure.loading,     error: actionAdventure.error,     refetch: actionAdventure.refetch,     hasMore: actionAdventure.hasMore,     loadMore: actionAdventure.fetchMore },
    awardWinning:   { movies: awardWinning.movies,        loading: awardWinning.loading,        error: awardWinning.error,        refetch: awardWinning.refetch,        hasMore: awardWinning.hasMore,        loadMore: awardWinning.fetchMore },
    inspiring:      { movies: inspiring.movies,           loading: inspiring.loading,           error: inspiring.error,           refetch: inspiring.refetch,           hasMore: inspiring.hasMore,           loadMore: inspiring.fetchMore },
    thriller:       { movies: thriller.movies,            loading: thriller.loading,            error: thriller.error,            refetch: thriller.refetch,            hasMore: thriller.hasMore,            loadMore: thriller.fetchMore },
    upcomingMovies: { movies: upcomingMoviesHook.movies,  loading: upcomingMoviesHook.loading,  error: upcomingMoviesHook.error,  refetch: upcomingMoviesHook.refetch,  hasMore: upcomingMoviesHook.hasMore,  loadMore: upcomingMoviesHook.fetchMore },
  }

  const showHookMap: Record<string, { shows: import('../types/tmdb').TVShow[]; loading: boolean; error: string | null; refetch: () => void; hasMore: boolean; loadMore?: () => void }> = {
    newShows:                { shows: newShows.shows,                 loading: newShows.loading,                 error: newShows.error,                 refetch: newShows.refetch,                 hasMore: newShows.hasMore,                 loadMore: newShows.loadMore },
    tvDailyTrending:         { shows: tvDailyTrending.shows,          loading: tvDailyTrending.loading,          error: tvDailyTrending.error,          refetch: tvDailyTrending.refetch,          hasMore: false },
    tvWeeklyTrending:        { shows: tvWeeklyTrending.shows,         loading: tvWeeklyTrending.loading,         error: tvWeeklyTrending.error,         refetch: tvWeeklyTrending.refetch,         hasMore: false },
    recommendedShows:        { shows: recommendedShows.shows,         loading: recommendedShows.loading,         error: recommendedShows.error,         refetch: recommendedShows.refetch,         hasMore: recommendedShows.hasMore,         loadMore: recommendedShows.loadMore },
    criticallyAcclaimedShows:{ shows: criticallyAcclaimedShows.shows, loading: criticallyAcclaimedShows.loading, error: criticallyAcclaimedShows.error, refetch: criticallyAcclaimedShows.refetch, hasMore: criticallyAcclaimedShows.hasMore, loadMore: criticallyAcclaimedShows.loadMore },
    comedyShows:             { shows: comedyShows.shows,              loading: comedyShows.loading,              error: comedyShows.error,              refetch: comedyShows.refetch,              hasMore: comedyShows.hasMore,              loadMore: comedyShows.loadMore },
    sciFiFantasyShows:       { shows: sciFiFantasyShows.shows,        loading: sciFiFantasyShows.loading,        error: sciFiFantasyShows.error,        refetch: sciFiFantasyShows.refetch,        hasMore: sciFiFantasyShows.hasMore,        loadMore: sciFiFantasyShows.loadMore },
    realLifeShows:           { shows: realLifeShows.shows,            loading: realLifeShows.loading,            error: realLifeShows.error,            refetch: realLifeShows.refetch,            hasMore: realLifeShows.hasMore,            loadMore: realLifeShows.loadMore },
    animationShows:          { shows: animationShows.shows,           loading: animationShows.loading,           error: animationShows.error,           refetch: animationShows.refetch,           hasMore: animationShows.hasMore,           loadMore: animationShows.loadMore },
    romanceShows:            { shows: romanceShows.shows,             loading: romanceShows.loading,             error: romanceShows.error,             refetch: romanceShows.refetch,             hasMore: romanceShows.hasMore,             loadMore: romanceShows.loadMore },
    actionAdventureShows:    { shows: actionAdventureShows.shows,     loading: actionAdventureShows.loading,     error: actionAdventureShows.error,     refetch: actionAdventureShows.refetch,     hasMore: actionAdventureShows.hasMore,     loadMore: actionAdventureShows.loadMore },
    awardWinningShows:       { shows: awardWinningShows.shows,        loading: awardWinningShows.loading,        error: awardWinningShows.error,        refetch: awardWinningShows.refetch,        hasMore: awardWinningShows.hasMore,        loadMore: awardWinningShows.loadMore },
    inspiringShows:          { shows: inspiringShows.shows,           loading: inspiringShows.loading,           error: inspiringShows.error,           refetch: inspiringShows.refetch,           hasMore: inspiringShows.hasMore,           loadMore: inspiringShows.loadMore },
    thrillerShows:           { shows: thrillerShows.shows,            loading: thrillerShows.loading,            error: thrillerShows.error,            refetch: thrillerShows.refetch,            hasMore: thrillerShows.hasMore,            loadMore: thrillerShows.loadMore },
    upcomingShows:           { shows: upcomingShowsHook.shows,        loading: upcomingShowsHook.loading,        error: upcomingShowsHook.error,        refetch: upcomingShowsHook.refetch,        hasMore: upcomingShowsHook.hasMore,        loadMore: upcomingShowsHook.loadMore },
  }

  return (
    <div>
      <HeroSlider items={heroSlider.items} loading={heroSlider.loading} />

      <div className="py-4 sm:py-6">
        {/* Carousels — driven by CAROUSEL_CONFIG */}
        {CAROUSEL_CONFIG.map(config => {
          // Content-type visibility
          const typeVisible =
            (config.type === 'movies' && showMovies) ||
            (config.type === 'shows'  && showShows)  ||
            config.type === 'both'
          if (!typeVisible) return null

          // When a category is active, only show carousels whose genreKey matches exactly.
          // Generic carousels (no genreKey) are also hidden so all visible content matches the selection.
          if (activeGenreKey !== null && config.genreKey !== activeGenreKey) return null

          const title = getCarouselTitle(config.hookKey, config.type)
          const countFromTitle = extractCountFromTitle(title)
          const isRanked = config.rankDisplay || countFromTitle !== null
          const maxItems = countFromTitle ?? (config.rankDisplay ? 10 : undefined)

          if (config.type === 'movies') {
            const hook = movieHookMap[config.hookKey]
            if (!hook) return null
            return (
              <LazySection key={config.id}>
                <MovieCarousel
                  title={title}
                  movies={hook.movies}
                  loading={hook.loading}
                  error={hook.error}
                  onRetry={hook.refetch}
                  singleRow
                  rankDisplay={isRanked}
                  maxItems={maxItems}
                  hasMore={isRanked ? false : hook.hasMore}
                  onLoadMore={isRanked ? undefined : hook.loadMore}
                />
              </LazySection>
            )
          }

          if (config.type === 'shows') {
            const hook = showHookMap[config.hookKey]
            if (!hook) return null
            return (
              <LazySection key={config.id}>
                <ShowCarousel
                  title={title}
                  shows={hook.shows}
                  loading={hook.loading}
                  error={hook.error}
                  onRetry={hook.refetch}
                  rankDisplay={isRanked}
                  maxItems={maxItems}
                  hasMore={isRanked ? false : hook.hasMore}
                  onLoadMore={isRanked ? undefined : hook.loadMore}
                />
              </LazySection>
            )
          }

          return null
        })}
      </div>
    </div>
  )
}
