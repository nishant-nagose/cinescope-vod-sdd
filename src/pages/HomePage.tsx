import { useContentFilter } from '../context/ContentFilterContext'
import { MovieCarousel } from '../components/MovieCarousel'
import { ShowCarousel } from '../components/ShowCarousel'
import { HeroSlider } from '../components/HeroSlider'
import { LazySection } from '../components/LazySection'
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
  const { contentType, activeCategory: _activeCategory } = useContentFilter()

  // Movie hooks (infinite scroll)
  const newReleases = useInfiniteMovies(
    (page, f) => getNewReleases(page, f), { cacheKeyPrefix: 'new-releases' }
  )
  const dailyTrending = useInfiniteMovies(
    (page) => getDailyTrending(page), { cacheKeyPrefix: 'daily-trending' }
  )
  const weeklyTrending = useInfiniteMovies(
    (page) => getWeeklyTrending(page), { cacheKeyPrefix: 'weekly-trending' }
  )
  const trending = useInfiniteMovies(
    (page, f) => getTrendingMovies(page, f), { cacheKeyPrefix: 'trending' }
  )
  const acclaimed = useInfiniteMovies(
    (page, f) => getCriticallyAcclaimed(page, f), { cacheKeyPrefix: 'acclaimed' }
  )
  const comedy = useInfiniteMovies(
    (page, f) => getComedyMovies(page, f), { cacheKeyPrefix: 'comedy' }
  )
  const sciFiFantasy = useInfiniteMovies(
    (page, f) => getSciFiFantasyMovies(page, f), { cacheKeyPrefix: 'sci-fi' }
  )
  const realLife = useInfiniteMovies(
    (page, f) => getRealLifeMovies(page, f), { cacheKeyPrefix: 'real-life' }
  )
  const animation = useInfiniteMovies(
    (page, f) => getAnimationMovies(page, f), { cacheKeyPrefix: 'animation' }
  )
  const romance = useInfiniteMovies(
    (page, f) => getRomanceMovies(page, f), { cacheKeyPrefix: 'romance' }
  )
  const actionAdventure = useInfiniteMovies(
    (page, f) => getActionAdventureMovies(page, f), { cacheKeyPrefix: 'action-adventure' }
  )
  const awardWinning = useInfiniteMovies(
    (page, f) => getAwardWinningMovies(page, f), { cacheKeyPrefix: 'award-winning' }
  )
  const inspiring = useInfiniteMovies(
    (page, f) => getInspiringMovies(page, f), { cacheKeyPrefix: 'inspiring' }
  )
  const thriller = useInfiniteMovies(
    (page, f) => getThrillerMovies(page, f), { cacheKeyPrefix: 'thriller' }
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

  const showMovies = contentType === 'movies' || contentType === 'all' || !contentType
  const showShows = contentType === 'shows' || contentType === 'all' || !contentType

  return (
    <div>
      <HeroSlider
        items={heroSlider.items}
        loading={heroSlider.loading}
        currentVideoKey={heroSlider.currentVideoKey}
      />

      <div className="py-4 sm:py-6">
        {/* Welcome message */}
        <div className="px-3 sm:px-4 md:px-6 lg:px-8 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Welcome to CineScope
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">
            Discover the latest movies and shows. Browse trending content, explore by genre, or search for something specific.
          </p>
        </div>

        {/* Movie Carousels */}
        {showMovies && (
          <>
            <LazySection>
              <MovieCarousel
                title="New Movies on CineScope"
                movies={newReleases.movies}
                loading={newReleases.loading}
                error={newReleases.error}
                onRetry={newReleases.refetch}
                singleRow
                hasMore={newReleases.hasMore}
                onLoadMore={newReleases.fetchMore}
              />
            </LazySection>

            <LazySection>
              <MovieCarousel
                title="Today's Top 10 Movies"
                movies={dailyTrending.movies}
                loading={dailyTrending.loading}
                error={dailyTrending.error}
                onRetry={dailyTrending.refetch}
                singleRow
                rankDisplay
                maxItems={10}
                hasMore={false}
              />
            </LazySection>

            <LazySection>
              <MovieCarousel
                title="Weekly Top 10 Movies"
                movies={weeklyTrending.movies}
                loading={weeklyTrending.loading}
                error={weeklyTrending.error}
                onRetry={weeklyTrending.refetch}
                singleRow
                rankDisplay
                maxItems={10}
                hasMore={false}
              />
            </LazySection>

            <LazySection>
              <MovieCarousel
                title="Recommended Movies"
                movies={trending.movies}
                loading={trending.loading}
                error={trending.error}
                onRetry={trending.refetch}
                singleRow
                hasMore={trending.hasMore}
                onLoadMore={trending.fetchMore}
              />
            </LazySection>

            <LazySection>
              <MovieCarousel
                title="Critically Acclaimed Movies"
                movies={acclaimed.movies}
                loading={acclaimed.loading}
                error={acclaimed.error}
                onRetry={acclaimed.refetch}
                singleRow
                hasMore={acclaimed.hasMore}
                onLoadMore={acclaimed.fetchMore}
              />
            </LazySection>

            <LazySection>
              <MovieCarousel
                title="Need a Good Laugh? (Movies)"
                movies={comedy.movies}
                loading={comedy.loading}
                error={comedy.error}
                onRetry={comedy.refetch}
                singleRow
                hasMore={comedy.hasMore}
                onLoadMore={comedy.fetchMore}
              />
            </LazySection>

            <LazySection>
              <MovieCarousel
                title="Sci-Fi & Fantasy Movies"
                movies={sciFiFantasy.movies}
                loading={sciFiFantasy.loading}
                error={sciFiFantasy.error}
                onRetry={sciFiFantasy.refetch}
                singleRow
                hasMore={sciFiFantasy.hasMore}
                onLoadMore={sciFiFantasy.fetchMore}
              />
            </LazySection>

            <LazySection>
              <MovieCarousel
                title="Movies Based on Real Life"
                movies={realLife.movies}
                loading={realLife.loading}
                error={realLife.error}
                onRetry={realLife.refetch}
                singleRow
                hasMore={realLife.hasMore}
                onLoadMore={realLife.fetchMore}
              />
            </LazySection>

            <LazySection>
              <MovieCarousel
                title="Anime & Animation Movies"
                movies={animation.movies}
                loading={animation.loading}
                error={animation.error}
                onRetry={animation.refetch}
                singleRow
                hasMore={animation.hasMore}
                onLoadMore={animation.fetchMore}
              />
            </LazySection>

            <LazySection>
              <MovieCarousel
                title="Romantic Movies"
                movies={romance.movies}
                loading={romance.loading}
                error={romance.error}
                onRetry={romance.refetch}
                singleRow
                hasMore={romance.hasMore}
                onLoadMore={romance.fetchMore}
              />
            </LazySection>

            <LazySection>
              <MovieCarousel
                title="Action & Adventure Movies"
                movies={actionAdventure.movies}
                loading={actionAdventure.loading}
                error={actionAdventure.error}
                onRetry={actionAdventure.refetch}
                singleRow
                hasMore={actionAdventure.hasMore}
                onLoadMore={actionAdventure.fetchMore}
              />
            </LazySection>

            <LazySection>
              <MovieCarousel
                title="Award-Winning Movies"
                movies={awardWinning.movies}
                loading={awardWinning.loading}
                error={awardWinning.error}
                onRetry={awardWinning.refetch}
                singleRow
                hasMore={awardWinning.hasMore}
                onLoadMore={awardWinning.fetchMore}
              />
            </LazySection>

            <LazySection>
              <MovieCarousel
                title="Inspiring Movies"
                movies={inspiring.movies}
                loading={inspiring.loading}
                error={inspiring.error}
                onRetry={inspiring.refetch}
                singleRow
                hasMore={inspiring.hasMore}
                onLoadMore={inspiring.fetchMore}
              />
            </LazySection>

            <LazySection>
              <MovieCarousel
                title="Chilling Thriller Movies"
                movies={thriller.movies}
                loading={thriller.loading}
                error={thriller.error}
                onRetry={thriller.refetch}
                singleRow
                hasMore={thriller.hasMore}
                onLoadMore={thriller.fetchMore}
              />
            </LazySection>

            <LazySection>
              <MovieCarousel
                title="Upcoming Movies"
                movies={upcomingMoviesHook.movies}
                loading={upcomingMoviesHook.loading}
                error={upcomingMoviesHook.error}
                onRetry={upcomingMoviesHook.refetch}
                singleRow
                hasMore={upcomingMoviesHook.hasMore}
                onLoadMore={upcomingMoviesHook.fetchMore}
              />
            </LazySection>
          </>
        )}

        {/* Show Carousels */}
        {showShows && (
          <>
            <LazySection>
              <ShowCarousel
                title="New Shows on CineScope"
                shows={newShows.shows}
                loading={newShows.loading}
                error={newShows.error}
                onRetry={newShows.refetch}
                hasMore={newShows.hasMore}
                onLoadMore={newShows.loadMore}
              />
            </LazySection>

            <LazySection>
              <ShowCarousel
                title="Today's Top 10 Shows"
                shows={tvDailyTrending.shows}
                loading={tvDailyTrending.loading}
                error={tvDailyTrending.error}
                onRetry={tvDailyTrending.refetch}
                rankDisplay
                hasMore={tvDailyTrending.hasMore}
                onLoadMore={tvDailyTrending.loadMore}
              />
            </LazySection>

            <LazySection>
              <ShowCarousel
                title="Weekly Top 10 Shows"
                shows={tvWeeklyTrending.shows}
                loading={tvWeeklyTrending.loading}
                error={tvWeeklyTrending.error}
                onRetry={tvWeeklyTrending.refetch}
                rankDisplay
                hasMore={tvWeeklyTrending.hasMore}
                onLoadMore={tvWeeklyTrending.loadMore}
              />
            </LazySection>

            <LazySection>
              <ShowCarousel
                title="Recommended Shows"
                shows={recommendedShows.shows}
                loading={recommendedShows.loading}
                error={recommendedShows.error}
                onRetry={recommendedShows.refetch}
                hasMore={recommendedShows.hasMore}
                onLoadMore={recommendedShows.loadMore}
              />
            </LazySection>

            <LazySection>
              <ShowCarousel
                title="Critically Acclaimed Shows"
                shows={criticallyAcclaimedShows.shows}
                loading={criticallyAcclaimedShows.loading}
                error={criticallyAcclaimedShows.error}
                onRetry={criticallyAcclaimedShows.refetch}
                hasMore={criticallyAcclaimedShows.hasMore}
                onLoadMore={criticallyAcclaimedShows.loadMore}
              />
            </LazySection>

            <LazySection>
              <ShowCarousel
                title="Need a Good Laugh?"
                shows={comedyShows.shows}
                loading={comedyShows.loading}
                error={comedyShows.error}
                onRetry={comedyShows.refetch}
                hasMore={comedyShows.hasMore}
                onLoadMore={comedyShows.loadMore}
              />
            </LazySection>

            <LazySection>
              <ShowCarousel
                title="Sci-Fi & Fantasy Shows"
                shows={sciFiFantasyShows.shows}
                loading={sciFiFantasyShows.loading}
                error={sciFiFantasyShows.error}
                onRetry={sciFiFantasyShows.refetch}
                hasMore={sciFiFantasyShows.hasMore}
                onLoadMore={sciFiFantasyShows.loadMore}
              />
            </LazySection>

            <LazySection>
              <ShowCarousel
                title="Shows Based on Real Life"
                shows={realLifeShows.shows}
                loading={realLifeShows.loading}
                error={realLifeShows.error}
                onRetry={realLifeShows.refetch}
                hasMore={realLifeShows.hasMore}
                onLoadMore={realLifeShows.loadMore}
              />
            </LazySection>

            <LazySection>
              <ShowCarousel
                title="Anime & Animation Shows"
                shows={animationShows.shows}
                loading={animationShows.loading}
                error={animationShows.error}
                onRetry={animationShows.refetch}
                hasMore={animationShows.hasMore}
                onLoadMore={animationShows.loadMore}
              />
            </LazySection>

            <LazySection>
              <ShowCarousel
                title="Romantic Shows"
                shows={romanceShows.shows}
                loading={romanceShows.loading}
                error={romanceShows.error}
                onRetry={romanceShows.refetch}
                hasMore={romanceShows.hasMore}
                onLoadMore={romanceShows.loadMore}
              />
            </LazySection>

            <LazySection>
              <ShowCarousel
                title="Action & Adventure Shows"
                shows={actionAdventureShows.shows}
                loading={actionAdventureShows.loading}
                error={actionAdventureShows.error}
                onRetry={actionAdventureShows.refetch}
                hasMore={actionAdventureShows.hasMore}
                onLoadMore={actionAdventureShows.loadMore}
              />
            </LazySection>

            <LazySection>
              <ShowCarousel
                title="Award-Winning Shows"
                shows={awardWinningShows.shows}
                loading={awardWinningShows.loading}
                error={awardWinningShows.error}
                onRetry={awardWinningShows.refetch}
                hasMore={awardWinningShows.hasMore}
                onLoadMore={awardWinningShows.loadMore}
              />
            </LazySection>

            <LazySection>
              <ShowCarousel
                title="Inspiring Shows"
                shows={inspiringShows.shows}
                loading={inspiringShows.loading}
                error={inspiringShows.error}
                onRetry={inspiringShows.refetch}
                hasMore={inspiringShows.hasMore}
                onLoadMore={inspiringShows.loadMore}
              />
            </LazySection>

            <LazySection>
              <ShowCarousel
                title="Chilling Thriller Shows"
                shows={thrillerShows.shows}
                loading={thrillerShows.loading}
                error={thrillerShows.error}
                onRetry={thrillerShows.refetch}
                hasMore={thrillerShows.hasMore}
                onLoadMore={thrillerShows.loadMore}
              />
            </LazySection>

            <LazySection>
              <ShowCarousel
                title="Upcoming Shows"
                shows={upcomingShowsHook.shows}
                loading={upcomingShowsHook.loading}
                error={upcomingShowsHook.error}
                onRetry={upcomingShowsHook.refetch}
                hasMore={upcomingShowsHook.hasMore}
                onLoadMore={upcomingShowsHook.loadMore}
              />
            </LazySection>
          </>
        )}
      </div>
    </div>
  )
}
