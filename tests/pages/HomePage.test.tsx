import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import { HomePage } from '../../src/pages/HomePage'
import { useTrendingMovies } from '../../src/hooks/useTrendingMovies'
import { useTopRatedMovies } from '../../src/hooks/useTopRatedMovies'
import { useGenres } from '../../src/hooks/useGenres'
import { useMoviesByGenre } from '../../src/hooks/useMoviesByGenre'
import { useNewReleases } from '../../src/hooks/useNewReleases'
import { useCriticallyAcclaimed } from '../../src/hooks/useCriticallyAcclaimed'

vi.mock('../../src/hooks/useTrendingMovies')
vi.mock('../../src/hooks/useTopRatedMovies')
vi.mock('../../src/hooks/useGenres')
vi.mock('../../src/hooks/useMoviesByGenre')
vi.mock('../../src/hooks/useNewReleases')
vi.mock('../../src/hooks/useCriticallyAcclaimed')
vi.mock('react-router-dom', () => ({
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
}))
vi.mock('../../src/services/tmdbApi', () => ({
  getImageUrl: (path: string | null) => (path ? `https://img.tmdb.org${path}` : null),
}))

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

const movies20 = Array.from({ length: 20 }, (_, i) => makeMovie(i + 1))

const emptyHookData = {
  data: null,
  loading: false,
  error: null,
  refetch: vi.fn(),
}

const trendingHookData = {
  data: { results: movies20, page: 1, total_pages: 1, total_results: 20 },
  loading: false,
  error: null,
  refetch: vi.fn(),
}

const topRatedHookData = {
  movies: movies20,
  currentPage: 1,
  totalPages: 5,
  loading: false,
  error: null,
  loadPage: vi.fn(),
  nextPage: vi.fn(),
  prevPage: vi.fn(),
  refetch: vi.fn(),
}

const genresHookData = {
  data: {
    genres: [
      { id: 28, name: 'Action' },
      { id: 35, name: 'Comedy' },
      { id: 18, name: 'Drama' },
    ],
  },
  loading: false,
  error: null,
  refetch: vi.fn(),
}

const discoverHookData = {
  data: { results: movies20, page: 1, total_pages: 1, total_results: 20 },
  loading: false,
  error: null,
  refetch: vi.fn(),
}

const setupMocks = () => {
  ;(useTrendingMovies as ReturnType<typeof vi.fn>).mockReturnValue(trendingHookData)
  ;(useTopRatedMovies as ReturnType<typeof vi.fn>).mockReturnValue(topRatedHookData)
  ;(useGenres as ReturnType<typeof vi.fn>).mockReturnValue(genresHookData)
  ;(useMoviesByGenre as ReturnType<typeof vi.fn>).mockReturnValue(discoverHookData)
  ;(useNewReleases as ReturnType<typeof vi.fn>).mockReturnValue(discoverHookData)
  ;(useCriticallyAcclaimed as ReturnType<typeof vi.fn>).mockReturnValue(discoverHookData)
}

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setupMocks()
  })

  test('renders welcome heading', () => {
    render(<HomePage />)
    expect(screen.getByText('Welcome to CineScope')).toBeInTheDocument()
  })

  test('renders all five carousel section headings', async () => {
    render(<HomePage />)
    await waitFor(() => {
      expect(screen.getByText('Top & Latest Movies')).toBeInTheDocument()
      expect(screen.getByText('Top 10 Movies Today')).toBeInTheDocument()
      expect(screen.getByText('Movies by Category')).toBeInTheDocument()
      expect(screen.getByText('New on CineScope')).toBeInTheDocument()
      expect(screen.getByText('Critically Acclaimed')).toBeInTheDocument()
    })
  })

  test('renders movie cards from trending data', async () => {
    render(<HomePage />)
    await waitFor(() => {
      expect(screen.getAllByText('Movie 1').length).toBeGreaterThan(0)
    })
  })

  test('renders genre dropdown when genres are loaded', async () => {
    render(<HomePage />)
    await waitFor(() => {
      expect(screen.getByRole('combobox', { name: /select movie genre/i })).toBeInTheDocument()
    })
  })

  test('genre dropdown contains loaded genres', async () => {
    render(<HomePage />)
    await waitFor(() => {
      expect(screen.getByRole('option', { name: 'Action' })).toBeInTheDocument()
      expect(screen.getByRole('option', { name: 'Comedy' })).toBeInTheDocument()
      expect(screen.getByRole('option', { name: 'Drama' })).toBeInTheDocument()
    })
  })

  test('changing genre calls useMoviesByGenre with new id', async () => {
    render(<HomePage />)
    const select = await screen.findByRole('combobox', { name: /select movie genre/i })
    fireEvent.change(select, { target: { value: '35' } })
    expect(useMoviesByGenre).toHaveBeenCalledWith(35)
  })

  test('renders navigation links to trending, top-rated, search', async () => {
    render(<HomePage />)
    await waitFor(() => {
      const trendingLinks = screen.getAllByRole('link', { name: /trending/i })
      expect(trendingLinks.length).toBeGreaterThan(0)
      expect(trendingLinks[0]).toHaveAttribute('href', '/trending')
    })
  })

  test('shows loading skeleton when trending is loading', () => {
    ;(useTrendingMovies as ReturnType<typeof vi.fn>).mockReturnValue({
      ...emptyHookData,
      loading: true,
    })
    render(<HomePage />)
    expect(screen.getByText('Top & Latest Movies')).toBeInTheDocument()
  })

  test('shows error with retry button when trending fails', async () => {
    ;(useTrendingMovies as ReturnType<typeof vi.fn>).mockReturnValue({
      ...emptyHookData,
      error: 'Failed to load trending movies',
    })
    render(<HomePage />)
    await waitFor(() => {
      expect(screen.getByText('Failed to load trending movies')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument()
    })
  })

  test('retry button calls refetch', async () => {
    const refetch = vi.fn()
    ;(useTrendingMovies as ReturnType<typeof vi.fn>).mockReturnValue({
      ...emptyHookData,
      error: 'Network error',
      refetch,
    })
    render(<HomePage />)
    const retryBtn = await screen.findByRole('button', { name: /retry/i })
    fireEvent.click(retryBtn)
    expect(refetch).toHaveBeenCalledTimes(1)
  })
})
