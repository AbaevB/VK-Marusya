/**
 * Утилиты для работы с изображениями
 */

// Базовый путь для GitHub Pages
const BASE_URL = import.meta.env.BASE_URL || '/'

// Пути к плейсхолдерам
const PLACEHOLDER_POSTER = '/images/placeholders/poster-placeholder.png'
const PLACEHOLDER_BACKDROP = '/images/placeholders/backdrop-placeholder.png'

/**
 * Добавляет базовый путь к URL изображения
 */
export const getImageUrl = (url: string): string => {
  if (!url) return ''
  // Если URL уже абсолютный или содержит base, возвращаем как есть
  if (url.startsWith('http') || url.startsWith('data:')) {
    return url
  }
  // Добавляем базовый путь
  return `${BASE_URL}${url.replace(/^\//, '')}`
}
  
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
    return getImageUrl(posterUrl!)
  }
  return getImageUrl(PLACEHOLDER_POSTER)
}

/**
 * Возвращает URL кадра из фильма или плейсхолдер
 */
export const getBackdropUrl = (backdropUrl: string | null | undefined): string => {
  if (isValidImageUrl(backdropUrl)) {
    return getImageUrl(backdropUrl!)
  }
  return getImageUrl(PLACEHOLDER_BACKDROP)
}

/**
 * Обрабатывает ошибку загрузки изображения и возвращает плейсхолдер
 */
export const handleImageError = (
  event: Event,
  type: 'poster' | 'backdrop' = 'poster'
): void => {
  const target = event.target as HTMLImageElement
  target.src = type === 'poster' ? getImageUrl(PLACEHOLDER_POSTER) : getImageUrl(PLACEHOLDER_BACKDROP)
}
