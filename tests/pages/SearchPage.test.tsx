import { render, screen, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import { SearchPage } from '../../src/pages/SearchPage'

const mockSetSearchParams = vi.fn()
vi.mock('react-router-dom', () => ({
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
  useNavigate: () => vi.fn(),
  useSearchParams: () => [new URLSearchParams(), mockSetSearchParams],
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
vi.mock('../../src/services/tmdbApi', () => ({
  getImageUrl: (path: string | null) => (path ? `https://img.tmdb.org${path}` : null),
  searchMulti: vi.fn().mockResolvedValue({ results: [], page: 1, total_pages: 0, total_results: 0 }),
}))
vi.mock('../../src/components/SearchBar', () => ({
  SearchBar: ({ onSearch }: { onSearch: (q: string) => void }) => (
    <input data-testid="search-bar" onChange={(e) => onSearch(e.target.value)} />
  ),
}))
vi.mock('../../src/components/InfiniteScrollTrigger', () => ({
  InfiniteScrollTrigger: ({ hasMore, loading }: { hasMore: boolean; loading: boolean }) => (
    <div data-testid="infinite-trigger">
      {!hasMore && !loading && <span>You've reached the end</span>}
    </div>
  ),
}))

describe('SearchPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('shows prompt when query is empty', () => {
    render(<SearchPage />)
    expect(screen.getByText('Enter a title to start searching.')).toBeInTheDocument()
  })

  test('shows InfiniteScrollTrigger in place of pagination', () => {
    render(<SearchPage />)
    expect(screen.queryByText('Next')).not.toBeInTheDocument()
    expect(screen.queryByText('Previous')).not.toBeInTheDocument()
  })

  test('does not render pagination controls', () => {
    render(<SearchPage />)
    expect(screen.queryByRole('button', { name: /next/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /previous/i })).not.toBeInTheDocument()
  })
})
