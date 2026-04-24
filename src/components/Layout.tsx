import { ReactNode, useState } from 'react'
import { Link } from 'react-router-dom'
import cinescopeLogo from '../images/cinescope-logo.svg'
import { SearchBar } from './SearchBar'
import { ContentFilterBar } from './ContentFilterBar'

interface LayoutProps {
  children: ReactNode
}

export const Layout = ({ children }: LayoutProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <header className="bg-gray-800 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16 gap-2">
            <Link to="/" className="flex items-center flex-shrink-0">
              <img
                src={cinescopeLogo}
                alt="CineScope"
                className="h-6 sm:h-8 w-auto"
              />
            </Link>

            <nav className="hidden md:flex space-x-4 lg:space-x-6 flex-shrink-0">
              <Link to="/trending" className="text-sm lg:text-base hover:text-blue-400 transition-colors whitespace-nowrap">
                Trending
              </Link>
              <Link to="/top-rated" className="text-sm lg:text-base hover:text-blue-400 transition-colors whitespace-nowrap">
                Top Rated
              </Link>
              <Link to="/search" className="text-sm lg:text-base hover:text-blue-400 transition-colors whitespace-nowrap">
                Search
              </Link>
            </nav>

            {/* Search + Filter in header (desktop) */}
            <div className="hidden lg:flex items-center gap-2 flex-1 max-w-xl justify-end">
              <div className="flex-1 max-w-xs">
                <SearchBar placeholder="Search movies..." className="w-full" />
              </div>
              <ContentFilterBar compact />
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-700 transition-colors"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {mobileMenuOpen && (
            <nav className="md:hidden border-t border-gray-700 py-3 space-y-2">
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
              <div className="px-4 py-2 flex items-center gap-2">
                <SearchBar placeholder="Search..." className="flex-1" />
                <ContentFilterBar compact />
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
