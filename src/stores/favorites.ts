import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/api'
import type { Film } from '@/api/films'

export const useFavoritesStore = defineStore('favorites', () => {
  const favorites = ref<Film[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchFavorites = async () => {
    isLoading.value = true
    error.value = null
    try {
      console.log('Fetching favorites...')
      const response = await api.get('/favorites')
      console.log('Favorites response:', response.data)
      favorites.value = response.data
    } catch (err: any) {
      console.error('Failed to fetch favorites:', err)
      error.value = err.response?.data?.message || 'Ошибка загрузки избранного'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const addToFavorites = async (filmId: number) => {
    isLoading.value = true
    error.value = null
    try {
      console.log('Adding to favorites, filmId:', filmId)
      const response = await api.post('/favorites', { filmId })
      console.log('Add to favorites response:', response.data)
      // После успешного добавления обновляем список
      await fetchFavorites()
    } catch (err: any) {
      console.error('Add to favorites error:', err)
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
      await api.delete(`/favorites/${filmId}`)
      // После успешного удаления обновляем список
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