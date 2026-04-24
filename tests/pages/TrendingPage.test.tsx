import { render, screen, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import { TrendingPage } from '../../src/pages/TrendingPage'

vi.mock('../../src/hooks/useInfiniteMovies', () => ({
  useInfiniteMovies: vi.fn(),
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
  getTrendingMovies: vi.fn(),
}))

import { useInfiniteMovies } from '../../src/hooks/useInfiniteMovies'

const mockMovies = [
  { id: 1, title: 'Test Movie 1', poster_path: '/test1.jpg', release_date: '2023-01-01', vote_average: 8.5, vote_count: 1000, overview: '', backdrop_path: null, adult: false, original_language: 'en', original_title: 'Test Movie 1', popularity: 100, video: false },
  { id: 2, title: 'Test Movie 2', poster_path: '/test2.jpg', release_date: '2023-02-01', vote_average: 7.2, vote_count: 800, overview: '', backdrop_path: null, adult: false, original_language: 'en', original_title: 'Test Movie 2', popularity: 90, video: false },
]

const defaultHook = {
  movies: mockMovies,
  loading: false,
  error: null,
  hasMore: true,
  fetchMore: vi.fn(),
  refetch: vi.fn(),
}

describe('TrendingPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(useInfiniteMovies as ReturnType<typeof vi.fn>).mockReturnValue(defaultHook)
  })

  test('renders page heading', () => {
    render(<TrendingPage />)
    expect(screen.getByText('Trending Movies')).toBeInTheDocument()
  })

  test('renders movie cards when data loads', async () => {
    render(<TrendingPage />)
    await waitFor(() => {
      expect(screen.getByText('Test Movie 1')).toBeInTheDocument()
      expect(screen.getByText('Test Movie 2')).toBeInTheDocument()
    })
  })

  test('does not render pagination controls', () => {
    render(<TrendingPage />)
    expect(screen.queryByText('Next')).not.toBeInTheDocument()
    expect(screen.queryByText('Previous')).not.toBeInTheDocument()
  })

  test('renders InfiniteScrollTrigger sentinel', () => {
    render(<TrendingPage />)
    expect(screen.queryByText("You've reached the end")).not.toBeInTheDocument()
  })

  test('shows end-of-list message when hasMore is false', async () => {
    ;(useInfiniteMovies as ReturnType<typeof vi.fn>).mockReturnValue({
      ...defaultHook,
      hasMore: false,
    })
    render(<TrendingPage />)
    await waitFor(() => {
      expect(screen.getByText("You've reached the end")).toBeInTheDocument()
    })
  })

  test('renders error state', async () => {
    ;(useInfiniteMovies as ReturnType<typeof vi.fn>).mockReturnValue({
      ...defaultHook,
      movies: [],
      error: 'Something went wrong',
    })
    render(<TrendingPage />)
    await waitFor(() => {
      expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    })
  })
})
