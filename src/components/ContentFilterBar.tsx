import { useState, useRef, useEffect } from 'react'
import { useContentFilter } from '../context/ContentFilterContext'
import { useCountries } from '../hooks/useCountries'
import { useLanguages } from '../hooks/useLanguages'
import { useGenres } from '../hooks/useGenres'

const GlobeIcon = () => (
  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const TranslateIcon = () => (
  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
  </svg>
)

const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg
    className={`w-3.5 h-3.5 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
)

interface ContentFilterBarProps {
  compact?: boolean
  hideToggle?: boolean
}

export const ContentFilterBar = ({ compact = false, hideToggle = false }: ContentFilterBarProps) => {
  const { countries, languages, contentType, activeCategory, setCountries, setLanguages, setContentType, setActiveCategory } = useContentFilter()
  const { data: countryList } = useCountries()
  const { data: languageList } = useLanguages()
  const { data: genresData } = useGenres()

  const [countryOpen, setCountryOpen] = useState(false)
  const [languageOpen, setLanguageOpen] = useState(false)
  const [countrySearch, setCountrySearch] = useState('')
  const [languageSearch, setLanguageSearch] = useState('')

  const countryRef = useRef<HTMLDivElement>(null)
  const languageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (countryRef.current && !countryRef.current.contains(e.target as Node)) {
        setCountryOpen(false)
        setCountrySearch('')
      }
      if (languageRef.current && !languageRef.current.contains(e.target as Node)) {
        setLanguageOpen(false)
        setLanguageSearch('')
      }
    }
    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [])

  const countryLabel = countries.length === 0
    ? 'All Countries'
    : countries.length === 1
    ? '1 Country'
    : `${countries.length} Countries`

  const languageLabel = languages.length === 0
    ? 'All Languages'
    : languages.length === 1
    ? '1 Language'
    : `${languages.length} Languages`

  const handleCountrySelectAll = () => setCountries([])
  const handleLanguageSelectAll = () => setLanguages([])

  const handleCountryToggle = (code: string) => {
    const next = countries.length === 0
      ? [code]
      : countries.includes(code)
        ? countries.filter(c => c !== code)
        : [...countries, code]
    setCountries(next)
  }

  const handleLanguageToggle = (code: string) => {
    const next = languages.length === 0
      ? [code]
      : languages.includes(code)
        ? languages.filter(l => l !== code)
        : [...languages, code]
    setLanguages(next)
  }

  const sortedCountries = [...(countryList ?? [])].sort((a, b) =>
    a.english_name.localeCompare(b.english_name)
  )
  const filteredCountries = sortedCountries.filter(c =>
    countries.includes(c.iso_3166_1) ||
    c.english_name.toLowerCase().includes(countrySearch.toLowerCase())
  )

  const sortedLanguages = [...(languageList ?? [])].sort((a, b) =>
    a.english_name.localeCompare(b.english_name)
  )
  const filteredLanguages = sortedLanguages.filter(l =>
    languages.includes(l.iso_639_1) ||
    l.english_name.toLowerCase().includes(languageSearch.toLowerCase())
  )

  const btnClass = compact
    ? 'flex items-center gap-1 px-2 py-1 rounded-md bg-gray-700 hover:bg-gray-600 text-xs text-white transition-colors min-h-[30px]'
    : 'flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-sm text-white transition-colors min-h-[36px]'

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Movies / Shows Toggle — hidden when parent header renders its own toggle */}
      {!hideToggle && (
        <div className="flex rounded-lg overflow-hidden border border-gray-600">
          {(['all', 'movies', 'shows'] as const).map(type => (
            <button
              key={type}
              onClick={() => setContentType(type)}
              className={`px-3 py-1.5 text-xs font-medium transition-colors capitalize ${
                contentType === type
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      )}

      {/* Category Dropdown */}
      {genresData && (
        <select
          value={activeCategory ?? ''}
          onChange={e => setActiveCategory(e.target.value === '' ? null : Number(e.target.value))}
          className="px-2 py-1.5 rounded-lg bg-gray-700 text-gray-300 text-xs border border-gray-600 focus:outline-none focus:border-blue-500"
          aria-label="Category"
        >
          <option value="">All Categories</option>
          {genresData.genres.map(g => (
            <option key={g.id} value={g.id}>{g.name}</option>
          ))}
        </select>
      )}

      {/* Country Dropdown */}
      <div className="relative" ref={countryRef}>
        <button
          onClick={() => { setCountryOpen(o => !o); setLanguageOpen(false); setLanguageSearch('') }}
          className={btnClass}
          aria-haspopup="listbox"
          aria-expanded={countryOpen}
        >
          <GlobeIcon />
          <span>{countryLabel}</span>
          <ChevronIcon open={countryOpen} />
        </button>

        {countryOpen && (
          <div className="absolute top-full right-0 mt-1 z-50 w-56 bg-gray-800 border border-gray-600 rounded-lg shadow-xl overflow-hidden">
            <div className="p-2 border-b border-gray-700">
              <input
                type="text"
                placeholder="Search countries..."
                value={countrySearch}
                onChange={e => setCountrySearch(e.target.value)}
                className="w-full px-2 py-1 text-xs bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                aria-label="Search countries"
              />
            </div>
            <div className="max-h-56 overflow-y-auto">
              {countrySearch === '' && (
                <label className="flex items-center gap-2 px-3 py-2 hover:bg-gray-700 cursor-pointer border-b border-gray-700">
                  <input
                    type="checkbox"
                    checked={countries.length === 0}
                    onChange={handleCountrySelectAll}
                    className="rounded text-blue-500"
                  />
                  <span className="text-sm text-white font-medium">Select All</span>
                </label>
              )}
              {filteredCountries.map(country => (
                <label
                  key={country.iso_3166_1}
                  className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-700 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={countries.includes(country.iso_3166_1)}
                    onChange={() => handleCountryToggle(country.iso_3166_1)}
                    className="rounded text-blue-500"
                  />
                  <span className="text-sm text-gray-200">{country.english_name}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Language Dropdown */}
      <div className="relative" ref={languageRef}>
        <button
          onClick={() => { setLanguageOpen(o => !o); setCountryOpen(false); setCountrySearch('') }}
          className={btnClass}
          aria-haspopup="listbox"
          aria-expanded={languageOpen}
        >
          <TranslateIcon />
          <span>{languageLabel}</span>
          <ChevronIcon open={languageOpen} />
        </button>

        {languageOpen && (
          <div className="absolute top-full right-0 mt-1 z-50 w-56 bg-gray-800 border border-gray-600 rounded-lg shadow-xl overflow-hidden">
            <div className="p-2 border-b border-gray-700">
              <input
                type="text"
                placeholder="Search languages..."
                value={languageSearch}
                onChange={e => setLanguageSearch(e.target.value)}
                className="w-full px-2 py-1 text-xs bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                aria-label="Search languages"
              />
            </div>
            <div className="max-h-56 overflow-y-auto">
              {languageSearch === '' && (
                <label className="flex items-center gap-2 px-3 py-2 hover:bg-gray-700 cursor-pointer border-b border-gray-700">
                  <input
                    type="checkbox"
                    checked={languages.length === 0}
                    onChange={handleLanguageSelectAll}
                    className="rounded text-blue-500"
                  />
                  <span className="text-sm text-white font-medium">Select All</span>
                </label>
              )}
              {filteredLanguages.map(lang => (
                <label
                  key={lang.iso_639_1}
                  className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-700 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={languages.includes(lang.iso_639_1)}
                    onChange={() => handleLanguageToggle(lang.iso_639_1)}
                    className="rounded text-blue-500"
                  />
                  <span className="text-sm text-gray-200">{lang.english_name}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
