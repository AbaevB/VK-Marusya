/**
 * Утилиты для работы с изображениями
 */

// Пути к плейсхолдерам
const PLACEHOLDER_POSTER = '/images/placeholders/poster-placeholder.png'
const PLACEHOLDER_BACKDROP = '/images/placeholders/backdrop-placeholder.png'

/**
 * Проверяет, является ли URL изображения пустым или некорректным
 */
export const isValidImageUrl = (url: string | null | undefined): boolean => {
  if (!url || typeof url !== 'string') {
    return false
  }
  
  const trimmed = url.trim()
  if (trimmed === '') {
    return false
  }
  
  // Проверяем, что это не пустой placeholder
  return !trimmed.includes('null') && !trimmed.includes('undefined')
}

/**
 * Возвращает URL постера или плейсхолдер
 */
export const getPosterUrl = (posterUrl: string | null | undefined): string => {
  if (isValidImageUrl(posterUrl)) {
    return posterUrl!
  }
  return PLACEHOLDER_POSTER
}

/**
 * Возвращает URL кадра из фильма или плейсхолдер
 */
export const getBackdropUrl = (backdropUrl: string | null | undefined): string => {
  if (isValidImageUrl(backdropUrl)) {
    return backdropUrl!
  }
  return PLACEHOLDER_BACKDROP
}

/**
 * Обрабатывает ошибку загрузки изображения и возвращает плейсхолдер
 */
export const handleImageError = (
  event: Event,
  type: 'poster' | 'backdrop' = 'poster'
): void => {
  const target = event.target as HTMLImageElement
  target.src = type === 'poster' ? PLACEHOLDER_POSTER : PLACEHOLDER_BACKDROP
}
