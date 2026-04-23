import { useEffect } from 'react'

interface LaunchScreenProps {
  onComplete: () => void
}

export const LaunchScreen = ({ onComplete }: LaunchScreenProps) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 3000)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-950"
      aria-label="CineScope loading"
      role="status"
    >
      <style>{`
        @keyframes csLaunch {
          0%   { opacity: 0; transform: scale(0.8); }
          20%  { opacity: 1; transform: scale(1); }
          70%  { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(1.05); }
        }
        .cs-launch-logo {
          animation: csLaunch 3s ease-in-out forwards;
        }
      `}</style>

      <div className="cs-launch-logo flex flex-col items-center gap-4">
        <div className="text-5xl sm:text-7xl font-black tracking-tight">
          <span className="text-white">Cine</span>
          <span className="text-blue-500">Scope</span>
        </div>
        <p className="text-gray-400 text-sm sm:text-base tracking-widest uppercase">
          Your gateway to movie discoveries
        </p>
      </div>
    </div>
  )
}
