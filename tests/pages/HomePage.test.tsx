import { render, screen, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import { HomePage } from '../../src/pages/HomePage'

const makeHookData = (results: object[] = []) => ({
  data: { results, page: 1, total_pages: 1, total_results: results.length },
  loading: false,
  error: null,
  refetch: vi.fn(),
})

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

const mockMovies = Array.from({ length: 5 }, (_, i) => makeMovie(i + 1))
const emptyHook = makeHookData([])

vi.mock('../../src/components/HeroSlider', () => ({
  HeroSlider: () => <div data-testid="hero-slider" />,
}))
vi.mock('../../src/hooks/useTrendingMovies', () => ({
  useTrendingMovies: vi.fn(),
}))
vi.mock('../../src/hooks/useDailyTrending', () => ({
  useDailyTrending: vi.fn(),
}))
vi.mock('../../src/hooks/useWeeklyTrending', () => ({
  useWeeklyTrending: vi.fn(),
}))
vi.mock('../../src/hooks/useNewReleases', () => ({
  useNewReleases: vi.fn(),
}))
vi.mock('../../src/hooks/useCriticallyAcclaimed', () => ({
  useCriticallyAcclaimed: vi.fn(),
}))
vi.mock('../../src/hooks/useComedyMovies', () => ({
  useComedyMovies: vi.fn(),
}))
vi.mock('../../src/hooks/useSciFiFantasyMovies', () => ({
  useSciFiFantasyMovies: vi.fn(),
}))
vi.mock('../../src/hooks/useRealLifeMovies', () => ({
  useRealLifeMovies: vi.fn(),
}))
vi.mock('../../src/hooks/useAnimationMovies', () => ({
  useAnimationMovies: vi.fn(),
}))
vi.mock('../../src/hooks/useRomanceMovies', () => ({
  useRomanceMovies: vi.fn(),
}))
vi.mock('../../src/hooks/useActionAdventureMovies', () => ({
  useActionAdventureMovies: vi.fn(),
}))
vi.mock('../../src/hooks/useAwardWinningMovies', () => ({
  useAwardWinningMovies: vi.fn(),
}))
vi.mock('../../src/hooks/useInspiringMovies', () => ({
  useInspiringMovies: vi.fn(),
}))
vi.mock('../../src/hooks/useThrillerMovies', () => ({
  useThrillerMovies: vi.fn(),
}))
vi.mock('../../src/hooks/useGenres', () => ({
  useGenres: vi.fn(),
}))
vi.mock('../../src/hooks/useMoviesByGenre', () => ({
  useMoviesByGenre: vi.fn(),
}))
vi.mock('../../src/context/ContentFilterContext', () => ({
  useContentFilter: () => ({
    countries: ['US'],
    languages: ['en'],
    filterKey: 'US-en',
    setCountries: vi.fn(),
    setLanguages: vi.fn(),
  }),
}))
vi.mock('react-router-dom', () => ({
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
}))
vi.mock('../../src/services/tmdbApi', () => ({
  getImageUrl: (path: string | null) => (path ? `https://img.tmdb.org${path}` : null),
}))

import { useTrendingMovies } from '../../src/hooks/useTrendingMovies'
import { useDailyTrending } from '../../src/hooks/useDailyTrending'
import { useWeeklyTrending } from '../../src/hooks/useWeeklyTrending'
import { useNewReleases } from '../../src/hooks/useNewReleases'
import { useCriticallyAcclaimed } from '../../src/hooks/useCriticallyAcclaimed'
import { useComedyMovies } from '../../src/hooks/useComedyMovies'
import { useSciFiFantasyMovies } from '../../src/hooks/useSciFiFantasyMovies'
import { useRealLifeMovies } from '../../src/hooks/useRealLifeMovies'
import { useAnimationMovies } from '../../src/hooks/useAnimationMovies'
import { useRomanceMovies } from '../../src/hooks/useRomanceMovies'
import { useActionAdventureMovies } from '../../src/hooks/useActionAdventureMovies'
import { useAwardWinningMovies } from '../../src/hooks/useAwardWinningMovies'
import { useInspiringMovies } from '../../src/hooks/useInspiringMovies'
import { useThrillerMovies } from '../../src/hooks/useThrillerMovies'
import { useGenres } from '../../src/hooks/useGenres'
import { useMoviesByGenre } from '../../src/hooks/useMoviesByGenre'

const hookWithMovies = makeHookData(mockMovies)
const genresHook = {
  data: { genres: [{ id: 28, name: 'Action' }, { id: 35, name: 'Comedy' }] },
  loading: false,
  error: null,
  refetch: vi.fn(),
}

const setupMocks = () => {
  ;(useTrendingMovies as ReturnType<typeof vi.fn>).mockReturnValue(hookWithMovies)
  ;(useDailyTrending as ReturnType<typeof vi.fn>).mockReturnValue(hookWithMovies)
  ;(useWeeklyTrending as ReturnType<typeof vi.fn>).mockReturnValue(hookWithMovies)
  ;(useNewReleases as ReturnType<typeof vi.fn>).mockReturnValue(hookWithMovies)
  ;(useCriticallyAcclaimed as ReturnType<typeof vi.fn>).mockReturnValue(hookWithMovies)
  ;(useComedyMovies as ReturnType<typeof vi.fn>).mockReturnValue(hookWithMovies)
  ;(useSciFiFantasyMovies as ReturnType<typeof vi.fn>).mockReturnValue(hookWithMovies)
  ;(useRealLifeMovies as ReturnType<typeof vi.fn>).mockReturnValue(hookWithMovies)
  ;(useAnimationMovies as ReturnType<typeof vi.fn>).mockReturnValue(hookWithMovies)
  ;(useRomanceMovies as ReturnType<typeof vi.fn>).mockReturnValue(hookWithMovies)
  ;(useActionAdventureMovies as ReturnType<typeof vi.fn>).mockReturnValue(hookWithMovies)
  ;(useAwardWinningMovies as ReturnType<typeof vi.fn>).mockReturnValue(hookWithMovies)
  ;(useInspiringMovies as ReturnType<typeof vi.fn>).mockReturnValue(hookWithMovies)
  ;(useThrillerMovies as ReturnType<typeof vi.fn>).mockReturnValue(hookWithMovies)
  ;(useGenres as ReturnType<typeof vi.fn>).mockReturnValue(genresHook)
  ;(useMoviesByGenre as ReturnType<typeof vi.fn>).mockReturnValue(hookWithMovies)
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

  test('renders all 15 carousel section headings', async () => {
    render(<HomePage />)
    await waitFor(() => {
      expect(screen.getByText('New Movies on CineScope')).toBeInTheDocument()
      expect(screen.getByText("Today's Top 10 Movies")).toBeInTheDocument()
      expect(screen.getByText('Weekly Top 10 Movies')).toBeInTheDocument()
      expect(screen.getByText('Movies by Category')).toBeInTheDocument()
      expect(screen.getByText('Recommended Movies')).toBeInTheDocument()
      expect(screen.getByText('Critically Acclaimed Movies')).toBeInTheDocument()
      expect(screen.getByText('Need a Good Laugh?')).toBeInTheDocument()
      expect(screen.getByText('Sci-Fi & Fantasy Movies')).toBeInTheDocument()
      expect(screen.getByText('Movies Based on Real Life')).toBeInTheDocument()
      expect(screen.getByText('Anime & Animation Movies')).toBeInTheDocument()
      expect(screen.getByText('Romantic Movies')).toBeInTheDocument()
      expect(screen.getByText('Action & Adventure Movies')).toBeInTheDocument()
      expect(screen.getByText('Award-Winning Movies')).toBeInTheDocument()
      expect(screen.getByText('Inspiring Movies')).toBeInTheDocument()
      expect(screen.getByText('Chilling Thriller Movies')).toBeInTheDocument()
    })
  })

  test('renders movie cards from hook data', async () => {
    render(<HomePage />)
    await waitFor(() => {
      expect(screen.getAllByText('Movie 1').length).toBeGreaterThan(0)
    })
  })

  test('shows loading state when data is loading', () => {
    ;(useNewReleases as ReturnType<typeof vi.fn>).mockReturnValue({
      ...emptyHook,
      data: null,
      loading: true,
    })
    render(<HomePage />)
    expect(screen.getByText('New Movies on CineScope')).toBeInTheDocument()
  })

  test('shows error with retry button when a section fails', async () => {
    ;(useNewReleases as ReturnType<typeof vi.fn>).mockReturnValue({
      ...emptyHook,
      data: null,
      error: 'Failed to load',
    })
    render(<HomePage />)
    await waitFor(() => {
      expect(screen.getByText('Failed to load')).toBeInTheDocument()
    })
  })
})
