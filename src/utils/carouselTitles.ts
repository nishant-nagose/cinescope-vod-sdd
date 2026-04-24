// hookKey → display title for movies
const MOVIE_TITLES: Record<string, string> = {
  newReleases:     'Just Released',
  dailyTrending:   'Trending Today',
  weeklyTrending:  'This Week\'s Top 10',
  trending:        'Blockbusters',
  acclaimed:       'Critics\' Picks',
  comedy:          'Something to Laugh About',
  sciFiFantasy:    'Beyond Reality',
  realLife:        'Truth Is Stranger Than Fiction',
  animation:       'Animated Worlds',
  romance:         'Love Stories',
  actionAdventure: 'Pure Adrenaline',
  awardWinning:    'Award Season Darlings',
  inspiring:       'Heart & Soul',
  thriller:        'Don\'t Watch Alone',
  upcomingMovies:  'Coming Soon to Theatres',
}

// hookKey → display title for shows
const SHOW_TITLES: Record<string, string> = {
  newShows:               'Freshly Aired',
  tvDailyTrending:        'Trending Today',
  tvWeeklyTrending:       'This Week\'s Top 10',
  recommendedShows:       'Fan Favorites',
  criticallyAcclaimedShows: 'Critics\' Choice Series',
  comedyShows:            'Guaranteed Laughs',
  sciFiFantasyShows:      'Worlds Beyond',
  realLifeShows:          'Real Stories, Real Impact',
  animationShows:         'Anime & Toons',
  romanceShows:           'Love & Drama',
  actionAdventureShows:   'High-Stakes Action',
  awardWinningShows:      'Emmy Territory',
  inspiringShows:         'Stories That Move You',
  thrillerShows:          'Binge-Worthy Suspense',
  upcomingShows:          'Coming Soon',
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
