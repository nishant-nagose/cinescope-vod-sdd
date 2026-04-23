import { useState } from 'react'
import { MovieCarousel } from '../components/MovieCarousel'
import { HeroSlider } from '../components/HeroSlider'
import { CategoryDropdown } from '../components/CategoryDropdown'
import { useTrendingMovies } from '../hooks/useTrendingMovies'
import { useGenres } from '../hooks/useGenres'
import { useMoviesByGenre } from '../hooks/useMoviesByGenre'
import { useNewReleases } from '../hooks/useNewReleases'
import { useCriticallyAcclaimed } from '../hooks/useCriticallyAcclaimed'
import { useDailyTrending } from '../hooks/useDailyTrending'
import { useWeeklyTrending } from '../hooks/useWeeklyTrending'
import { useComedyMovies } from '../hooks/useComedyMovies'
import { useSciFiFantasyMovies } from '../hooks/useSciFiFantasyMovies'
import { useRealLifeMovies } from '../hooks/useRealLifeMovies'
import { useAnimationMovies } from '../hooks/useAnimationMovies'
import { useRomanceMovies } from '../hooks/useRomanceMovies'
import { useActionAdventureMovies } from '../hooks/useActionAdventureMovies'
import { useAwardWinningMovies } from '../hooks/useAwardWinningMovies'
import { useInspiringMovies } from '../hooks/useInspiringMovies'
import { useThrillerMovies } from '../hooks/useThrillerMovies'

const ACTION_GENRE_ID = 28

export const HomePage = () => {
  const [selectedGenreId, setSelectedGenreId] = useState(ACTION_GENRE_ID)

  const dailyTrending = useDailyTrending()
  const weeklyTrending = useWeeklyTrending()
  const newReleases = useNewReleases()
  const trending = useTrendingMovies()
  const acclaimed = useCriticallyAcclaimed()
  const comedy = useComedyMovies()
  const sciFiFantasy = useSciFiFantasyMovies()
  const realLife = useRealLifeMovies()
  const animation = useAnimationMovies()
  const romance = useRomanceMovies()
  const actionAdventure = useActionAdventureMovies()
  const awardWinning = useAwardWinningMovies()
  const inspiring = useInspiringMovies()
  const thriller = useThrillerMovies()
  const genres = useGenres()
  const byGenre = useMoviesByGenre(selectedGenreId)

  return (
    <div>
      <HeroSlider
        movies={dailyTrending.data?.results ?? []}
        loading={dailyTrending.loading}
      />

      <div className="py-4 sm:py-6">
        <MovieCarousel
          title="New Movies on CineScope"
          movies={newReleases.data?.results ?? []}
          loading={newReleases.loading}
          error={newReleases.error}
          onRetry={newReleases.refetch}
          emptyMessage="No new releases found for the selected filters."
        />

        <MovieCarousel
          title="Today's Top 10 Movies"
          movies={dailyTrending.data?.results ?? []}
          loading={dailyTrending.loading}
          error={dailyTrending.error}
          onRetry={dailyTrending.refetch}
          emptyMessage="No trending movies found."
          rankDisplay
          maxItems={10}
        />

        <MovieCarousel
          title="Weekly Top 10 Movies"
          movies={weeklyTrending.data?.results ?? []}
          loading={weeklyTrending.loading}
          error={weeklyTrending.error}
          onRetry={weeklyTrending.refetch}
          emptyMessage="No weekly trending movies found."
          maxItems={10}
        />

        <MovieCarousel
          title="Movies by Category"
          titleExtra={
            genres.data ? (
              <CategoryDropdown
                genres={genres.data.genres}
                selectedGenreId={selectedGenreId}
                onChange={setSelectedGenreId}
              />
            ) : undefined
          }
          movies={byGenre.data?.results ?? []}
          loading={byGenre.loading || genres.loading}
          error={byGenre.error}
          onRetry={byGenre.refetch}
          emptyMessage="No movies found for the selected category."
        />

        <MovieCarousel
          title="Recommended Movies"
          movies={trending.data?.results ?? []}
          loading={trending.loading}
          error={trending.error}
          onRetry={trending.refetch}
          emptyMessage="No recommended movies found."
        />

        <MovieCarousel
          title="Critically Acclaimed Movies"
          movies={acclaimed.data?.results ?? []}
          loading={acclaimed.loading}
          error={acclaimed.error}
          onRetry={acclaimed.refetch}
          emptyMessage="No critically acclaimed movies found."
        />

        <MovieCarousel
          title="Need a Good Laugh?"
          movies={comedy.data?.results ?? []}
          loading={comedy.loading}
          error={comedy.error}
          onRetry={comedy.refetch}
          emptyMessage="No comedy movies found for the selected filters."
        />

        <MovieCarousel
          title="Sci-Fi & Fantasy Movies"
          movies={sciFiFantasy.data?.results ?? []}
          loading={sciFiFantasy.loading}
          error={sciFiFantasy.error}
          onRetry={sciFiFantasy.refetch}
          emptyMessage="No sci-fi or fantasy movies found."
        />

        <MovieCarousel
          title="Movies Based on Real Life"
          movies={realLife.data?.results ?? []}
          loading={realLife.loading}
          error={realLife.error}
          onRetry={realLife.refetch}
          emptyMessage="No real-life movies found for the selected filters."
        />

        <MovieCarousel
          title="Anime & Animation Movies"
          movies={animation.data?.results ?? []}
          loading={animation.loading}
          error={animation.error}
          onRetry={animation.refetch}
          emptyMessage="No animation movies found."
        />

        <MovieCarousel
          title="Romantic Movies"
          movies={romance.data?.results ?? []}
          loading={romance.loading}
          error={romance.error}
          onRetry={romance.refetch}
          emptyMessage="No romantic movies found."
        />

        <MovieCarousel
          title="Action & Adventure Movies"
          movies={actionAdventure.data?.results ?? []}
          loading={actionAdventure.loading}
          error={actionAdventure.error}
          onRetry={actionAdventure.refetch}
          emptyMessage="No action or adventure movies found."
        />

        <MovieCarousel
          title="Award-Winning Movies"
          movies={awardWinning.data?.results ?? []}
          loading={awardWinning.loading}
          error={awardWinning.error}
          onRetry={awardWinning.refetch}
          emptyMessage="No award-winning movies found."
        />

        <MovieCarousel
          title="Inspiring Movies"
          movies={inspiring.data?.results ?? []}
          loading={inspiring.loading}
          error={inspiring.error}
          onRetry={inspiring.refetch}
          emptyMessage="No inspiring movies found."
        />

        <MovieCarousel
          title="Chilling Thriller Movies"
          movies={thriller.data?.results ?? []}
          loading={thriller.loading}
          error={thriller.error}
          onRetry={thriller.refetch}
          emptyMessage="No thriller movies found."
        />
      </div>
    </div>
  )
}
