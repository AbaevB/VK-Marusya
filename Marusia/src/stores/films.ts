import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { filmsApi } from '@/api/films'
import type { Film } from '@/api/films'

export const useFilmsStore = defineStore('films', () => {
  const films = ref<Film[]>([])
  const currentFilm = ref<Film | null>(null)
  const randomFilm = ref<Film | null>(null)
  const topFilms = ref<Film[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const currentPage = ref(1)
  const totalPages = ref(1)

  const fetchRandomFilm = async () => {
    isLoading.value = true
    error.value = null
    try {
      const response = await filmsApi.getRandomFilm()
      randomFilm.value = response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Ошибка загрузки случайного фильма'
      console.error('Ошибка загрузки случайного фильма:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const fetchTopFilms = async (limit = 10) => {
    isLoading.value = true
    error.value = null
    try {
      const response = await filmsApi.getTopFilms(limit)
      topFilms.value = response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Ошибка загрузки топ фильмов'
      console.error('Ошибка загрузки топ фильмов:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const fetchFilmById = async (id: number) => {
    isLoading.value = true
    error.value = null
    try {
      const response = await filmsApi.getFilmById(id)
      currentFilm.value = response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Ошибка загрузки фильма'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const searchFilms = async (query: string, page = 1, limit = 10) => {
    isLoading.value = true
    error.value = null
    try {
      const response = await filmsApi.searchFilms(query, page, limit)
      films.value = response.data
      // API не возвращает total для поиска, используем эвристику
      totalPages.value = Math.ceil(response.data.length / limit)
      currentPage.value = page
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Ошибка поиска фильмов'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const fetchFilmsByGenre = async (genre: string, page = 1, limit = 10) => {
    isLoading.value = true
    error.value = null
    try {
      const response = await filmsApi.getFilmsByGenre(genre, page, limit)
      films.value = response.data
      // API возвращает массив фильмов, используем эвристику для пагинации
      totalPages.value = response.data.length < limit ? page : page + 1
      currentPage.value = page
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Ошибка загрузки фильмов по жанру'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const loadMoreFilms = async (genre?: string, query?: string) => {
    const nextPage = currentPage.value + 1
    isLoading.value = true
    try {
      let response
      if (genre) {
        response = await filmsApi.getFilmsByGenre(genre, nextPage)
      } else if (query) {
        response = await filmsApi.searchFilms(query, nextPage)
      } else {
        response = await filmsApi.getFilms(nextPage)
      }
      
      films.value = [...films.value, ...response.data]
      currentPage.value = nextPage
      // Обновляем totalPages если загружено меньше фильмов, чем лимит
      if (response.data.length < 10) {
        totalPages.value = nextPage
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Ошибка загрузки дополнительных фильмов'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    films,
    currentFilm,
    randomFilm,
    topFilms,
    isLoading,
    error,
    currentPage,
    totalPages,
    fetchRandomFilm,
    fetchTopFilms,
    fetchFilmById,
    searchFilms,
    fetchFilmsByGenre,
    loadMoreFilms,
  }
})