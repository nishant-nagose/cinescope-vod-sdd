import { useEffect, useRef } from 'react'

interface InfiniteScrollTriggerProps {
  onIntersect: () => void
  hasMore: boolean
  loading: boolean
}

export const InfiniteScrollTrigger = ({ onIntersect, hasMore, loading }: InfiniteScrollTriggerProps) => {
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !loading) {
          onIntersect()
        }
      },
      { rootMargin: '200px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [onIntersect, hasMore, loading])

  return (
    <div ref={sentinelRef} className="flex flex-col items-center py-8">
      {loading && (
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Loading more...
        </div>
      )}
      {!hasMore && !loading && (
        <p className="text-gray-500 text-sm">You've reached the end</p>
      )}
    </div>
  )
}
