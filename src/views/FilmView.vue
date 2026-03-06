<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useFilmsStore } from '@/stores/films'
import { useUserStore } from '@/stores/user'
import { useFavoritesStore } from '@/stores/favorites'

const route = useRoute()
const filmsStore = useFilmsStore()
const userStore = useUserStore()
const favoritesStore = useFavoritesStore()

const filmId = computed(() => parseInt(route.params.id as string))
const isTrailerModalOpen = ref(false)

onMounted(() => {
  filmsStore.fetchFilmById(filmId.value)
})

const isFavorite = computed(() => {
  return favoritesStore.isFavorite(filmId.value)
})

const favoriteError = ref<string | null>(null)

const handleFavoriteClick = async () => {
  console.log('handleFavoriteClick called')
  console.log('isAuthenticated:', userStore.isAuthenticated)
  console.log('user:', userStore.user)
  
  if (!userStore.isAuthenticated) {
    console.log('Not authenticated, opening modal')
    // Открываем модальное окно авторизации
    if (window.openAuthModal) {
      window.openAuthModal()
    }
    return
  }
  
  favoriteError.value = null
  try {
    console.log('Toggling favorite for film:', filmId.value)
    await favoritesStore.toggleFavorite(filmId.value)
    console.log('Toggle successful')
  } catch (error: any) {
    console.error('Ошибка при работе с избранным:', error)
    favoriteError.value = error?.response?.data?.message || 'Не удалось добавить в избранное'
  }
}

const openTrailer = () => {
  isTrailerModalOpen.value = true
}

const closeTrailer = () => {
  isTrailerModalOpen.value = false
}
</script>

<template>
  <section class="film">
    <div class="container">
      <div v-if="filmsStore.isLoading && !filmsStore.currentFilm" class="loading">
        Загрузка информации о фильме...
      </div>
      
      <div v-else-if="filmsStore.error" class="error">
        {{ filmsStore.error }}
      </div>
      
      <div v-else-if="filmsStore.currentFilm" class="film__inner">
        <div class="film__content">
          <ul class="film__content-top">
            <li class="film__content-top-item">
              <div class="film__rating film__rating--green">
                <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                  <use xlink:href="/images/sprite.svg#icon-star"></use>
                </svg>
                <span class="film__rating-text">
                  {{ filmsStore.currentFilm.tmdbRating?.toFixed(1) || '—' }}
                </span>
              </div>
            </li>
            <li class="film__content-top-item">
              <span class="film__year">
                {{ filmsStore.currentFilm.releaseYear }}
              </span>
            </li>
            <li class="film__content-top-item">
              <span class="film__genre">
                {{ filmsStore.currentFilm.genres?.join(', ') || '—' }}
              </span>
            </li>
            <li class="film__content-top-item">
              <span class="random__film__duration">
                {{ filmsStore.currentFilm.runtime }} мин
              </span>
            </li> 
          </ul>
          <div class="film__content-body">
            <h1 class="film__title">
              {{ filmsStore.currentFilm.title }}
            </h1>
            <p class="film__description">
              {{ filmsStore.currentFilm.plot }}
            </p>
          </div>
          <div class="film__content-bottom">
            <button class="btn btn-primary" type="button" @click="openTrailer">
              Трейлер
            </button>
            <button class="btn btn-primary btn-primary--icon" type="button" @click="handleFavoriteClick">
              <svg class="btn-primary__icon" aria-hidden="true" width="16" height="16" viewBox="0 0 24 24">
                <use xlink:href="/images/sprite.svg#icon-heart"></use>
              </svg>
            </button>
            <span v-if="favoriteError" class="error-message">{{ favoriteError }}</span>
          </div>
        </div>
        <div class="film__image-wrapper">
          <img class="film__image" :src="filmsStore.currentFilm.posterUrl" :alt="`Кадр из фильма ${filmsStore.currentFilm.title}`">
        </div>
        <div class="film__info">
          <h2 class="film__info-title">
            О фильме 
          </h2>
          <ul class="film__info-list">
            <li class="film__info-item">
              <div class="film__info-item-left">
                Язык оригинала
              </div>
              <div class="film__info-item-right">
                {{ filmsStore.currentFilm.language || '—' }}
              </div>
            </li>
            <li class="film__info-item">
              <div class="film__info-item-left">
                Бюджет
              </div>
              <div class="film__info-item-right">
                {{ filmsStore.currentFilm.budget || '—' }}
              </div>
            </li>
            <li class="film__info-item">
              <div class="film__info-item-left">
                Выручка
              </div>
              <div class="film__info-item-right">
                {{ filmsStore.currentFilm.revenue || '—' }}
              </div>
            </li>
            <li class="film__info-item">
              <div class="film__info-item-left">
                Режиссёр
              </div>
              <div class="film__info-item-right">
                {{ filmsStore.currentFilm.director || '—' }}
              </div>
            </li>
            <li class="film__info-item">
              <div class="film__info-item-left">
                Продакшен 
              </div>
              <div class="film__info-item-right">
                {{ filmsStore.currentFilm.production || '—' }}
              </div>
            </li>
            <li class="film__info-item">
              <div class="film__info-item-left">
                Награды
              </div>
              <div class="film__info-item-right">
                {{ filmsStore.currentFilm.awardsSummary || '—' }}
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    
    <!-- Модальное окно трейлера -->
    <div v-if="isTrailerModalOpen" class="modal modal--active">
      <div class="preview">
        <button type="button" class="modal__close" id="previewClose" @click="closeTrailer">
          <svg class="modal__close-icon" aria-hidden="true" width="13" height="13">
            <use xlink:href="/images/sprite.svg#icon-close-black"></use>
          </svg>
        </button>
        <div class="plyr__video-embed" id="player" :data-url="filmsStore.currentFilm?.trailerUrl">
          <iframe
            id="videoFrame"
            :src="filmsStore.currentFilm?.trailerUrl"
            allowfullscreen
            allowtransparency
            allow="autoplay"
            title="YouTube video player">
          </iframe>
        </div>
      </div>
    </div>
  </section>
</template>

