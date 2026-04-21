import { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import cinescopeLogo from '../images/cinescope-logo-black.png'

interface LayoutProps {
  children: ReactNode
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center">
              <img
                src={cinescopeLogo}
                alt="CineScope"
                className="h-8 w-auto"
              />
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link to="/" className="hover:text-blue-400 transition-colors">
                Trending
              </Link>
              <Link to="/top-rated" className="hover:text-blue-400 transition-colors">
                Top Rated
              </Link>
              <Link to="/search" className="hover:text-blue-400 transition-colors">
                Search
              </Link>
            </nav>
            {/* Search bar placeholder */}
            <div className="w-64">
              <input
                type="text"
                placeholder="Search movies..."
                className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled
              />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="bg-gray-800 mt-12 border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="flex flex-col items-start">
              <img
                src={cinescopeLogo}
                alt="CineScope"
                className="h-10 w-auto mb-2"
              />
              <p className="text-sm text-gray-400">
                Your gateway to movie discoveries
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Popular</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/" className="hover:text-blue-400 transition-colors">Trending</Link></li>
                <li><Link to="/top-rated" className="hover:text-blue-400 transition-colors">Top Rated</Link></li>
                <li><Link to="/search" className="hover:text-blue-400 transition-colors">Search</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">About</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">TMDB API</a></li>
                <li><a href="https://www.themoviedb.org/settings/api" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">API Documentation</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2026 CineScope. Powered by TMDB API. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}