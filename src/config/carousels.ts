import { CarouselConfig } from '../types/tmdb'

export const CAROUSEL_CONFIG: CarouselConfig[] = [
  // Movie carousels
  { id: 'new-movies', title: 'New Movies on CineScope', type: 'movies', hookKey: 'newReleases', rankDisplay: false },
  { id: 'daily-top10-movies', title: "Today's Top 10 Movies", type: 'movies', hookKey: 'dailyTrending', rankDisplay: true },
  { id: 'weekly-top10-movies', title: 'Weekly Top 10 Movies', type: 'movies', hookKey: 'weeklyTrending', rankDisplay: true },
  { id: 'recommended-movies', title: 'Recommended Movies', type: 'movies', hookKey: 'trending', rankDisplay: false },
  { id: 'acclaimed-movies', title: 'Critically Acclaimed Movies', type: 'movies', hookKey: 'acclaimed', rankDisplay: false },
  { id: 'comedy-movies', title: 'Need a Good Laugh?', type: 'movies', hookKey: 'comedy', rankDisplay: false },
  { id: 'scifi-movies', title: 'Sci‑Fi & Fantasy Movies', type: 'movies', hookKey: 'sciFiFantasy', rankDisplay: false },
  { id: 'reallife-movies', title: 'Movies Based on Real Life', type: 'movies', hookKey: 'realLife', rankDisplay: false },
  { id: 'animation-movies', title: 'Anime & Animation Movies', type: 'movies', hookKey: 'animation', rankDisplay: false },
  { id: 'romance-movies', title: 'Romantic Movies', type: 'movies', hookKey: 'romance', rankDisplay: false },
  { id: 'action-movies', title: 'Action & Adventure Movies', type: 'movies', hookKey: 'actionAdventure', rankDisplay: false },
  { id: 'award-movies', title: 'Award‑Winning Movies', type: 'movies', hookKey: 'awardWinning', rankDisplay: false },
  { id: 'inspiring-movies', title: 'Inspiring Movies', type: 'movies', hookKey: 'inspiring', rankDisplay: false },
  { id: 'thriller-movies', title: 'Chilling Thriller Movies', type: 'movies', hookKey: 'thriller', rankDisplay: false },
  { id: 'upcoming-movies', title: 'Upcoming Movies', type: 'movies', hookKey: 'upcomingMovies', rankDisplay: false },

  // Show carousels
  { id: 'new-shows', title: 'New Shows on CineScope', type: 'shows', hookKey: 'newShows', rankDisplay: false },
  { id: 'daily-top10-shows', title: "Today's Top 10 Shows", type: 'shows', hookKey: 'tvDailyTrending', rankDisplay: true },
  { id: 'weekly-top10-shows', title: 'Weekly Top 10 Shows', type: 'shows', hookKey: 'tvWeeklyTrending', rankDisplay: true },
  { id: 'recommended-shows', title: 'Recommended Shows', type: 'shows', hookKey: 'recommendedShows', rankDisplay: false },
  { id: 'acclaimed-shows', title: 'Critically Acclaimed Shows', type: 'shows', hookKey: 'criticallyAcclaimedShows', rankDisplay: false },
  { id: 'comedy-shows', title: 'Need a Good Laugh?', type: 'shows', hookKey: 'comedyShows', rankDisplay: false },
  { id: 'scifi-shows', title: 'Sci‑Fi & Fantasy Shows', type: 'shows', hookKey: 'sciFiFantasyShows', rankDisplay: false },
  { id: 'reallife-shows', title: 'Shows Based on Real Life', type: 'shows', hookKey: 'realLifeShows', rankDisplay: false },
  { id: 'animation-shows', title: 'Anime & Animation Shows', type: 'shows', hookKey: 'animationShows', rankDisplay: false },
  { id: 'romance-shows', title: 'Romantic Shows', type: 'shows', hookKey: 'romanceShows', rankDisplay: false },
  { id: 'action-shows', title: 'Action & Adventure Shows', type: 'shows', hookKey: 'actionAdventureShows', rankDisplay: false },
  { id: 'award-shows', title: 'Award‑Winning Shows', type: 'shows', hookKey: 'awardWinningShows', rankDisplay: false },
  { id: 'inspiring-shows', title: 'Inspiring Shows', type: 'shows', hookKey: 'inspiringShows', rankDisplay: false },
  { id: 'thriller-shows', title: 'Chilling Thriller Shows', type: 'shows', hookKey: 'thrillerShows', rankDisplay: false },
  { id: 'upcoming-shows', title: 'Upcoming Shows', type: 'shows', hookKey: 'upcomingShows', rankDisplay: false },
]
