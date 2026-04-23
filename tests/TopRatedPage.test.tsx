import { render, screen, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import { TopRatedPage } from '../src/pages/TopRatedPage'

vi.mock('../src/hooks/useInfiniteMovies', () => ({
  useInfiniteMovies: vi.fn(),
}))
vi.mock('../src/context/ContentFilterContext', () => ({
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
vi.mock('../src/services/tmdbApi', () => ({
  getImageUrl: (path: string | null) => (path ? `https://img.tmdb.org${path}` : null),
  getTopRatedMovies: vi.fn(),
}))

import { useInfiniteMovies } from '../src/hooks/useInfiniteMovies'

const mockMovies = [
  { id: 1, title: 'Top Movie 1', poster_path: '/top1.jpg', release_date: '2023-01-01', vote_average: 9.2, vote_count: 5000, overview: '', backdrop_path: null, adult: false, original_language: 'en', original_title: 'Top Movie 1', popularity: 200, video: false },
  { id: 2, title: 'Top Movie 2', poster_path: '/top2.jpg', release_date: '2023-02-01', vote_average: 8.8, vote_count: 4000, overview: '', backdrop_path: null, adult: false, original_language: 'en', original_title: 'Top Movie 2', popularity: 180, video: false },
]

const defaultHook = {
  movies: mockMovies,
  loading: false,
  error: null,
  hasMore: true,
  fetchMore: vi.fn(),
  refetch: vi.fn(),
}

describe('TopRatedPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(useInfiniteMovies as ReturnType<typeof vi.fn>).mockReturnValue(defaultHook)
  })

  test('renders page heading', () => {
    render(<TopRatedPage />)
    expect(screen.getByText('Top Rated Movies')).toBeInTheDocument()
  })

  test('renders movie cards when data loads', async () => {
    render(<TopRatedPage />)
    await waitFor(() => {
      expect(screen.getByText('Top Movie 1')).toBeInTheDocument()
      expect(screen.getByText('Top Movie 2')).toBeInTheDocument()
    })
  })

  test('does not render pagination controls', () => {
    render(<TopRatedPage />)
    expect(screen.queryByText('Next')).not.toBeInTheDocument()
    expect(screen.queryByText('Previous')).not.toBeInTheDocument()
  })

  test('shows end-of-list message when hasMore is false', async () => {
    ;(useInfiniteMovies as ReturnType<typeof vi.fn>).mockReturnValue({
      ...defaultHook,
      hasMore: false,
    })
    render(<TopRatedPage />)
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
    render(<TopRatedPage />)
    await waitFor(() => {
      expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    })
  })
})
