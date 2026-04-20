interface RatingBadgeProps {
  rating: number
}

export const RatingBadge = ({ rating }: RatingBadgeProps) => {
  const getRatingColor = (rating: number) => {
    if (rating >= 8) return 'bg-yellow-500 text-black'
    if (rating >= 6) return 'bg-gray-400 text-black'
    return 'bg-gray-600 text-white'
  }

  const getRatingLabel = (rating: number) => {
    if (rating >= 8) return 'Excellent'
    if (rating >= 6) return 'Good'
    return 'Poor'
  }

  return (
    <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${getRatingColor(rating)}`}>
      {rating.toFixed(1)} - {getRatingLabel(rating)}
    </span>
  )
}