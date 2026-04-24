// hookKey → display title for movies
const MOVIE_TITLES: Record<string, string> = {
  newReleases:     'Just Released — Movies',
  dailyTrending:   'Trending Today — Movies',
  weeklyTrending:  "This Week's Top 10 — Movies",
  trending:        'Popular Movies',
  acclaimed:       "Critics' Picks — Movies",
  comedy:          'Comedy Movies',
  sciFiFantasy:    'Sci-Fi & Fantasy Movies',
  realLife:        'Documentary & True Stories',
  animation:       'Animated Movies',
  romance:         'Romance Movies',
  actionAdventure: 'Action & Adventure Movies',
  awardWinning:    'Award-Winning Movies',
  inspiring:       'Inspiring Movies',
  thriller:        'Thriller & Mystery Movies',
  upcomingMovies:  'Coming Soon — Movies',
}

// hookKey → display title for shows
const SHOW_TITLES: Record<string, string> = {
  newShows:               'Just Aired — Shows',
  tvDailyTrending:        'Trending Today — Shows',
  tvWeeklyTrending:       "This Week's Top 10 — Shows",
  recommendedShows:       'Popular Shows',
  criticallyAcclaimedShows: "Critics' Choice — Shows",
  comedyShows:            'Comedy Shows',
  sciFiFantasyShows:      'Sci-Fi & Fantasy Shows',
  realLifeShows:          'Documentary & Reality Shows',
  animationShows:         'Anime & Animation Shows',
  romanceShows:           'Romance Shows',
  actionAdventureShows:   'Action & Adventure Shows',
  awardWinningShows:      'Award-Winning Shows',
  inspiringShows:         'Inspiring Shows',
  thrillerShows:          'Thriller & Suspense Shows',
  upcomingShows:          'Coming Soon — Shows',
}

export const getCarouselTitle = (hookKey: string, type: 'movies' | 'shows' | 'both'): string => {
  if (type === 'movies') return MOVIE_TITLES[hookKey] ?? hookKey
  if (type === 'shows')  return SHOW_TITLES[hookKey]  ?? hookKey
  return MOVIE_TITLES[hookKey] ?? SHOW_TITLES[hookKey] ?? hookKey
}

// Returns the count embedded in a title like "This Week's Top 10" → 10, or null if none.
export const extractCountFromTitle = (title: string): number | null => {
  const match = title.match(/\bTop\s+(\d+)\b/i)
  return match ? parseInt(match[1], 10) : null
}
