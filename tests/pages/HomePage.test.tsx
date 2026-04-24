import { render, screen, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import { HomePage } from '../../src/pages/HomePage'

const makeMovie = (id: number) => ({
  id,
  title: `Movie ${id}`,
  poster_path: `/poster${id}.jpg`,
  release_date: '2024-01-01',
  vote_average: 7.5,
  vote_count: 500,
  overview: '',
  backdrop_path: null,
  adult: false,
  original_language: 'en',
  original_title: `Movie ${id}`,
  popularity: 100,
  video: false,
})

const mockMovies = Array.from({ length: 3 }, (_, i) => makeMovie(i + 1))

const movieHook = {
  movies: mockMovies,
  loading: false,
  error: null,
  hasMore: false,
  fetchMore: vi.fn(),
  refetch: vi.fn(),
}

const emptyMovieHook = { movies: [], loading: false, error: null, hasMore: false, fetchMore: vi.fn(), refetch: vi.fn() }

const showHook = { shows: [], loading: false, error: null, hasMore: false, loadMore: vi.fn(), refetch: vi.fn() }

vi.mock('../../src/components/HeroSlider', () => ({
  HeroSlider: () => <div data-testid="hero-slider" />,
}))
vi.mock('../../src/components/LazySection', () => ({
  LazySection: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))
vi.mock('../../src/components/MovieCarousel', () => ({
  MovieCarousel: ({ title, movies, error, onRetry }: { title: string; movies?: Array<{ id: number; title: string }>; error?: string | null; onRetry?: () => void }) => (
    <div>
      <span>{title}</span>
      {movies?.map(m => <span key={m.id}>{m.title}</span>)}
      {error && onRetry && <button onClick={onRetry}>Retry</button>}
    </div>
  ),
}))
vi.mock('../../src/components/ShowCarousel', () => ({
  ShowCarousel: ({ title }: { title: string }) => <div><span>{title}</span></div>,
}))
vi.mock('../../src/hooks/useHeroSlider', () => ({
  useHeroSlider: vi.fn(),
}))
vi.mock('../../src/hooks/useInfiniteMovies', () => ({
  useInfiniteMovies: vi.fn(),
}))
vi.mock('../../src/hooks/useTVDailyTrending', () => ({ useTVDailyTrending: vi.fn() }))
vi.mock('../../src/hooks/useTVWeeklyTrending', () => ({ useTVWeeklyTrending: vi.fn() }))
vi.mock('../../src/hooks/useNewShows', () => ({ useNewShows: vi.fn() }))
vi.mock('../../src/hooks/useRecommendedShows', () => ({ useRecommendedShows: vi.fn() }))
vi.mock('../../src/hooks/useCriticallyAcclaimedShows', () => ({ useCriticallyAcclaimedShows: vi.fn() }))
vi.mock('../../src/hooks/useComedyShows', () => ({ useComedyShows: vi.fn() }))
vi.mock('../../src/hooks/useSciFiFantasyShows', () => ({ useSciFiFantasyShows: vi.fn() }))
vi.mock('../../src/hooks/useRealLifeShows', () => ({ useRealLifeShows: vi.fn() }))
vi.mock('../../src/hooks/useAnimationShows', () => ({ useAnimationShows: vi.fn() }))
vi.mock('../../src/hooks/useRomanceShows', () => ({ useRomanceShows: vi.fn() }))
vi.mock('../../src/hooks/useActionAdventureShows', () => ({ useActionAdventureShows: vi.fn() }))
vi.mock('../../src/hooks/useAwardWinningShows', () => ({ useAwardWinningShows: vi.fn() }))
vi.mock('../../src/hooks/useInspiringShows', () => ({ useInspiringShows: vi.fn() }))
vi.mock('../../src/hooks/useThrillerShows', () => ({ useThrillerShows: vi.fn() }))
vi.mock('../../src/hooks/useUpcomingShows', () => ({ useUpcomingShows: vi.fn() }))
vi.mock('../../src/context/ContentFilterContext', () => ({
  useContentFilter: () => ({
    countries: ['US'],
    languages: ['en'],
    contentType: 'all',
    activeCategory: null,
    filterKey: 'US-en-all-all',
    setCountries: vi.fn(),
    setLanguages: vi.fn(),
    setContentType: vi.fn(),
    setActiveCategory: vi.fn(),
  }),
}))
vi.mock('react-router-dom', () => ({
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => <a href={to}>{children}</a>,
}))
vi.mock('../../src/services/tmdbApi', () => ({
  getImageUrl: (path: string | null) => (path ? `https://img.tmdb.org${path}` : null),
  getTrendingMovies: vi.fn(),
  getNewReleases: vi.fn(),
  getCriticallyAcclaimed: vi.fn(),
  getComedyMovies: vi.fn(),
  getSciFiFantasyMovies: vi.fn(),
  getRealLifeMovies: vi.fn(),
  getAnimationMovies: vi.fn(),
  getRomanceMovies: vi.fn(),
  getActionAdventureMovies: vi.fn(),
  getAwardWinningMovies: vi.fn(),
  getInspiringMovies: vi.fn(),
  getThrillerMovies: vi.fn(),
  getDailyTrending: vi.fn(),
  getWeeklyTrending: vi.fn(),
  getUpcomingMovies: vi.fn(),
}))

import { useHeroSlider } from '../../src/hooks/useHeroSlider'
import { useInfiniteMovies } from '../../src/hooks/useInfiniteMovies'
import { useTVDailyTrending } from '../../src/hooks/useTVDailyTrending'
import { useTVWeeklyTrending } from '../../src/hooks/useTVWeeklyTrending'
import { useNewShows } from '../../src/hooks/useNewShows'
import { useRecommendedShows } from '../../src/hooks/useRecommendedShows'
import { useCriticallyAcclaimedShows } from '../../src/hooks/useCriticallyAcclaimedShows'
import { useComedyShows } from '../../src/hooks/useComedyShows'
import { useSciFiFantasyShows } from '../../src/hooks/useSciFiFantasyShows'
import { useRealLifeShows } from '../../src/hooks/useRealLifeShows'
import { useAnimationShows } from '../../src/hooks/useAnimationShows'
import { useRomanceShows } from '../../src/hooks/useRomanceShows'
import { useActionAdventureShows } from '../../src/hooks/useActionAdventureShows'
import { useAwardWinningShows } from '../../src/hooks/useAwardWinningShows'
import { useInspiringShows } from '../../src/hooks/useInspiringShows'
import { useThrillerShows } from '../../src/hooks/useThrillerShows'
import { useUpcomingShows } from '../../src/hooks/useUpcomingShows'

const setupMocks = () => {
  ;(useHeroSlider as ReturnType<typeof vi.fn>).mockReturnValue({ items: [], loading: false, currentVideoKey: null })
  ;(useInfiniteMovies as ReturnType<typeof vi.fn>).mockReturnValue(movieHook)
  ;(useTVDailyTrending as ReturnType<typeof vi.fn>).mockReturnValue(showHook)
  ;(useTVWeeklyTrending as ReturnType<typeof vi.fn>).mockReturnValue(showHook)
  ;(useNewShows as ReturnType<typeof vi.fn>).mockReturnValue(showHook)
  ;(useRecommendedShows as ReturnType<typeof vi.fn>).mockReturnValue(showHook)
  ;(useCriticallyAcclaimedShows as ReturnType<typeof vi.fn>).mockReturnValue(showHook)
  ;(useComedyShows as ReturnType<typeof vi.fn>).mockReturnValue(showHook)
  ;(useSciFiFantasyShows as ReturnType<typeof vi.fn>).mockReturnValue(showHook)
  ;(useRealLifeShows as ReturnType<typeof vi.fn>).mockReturnValue(showHook)
  ;(useAnimationShows as ReturnType<typeof vi.fn>).mockReturnValue(showHook)
  ;(useRomanceShows as ReturnType<typeof vi.fn>).mockReturnValue(showHook)
  ;(useActionAdventureShows as ReturnType<typeof vi.fn>).mockReturnValue(showHook)
  ;(useAwardWinningShows as ReturnType<typeof vi.fn>).mockReturnValue(showHook)
  ;(useInspiringShows as ReturnType<typeof vi.fn>).mockReturnValue(showHook)
  ;(useThrillerShows as ReturnType<typeof vi.fn>).mockReturnValue(showHook)
  ;(useUpcomingShows as ReturnType<typeof vi.fn>).mockReturnValue(showHook)
}

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setupMocks()
  })

  test('renders HeroSlider', () => {
    render(<HomePage />)
    expect(screen.getByTestId('hero-slider')).toBeInTheDocument()
  })

  test('renders welcome message', () => {
    render(<HomePage />)
    expect(screen.getByText('Welcome to CineScope')).toBeInTheDocument()
  })

  test('renders movie carousel section headings', async () => {
    render(<HomePage />)
    await waitFor(() => {
      expect(screen.getByText('New Movies on CineScope')).toBeInTheDocument()
      expect(screen.getByText("Today's Top 10 Movies")).toBeInTheDocument()
      expect(screen.getByText('Weekly Top 10 Movies')).toBeInTheDocument()
      expect(screen.getByText('Recommended Movies')).toBeInTheDocument()
      expect(screen.getByText('Critically Acclaimed Movies')).toBeInTheDocument()
      expect(screen.getAllByText('Need a Good Laugh?').length).toBeGreaterThan(0)
      expect(screen.getByText('Sci‑Fi & Fantasy Movies')).toBeInTheDocument()
      expect(screen.getByText('Movies Based on Real Life')).toBeInTheDocument()
      expect(screen.getByText('Anime & Animation Movies')).toBeInTheDocument()
      expect(screen.getByText('Romantic Movies')).toBeInTheDocument()
      expect(screen.getByText('Action & Adventure Movies')).toBeInTheDocument()
      expect(screen.getByText('Award‑Winning Movies')).toBeInTheDocument()
      expect(screen.getByText('Inspiring Movies')).toBeInTheDocument()
      expect(screen.getByText('Chilling Thriller Movies')).toBeInTheDocument()
      expect(screen.getByText('Upcoming Movies')).toBeInTheDocument()
    })
  })

  test('renders movie cards from hook data', async () => {
    render(<HomePage />)
    await waitFor(() => {
      expect(screen.getAllByText('Movie 1').length).toBeGreaterThan(0)
    })
  })

  test('shows loading state when data is loading', () => {
    ;(useInfiniteMovies as ReturnType<typeof vi.fn>).mockReturnValue({
      ...emptyMovieHook,
      loading: true,
    })
    render(<HomePage />)
    expect(screen.getByText('New Movies on CineScope')).toBeInTheDocument()
  })

  test('shows retry button when a section has an error', async () => {
    ;(useInfiniteMovies as ReturnType<typeof vi.fn>).mockReturnValue({
      ...emptyMovieHook,
      error: 'Failed to load',
    })
    render(<HomePage />)
    await waitFor(() => {
      expect(screen.getAllByRole('button', { name: /retry/i }).length).toBeGreaterThan(0)
    })
  })
})
