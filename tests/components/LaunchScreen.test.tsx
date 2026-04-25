import { render, screen, act } from '@testing-library/react'
import { vi, describe, test, expect, beforeEach, afterEach } from 'vitest'
import { LaunchScreen } from '../../src/components/LaunchScreen'

describe('LaunchScreen', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  test('renders animation container with aria-label', () => {
    const onComplete = vi.fn()
    render(<LaunchScreen onComplete={onComplete} />)
    expect(screen.getByRole('status')).toBeInTheDocument()
    expect(screen.getByLabelText('CineScope loading')).toBeInTheDocument()
  })

  test('renders CineScope logo text', () => {
    const onComplete = vi.fn()
    render(<LaunchScreen onComplete={onComplete} />)
    expect(screen.getByText('CineScope')).toBeInTheDocument()
  })

  test('calls onComplete after 3600ms', () => {
    const onComplete = vi.fn()
    render(<LaunchScreen onComplete={onComplete} />)
    expect(onComplete).not.toHaveBeenCalled()
    act(() => {
      vi.advanceTimersByTime(3600)
    })
    expect(onComplete).toHaveBeenCalledTimes(1)
  })

  test('does not call onComplete before 3600ms', () => {
    const onComplete = vi.fn()
    render(<LaunchScreen onComplete={onComplete} />)
    act(() => {
      vi.advanceTimersByTime(3599)
    })
    expect(onComplete).not.toHaveBeenCalled()
  })
})
