import { render, screen, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import { TrendingPage } from '../src/pages/TrendingPage'
import { getTrendingMovies } from '../src/services/tmdbApi'

// Mock the API
vi.mock('../src/services/tmdbApi', () => ({
  getTrendingMovies: vi.fn(),
}))

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
}))

const mockMovies = [
  {
    id: 1,
    title: 'Test Movie 1',
    poster_path: '/test1.jpg',
    release_date: '2023-01-01',
    vote_average: 8.5,
  },
  {
    id: 2,
    title: 'Test Movie 2',
    poster_path: '/test2.jpg',
    release_date: '2023-02-01',
    vote_average: 7.2,
  },
]

describe('TrendingPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('renders loading state initially', () => {
    ;(getTrendingMovies as any).mockImplementation(() => new Promise(() => {}))

    render(<TrendingPage />)

    expect(screen.getByText('Trending Movies')).toBeInTheDocument()
    // Loading skeletons should be present
    expect(screen.getAllByRole('generic', { hidden: true }).length).toBeGreaterThan(0)
  })

  test('renders movie cards when data loads', async () => {
    ;(getTrendingMovies as any).mockResolvedValue({
      results: mockMovies,
    })

    render(<TrendingPage />)

    await waitFor(() => {
      expect(screen.getByText('Test Movie 1')).toBeInTheDocument()
      expect(screen.getByText('Test Movie 2')).toBeInTheDocument()
    })

    // Check that links are present
    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(2)
    expect(links[0]).toHaveAttribute('href', '/movie/1')
    expect(links[1]).toHaveAttribute('href', '/movie/2')
  })

  test('renders error state when API fails', async () => {
    ;(getTrendingMovies as any).mockRejectedValue(new Error('API Error'))

    render(<TrendingPage />)

    await waitFor(() => {
      expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    })
  })
})