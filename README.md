# CineScope

A modern movie browsing application built with React 18, TypeScript, and Vite. Discover trending movies, explore top-rated content, search by title, and view detailed movie information.

## Features

- **Trending Movies**: Browse the latest trending movies from TMDB
- **Top Rated**: Discover highly-rated movies sorted by popularity
- **Search**: Find movies by title with real-time suggestions
- **Movie Details**: Comprehensive movie information including cast, ratings, and related movies
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

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
├── components/     # Reusable UI components
├── pages/         # Page components
├── services/      # API services and utilities
├── hooks/         # Custom React hooks
├── types/         # TypeScript type definitions
├── styles/        # Global styles and Tailwind config
└── tests/         # Test files
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
