import { ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface LayoutProps {
  children: ReactNode
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="text-2xl font-bold text-blue-400">
              CineScope
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

      <footer className="bg-gray-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-400">
            <p>&copy; 2026 CineScope. Powered by TMDB API.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}