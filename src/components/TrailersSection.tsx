import { useState } from 'react'
import { useMovieVideos } from '../hooks/useMovieVideos'
import { TrailerPlayer } from './TrailerPlayer'
import { MovieVideo } from '../types/tmdb'

interface TrailersSectionProps {
  movieId: number
}

const sortOrder = (type: string) => {
  if (type === 'Trailer') return 0
  if (type === 'Clip') return 1
  return 2
}

const VideoThumbnail = ({
  video,
  onClick,
}: {
  video: MovieVideo
  onClick: () => void
}) => (
  <button
    onClick={onClick}
    className="flex-shrink-0 w-48 sm:w-56 group text-left"
    aria-label={`Play ${video.name}`}
  >
    <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-700">
      <img
        src={`https://img.youtube.com/vi/${video.key}/mqdefault.jpg`}
        alt={video.name}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
      />
      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 group-hover:bg-opacity-10 transition-colors">
        <div className="w-10 h-10 rounded-full bg-white bg-opacity-80 flex items-center justify-center">
          <svg className="w-5 h-5 text-gray-900 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>
    </div>
    <p className="mt-1.5 text-xs text-white font-medium truncate">{video.name}</p>
    <p className="text-xs text-gray-400">{video.type}</p>
  </button>
)

export const TrailersSection = ({ movieId }: TrailersSectionProps) => {
  const { data, loading } = useMovieVideos(movieId)
  const [activeKey, setActiveKey] = useState<string | null>(null)

  if (loading) {
    return (
      <section className="mt-8">
        <h2 className="text-lg sm:text-xl font-bold text-white mb-4">Trailers &amp; Clips</h2>
        <div className="flex gap-4 overflow-x-hidden">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex-shrink-0 w-48 sm:w-56">
              <div className="aspect-video bg-gray-700 rounded-lg animate-pulse" />
              <div className="mt-2 h-3 bg-gray-700 rounded animate-pulse w-3/4" />
            </div>
          ))}
        </div>
      </section>
    )
  }

  const videos = (data?.results ?? [])
    .filter(v => v.site === 'YouTube')
    .sort((a, b) => sortOrder(a.type) - sortOrder(b.type))

  if (videos.length === 0) return null

  return (
    <section className="mt-8">
      <h2 className="text-lg sm:text-xl font-bold text-white mb-4">Trailers &amp; Clips</h2>

      {activeKey && (
        <div className="mb-4">
          <TrailerPlayer
            videoKey={activeKey}
            autoplay
            title="Movie Trailer"
            onClose={() => setActiveKey(null)}
          />
        </div>
      )}

      <div className="flex gap-4 overflow-x-auto pb-3 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-gray-800 [&::-webkit-scrollbar-thumb]:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full">
        {videos.map(video => (
          <VideoThumbnail
            key={video.id}
            video={video}
            onClick={() => setActiveKey(activeKey === video.key ? null : video.key)}
          />
        ))}
      </div>
    </section>
  )
}
