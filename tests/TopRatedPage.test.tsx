import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import { TopRatedPage } from '../src/pages/TopRatedPage'
import { useTopRatedMovies } from '../src/hooks/useTopRatedMovies'

vi.mock('../src/hooks/useTopRatedMovies')
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

const mockMovies = [
  { id: 1, title: 'Top Movie 1', poster_path: '/top1.jpg', release_date: '2023-01-01', vote_average: 9.2 },
  { id: 2, title: 'Top Movie 2', poster_path: '/top2.jpg', release_date: '2023-02-01', vote_average: 8.8 },
]

const defaultHook = {
  movies: mockMovies,
  currentPage: 1,
  totalPages: 5,
  loading: false,
  error: null,
  loadPage: vi.fn(),
  refetch: vi.fn(),
  nextPage: vi.fn(),
  prevPage: vi.fn(),
}

describe('TopRatedPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(useTopRatedMovies as ReturnType<typeof vi.fn>).mockReturnValue(defaultHook)
  })

  test('renders loading state initially', () => {
    ;(useTopRatedMovies as ReturnType<typeof vi.fn>).mockReturnValue({
      ...defaultHook,
      movies: [],
      loading: true,
    })
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

  test('renders pagination controls', async () => {
    render(<TopRatedPage />)
    await waitFor(() => {
      expect(screen.getByText('Next')).toBeInTheDocument()
      expect(screen.getByText('Previous')).toBeInTheDocument()
    })
  })

  test('handles page changes', async () => {
    const loadPage = vi.fn()
    ;(useTopRatedMovies as ReturnType<typeof vi.fn>).mockReturnValue({
      ...defaultHook,
      loadPage,
    })
    render(<TopRatedPage />)
    await waitFor(() => expect(screen.getByText('Next')).toBeInTheDocument())
    fireEvent.click(screen.getByText('Next'))
    expect(loadPage).toHaveBeenCalledWith(2)
  })

  test('renders error state when API fails', async () => {
    ;(useTopRatedMovies as ReturnType<typeof vi.fn>).mockReturnValue({
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
