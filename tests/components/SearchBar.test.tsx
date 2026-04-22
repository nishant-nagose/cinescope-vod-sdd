import { render, screen, fireEvent, act } from '@testing-library/react'
import { vi } from 'vitest'
import { SearchBar } from '../../src/components/SearchBar'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useSearchParams: () => [new URLSearchParams(), vi.fn()],
}))

describe('SearchBar', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  test('renders search input', () => {
    render(<SearchBar />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  test('shows clear button when input has value', () => {
    render(<SearchBar />)
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'batman' } })
    expect(screen.getByLabelText('Clear search')).toBeInTheDocument()
  })

  test('does NOT navigate for queries shorter than 3 chars', () => {
    render(<SearchBar />)
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'ba' } })
    act(() => vi.runAllTimers())
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  test('does not navigate immediately — waits for 300ms debounce', () => {
    render(<SearchBar />)
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'batman' } })
    expect(mockNavigate).not.toHaveBeenCalled()
    act(() => vi.advanceTimersByTime(200))
    expect(mockNavigate).not.toHaveBeenCalled()
    act(() => vi.advanceTimersByTime(100))
    expect(mockNavigate).toHaveBeenCalledWith('/search?q=batman')
  })

  test('calls onSearch prop instead of navigate when provided', () => {
    const onSearch = vi.fn()
    render(<SearchBar onSearch={onSearch} />)
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'inception' } })
    act(() => vi.runAllTimers())
    expect(onSearch).toHaveBeenCalledWith('inception')
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  test('clears input and calls onSearch with empty string on clear', () => {
    const onSearch = vi.fn()
    render(<SearchBar onSearch={onSearch} />)
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'batman' } })
    fireEvent.click(screen.getByLabelText('Clear search'))
    expect(input).toHaveValue('')
    expect(onSearch).toHaveBeenCalledWith('')
  })

  test('submits immediately on form submit without waiting for debounce', () => {
    render(<SearchBar />)
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'inception' } })
    fireEvent.submit(screen.getByRole('search'))
    expect(mockNavigate).toHaveBeenCalledWith('/search?q=inception')
  })

  test('does not submit for queries shorter than 3 chars on form submit', () => {
    render(<SearchBar />)
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'in' } })
    fireEvent.submit(screen.getByRole('search'))
    expect(mockNavigate).not.toHaveBeenCalled()
  })
})
