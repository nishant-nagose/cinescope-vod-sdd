interface TrailerPlayerProps {
  videoKey: string
  autoplay?: boolean
  muted?: boolean
  title?: string
  onClose?: () => void
}

export const TrailerPlayer = ({
  videoKey,
  autoplay = false,
  muted = true,
  title = 'Movie Trailer',
  onClose,
}: TrailerPlayerProps) => {
  const params = new URLSearchParams({
    autoplay: autoplay ? '1' : '0',
    mute: muted ? '1' : '0',
    playsinline: '1',
    rel: '0',
  })
  const src = `https://www.youtube.com/embed/${videoKey}?${params.toString()}`

  return (
    <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-10 p-1.5 bg-black bg-opacity-70 rounded-full text-white hover:bg-opacity-90 transition-colors"
          aria-label="Close trailer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
      <iframe
        src={src}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 w-full h-full rounded-lg"
      />
    </div>
  )
}
