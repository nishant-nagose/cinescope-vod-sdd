import { ReactNode, useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import cinescopeLogo from '../images/cinescope-logo.svg'
import { RegionDropdown } from './RegionDropdown'
import { useContentFilter } from '../context/ContentFilterContext'
import { useGenres } from '../hooks/useGenres'

interface LayoutProps {
  children: ReactNode
}

// ─── Pill button ─────────────────────────────────────────────────────────────
const Pill = ({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) => (
  <button
    onClick={onClick}
    className={`relative px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 select-none whitespace-nowrap ${
      active
        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-900/40 ring-1 ring-white/20'
        : 'bg-white/8 text-gray-300 hover:bg-white/15 hover:text-white border border-white/10'
    }`}
  >
    {label}
  </button>
)

// ─── Minimal detail-page header ───────────────────────────────────────────────
const DetailHeader = () => {
  const navigate = useNavigate()
  return (
    <header className="bg-gray-900/95 backdrop-blur-md border-b border-white/8 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 flex items-center justify-between h-14">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-gray-300 hover:text-white transition-colors min-h-[44px] px-2"
          aria-label="Go back"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm font-medium">Back</span>
        </button>
        <button
          onClick={() => navigate('/search')}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-300 hover:text-white"
          aria-label="Search"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>
    </header>
  )
}

// ─── Layout ──────────────────────────────────────────────────────────────────
export const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { contentType, setContentType, activeCategory, setActiveCategory } = useContentFilter()
  const { data: genresData } = useGenres()

  const [catOpen, setCatOpen] = useState(false)
  const [pagesOpen, setPagesOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const catRef = useRef<HTMLDivElement>(null)
  const pagesRef = useRef<HTMLDivElement>(null)

  const isDetailPage = /^\/(movie|show)\/\d+/.test(location.pathname)

  // Close dropdowns when clicking outside
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (catRef.current && !catRef.current.contains(e.target as Node)) setCatOpen(false)
      if (pagesRef.current && !pagesRef.current.contains(e.target as Node)) setPagesOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [])

  const toggleContent = (type: 'movies' | 'shows') => {
    setContentType(contentType === type ? 'all' : type)
  }

  // Find the current category name for the pill label
  const activeCategoryName = activeCategory
    ? genresData?.genres.find(g => g.id === activeCategory)?.name
    : null

  const catLabel = activeCategoryName ? activeCategoryName : 'Categories'

  if (isDetailPage) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col">
        <DetailHeader />
        <main className="flex-1">{children}</main>
        <footer className="bg-gray-800 mt-8 sm:mt-12 border-t border-gray-700">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 text-center text-xs text-gray-400">
            <p>&copy; 2026 CineScope. Powered by TMDB API.</p>
          </div>
        </footer>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* ── Top header bar ──────────────────────────────────────────────────── */}
      <header className="bg-gray-900/95 backdrop-blur-md border-b border-white/8 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">

          {/* Desktop & tablet: Logo | spacer | RegionDropdown | SearchIcon */}
          <div className="flex items-center justify-between h-14 gap-3">
            <Link to="/" className="flex items-center flex-shrink-0">
              <img src={cinescopeLogo} alt="CineScope" className="h-8 w-auto" />
            </Link>

            <div className="flex items-center gap-2 ml-auto">
              {/* Region selector */}
              <div className="hidden sm:block">
                <RegionDropdown />
              </div>

              {/* Search icon → navigates to /search */}
              <button
                onClick={() => navigate('/search')}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-300 hover:text-white"
                aria-label="Search"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {/* Mobile hamburger */}
              <button
                className="sm:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
                onClick={() => setMobileMenuOpen(o => !o)}
                aria-label="Menu"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* ── Pill navigation bar ─────────────────────────────────────────── */}
          {/* NOTE: No overflow-x-auto here — it would clip absolute dropdown menus */}
          <div className="hidden sm:flex items-center gap-2 pb-2.5">
            {/* Shows pill */}
            <Pill
              label="Shows"
              active={contentType === 'shows'}
              onClick={() => toggleContent('shows')}
            />

            {/* Movies pill */}
            <Pill
              label="Movies"
              active={contentType === 'movies'}
              onClick={() => toggleContent('movies')}
            />

            {/* Categories pill + dropdown */}
            <div className="relative" ref={catRef}>
              <Pill
                label={catLabel}
                active={catOpen || activeCategory !== null}
                onClick={() => setCatOpen(o => !o)}
              />
              {catOpen && genresData && (
                <div className="absolute top-full left-0 mt-1 z-[200] w-52 bg-gray-900 border border-white/15 rounded-xl shadow-2xl overflow-hidden">
                  <div className="max-h-64 overflow-y-auto py-1">
                    <button
                      onClick={() => { setActiveCategory(null); setCatOpen(false) }}
                      className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                        activeCategory === null ? 'text-blue-400 bg-blue-600/10' : 'text-gray-200 hover:bg-white/10'
                      }`}
                    >
                      All Categories
                    </button>
                    {genresData.genres.map(g => (
                      <button
                        key={g.id}
                        onClick={() => { setActiveCategory(g.id); setCatOpen(false) }}
                        className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                          activeCategory === g.id ? 'text-blue-400 bg-blue-600/10' : 'text-gray-200 hover:bg-white/10'
                        }`}
                      >
                        {g.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Pages pill + dropdown */}
            <div className="relative" ref={pagesRef}>
              <Pill
                label="Pages"
                active={pagesOpen}
                onClick={() => setPagesOpen(o => !o)}
              />
              {pagesOpen && (
                <div className="absolute top-full left-0 mt-1 z-[200] w-44 bg-gray-900 border border-white/15 rounded-xl shadow-2xl overflow-hidden py-1">
                  <Link
                    to="/trending"
                    onClick={() => setPagesOpen(false)}
                    className="block px-4 py-2.5 text-sm text-gray-200 hover:bg-white/10 hover:text-white transition-colors"
                  >
                    Trending
                  </Link>
                  <Link
                    to="/top-rated"
                    onClick={() => setPagesOpen(false)}
                    className="block px-4 py-2.5 text-sm text-gray-200 hover:bg-white/10 hover:text-white transition-colors"
                  >
                    Top Rated
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Mobile slide-down menu ──────────────────────────────────────── */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-white/8 bg-gray-900 px-4 py-3 space-y-2">
            <RegionDropdown />
            <div className="flex flex-wrap gap-2 pt-1">
              <Pill label="Shows"   active={contentType === 'shows'}  onClick={() => { toggleContent('shows');  setMobileMenuOpen(false) }} />
              <Pill label="Movies"  active={contentType === 'movies'} onClick={() => { toggleContent('movies'); setMobileMenuOpen(false) }} />
            </div>
            <div className="flex flex-wrap gap-2">
              <Link to="/trending"  onClick={() => setMobileMenuOpen(false)} className="text-sm text-gray-300 hover:text-white transition-colors">Trending</Link>
              <span className="text-gray-600">·</span>
              <Link to="/top-rated" onClick={() => setMobileMenuOpen(false)} className="text-sm text-gray-300 hover:text-white transition-colors">Top Rated</Link>
            </div>
            {genresData && (
              <select
                value={activeCategory ?? ''}
                onChange={e => { setActiveCategory(e.target.value === '' ? null : Number(e.target.value)); setMobileMenuOpen(false) }}
                className="w-full px-3 py-2 rounded-lg bg-white/10 text-gray-200 text-sm border border-white/10 focus:outline-none"
                aria-label="Category"
              >
                <option value="">All Categories</option>
                {genresData.genres.map(g => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            )}
          </div>
        )}
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="bg-gray-800 mt-8 sm:mt-12 border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-8">
            <div className="flex flex-col items-start">
              <img src={cinescopeLogo} alt="CineScope" className="h-8 sm:h-10 w-auto mb-2" />
              <p className="text-xs sm:text-sm text-gray-400">Your gateway to movie discoveries</p>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm sm:text-base mb-3 sm:mb-4">Explore</h4>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-400">
                <li><Link to="/trending"  className="hover:text-blue-400 transition-colors">Trending</Link></li>
                <li><Link to="/top-rated" className="hover:text-blue-400 transition-colors">Top Rated</Link></li>
                <li><Link to="/search"    className="hover:text-blue-400 transition-colors">Search</Link></li>
              </ul>
            </div>
            <div className="sm:col-span-2 lg:col-span-1">
              <h4 className="text-white font-semibold text-sm sm:text-base mb-3 sm:mb-4">About</h4>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-400">
                <li><a href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">TMDB API</a></li>
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
