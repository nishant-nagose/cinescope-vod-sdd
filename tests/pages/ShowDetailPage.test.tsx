import { render, screen, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import { ShowDetailPage } from '../../src/pages/ShowDetailPage'

vi.mock('react-router-dom', () => ({
  useParams: () => ({ id: '1' }),
  useNavigate: () => vi.fn(),
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => <a href={to}>{children}</a>,
}))
vi.mock('../../src/hooks/useShowDetails', () => ({
  useShowDetails: vi.fn(),
}))
vi.mock('../../src/hooks/useSeasonDetails', () => ({
  useSeasonDetails: vi.fn(),
}))
vi.mock('../../src/services/tmdbApi', () => ({
  getImageUrl: (path: string | null) => (path ? `https://img.tmdb.org${path}` : null),
}))
vi.mock('../../src/components/ShowCarousel', () => ({
  ShowCarousel: ({ title }: { title: string }) => <div data-testid="show-carousel">{title}</div>,
}))
vi.mock('../../src/components/EpisodeList', () => ({
  EpisodeList: ({ episodes }: { episodes: unknown[] }) => (
    <div data-testid="episode-list">Episodes: {episodes.length}</div>
  ),
}))

import { useShowDetails } from '../../src/hooks/useShowDetails'
import { useSeasonDetails } from '../../src/hooks/useSeasonDetails'

const mockShow = {
  id: 1,
  name: 'Test Show',
  overview: 'A great test show',
  backdrop_path: '/backdrop.jpg',
  poster_path: '/poster.jpg',
  first_air_date: '2023-01-15',
  vote_average: 8.5,
  vote_count: 1200,
  genres: [{ id: 18, name: 'Drama' }],
  networks: [{ id: 1, name: 'HBO', logo_path: null, origin_country: 'US' }],
  seasons: [
    { id: 10, name: 'Season 1', season_number: 1, episode_count: 10, overview: '', air_date: '2023-01-15', poster_path: null },
    { id: 11, name: 'Season 2', season_number: 2, episode_count: 8, overview: '', air_date: '2024-01-01', poster_path: null },
  ],
  number_of_seasons: 2,
  number_of_episodes: 18,
  status: 'Ended',
  in_production: false,
  tagline: 'Drama awaits',
  type: 'Scripted',
  original_language: 'en',
  popularity: 150,
  homepage: '',
  created_by: [],
  last_air_date: '2024-03-01',
}

const mockCredits = {
  cast: [
    { id: 100, name: 'Actor One', character: 'Hero', profile_path: null, order: 0 },
  ],
  crew: [],
}

const mockSimilar = { results: [], page: 1, total_pages: 1, total_results: 0 }

const defaultHook = {
  show: mockShow,
  credits: mockCredits,
  similarShows: mockSimilar,
  loading: false,
  error: null,
}

const defaultSeasonHook = { season: null, loading: false, error: null }

describe('ShowDetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(useShowDetails as ReturnType<typeof vi.fn>).mockReturnValue(defaultHook)
    ;(useSeasonDetails as ReturnType<typeof vi.fn>).mockReturnValue(defaultSeasonHook)
  })

  test('renders show title', async () => {
    render(<ShowDetailPage />)
    await waitFor(() => {
      expect(screen.getByText('Test Show')).toBeInTheDocument()
    })
  })

  test('renders show overview', async () => {
    render(<ShowDetailPage />)
    await waitFor(() => {
      expect(screen.getByText('A great test show')).toBeInTheDocument()
    })
  })

  test('renders season tabs', async () => {
    render(<ShowDetailPage />)
    await waitFor(() => {
      expect(screen.getByText('Season 1')).toBeInTheDocument()
      expect(screen.getByText('Season 2')).toBeInTheDocument()
    })
  })

  test('renders cast section with cast member', async () => {
    render(<ShowDetailPage />)
    await waitFor(() => {
      expect(screen.getByText('Actor One')).toBeInTheDocument()
    })
  })

  test('shows loading skeleton when loading', () => {
    ;(useShowDetails as ReturnType<typeof vi.fn>).mockReturnValue({ ...defaultHook, show: null, loading: true })
    const { container } = render(<ShowDetailPage />)
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument()
  })

  test('shows error state', async () => {
    ;(useShowDetails as ReturnType<typeof vi.fn>).mockReturnValue({
      ...defaultHook,
      show: null,
      loading: false,
      error: 'Failed to load show',
    })
    render(<ShowDetailPage />)
    await waitFor(() => {
      expect(screen.getByText('Failed to load show')).toBeInTheDocument()
    })
  })

  test('prompts to select season when none selected', async () => {
    render(<ShowDetailPage />)
    await waitFor(() => {
      expect(screen.getByText('Select a season to view episodes.')).toBeInTheDocument()
    })
  })
})
