import { ReactNode, useState } from 'react'
import { Link } from 'react-router-dom'
import cinescopeLogo from '../images/cinescope-logo.svg'
import { SearchBar } from './SearchBar'
import { ContentFilterBar } from './ContentFilterBar'
import { useContentFilter } from '../context/ContentFilterContext'

interface LayoutProps {
  children: ReactNode
}

export const Layout = ({ children }: LayoutProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { contentType, setContentType } = useContentFilter()

  const ContentToggle = () => (
    <div className="flex rounded-lg overflow-hidden border border-gray-600 flex-shrink-0">
      {(['movies', 'shows'] as const).map(type => (
        <button
          key={type}
          onClick={() => setContentType(contentType === type ? 'all' : type)}
          className={`px-3 py-1.5 text-xs font-medium transition-colors capitalize ${
            contentType === type
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </button>
      ))}
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <header className="bg-gray-800 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          {/* Desktop: 4-zone CSS Grid — Logo | Search | Toggle | Nav+Filters */}
          <div className="hidden lg:grid lg:items-center lg:h-16 lg:gap-3"
            style={{ gridTemplateColumns: 'auto minmax(200px, 1fr) auto auto' }}
          >
            {/* Zone 1: Logo */}
            <Link to="/" className="flex items-center flex-shrink-0">
              <img src={cinescopeLogo} alt="CineScope" className="h-8 w-auto" />
            </Link>

            {/* Zone 2: Search */}
            <div className="w-full">
              <SearchBar placeholder="🔍 Search movies, shows, genres..." className="w-full" />
            </div>

            {/* Zone 3: Content Toggle */}
            <ContentToggle />

            {/* Zone 4: Nav links [separator] Filter controls */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <nav className="flex items-center gap-4">
                <Link to="/trending" className="text-sm hover:text-blue-400 transition-colors whitespace-nowrap">Trending</Link>
                <Link to="/top-rated" className="text-sm hover:text-blue-400 transition-colors whitespace-nowrap">Top Rated</Link>
                <Link to="/search" className="text-sm hover:text-blue-400 transition-colors whitespace-nowrap">Search</Link>
              </nav>
              <div className="border-l border-white/20 pl-3 ml-1">
                <ContentFilterBar compact hideToggle />
              </div>
            </div>
          </div>

          {/* Tablet (md): Logo | Search | Toggle | ⋮ */}
          <div className="hidden md:flex lg:hidden items-center h-14 gap-2">
            <Link to="/" className="flex items-center flex-shrink-0">
              <img src={cinescopeLogo} alt="CineScope" className="h-7 w-auto" />
            </Link>
            <div className="flex-1 mx-2">
              <SearchBar placeholder="Search..." className="w-full" />
            </div>
            <ContentToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
              aria-label="Toggle menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01" />
              </svg>
            </button>
          </div>

          {/* Mobile: Logo | search icon | hamburger */}
          <div className="flex md:hidden items-center justify-between h-14">
            <Link to="/" className="flex items-center flex-shrink-0">
              <img src={cinescopeLogo} alt="CineScope" className="h-6 w-auto" />
            </Link>
            <div className="flex items-center gap-2">
              <Link to="/search" className="p-2 rounded-lg hover:bg-gray-700 transition-colors" aria-label="Search">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
                aria-label="Toggle menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <nav className="border-t border-gray-700 py-3 space-y-1 lg:hidden">
              <div className="px-4 py-2">
                <ContentToggle />
              </div>
              <Link
                to="/trending"
                className="block px-4 py-2 hover:bg-gray-700 rounded-md transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Trending
              </Link>
              <Link
                to="/top-rated"
                className="block px-4 py-2 hover:bg-gray-700 rounded-md transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Top Rated
              </Link>
              <Link
                to="/search"
                className="block px-4 py-2 hover:bg-gray-700 rounded-md transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Search
              </Link>
              <div className="px-4 py-2">
                <ContentFilterBar compact hideToggle />
              </div>
            </nav>
          )}
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="bg-gray-800 mt-8 sm:mt-12 border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-8">
            <div className="flex flex-col items-start">
              <img
                src={cinescopeLogo}
                alt="CineScope"
                className="h-8 sm:h-10 w-auto mb-2"
              />
              <p className="text-xs sm:text-sm text-gray-400">
                Your gateway to movie discoveries
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm sm:text-base mb-3 sm:mb-4">Popular</h4>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-400">
                <li><Link to="/trending" className="hover:text-blue-400 transition-colors">Trending</Link></li>
                <li><Link to="/top-rated" className="hover:text-blue-400 transition-colors">Top Rated</Link></li>
                <li><Link to="/search" className="hover:text-blue-400 transition-colors">Search</Link></li>
              </ul>
            </div>
            <div className="sm:col-span-2 lg:col-span-1">
              <h4 className="text-white font-semibold text-sm sm:text-base mb-3 sm:mb-4">About</h4>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-400">
                <li><a href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">TMDB API</a></li>
                <li><a href="https://www.themoviedb.org/settings/api" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">API Documentation</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-6 sm:pt-8 text-center text-xs sm:text-sm text-gray-400">
            <p>&copy; 2026 CineScope. Powered by TMDB API. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
