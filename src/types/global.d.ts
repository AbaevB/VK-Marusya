export {}

declare global {
  interface Window {
    openAuthModal?: () => void
  }
}
