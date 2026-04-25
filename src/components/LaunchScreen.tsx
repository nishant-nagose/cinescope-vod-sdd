import { useEffect } from 'react'

interface LaunchScreenProps {
  onComplete: () => void
}

export const LaunchScreen = ({ onComplete }: LaunchScreenProps) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 3600)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
      style={{ background: 'radial-gradient(ellipse 90% 70% at 50% 50%, #0d1a2e 0%, #060b15 55%, #000000 100%)' }}
      aria-label="CineScope loading"
      role="status"
    >
      <style>{`
        @keyframes csGlow {
          0%   { opacity: 0; transform: scale(0.7); }
          30%  { opacity: 1; transform: scale(1); }
          72%  { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(1.15); }
        }
        @keyframes csLogoWrap {
          0%   { opacity: 0; transform: translateY(32px) scale(0.88); filter: blur(12px); }
          38%  { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
          72%  { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
          100% { opacity: 0; transform: translateY(-14px) scale(1.04); filter: blur(6px); }
        }
        @keyframes csShimmer {
          0%   { background-position: -350% center; }
          100% { background-position: 350% center; }
        }
        @keyframes csDivider {
          0%, 22% { transform: scaleX(0); opacity: 0; }
          52%     { transform: scaleX(1); opacity: 1; }
          72%     { transform: scaleX(1); opacity: 1; }
          100%    { transform: scaleX(1); opacity: 0; }
        }
        @keyframes csTagline {
          0%, 32% { opacity: 0; transform: translateY(10px); letter-spacing: 0.55em; }
          58%     { opacity: 1; transform: translateY(0); letter-spacing: 0.3em; }
          72%     { opacity: 1; letter-spacing: 0.3em; }
          100%    { opacity: 0; }
        }
        @keyframes csDot {
          0%, 55%, 100% { opacity: 0.15; transform: scale(0.65); }
          28%            { opacity: 1;    transform: scale(1); }
        }

        .cs-glow-bg {
          position: absolute;
          inset: -25%;
          background: radial-gradient(ellipse 52% 42% at 50% 50%,
            rgba(59,130,246,0.22) 0%,
            rgba(99,102,241,0.10) 35%,
            transparent 65%
          );
          animation: csGlow 3.6s ease-in-out forwards;
        }
        .cs-logo-wrap {
          animation: csLogoWrap 3.6s cubic-bezier(0.14, 1, 0.34, 1) forwards;
        }
        .cs-shimmer-text {
          background: linear-gradient(
            105deg,
            #cbd5e1 0%,
            #93c5fd 25%,
            #a5b4fc 45%,
            #818cf8 55%,
            #93c5fd 75%,
            #e2e8f0 100%
          );
          background-size: 350% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: csShimmer 2.6s linear infinite;
        }
        .cs-divider {
          transform-origin: center;
          animation: csDivider 3.6s ease-in-out forwards;
        }
        .cs-tagline { animation: csTagline 3.6s ease-in-out forwards; }
        .cs-dot-1 { animation: csDot 1.2s 1.5s  ease-in-out infinite; }
        .cs-dot-2 { animation: csDot 1.2s 1.75s ease-in-out infinite; }
        .cs-dot-3 { animation: csDot 1.2s 2.0s  ease-in-out infinite; }
      `}</style>

      {/* Cinematic spotlight glow */}
      <div className="cs-glow-bg" />

      {/* Content card */}
      <div className="cs-logo-wrap relative z-10 flex flex-col items-center gap-5 select-none px-6">

        {/* Wordmark */}
        <div
          className="cs-shimmer-text font-black tracking-tight"
          style={{ fontSize: 'clamp(3.2rem, 13vw, 6.5rem)', lineHeight: 1 }}
        >
          CineScope
        </div>

        {/* Animated divider line */}
        <div
          className="cs-divider h-px"
          style={{
            width: 'clamp(100px, 30vw, 200px)',
            background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.9), rgba(59,130,246,0.9), transparent)',
          }}
        />

        {/* Tagline */}
        <p className="cs-tagline text-blue-200/50 text-xs sm:text-sm font-light uppercase tracking-widest text-center">
          Your gateway to discovery
        </p>

        {/* Pulsing dots */}
        <div className="flex items-center gap-2 mt-1">
          <span className="cs-dot-1 block w-1.5 h-1.5 rounded-full bg-blue-400" style={{ opacity: 0.15 }} />
          <span className="cs-dot-2 block w-1.5 h-1.5 rounded-full bg-indigo-400" style={{ opacity: 0.15 }} />
          <span className="cs-dot-3 block w-1.5 h-1.5 rounded-full bg-violet-400" style={{ opacity: 0.15 }} />
        </div>
      </div>
    </div>
  )
}
