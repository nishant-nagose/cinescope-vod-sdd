import { useState, useRef, useEffect } from 'react'
import { useContentFilter } from '../context/ContentFilterContext'
import { useCountries } from '../hooks/useCountries'

const GlobeIcon = () => (
  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
)

interface RegionDropdownProps {
  dropdownAlign?: 'left' | 'right'
}

export const RegionDropdown = ({ dropdownAlign = 'right' }: RegionDropdownProps) => {
  const { region, setRegion } = useContentFilter()
  const { data: countryList } = useCountries()
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
        setSearch('')
      }
    }
    document.addEventListener('mousedown', onMouseDown)
    return () => document.removeEventListener('mousedown', onMouseDown)
  }, [])

  const sorted = [...(countryList ?? [])].sort((a, b) => a.english_name.localeCompare(b.english_name))

  // Selected country always pinned first, then alphabetical search results
  const selectedCountry = sorted.find(c => c.iso_3166_1 === region)
  const filtered = sorted.filter(c =>
    c.iso_3166_1 !== region &&
    c.english_name.toLowerCase().includes(search.toLowerCase())
  )

  const label = selectedCountry ? selectedCountry.english_name : 'Global'

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors border border-white/20 min-h-[34px]"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <GlobeIcon />
        <span className="max-w-[90px] truncate">{label}</span>
        <ChevronIcon open={open} />
      </button>

      {open && (
        <div className={`absolute top-full mt-1 z-50 w-60 bg-gray-900 border border-white/15 rounded-xl shadow-2xl overflow-hidden ${dropdownAlign === 'left' ? 'left-0' : 'right-0'}`}>
          {/* Search */}
          <div className="p-2 border-b border-white/10">
            <input
              type="text"
              placeholder="Search region..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white/10 text-white placeholder-gray-400 rounded-lg border border-white/10 focus:outline-none focus:border-blue-500"
              style={{ fontSize: '16px' }}
              aria-label="Search region"
              autoFocus
            />
          </div>

          <div className="max-h-60 overflow-y-auto">
            {/* Select All (Global) — always shown */}
            {search === '' && (
              <button
                onClick={() => { setRegion(null); setOpen(false); setSearch('') }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-left text-sm transition-colors border-b border-white/10 ${
                  region === null
                    ? 'bg-blue-600/30 text-blue-300'
                    : 'hover:bg-white/10 text-white'
                }`}
              >
                <GlobeIcon />
                <span className="font-medium">Global (All Regions)</span>
                {region === null && <span className="ml-auto text-blue-400">✓</span>}
              </button>
            )}

            {/* Selected region pinned at top */}
            {selectedCountry && (
              <button
                onClick={() => { setRegion(null); setOpen(false); setSearch('') }}
                className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm bg-blue-600/20 text-blue-300 border-b border-white/10 hover:bg-blue-600/30 transition-colors"
              >
                <span className="font-medium">{selectedCountry.english_name}</span>
                <span className="ml-auto text-xs text-blue-400">✓ selected</span>
              </button>
            )}

            {/* Country list */}
            {filtered.map(country => (
              <button
                key={country.iso_3166_1}
                onClick={() => { setRegion(country.iso_3166_1); setOpen(false); setSearch('') }}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-left text-sm text-gray-200 hover:bg-white/10 transition-colors"
              >
                {country.english_name}
              </button>
            ))}

            {filtered.length === 0 && search !== '' && (
              <p className="px-3 py-3 text-xs text-gray-500 text-center">No results for "{search}"</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
