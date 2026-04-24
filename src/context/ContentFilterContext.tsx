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

export const ContentFilterProvider = ({ children }: { children: ReactNode }) => {
  const [region, setRegionState] = useState<string | null>(null)
  const [contentType, setContentType] = useState<'movies' | 'shows' | 'all'>('all')
  const [activeCategory, setActiveCategory] = useState<number | null>(null)

  // Auto-detect region from IP on first load; only sets if user hasn't picked one yet
  useEffect(() => {
    fetch('https://ipapi.co/country/')
      .then(r => r.text())
      .then(code => {
        const trimmed = code.trim()
        if (/^[A-Z]{2}$/.test(trimmed)) {
          setRegionState(prev => prev === null ? trimmed : prev)
        }
      })
      .catch(() => {})
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
