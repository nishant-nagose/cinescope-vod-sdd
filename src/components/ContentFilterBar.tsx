import { useState, useRef, useEffect } from 'react'
import { useContentFilter } from '../context/ContentFilterContext'
import { useCountries } from '../hooks/useCountries'
import { useLanguages } from '../hooks/useLanguages'

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

export const ContentFilterBar = () => {
  const { countries, languages, setCountries, setLanguages } = useContentFilter()
  const { data: countryList } = useCountries()
  const { data: languageList } = useLanguages()

  const [countryOpen, setCountryOpen] = useState(false)
  const [languageOpen, setLanguageOpen] = useState(false)

  const countryRef = useRef<HTMLDivElement>(null)
  const languageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (countryRef.current && !countryRef.current.contains(e.target as Node)) {
        setCountryOpen(false)
      }
      if (languageRef.current && !languageRef.current.contains(e.target as Node)) {
        setLanguageOpen(false)
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

  const handleCountryToggle = (code: string) => {
    if (countries.length === 0) {
      setCountries([code])
    } else {
      const next = countries.includes(code)
        ? countries.filter(c => c !== code)
        : [...countries, code]
      setCountries(next)
    }
  }

  const handleLanguageSelectAll = () => setLanguages([])

  const handleLanguageToggle = (code: string) => {
    if (languages.length === 0) {
      setLanguages([code])
    } else {
      const next = languages.includes(code)
        ? languages.filter(l => l !== code)
        : [...languages, code]
      setLanguages(next)
    }
  }

  return (
    <div className="flex items-center gap-3 py-2 flex-wrap">
      {/* Country Dropdown */}
      <div className="relative" ref={countryRef}>
        <button
          onClick={() => { setCountryOpen(o => !o); setLanguageOpen(false) }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-sm text-white transition-colors min-h-[36px]"
          aria-haspopup="listbox"
          aria-expanded={countryOpen}
        >
          <GlobeIcon />
          <span>{countryLabel}</span>
          <ChevronIcon open={countryOpen} />
        </button>

        {countryOpen && (
          <div className="absolute top-full left-0 mt-1 z-50 w-56 bg-gray-800 border border-gray-600 rounded-lg shadow-xl overflow-hidden">
            <div className="max-h-64 overflow-y-auto">
              {/* Select All */}
              <label className="flex items-center gap-2 px-3 py-2 hover:bg-gray-700 cursor-pointer border-b border-gray-700">
                <input
                  type="checkbox"
                  checked={countries.length === 0}
                  onChange={handleCountrySelectAll}
                  className="rounded text-blue-500"
                />
                <span className="text-sm text-white font-medium">Select All</span>
              </label>

              {countryList?.map(country => (
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
          onClick={() => { setLanguageOpen(o => !o); setCountryOpen(false) }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-sm text-white transition-colors min-h-[36px]"
          aria-haspopup="listbox"
          aria-expanded={languageOpen}
        >
          <TranslateIcon />
          <span>{languageLabel}</span>
          <ChevronIcon open={languageOpen} />
        </button>

        {languageOpen && (
          <div className="absolute top-full left-0 mt-1 z-50 w-56 bg-gray-800 border border-gray-600 rounded-lg shadow-xl overflow-hidden">
            <div className="max-h-64 overflow-y-auto">
              {/* Select All */}
              <label className="flex items-center gap-2 px-3 py-2 hover:bg-gray-700 cursor-pointer border-b border-gray-700">
                <input
                  type="checkbox"
                  checked={languages.length === 0}
                  onChange={handleLanguageSelectAll}
                  className="rounded text-blue-500"
                />
                <span className="text-sm text-white font-medium">Select All</span>
              </label>

              {languageList?.map(lang => (
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
