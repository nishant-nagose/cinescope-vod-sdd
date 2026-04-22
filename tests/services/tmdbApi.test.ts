import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'

const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

import {
  getImageUrl,
  getTrendingMovies,
  getTopRatedMovies,
  searchMovies,
  getMovieDetails,
  getMovieCredits,
  getSimilarMovies,
} from '../../src/services/tmdbApi'

const mockResponse = (data: unknown, ok = true, status = 200) =>
  Promise.resolve({
    ok,
    status,
    statusText: ok ? 'OK' : 'Not Found',
    json: () => Promise.resolve(data),
  } as Response)

describe('getImageUrl', () => {
  test('returns full URL with default size w500', () => {
    const result = getImageUrl('/poster.jpg')
    expect(result).toContain('/w500/poster.jpg')
  })

  test('returns full URL with custom size', () => {
    const result = getImageUrl('/backdrop.jpg', 'original')
    expect(result).toContain('/original/backdrop.jpg')
  })

  test('returns null for null path', () => {
    expect(getImageUrl(null)).toBeNull()
  })
})

describe('getTrendingMovies', () => {
  beforeEach(() => vi.clearAllMocks())
  afterEach(() => vi.clearAllMocks())

  test('calls trending endpoint with page param', async () => {
    const mockData = { results: [], page: 1, total_pages: 1, total_results: 0 }
    mockFetch.mockReturnValueOnce(mockResponse(mockData))
    const data = await getTrendingMovies(1)
    expect(mockFetch).toHaveBeenCalledTimes(1)
    const url: string = mockFetch.mock.calls[0][0]
    expect(url).toContain('/trending/movie/week')
    expect(url).toContain('page=1')
    expect(data).toEqual(mockData)
  })

  test('defaults to page 1', async () => {
    mockFetch.mockReturnValueOnce(mockResponse({ results: [] }))
    await getTrendingMovies()
    const url: string = mockFetch.mock.calls[0][0]
    expect(url).toContain('page=1')
  })

  test('throws on non-ok response', async () => {
    mockFetch.mockReturnValueOnce(mockResponse({}, false, 401))
    await expect(getTrendingMovies()).rejects.toThrow('TMDB API error')
  })
})

describe('getTopRatedMovies', () => {
  beforeEach(() => vi.clearAllMocks())

  test('calls top_rated endpoint', async () => {
    mockFetch.mockReturnValueOnce(mockResponse({ results: [] }))
    await getTopRatedMovies(2)
    const url: string = mockFetch.mock.calls[0][0]
    expect(url).toContain('/movie/top_rated')
    expect(url).toContain('page=2')
  })
})

describe('searchMovies', () => {
  beforeEach(() => vi.clearAllMocks())

  test('calls search endpoint with query and page', async () => {
    mockFetch.mockReturnValueOnce(mockResponse({ results: [] }))
    await searchMovies('inception', 1)
    const url: string = mockFetch.mock.calls[0][0]
    expect(url).toContain('/search/movie')
    expect(url).toContain('query=inception')
    expect(url).toContain('page=1')
  })
})

describe('getMovieDetails', () => {
  beforeEach(() => vi.clearAllMocks())

  test('calls movie details endpoint with id', async () => {
    const mockMovie = { id: 123, title: 'Inception' }
    mockFetch.mockReturnValueOnce(mockResponse(mockMovie))
    const data = await getMovieDetails(123)
    const url: string = mockFetch.mock.calls[0][0]
    expect(url).toContain('/movie/123')
    expect(data).toEqual(mockMovie)
  })

  test('throws on API error', async () => {
    mockFetch.mockReturnValueOnce(mockResponse({}, false, 404))
    await expect(getMovieDetails(999)).rejects.toThrow('TMDB API error')
  })
})

describe('getMovieCredits', () => {
  beforeEach(() => vi.clearAllMocks())

  test('calls credits endpoint', async () => {
    mockFetch.mockReturnValueOnce(mockResponse({ cast: [] }))
    await getMovieCredits(123)
    const url: string = mockFetch.mock.calls[0][0]
    expect(url).toContain('/movie/123/credits')
  })
})

describe('getSimilarMovies', () => {
  beforeEach(() => vi.clearAllMocks())

  test('calls similar endpoint with id and page', async () => {
    mockFetch.mockReturnValueOnce(mockResponse({ results: [] }))
    await getSimilarMovies(123, 1)
    const url: string = mockFetch.mock.calls[0][0]
    expect(url).toContain('/movie/123/similar')
    expect(url).toContain('page=1')
  })
})

describe('network error handling', () => {
  beforeEach(() => vi.clearAllMocks())

  test('propagates network errors', async () => {
    mockFetch.mockRejectedValueOnce(new TypeError('Failed to fetch'))
    await expect(getTrendingMovies()).rejects.toThrow()
  })
})
