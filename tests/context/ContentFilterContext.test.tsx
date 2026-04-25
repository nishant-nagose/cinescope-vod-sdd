import { renderHook, act } from '@testing-library/react'
import { render, screen } from '@testing-library/react'
import { describe, test, expect } from 'vitest'
import { ContentFilterProvider, useContentFilter } from '../../src/context/ContentFilterContext'

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ContentFilterProvider>{children}</ContentFilterProvider>
)

describe('ContentFilterContext', () => {
  test('provides default region as null (global)', () => {
    const { result } = renderHook(() => useContentFilter(), { wrapper })
    expect(result.current.region).toBeNull()
    expect(result.current.countries).toEqual([])
    expect(result.current.languages).toEqual([])
  })

  test('provides default filterKey of global-all-all', () => {
    const { result } = renderHook(() => useContentFilter(), { wrapper })
    expect(result.current.filterKey).toBe('global-all-all')
  })

  test('setRegion updates region, countries, and filterKey', () => {
    const { result } = renderHook(() => useContentFilter(), { wrapper })
    act(() => {
      result.current.setRegion('IN')
    })
    expect(result.current.region).toBe('IN')
    expect(result.current.countries).toEqual(['IN'])
    expect(result.current.filterKey).toBe('IN-all-all')
  })

  test('setRegion to null reverts to global', () => {
    const { result } = renderHook(() => useContentFilter(), { wrapper })
    act(() => { result.current.setRegion('KR') })
    act(() => { result.current.setRegion(null) })
    expect(result.current.region).toBeNull()
    expect(result.current.filterKey).toBe('global-all-all')
  })

  test('setContentType updates filterKey', () => {
    const { result } = renderHook(() => useContentFilter(), { wrapper })
    act(() => {
      result.current.setContentType('movies')
    })
    expect(result.current.contentType).toBe('movies')
    expect(result.current.filterKey).toBe('global-movies-all')
  })

  test('setActiveCategory updates filterKey', () => {
    const { result } = renderHook(() => useContentFilter(), { wrapper })
    act(() => {
      result.current.setActiveCategory(28)
    })
    expect(result.current.activeCategory).toBe(28)
    expect(result.current.filterKey).toBe('global-all-28')
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
