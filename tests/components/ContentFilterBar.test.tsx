import { render } from '@testing-library/react'
import { vi } from 'vitest'
import { ContentFilterBar } from '../../src/components/ContentFilterBar'

vi.mock('../../src/context/ContentFilterContext', () => ({
  useContentFilter: () => ({
    region: null,
    countries: [],
    languages: [],
    contentType: 'all',
    activeCategory: null,
    filterKey: 'global-all-all',
    setRegion: vi.fn(),
    setContentType: vi.fn(),
    setActiveCategory: vi.fn(),
  }),
}))

describe('ContentFilterBar', () => {
  test('renders without crashing (legacy stub)', () => {
    const { container } = render(<ContentFilterBar />)
    expect(container).toBeInTheDocument()
  })

  test('compact prop does not cause errors', () => {
    const { container } = render(<ContentFilterBar compact />)
    expect(container).toBeInTheDocument()
  })

  test('hideToggle prop does not cause errors', () => {
    const { container } = render(<ContentFilterBar hideToggle />)
    expect(container).toBeInTheDocument()
  })
})
