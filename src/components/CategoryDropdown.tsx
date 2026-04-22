import { Genre } from '../types/tmdb'

interface CategoryDropdownProps {
  genres: Genre[]
  selectedGenreId: number
  onChange: (genreId: number) => void
}

export const CategoryDropdown = ({ genres, selectedGenreId, onChange }: CategoryDropdownProps) => {
  return (
    <select
      value={selectedGenreId}
      onChange={(e) => onChange(Number(e.target.value))}
      className="bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer min-h-[44px]"
      aria-label="Select movie genre"
    >
      {genres.map(genre => (
        <option key={genre.id} value={genre.id}>
          {genre.name}
        </option>
      ))}
    </select>
  )
}
