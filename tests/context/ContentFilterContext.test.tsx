import { renderHook, act } from '@testing-library/react'
import { render, screen } from '@testing-library/react'
import { describe, test, expect } from 'vitest'
import { ContentFilterProvider, useContentFilter } from '../../src/context/ContentFilterContext'

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ContentFilterProvider>{children}</ContentFilterProvider>
)

describe('ContentFilterContext', () => {
  test('provides default countries and languages', () => {
    const { result } = renderHook(() => useContentFilter(), { wrapper })
    expect(result.current.countries).toEqual(['US'])
    expect(result.current.languages).toEqual(['en'])
  })

  test('provides default filterKey of US-en-all-all', () => {
    const { result } = renderHook(() => useContentFilter(), { wrapper })
    expect(result.current.filterKey).toBe('US-en-all-all')
  })

  test('setCountries updates countries and filterKey', () => {
    const { result } = renderHook(() => useContentFilter(), { wrapper })
    act(() => {
      result.current.setCountries(['KR', 'FR'])
    })
    expect(result.current.countries).toEqual(['KR', 'FR'])
    expect(result.current.filterKey).toBe('KR,FR-en-all-all')
  })

  test('setLanguages updates languages and filterKey', () => {
    const { result } = renderHook(() => useContentFilter(), { wrapper })
    act(() => {
      result.current.setLanguages(['ko', 'fr'])
    })
    expect(result.current.languages).toEqual(['ko', 'fr'])
    expect(result.current.filterKey).toBe('US-ko,fr-all-all')
  })

  test('empty arrays produce filterKey with empty segments', () => {
    const { result } = renderHook(() => useContentFilter(), { wrapper })
    act(() => {
      result.current.setCountries([])
      result.current.setLanguages([])
    })
    expect(result.current.filterKey).toBe('--all-all')
  })

  test('ContentFilterProvider renders children', () => {
    render(
      <ContentFilterProvider>
        <span>child content</span>
      </ContentFilterProvider>
    )
    expect(screen.getByText('child content')).toBeInTheDocument()
  })

  test('useContentFilter throws when used outside provider', () => {
    const consoleError = console.error
    console.error = () => {}
    expect(() => renderHook(() => useContentFilter())).toThrow(
      'useContentFilter must be used within ContentFilterProvider'
    )
    console.error = consoleError
  })
})
