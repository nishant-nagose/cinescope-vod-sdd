import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import { MovieDetailPage } from '../../src/pages/MovieDetailPage'
import { useMovieDetails } from '../../src/hooks/useMovieDetails'

vi.mock('../../src/hooks/useMovieDetails')
vi.mock('../../src/hooks/useMovieVideos', () => ({
  useMovieVideos: () => ({ data: null, loading: false, error: null, refetch: vi.fn() }),
}))
vi.mock('../../src/hooks/useWatchProviders', () => ({
  useWatchProviders: () => ({ data: null, loading: false, error: null, refetch: vi.fn() }),
}))
vi.mock('../../src/hooks/usePersonCredits', () => ({
  usePersonCredits: () => ({ data: null, loading: false, error: null, refetch: vi.fn() }),
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

const mockNavigate = vi.fn()
vi.mock('react-router-dom', () => ({
  useParams: () => ({ id: '123' }),
  useNavigate: () => mockNavigate,
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => <a href={to}>{children}</a>,
}))
vi.mock('../../src/services/tmdbApi', () => ({
  getImageUrl: (path: string | null) => path ? `https://img.tmdb.org${path}` : null,
  getMovieVideos: vi.fn().mockResolvedValue({ id: 123, results: [] }),
}))

const mockMovie = {
  id: 123, title: 'Inception', overview: 'A thief who steals secrets.', release_date: '2010-07-16',
  vote_average: 8.8, vote_count: 34000, runtime: 148, tagline: 'Your mind is the scene of the crime.',
  backdrop_path: '/backdrop.jpg', poster_path: '/poster.jpg', adult: false, original_language: 'en',
  original_title: 'Inception', popularity: 100, video: false, genre_ids: [],
  genres: [{ id: 28, name: 'Action' }, { id: 878, name: 'Sci-Fi' }],
}
const mockCast = [
  { id: 1, name: 'Leonardo DiCaprio', character: 'Cobb', profile_path: '/leo.jpg', order: 0, adult: false, gender: 2, known_for_department: 'Acting', original_name: 'Leonardo DiCaprio', popularity: 50, cast_id: 1, credit_id: 'abc' },
]
const mockCrew = [
  { id: 10, name: 'Christopher Nolan', job: 'Director', department: 'Directing', profile_path: null, adult: false, gender: 2, known_for_department: 'Directing', original_name: 'Christopher Nolan', popularity: 80, credit_id: 'xyz' },
]
const mockSimilar = [
  { id: 2, title: 'Interstellar', poster_path: '/inter.jpg', release_date: '2014-11-05', vote_average: 8.6, vote_count: 28000, overview: '', backdrop_path: null, adult: false, original_language: 'en', original_title: 'Interstellar', popularity: 90, video: false },
]

const defaultHook = { movie: mockMovie, cast: mockCast, crew: mockCrew, similar: mockSimilar, loading: false, error: null }

describe('MovieDetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(useMovieDetails as ReturnType<typeof vi.fn>).mockReturnValue(defaultHook)
  })

  test('renders skeleton while loading', () => {
    ;(useMovieDetails as ReturnType<typeof vi.fn>).mockReturnValue({ ...defaultHook, loading: true, movie: null })
    render(<MovieDetailPage />)
    expect(screen.queryByText('Inception')).not.toBeInTheDocument()
  })

  test('renders movie title and metadata', async () => {
    render(<MovieDetailPage />)
    await waitFor(() => expect(screen.getByText('Inception')).toBeInTheDocument())
    expect(screen.getByText('Overview')).toBeInTheDocument()
    expect(screen.getByText('A thief who steals secrets.')).toBeInTheDocument()
  })

  test('renders genres as pill tags', async () => {
    render(<MovieDetailPage />)
    await waitFor(() => expect(screen.getByText('Action')).toBeInTheDocument())
    expect(screen.getByText('Sci-Fi')).toBeInTheDocument()
  })

  test('renders actors section', async () => {
    render(<MovieDetailPage />)
    await waitFor(() => expect(screen.getByText('Actors')).toBeInTheDocument())
    expect(screen.getAllByText('Leonardo DiCaprio').length).toBeGreaterThan(0)
  })

  test('renders director section', async () => {
    render(<MovieDetailPage />)
    await waitFor(() => expect(screen.getAllByText('Director').length).toBeGreaterThan(0))
    expect(screen.getAllByText('Christopher Nolan').length).toBeGreaterThan(0)
  })

  test('renders similar movies section', async () => {
    render(<MovieDetailPage />)
    await waitFor(() => expect(screen.getByText('Similar Movies')).toBeInTheDocument())
    expect(screen.getByText('Interstellar')).toBeInTheDocument()
  })

  test('hides similar movies section when empty', async () => {
    ;(useMovieDetails as ReturnType<typeof vi.fn>).mockReturnValue({ ...defaultHook, similar: [] })
    render(<MovieDetailPage />)
    await waitFor(() => expect(screen.getByText('Inception')).toBeInTheDocument())
    expect(screen.queryByText('Similar Movies')).not.toBeInTheDocument()
  })

  test('shows error state for invalid movie', async () => {
    ;(useMovieDetails as ReturnType<typeof vi.fn>).mockReturnValue({ ...defaultHook, movie: null, error: 'Something went wrong' })
    render(<MovieDetailPage />)
    await waitFor(() => expect(screen.getByText('Movie not found')).toBeInTheDocument())
  })

  test('back button calls navigate(-1)', async () => {
    render(<MovieDetailPage />)
    await waitFor(() => expect(screen.getByLabelText('Go back')).toBeInTheDocument())
    fireEvent.click(screen.getByLabelText('Go back'))
    expect(mockNavigate).toHaveBeenCalledWith(-1)
  })
})
