import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import { MovieCarousel } from '../../src/components/MovieCarousel'

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
  title: `Carousel Movie ${id}`,
  poster_path: `/poster${id}.jpg`,
  release_date: '2024-06-01',
  vote_average: 8.0,
  vote_count: 1000,
  overview: '',
  backdrop_path: null,
  adult: false,
  original_language: 'en',
  original_title: `Carousel Movie ${id}`,
  popularity: 100,
  video: false,
})

describe('MovieCarousel', () => {
  test('renders section heading', () => {
    render(<MovieCarousel title="Test Carousel" movies={[makeMovie(1)]} />)
    expect(screen.getByText('Test Carousel')).toBeInTheDocument()
  })

  test('renders movie cards', () => {
    const movies = [makeMovie(1), makeMovie(2), makeMovie(3)]
    render(<MovieCarousel title="Test" movies={movies} />)
    expect(screen.getByText('Carousel Movie 1')).toBeInTheDocument()
    expect(screen.getByText('Carousel Movie 2')).toBeInTheDocument()
    expect(screen.getByText('Carousel Movie 3')).toBeInTheDocument()
  })

  test('renders two rows when more than 10 movies provided', () => {
    const movies = Array.from({ length: 20 }, (_, i) => makeMovie(i + 1))
    render(<MovieCarousel title="Test" movies={movies} />)
    expect(screen.getByText('Carousel Movie 1')).toBeInTheDocument()
    expect(screen.getByText('Carousel Movie 11')).toBeInTheDocument()
    expect(screen.getByText('Carousel Movie 20')).toBeInTheDocument()
  })

  test('renders skeleton when loading', () => {
    render(<MovieCarousel title="Loading Test" movies={[]} loading={true} />)
    expect(screen.getByText('Loading Test')).toBeInTheDocument()
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  test('renders retry button when error provided', () => {
    render(
      <MovieCarousel
        title="Error Test"
        movies={[]}
        error="Failed to load"
        onRetry={vi.fn()}
      />
    )
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument()
  })

  test('calls onRetry when retry button is clicked', () => {
    const onRetry = vi.fn()
    render(
      <MovieCarousel title="Retry Test" movies={[]} error="Error" onRetry={onRetry} />
    )
    fireEvent.click(screen.getByRole('button', { name: /retry/i }))
    expect(onRetry).toHaveBeenCalledTimes(1)
  })

  test('renders nothing when no movies and not loading', () => {
    const { container } = render(<MovieCarousel title="Empty Test" movies={[]} />)
    expect(container.firstChild).toBeNull()
  })

  test('renders scroll arrow buttons on desktop', () => {
    render(<MovieCarousel title="Arrow Test" movies={[makeMovie(1)]} />)
    expect(screen.getByRole('button', { name: /scroll left/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /scroll right/i })).toBeInTheDocument()
  })

  test('renders titleExtra content beside heading', () => {
    render(
      <MovieCarousel
        title="With Extra"
        movies={[makeMovie(1)]}
        titleExtra={<span>Extra Content</span>}
      />
    )
    expect(screen.getByText('With Extra')).toBeInTheDocument()
    expect(screen.getByText('Extra Content')).toBeInTheDocument()
  })

  test('movie cards link to correct detail page', () => {
    render(<MovieCarousel title="Links Test" movies={[makeMovie(42)]} />)
    const link = screen.getByRole('link', { name: /carousel movie 42/i })
    expect(link).toHaveAttribute('href', '/movie/42')
  })
})
