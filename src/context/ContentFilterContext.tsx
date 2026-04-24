import { createContext, useContext, useState, ReactNode } from 'react'

interface ContentFilterContextValue {
  countries: string[]
  languages: string[]
  contentType: 'movies' | 'shows' | 'all'
  activeCategory: number | null
  setCountries: (v: string[]) => void
  setLanguages: (v: string[]) => void
  setContentType: (v: 'movies' | 'shows' | 'all') => void
  setActiveCategory: (v: number | null) => void
  filterKey: string
}

const ContentFilterContext = createContext<ContentFilterContextValue | null>(null)

export const ContentFilterProvider = ({ children }: { children: ReactNode }) => {
  const [countries, setCountries] = useState<string[]>(['US'])
  const [languages, setLanguages] = useState<string[]>(['en'])
  const [contentType, setContentType] = useState<'movies' | 'shows' | 'all'>('all')
  const [activeCategory, setActiveCategory] = useState<number | null>(null)

  const filterKey = `${countries.join(',')}-${languages.join(',')}-${contentType}-${activeCategory ?? 'all'}`

  return (
    <ContentFilterContext.Provider value={{
      countries, languages, contentType, activeCategory,
      setCountries, setLanguages, setContentType, setActiveCategory,
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
