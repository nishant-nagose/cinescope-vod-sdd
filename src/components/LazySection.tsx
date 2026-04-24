import { useEffect, useRef, useState, ReactNode } from 'react'

interface LazySectionProps {
  children: ReactNode
  minHeight?: string
}

export const LazySection = ({ children, minHeight = '280px' }: LazySectionProps) => {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // If IntersectionObserver is unavailable (very old Android WebView), show immediately.
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }

    // 600px top margin: on slow mobile networks the data fetch + image load takes
    // ~1-2 s, so we start rendering well before the user scrolls to the section.
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '1200px 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      style={visible ? { animation: 'lazySectionFadeIn 0.25s ease-out' } : { minHeight }}
    >
      {visible && children}
      <style>{`
        @keyframes lazySectionFadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
