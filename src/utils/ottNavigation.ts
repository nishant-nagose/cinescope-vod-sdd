import { OTTPlatform } from '../types/tmdb'

export const isMobileDevice = (): boolean =>
  window.matchMedia('(pointer: coarse)').matches

export const navigateToOTT = (provider: OTTPlatform, isMobile: boolean): void => {
  if (!isMobile || !provider.appScheme) {
    // Desktop: open OTT web page directly in a new tab
    window.open(provider.webUrl, '_blank', 'noopener,noreferrer')
    return
  }

  // Mobile: attempt deep-link into the native app.
  // If the app is not installed the page stays visible, so after 1500 ms we
  // fall back to the web URL in a new tab.  If the app does open, the browser
  // tab becomes hidden — we catch that with visibilitychange and cancel the
  // fallback so the web page never opens on top.
  const fallbackTimer = setTimeout(() => {
    window.open(provider.webUrl, '_blank', 'noopener,noreferrer')
  }, 1500)

  const onVisibility = () => {
    if (document.hidden) {
      clearTimeout(fallbackTimer)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }
  document.addEventListener('visibilitychange', onVisibility)

  window.location.href = provider.appScheme
}
