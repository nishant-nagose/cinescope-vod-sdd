# CineScope

A modern VOD discovery platform built with React 18, TypeScript, and Vite. Browse trending movies and TV shows, explore top-rated content, search across both media types, and view rich detail pages — all powered by the TMDB API.

**Live:** https://nishant-nagose.github.io/cinescope-vod-sdd/

## Features

- **Hero Slider**: Full-width auto-advancing hero with trailer playback, swipe support, and mixed movies + shows
- **Dynamic Carousels**: 60+ lazily-loaded carousels — genre, trending, quality, mood, language, and regional
- **Content Toggle**: Switch between Movies, Shows, or All — filters every section globally
- **Trending**: Dedicated trending page for movies and shows with infinite scroll
- **Top Rated**: Dedicated top-rated page with infinite scroll
- **Search**: Unified search across movies and TV shows with type badges
- **Movie Details**: Backdrop → auto-trailer (10s), Trailers & Clips, Cast, Filmography, Watch Providers
- **Show Details**: Season/episode accordion, Cast, Trailers, Watch Providers, Similar Shows
- **Country & Language Filtering**: Regional and language-specific carousel rows
- **OTT Navigation**: Watch Provider icons link directly to platform apps on mobile
- **Responsive Design**: Mobile-first, touch-swipe, Tailwind CSS

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **API**: The Movie Database (TMDB)
- **Testing**: Vitest + React Testing Library
- **Linting**: ESLint + Prettier

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd cinescope
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Get your TMDB API key from [TMDB](https://www.themoviedb.org/settings/api) and add it to `.env`:
   ```
   VITE_TMDB_API_KEY=2e1025cc7e5b7674b5c36f2205cc0e15
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run test:ui` - Run tests with UI
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/   # 29 UI components (HeroSlider, DynamicCarousel, MovieCard, ShowCard, ...)
├── config/       # carouselPool.ts (60+ carousel defs), ottProviders.ts
├── context/      # ContentFilterContext (content type, category, region)
├── hooks/        # 15 active hooks (useInfiniteMovies, useShowDetails, useHeroSlider, ...)
├── pages/        # HomePage, TrendingPage, TopRatedPage, SearchPage, MovieDetailPage, ShowDetailPage
├── services/     # tmdbApi.ts, cache.ts, errorHandling.ts
├── types/        # tmdb.ts (Movie, TVShow, Episode, WatchProvider, ...)
├── utils/        # genreKeyMap.ts, carouselTitles.ts, ottNavigation.ts
├── styles/       # tailwind.css, index.css
├── images/       # cinescope-logo.svg
├── App.tsx
├── main.tsx
└── routes.tsx
tests/
├── components/   # Component-level tests
├── context/      # Context tests
├── pages/        # Page-level tests
└── services/     # API service tests
specs/
└── 001–011/      # Feature specs (all implemented)
```

## Contributing

1. Follow the established coding standards
2. Write tests for new features
3. Ensure all tests pass before submitting
4. Update documentation as needed

## License

This project is licensed under the MIT License.

## Configuration

Configuration is stored in `.specify/extensions/git/git-config.yml`:

```yaml
# Branch numbering strategy: "sequential" or "timestamp"
branch_numbering: sequential

# Custom commit message for git init
init_commit_message: "[Spec Kit] Initial commit"

# Auto-commit per command (all disabled by default)
# Example: enable auto-commit after specify
auto_commit:
  default: false
  after_specify:
    enabled: true
    message: "[Spec Kit] Add specification"
```

## Installation

```bash
# Install the bundled git extension (no network required)
specify extension add git
```

## Disabling

```bash
# Disable the git extension (spec creation continues without branching)
specify extension disable git

# Re-enable it
specify extension enable git
```

## Graceful Degradation

When Git is not installed or the directory is not a Git repository:
- Spec directories are still created under `specs/`
- Branch creation is skipped with a warning
- Branch validation is skipped with a warning
- Remote detection returns empty results

## Scripts

The extension bundles cross-platform scripts:

- `scripts/bash/create-new-feature.sh` — Bash implementation
- `scripts/bash/git-common.sh` — Shared Git utilities (Bash)
- `scripts/powershell/create-new-feature.ps1` — PowerShell implementation
- `scripts/powershell/git-common.ps1` — Shared Git utilities (PowerShell)
