import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface ContentFilterContextValue {
  region: string | null          // null = global (no country filter)
  countries: string[]            // derived: [region] or []
  languages: string[]            // always [], language filter removed from UI
  contentType: 'movies' | 'shows' | 'all'
  activeCategory: number | null
  setRegion: (v: string | null) => void
  setContentType: (v: 'movies' | 'shows' | 'all') => void
  setActiveCategory: (v: number | null) => void
  filterKey: string
}

const ContentFilterContext = createContext<ContentFilterContextValue | null>(null)

// Wraps fetch with an abort-based timeout so slow/hung services don't block the chain
const fetchWithTimeout = async (url: string, ms = 5000): Promise<Response> => {
  const ac = new AbortController()
  const id = setTimeout(() => ac.abort(), ms)
  try {
    return await fetch(url, { signal: ac.signal })
  } finally {
    clearTimeout(id)
  }
}

// Try multiple geolocation services in order; return first valid 2-letter country code
const detectCountryCode = async (): Promise<string | null> => {
  // 1. api.country.is — CORS-friendly JSON service, no rate limit
  try {
    const r = await fetchWithTimeout('https://api.country.is/')
    const d: { country?: string } = await r.json()
    if (d.country && /^[A-Z]{2}$/.test(d.country)) return d.country
  } catch {}

  // 2. ipapi.co plain-text endpoint (existing, may be rate-limited)
  try {
    const r = await fetchWithTimeout('https://ipapi.co/country/')
    const t = (await r.text()).trim()
    if (/^[A-Z]{2}$/.test(t)) return t
  } catch {}

  // 3. freeipapi.com — free JSON service, no auth required
  try {
    const r = await fetchWithTimeout('https://freeipapi.com/api/json')
    const d: { countryCode?: string } = await r.json()
    if (d.countryCode && /^[A-Z]{2}$/.test(d.countryCode)) return d.countryCode
  } catch {}

  return null
}

export const ContentFilterProvider = ({ children }: { children: ReactNode }) => {
  const [region, setRegionState] = useState<string | null>(null)
  const [contentType, setContentType] = useState<'movies' | 'shows' | 'all'>('all')
  const [activeCategory, setActiveCategory] = useState<number | null>(null)

  // Auto-detect region from IP on first load; only sets if user hasn't picked one yet
  useEffect(() => {
    let cancelled = false
    detectCountryCode().then(code => {
      if (!cancelled && code) setRegionState(prev => prev === null ? code : prev)
    })
    return () => { cancelled = true }
  }, [])

  const setRegion = (v: string | null) => setRegionState(v)

  const countries = region ? [region] : []
  const languages: string[] = []

  const filterKey = `${region ?? 'global'}-${contentType}-${activeCategory ?? 'all'}`

  return (
    <ContentFilterContext.Provider value={{
      region, countries, languages,
      contentType, activeCategory,
      setRegion, setContentType, setActiveCategory,
      filterKey,
    }}>
      {children}
    </ContentFilterContext.Provider>
  )
}

export const useContentFilter = (): ContentFilterContextValue => {
  const ctx = useContext(ContentFilterContext)
  if (!ctx) throw new Error('useContentFilter must be used within ContentFilterProvider')
  return ctx
}
