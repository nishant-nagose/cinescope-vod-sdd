export const LoadingSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="bg-gray-700 h-64 rounded-lg mb-4"></div>
      <div className="space-y-3">
        <div className="bg-gray-700 h-4 rounded w-3/4"></div>
        <div className="bg-gray-700 h-4 rounded w-1/2"></div>
        <div className="bg-gray-700 h-4 rounded w-1/4"></div>
      </div>
    </div>
  )
}

export const MovieCardSkeleton = () => {
  return (
    <div className="animate-pulse bg-gray-800 rounded-lg overflow-hidden">
      <div className="bg-gray-700 h-48"></div>
      <div className="p-4 space-y-3">
        <div className="bg-gray-700 h-4 rounded w-3/4"></div>
        <div className="bg-gray-700 h-4 rounded w-1/2"></div>
        <div className="bg-gray-700 h-3 rounded w-1/4"></div>
      </div>
    </div>
  )
}