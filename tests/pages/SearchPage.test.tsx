import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import { SearchPage } from '../../src/pages/SearchPage'
import { useMovieSearch } from '../../src/hooks/useMovieSearch'

vi.mock('../../src/hooks/useMovieSearch')
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
  useNavigate: () => vi.fn(),
  useSearchParams: () => [new URLSearchParams(), vi.fn()],
}))

const mockMovies = [
  { id: 1, title: 'Inception', poster_path: '/inc.jpg', release_date: '2010-07-16', vote_average: 8.8, vote_count: 34000, overview: '', backdrop_path: null, adult: false, original_language: 'en', original_title: 'Inception', popularity: 100, video: false },
  { id: 2, title: 'The Dark Knight', poster_path: '/tdk.jpg', release_date: '2008-07-18', vote_average: 9.0, vote_count: 29000, overview: '', backdrop_path: null, adult: false, original_language: 'en', original_title: 'The Dark Knight', popularity: 110, video: false },
]

const defaultHook = {
  results: [],
  loading: false,
  error: null,
  query: '',
  page: 1,
  totalPages: 0,
  setQuery: vi.fn(),
  setPage: vi.fn(),
}

describe('SearchPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(useMovieSearch as ReturnType<typeof vi.fn>).mockReturnValue(defaultHook)
  })

  test('shows prompt when query is empty', () => {
    render(<SearchPage />)
    expect(screen.getByText('Enter a movie title to start searching.')).toBeInTheDocument()
  })

  test('shows "type more" message when query is less than 3 chars', () => {
    ;(useMovieSearch as ReturnType<typeof vi.fn>).mockReturnValue({ ...defaultHook, query: 'in' })
    render(<SearchPage />)
    expect(screen.getByText('Type at least 3 characters to search.')).toBeInTheDocument()
  })

  test('shows no-results message when query >= 3 chars but no results', () => {
    ;(useMovieSearch as ReturnType<typeof vi.fn>).mockReturnValue({
      ...defaultHook,
      query: 'zzz',
      results: [],
      totalPages: 0,
    })
    render(<SearchPage />)
    expect(screen.getByText(/No movies found for/)).toBeInTheDocument()
  })

  test('renders movie results when search returns data', async () => {
    ;(useMovieSearch as ReturnType<typeof vi.fn>).mockReturnValue({
      ...defaultHook,
      query: 'inception',
      results: mockMovies,
      totalPages: 1,
    })
    render(<SearchPage />)
    await waitFor(() => {
      expect(screen.getByText('Inception')).toBeInTheDocument()
      expect(screen.getByText('The Dark Knight')).toBeInTheDocument()
    })
  })

  test('renders pagination when totalPages > 1', async () => {
    ;(useMovieSearch as ReturnType<typeof vi.fn>).mockReturnValue({
      ...defaultHook,
      query: 'batman',
      results: mockMovies,
      totalPages: 5,
      page: 1,
    })
    render(<SearchPage />)
    await waitFor(() => {
      expect(screen.getByText('Next')).toBeInTheDocument()
      expect(screen.getByText('Previous')).toBeInTheDocument()
    })
  })

  test('renders error state with retry button', async () => {
    ;(useMovieSearch as ReturnType<typeof vi.fn>).mockReturnValue({
      ...defaultHook,
      query: 'batman',
      error: 'Something went wrong',
      results: [],
    })
    render(<SearchPage />)
    await waitFor(() => {
      expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    })
  })

  test('shows sort controls when results are present', async () => {
    ;(useMovieSearch as ReturnType<typeof vi.fn>).mockReturnValue({
      ...defaultHook,
      query: 'inception',
      results: mockMovies,
    })
    render(<SearchPage />)
    await waitFor(() => {
      expect(screen.getByText('Relevance')).toBeInTheDocument()
      expect(screen.getByText('Rating')).toBeInTheDocument()
      expect(screen.getByText('Release Date')).toBeInTheDocument()
    })
  })

  test('sort by rating reorders results by vote_average descending', async () => {
    ;(useMovieSearch as ReturnType<typeof vi.fn>).mockReturnValue({
      ...defaultHook,
      query: 'dark',
      results: mockMovies,
    })
    render(<SearchPage />)
    await waitFor(() => expect(screen.getByText('Rating')).toBeInTheDocument())
    fireEvent.click(screen.getByText('Rating'))
    const cards = screen.getAllByRole('link')
    expect(cards[0]).toHaveAttribute('href', '/movie/2')
  })

  test('sort by release date reorders results by date descending', async () => {
    ;(useMovieSearch as ReturnType<typeof vi.fn>).mockReturnValue({
      ...defaultHook,
      query: 'dark',
      results: mockMovies,
    })
    render(<SearchPage />)
    await waitFor(() => expect(screen.getByText('Release Date')).toBeInTheDocument())
    fireEvent.click(screen.getByText('Release Date'))
    const cards = screen.getAllByRole('link')
    expect(cards[0]).toHaveAttribute('href', '/movie/1')
  })
})
