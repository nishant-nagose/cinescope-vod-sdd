import { render, screen, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import { TrendingPage } from '../src/pages/TrendingPage'
import { useTrendingMovies } from '../src/hooks/useTrendingMovies'

vi.mock('../src/hooks/useTrendingMovies')
vi.mock('react-router-dom', () => ({
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
}))
vi.mock('../src/services/tmdbApi', () => ({
  getImageUrl: (path: string | null) => (path ? `https://img.tmdb.org${path}` : null),
}))

const mockMovies = [
  { id: 1, title: 'Test Movie 1', poster_path: '/test1.jpg', release_date: '2023-01-01', vote_average: 8.5, vote_count: 1000, overview: '', backdrop_path: null, adult: false, original_language: 'en', original_title: 'Test Movie 1', popularity: 100, video: false },
  { id: 2, title: 'Test Movie 2', poster_path: '/test2.jpg', release_date: '2023-02-01', vote_average: 7.2, vote_count: 800, overview: '', backdrop_path: null, adult: false, original_language: 'en', original_title: 'Test Movie 2', popularity: 90, video: false },
]

const defaultHook = {
  data: { results: mockMovies, page: 1, total_pages: 1, total_results: 2 },
  loading: false,
  error: null,
  refetch: vi.fn(),
}

describe('TrendingPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(useTrendingMovies as ReturnType<typeof vi.fn>).mockReturnValue(defaultHook)
  })

  test('renders loading state initially', () => {
    ;(useTrendingMovies as ReturnType<typeof vi.fn>).mockReturnValue({
      ...defaultHook,
      data: null,
      loading: true,
    })
    render(<TrendingPage />)
    expect(screen.getByText('Trending Movies')).toBeInTheDocument()
  })

  test('renders movie cards when data loads', async () => {
    render(<TrendingPage />)
    await waitFor(() => {
      expect(screen.getByText('Test Movie 1')).toBeInTheDocument()
      expect(screen.getByText('Test Movie 2')).toBeInTheDocument()
    })
    const links = screen.getAllByRole('link')
    expect(links[0]).toHaveAttribute('href', '/movie/1')
    expect(links[1]).toHaveAttribute('href', '/movie/2')
  })

  test('renders error state when API fails', async () => {
    ;(useTrendingMovies as ReturnType<typeof vi.fn>).mockReturnValue({
      ...defaultHook,
      data: null,
      error: 'Something went wrong',
    })
    render(<TrendingPage />)
    await waitFor(() => {
      expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    })
  })
})
