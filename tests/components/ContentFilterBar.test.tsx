import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import { ContentFilterBar } from '../../src/components/ContentFilterBar'
import * as ContentFilterContextModule from '../../src/context/ContentFilterContext'
import * as useCountriesModule from '../../src/hooks/useCountries'
import * as useLanguagesModule from '../../src/hooks/useLanguages'

const mockSetCountries = vi.fn()
const mockSetLanguages = vi.fn()

const defaultFilterContext = {
  countries: ['US'],
  languages: ['en'],
  setCountries: mockSetCountries,
  setLanguages: mockSetLanguages,
  filterKey: 'US-en',
}

const sampleCountries = [
  { iso_3166_1: 'US', english_name: 'United States', native_name: 'United States' },
  { iso_3166_1: 'FR', english_name: 'France', native_name: 'France' },
  { iso_3166_1: 'KR', english_name: 'South Korea', native_name: '대한민국' },
]

const sampleLanguages = [
  { iso_639_1: 'en', english_name: 'English', name: 'English' },
  { iso_639_1: 'fr', english_name: 'French', name: 'Français' },
  { iso_639_1: 'ko', english_name: 'Korean', name: '한국어' },
]

vi.mock('../../src/context/ContentFilterContext', () => ({
  useContentFilter: vi.fn(),
}))

vi.mock('../../src/hooks/useCountries', () => ({
  useCountries: vi.fn(),
}))

vi.mock('../../src/hooks/useLanguages', () => ({
  useLanguages: vi.fn(),
}))

const setupMocks = (filterOverrides = {}) => {
  vi.mocked(ContentFilterContextModule.useContentFilter).mockReturnValue({
    ...defaultFilterContext,
    ...filterOverrides,
  })
  vi.mocked(useCountriesModule.useCountries).mockReturnValue({
    data: sampleCountries,
    loading: false,
    error: null,
    refetch: vi.fn(),
  })
  vi.mocked(useLanguagesModule.useLanguages).mockReturnValue({
    data: sampleLanguages,
    loading: false,
    error: null,
    refetch: vi.fn(),
  })
}

describe('ContentFilterBar', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setupMocks()
  })

  test('renders country and language trigger buttons', () => {
    render(<ContentFilterBar />)
    expect(screen.getByText('1 Country')).toBeInTheDocument()
    expect(screen.getByText('1 Language')).toBeInTheDocument()
  })

  test('shows All Countries when countries is empty', () => {
    setupMocks({ countries: [] })
    render(<ContentFilterBar />)
    expect(screen.getByText('All Countries')).toBeInTheDocument()
  })

  test('shows All Languages when languages is empty', () => {
    setupMocks({ languages: [] })
    render(<ContentFilterBar />)
    expect(screen.getByText('All Languages')).toBeInTheDocument()
  })

  test('shows plural count for multiple countries', () => {
    setupMocks({ countries: ['US', 'FR', 'KR'] })
    render(<ContentFilterBar />)
    expect(screen.getByText('3 Countries')).toBeInTheDocument()
  })

  test('country dropdown opens when trigger clicked', () => {
    render(<ContentFilterBar />)
    fireEvent.click(screen.getByText('1 Country'))
    expect(screen.getByText('United States')).toBeInTheDocument()
    expect(screen.getByText('France')).toBeInTheDocument()
    expect(screen.getByText('South Korea')).toBeInTheDocument()
  })

  test('language dropdown opens when trigger clicked', () => {
    render(<ContentFilterBar />)
    fireEvent.click(screen.getByText('1 Language'))
    expect(screen.getByText('English')).toBeInTheDocument()
    expect(screen.getByText('French')).toBeInTheDocument()
    expect(screen.getByText('Korean')).toBeInTheDocument()
  })

  test('clicking individual country calls setCountries with toggled array', () => {
    render(<ContentFilterBar />)
    fireEvent.click(screen.getByText('1 Country'))
    const franceCheckbox = screen.getAllByRole('checkbox').find(
      (_, i) => screen.getAllByRole('checkbox')[i].nextSibling?.textContent === 'France'
    ) || screen.getByLabelText('France')
    const labels = screen.getAllByText('France')
    fireEvent.click(labels[0].closest('label')!)
    expect(mockSetCountries).toHaveBeenCalledWith(['US', 'FR'])
  })

  test('clicking Select All in country dropdown calls setCountries with empty array', () => {
    render(<ContentFilterBar />)
    fireEvent.click(screen.getByText('1 Country'))
    const labels = screen.getAllByText('Select All')
    fireEvent.click(labels[0].closest('label')!)
    expect(mockSetCountries).toHaveBeenCalledWith([])
  })

  test('clicking Select All in language dropdown calls setLanguages with empty array', () => {
    render(<ContentFilterBar />)
    fireEvent.click(screen.getByText('1 Language'))
    const labels = screen.getAllByText('Select All')
    fireEvent.click(labels[0].closest('label')!)
    expect(mockSetLanguages).toHaveBeenCalledWith([])
  })

  test('when Select All is active, clicking individual country sets single-item array', () => {
    setupMocks({ countries: [] })
    render(<ContentFilterBar />)
    fireEvent.click(screen.getByText('All Countries'))
    const labels = screen.getAllByText('France')
    fireEvent.click(labels[0].closest('label')!)
    expect(mockSetCountries).toHaveBeenCalledWith(['FR'])
  })

  test('opening country dropdown closes language dropdown', () => {
    render(<ContentFilterBar />)
    fireEvent.click(screen.getByText('1 Language'))
    expect(screen.getByText('English')).toBeInTheDocument()
    fireEvent.click(screen.getByText('1 Country'))
    expect(screen.queryByText('English')).not.toBeInTheDocument()
    expect(screen.getByText('United States')).toBeInTheDocument()
  })
})
