const MOVIE_TITLES: Record<string, string> = {
  newReleases: 'New Movies on CineScope',
  dailyTrending: "Today's Top 10 Movies",
  weeklyTrending: 'Weekly Top 10 Movies',
  trending: 'Recommended Movies',
  acclaimed: 'Critically Acclaimed Movies',
  comedy: 'Need a Good Laugh?',
  sciFiFantasy: 'Sci‑Fi & Fantasy Movies',
  realLife: 'Movies Based on Real Life',
  animation: 'Anime & Animation Movies',
  romance: 'Romantic Movies',
  actionAdventure: 'Action & Adventure Movies',
  awardWinning: 'Award‑Winning Movies',
  inspiring: 'Inspiring Movies',
  thriller: 'Chilling Thriller Movies',
  upcomingMovies: 'Upcoming Movies',
}

const SHOW_TITLES: Record<string, string> = {
  newShows: 'New Shows on CineScope',
  tvDailyTrending: "Today's Top 10 Shows",
  tvWeeklyTrending: 'Weekly Top 10 Shows',
  recommendedShows: 'Recommended Shows',
  criticallyAcclaimedShows: 'Critically Acclaimed Shows',
  comedyShows: 'Need a Good Laugh?',
  sciFiFantasyShows: 'Sci‑Fi & Fantasy Shows',
  realLifeShows: 'Shows Based on Real Life',
  animationShows: 'Anime & Animation Shows',
  romanceShows: 'Romantic Shows',
  actionAdventureShows: 'Action & Adventure Shows',
  awardWinningShows: 'Award‑Winning Shows',
  inspiringShows: 'Inspiring Shows',
  thrillerShows: 'Chilling Thriller Shows',
  upcomingShows: 'Upcoming Shows',
}

export const getCarouselTitle = (hookKey: string, type: 'movies' | 'shows' | 'both'): string => {
  if (type === 'movies') return MOVIE_TITLES[hookKey] ?? hookKey
  if (type === 'shows') return SHOW_TITLES[hookKey] ?? hookKey
  return MOVIE_TITLES[hookKey] ?? SHOW_TITLES[hookKey] ?? hookKey
}
