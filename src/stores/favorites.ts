import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/api'
import { filmsApi } from '@/api/films'
import type { Film } from '@/api/films'

// Функция для отправки данных в формате x-www-form-urlencoded
const toFormData = (data: Record<string, string | number>) => {
  return Object.entries(data)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join('&')
}

export const useFavoritesStore = defineStore('favorites', () => {
  const favorites = ref<Film[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchFavorites = async () => {
    isLoading.value = true
    error.value = null
    try {
      // GET /favorites - возвращает массив фильмов
      const response = await api.get('/favorites')
      
      const data = response.data as any
      if (Array.isArray(data)) {
        favorites.value = data
      } else {
        favorites.value = []
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Ошибка загрузки избранного'
      favorites.value = []
    } finally {
      isLoading.value = false
    }
  }

  const addToFavorites = async (filmId: number) => {
    isLoading.value = true
    error.value = null
    try {
      // API принимает x-www-form-urlencoded с полем id (строка!)
      const formData = toFormData({ id: String(filmId) })
      await api.post('/favorites', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      })
      // Обновляем локальный список
      await fetchFavorites()
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Ошибка добавления в избранное'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const removeFromFavorites = async (filmId: number) => {
    isLoading.value = true
    error.value = null
    try {
      // DELETE /favorites/{movieId} - ID в URL path
      await api.delete(`/favorites/${filmId}`)
      // Обновляем локальный список
      await fetchFavorites()
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Ошибка удаления из избранного'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const isFavorite = computed(() => (filmId: number) => {
    return favorites.value.some(film => film.id === filmId)
  })

  const toggleFavorite = async (filmId: number) => {
    if (isFavorite.value(filmId)) {
      await removeFromFavorites(filmId)
    } else {
      await addToFavorites(filmId)
    }
  }

  return {
    favorites,
    isLoading,
    error,
    fetchFavorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    toggleFavorite,
  }
})