import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import { TopRatedPage } from '../src/pages/TopRatedPage'
import { getTopRatedMovies } from '../src/services/tmdbApi'

// Mock the API
vi.mock('../src/services/tmdbApi', () => ({
  getTopRatedMovies: vi.fn(),
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
    title: 'Top Movie 1',
    poster_path: '/top1.jpg',
    release_date: '2023-01-01',
    vote_average: 9.2,
  },
  {
    id: 2,
    title: 'Top Movie 2',
    poster_path: '/top2.jpg',
    release_date: '2023-02-01',
    vote_average: 8.8,
  },
]

describe('TopRatedPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('renders loading state initially', () => {
    ;(getTopRatedMovies as any).mockImplementation(() => new Promise(() => {}))

    render(<TopRatedPage />)

    expect(screen.getByText('Top Rated Movies')).toBeInTheDocument()
  })

  test('renders movie cards when data loads', async () => {
    ;(getTopRatedMovies as any).mockResolvedValue({
      results: mockMovies,
      total_pages: 5,
    })

    render(<TopRatedPage />)

    await waitFor(() => {
      expect(screen.getByText('Top Movie 1')).toBeInTheDocument()
      expect(screen.getByText('Top Movie 2')).toBeInTheDocument()
    })
  })

  test('renders pagination controls', async () => {
    ;(getTopRatedMovies as any).mockResolvedValue({
      results: mockMovies,
      total_pages: 5,
    })

    render(<TopRatedPage />)

    await waitFor(() => {
      expect(screen.getByText('Next')).toBeInTheDocument()
      expect(screen.getByText('Previous')).toBeInTheDocument()
    })
  })

  test('handles page changes', async () => {
    ;(getTopRatedMovies as any).mockResolvedValue({
      results: mockMovies,
      total_pages: 5,
    })

    render(<TopRatedPage />)

    await waitFor(() => {
      expect(screen.getByText('Next')).toBeInTheDocument()
    })

    // Click next page
    fireEvent.click(screen.getByText('Next'))

    expect(getTopRatedMovies).toHaveBeenCalledWith(2)
  })

  test('renders error state when API fails', async () => {
    ;(getTopRatedMovies as any).mockRejectedValue(new Error('API Error'))

    render(<TopRatedPage />)

    await waitFor(() => {
      expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    })
  })
})