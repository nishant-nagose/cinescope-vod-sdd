import { OTTPlatform } from '../types/tmdb'

export const isMobileDevice = (): boolean =>
  window.matchMedia('(pointer: coarse)').matches

export const navigateToOTT = (provider: OTTPlatform, isMobile: boolean): void => {
  if (!isMobile || !provider.appScheme) {
    window.open(provider.webUrl, '_blank', 'noopener,noreferrer')
    return
  }
  window.location.href = provider.appScheme
  setTimeout(() => {
    window.open(provider.webUrl, '_blank', 'noopener,noreferrer')
  }, 300)
}
