import { createContext, useContext, useState, ReactNode } from 'react'

interface ContentFilterContextValue {
  countries: string[]
  languages: string[]
  setCountries: (v: string[]) => void
  setLanguages: (v: string[]) => void
  filterKey: string
}

const ContentFilterContext = createContext<ContentFilterContextValue | null>(null)

export const ContentFilterProvider = ({ children }: { children: ReactNode }) => {
  const [countries, setCountries] = useState<string[]>(['US'])
  const [languages, setLanguages] = useState<string[]>(['en'])

  const filterKey = `${countries.join(',')}-${languages.join(',')}`

  return (
    <ContentFilterContext.Provider value={{ countries, languages, setCountries, setLanguages, filterKey }}>
      {children}
    </ContentFilterContext.Provider>
  )
}

export const useContentFilter = (): ContentFilterContextValue => {
  const ctx = useContext(ContentFilterContext)
  if (!ctx) throw new Error('useContentFilter must be used within ContentFilterProvider')
  return ctx
}
