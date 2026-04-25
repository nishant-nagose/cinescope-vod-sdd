import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import { HomePage } from '../../src/pages/HomePage'

const makeMovie = (id: number) => ({
  id,
  title: `Movie ${id}`,
  poster_path: `/poster${id}.jpg`,
  release_date: '2024-01-01',
  vote_average: 7.5,
  vote_count: 500,
  overview: '',
  backdrop_path: null,
  adult: false,
  original_language: 'en',
  original_title: `Movie ${id}`,
  popularity: 100,
  video: false,
})

const mockMovies = Array.from({ length: 3 }, (_, i) => makeMovie(i + 1))

const movieHook = {
  movies: mockMovies,
  loading: false,
  error: null,
  hasMore: false,
  fetchMore: vi.fn(),
  refetch: vi.fn(),
}

const showHook = {
  shows: [],
  loading: false,
  error: null,
  hasMore: false,
  loadMore: vi.fn(),
  refetch: vi.fn(),
}

vi.mock('../../src/components/HeroSlider', () => ({
  HeroSlider: () => <div data-testid="hero-slider" />,
}))
vi.mock('../../src/components/LazySection', () => ({
  LazySection: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))
vi.mock('../../src/components/DynamicCarousel', () => ({
  DynamicCarousel: ({ config }: { config: { title: string } }) => (
    <div data-testid="carousel"><span>{config.title}</span></div>
  ),
}))
vi.mock('../../src/hooks/useHeroSlider', () => ({
  useHeroSlider: vi.fn(),
}))
vi.mock('../../src/hooks/useInfiniteMovies', () => ({
  useInfiniteMovies: vi.fn(),
}))
vi.mock('../../src/hooks/useInfiniteShows', () => ({
  useInfiniteShows: vi.fn(),
}))
vi.mock('../../src/context/ContentFilterContext', () => ({
  useContentFilter: () => ({
    contentType: 'all',
    activeCategory: null,
    region: null,
    filterKey: 'null-null-all',
    setContentType: vi.fn(),
    setActiveCategory: vi.fn(),
    setRegion: vi.fn(),
  }),
}))
vi.mock('react-router-dom', () => ({
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => <a href={to}>{children}</a>,
}))

import { useHeroSlider } from '../../src/hooks/useHeroSlider'
import { useInfiniteMovies } from '../../src/hooks/useInfiniteMovies'
import { useInfiniteShows } from '../../src/hooks/useInfiniteShows'

const setupMocks = () => {
  ;(useHeroSlider as ReturnType<typeof vi.fn>).mockReturnValue({ items: [], loading: false })
  ;(useInfiniteMovies as ReturnType<typeof vi.fn>).mockReturnValue(movieHook)
  ;(useInfiniteShows as ReturnType<typeof vi.fn>).mockReturnValue(showHook)
}

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setupMocks()
  })

  test('renders HeroSlider', () => {
    render(<HomePage />)
    expect(screen.getByTestId('hero-slider')).toBeInTheDocument()
  })

  test('renders carousels from the carousel pool', () => {
    render(<HomePage />)
    const carousels = screen.getAllByTestId('carousel')
    expect(carousels.length).toBeGreaterThan(0)
  })

  test('renders New Movie Releases carousel', () => {
    render(<HomePage />)
    expect(screen.getByText('New Movie Releases')).toBeInTheDocument()
  })

  test('renders New TV Shows carousel', () => {
    render(<HomePage />)
    expect(screen.getByText('New TV Shows')).toBeInTheDocument()
  })

  test('renders trending carousels', () => {
    render(<HomePage />)
    expect(screen.getByText('Trending Movies Today')).toBeInTheDocument()
    expect(screen.getByText('Trending Shows Today')).toBeInTheDocument()
  })
})
