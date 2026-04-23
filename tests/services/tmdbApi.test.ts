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
  getCountries,
  getLanguages,
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

  test('calls /discover/movie with sort_by=popularity.desc', async () => {
    const mockData = { results: [], page: 1, total_pages: 1, total_results: 0 }
    mockFetch.mockReturnValueOnce(mockResponse(mockData))
    const data = await getTrendingMovies(1)
    expect(mockFetch).toHaveBeenCalledTimes(1)
    const url: string = mockFetch.mock.calls[0][0]
    expect(url).toContain('/discover/movie')
    expect(url).toContain('sort_by=popularity.desc')
    expect(url).toContain('page=1')
    expect(data).toEqual(mockData)
  })

  test('defaults to page 1', async () => {
    mockFetch.mockReturnValueOnce(mockResponse({ results: [] }))
    await getTrendingMovies()
    const url: string = mockFetch.mock.calls[0][0]
    expect(url).toContain('page=1')
  })

  test('appends with_origin_country when filter has countries', async () => {
    mockFetch.mockReturnValueOnce(mockResponse({ results: [] }))
    await getTrendingMovies(1, { countries: ['US', 'FR'], languages: [] })
    const url: string = mockFetch.mock.calls[0][0]
    expect(url).toContain('with_origin_country=US%7CFR')
  })

  test('appends with_original_language when filter has languages', async () => {
    mockFetch.mockReturnValueOnce(mockResponse({ results: [] }))
    await getTrendingMovies(1, { countries: [], languages: ['en', 'fr'] })
    const url: string = mockFetch.mock.calls[0][0]
    expect(url).toContain('with_original_language=en%7Cfr')
  })

  test('omits filter params when arrays are empty', async () => {
    mockFetch.mockReturnValueOnce(mockResponse({ results: [] }))
    await getTrendingMovies(1, { countries: [], languages: [] })
    const url: string = mockFetch.mock.calls[0][0]
    expect(url).not.toContain('with_origin_country')
    expect(url).not.toContain('with_original_language')
  })

  test('throws on non-ok response', async () => {
    mockFetch.mockReturnValueOnce(mockResponse({}, false, 401))
    await expect(getTrendingMovies()).rejects.toThrow('TMDB API error')
  })
})

describe('getTopRatedMovies', () => {
  beforeEach(() => vi.clearAllMocks())

  test('calls /discover/movie with sort_by=vote_average.desc', async () => {
    mockFetch.mockReturnValueOnce(mockResponse({ results: [] }))
    await getTopRatedMovies(2)
    const url: string = mockFetch.mock.calls[0][0]
    expect(url).toContain('/discover/movie')
    expect(url).toContain('sort_by=vote_average.desc')
    expect(url).toContain('page=2')
  })

  test('includes vote_count.gte=200 threshold', async () => {
    mockFetch.mockReturnValueOnce(mockResponse({ results: [] }))
    await getTopRatedMovies()
    const url: string = mockFetch.mock.calls[0][0]
    expect(url).toContain('vote_count.gte=200')
  })
})

describe('getCountries', () => {
  beforeEach(() => vi.clearAllMocks())

  test('calls /configuration/countries', async () => {
    const mockData = [{ iso_3166_1: 'US', english_name: 'United States', native_name: 'United States' }]
    mockFetch.mockReturnValueOnce(mockResponse(mockData))
    const data = await getCountries()
    const url: string = mockFetch.mock.calls[0][0]
    expect(url).toContain('/configuration/countries')
    expect(data).toEqual(mockData)
  })
})

describe('getLanguages', () => {
  beforeEach(() => vi.clearAllMocks())

  test('calls /configuration/languages', async () => {
    const mockData = [{ iso_639_1: 'en', english_name: 'English', name: 'English' }]
    mockFetch.mockReturnValueOnce(mockResponse(mockData))
    const data = await getLanguages()
    const url: string = mockFetch.mock.calls[0][0]
    expect(url).toContain('/configuration/languages')
    expect(data).toEqual(mockData)
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

import {
  getMovieVideos,
  getWatchProviders,
  getPersonMovieCredits,
  getDailyTrending,
  getWeeklyTrending,
} from '../../src/services/tmdbApi'

describe('getMovieVideos', () => {
  beforeEach(() => vi.clearAllMocks())

  test('calls /movie/{id}/videos URL', async () => {
    mockFetch.mockReturnValueOnce(mockResponse({ id: 123, results: [] }))
    await getMovieVideos(123)
    const url: string = mockFetch.mock.calls[0][0]
    expect(url).toContain('/movie/123/videos')
  })
})

describe('getWatchProviders', () => {
  beforeEach(() => vi.clearAllMocks())

  test('calls /movie/{id}/watch/providers URL', async () => {
    mockFetch.mockReturnValueOnce(mockResponse({ id: 123, results: {} }))
    await getWatchProviders(123)
    const url: string = mockFetch.mock.calls[0][0]
    expect(url).toContain('/movie/123/watch/providers')
  })
})

describe('getPersonMovieCredits', () => {
  beforeEach(() => vi.clearAllMocks())

  test('calls /person/{id}/movie_credits URL', async () => {
    mockFetch.mockReturnValueOnce(mockResponse({ id: 456, cast: [], crew: [] }))
    await getPersonMovieCredits(456)
    const url: string = mockFetch.mock.calls[0][0]
    expect(url).toContain('/person/456/movie_credits')
  })
})

describe('getDailyTrending', () => {
  beforeEach(() => vi.clearAllMocks())

  test('calls /trending/movie/day URL with page param', async () => {
    mockFetch.mockReturnValueOnce(mockResponse({ results: [], page: 1, total_pages: 1, total_results: 0 }))
    await getDailyTrending(1)
    const url: string = mockFetch.mock.calls[0][0]
    expect(url).toContain('/trending/movie/day')
    expect(url).toContain('page=1')
  })

  test('defaults to page 1', async () => {
    mockFetch.mockReturnValueOnce(mockResponse({ results: [] }))
    await getDailyTrending()
    const url: string = mockFetch.mock.calls[0][0]
    expect(url).toContain('page=1')
  })
})

describe('getWeeklyTrending', () => {
  beforeEach(() => vi.clearAllMocks())

  test('calls /trending/movie/week URL with page param', async () => {
    mockFetch.mockReturnValueOnce(mockResponse({ results: [], page: 1, total_pages: 1, total_results: 0 }))
    await getWeeklyTrending(2)
    const url: string = mockFetch.mock.calls[0][0]
    expect(url).toContain('/trending/movie/week')
    expect(url).toContain('page=2')
  })
})
