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

const handleFavoriteClick = async () => {
  if (!userStore.isAuthenticated) {
    // TODO: Открыть модальное окно авторизации
    console.log('Пользователь не авторизован, нужно открыть модальное окно логина')
    return
  }
  
  try {
    await favoritesStore.toggleFavorite(filmId.value)
  } catch (error) {
    console.error('Ошибка при работе с избранным:', error)
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
  <main class="film-page">
    <div class="container">
      <div v-if="filmsStore.isLoading && !filmsStore.currentFilm" class="loading">
        Загрузка информации о фильме...
      </div>
      
      <div v-else-if="filmsStore.error" class="error">
        {{ filmsStore.error }}
      </div>
      
      <div v-else-if="filmsStore.currentFilm" class="film-details">
        <div class="film-details__header">
          <div class="film-details__poster">
            <img 
              :src="filmsStore.currentFilm.posterUrl" 
              :alt="filmsStore.currentFilm.title"
              class="film-details__poster-image"
            />
          </div>
          
          <div class="film-details__info">
            <h1 class="film-details__title">{{ filmsStore.currentFilm.title }}</h1>
            
            <div class="film-details__rating">
              <span class="film-details__rating-value">
                Рейтинг: {{ filmsStore.currentFilm.tmdbRating?.toFixed(1) || '—' }}
              </span>
            </div>
            
            <div class="film-details__meta">
              <div class="film-details__meta-item">
                <span class="film-details__meta-label">Год:</span>
                <span class="film-details__meta-value">{{ filmsStore.currentFilm.releaseYear }}</span>
              </div>
              
              <div class="film-details__meta-item">
                <span class="film-details__meta-label">Длительность:</span>
                <span class="film-details__meta-value">{{ filmsStore.currentFilm.runtime }} мин.</span>
              </div>
              
              <div class="film-details__meta-item">
                <span class="film-details__meta-label">Режиссёр:</span>
                <span class="film-details__meta-value">{{ filmsStore.currentFilm.director || '—' }}</span>
              </div>
              
              <div class="film-details__meta-item">
                <span class="film-details__meta-label">Жанры:</span>
                <span class="film-details__meta-value">{{ filmsStore.currentFilm.genres?.join(', ') || '—' }}</span>
              </div>
              
              <div class="film-details__meta-item">
                <span class="film-details__meta-label">Актёры:</span>
                <span class="film-details__meta-value">{{ filmsStore.currentFilm.cast?.join(', ') || '—' }}</span>
              </div>
            </div>
            
            <div class="film-details__actions">
              <button
                @click="openTrailer"
                class="film-details__trailer-btn"
              >
                Смотреть трейлер
              </button>
              
              <button
                @click="handleFavoriteClick"
                :class="['film-details__favorite-btn', { 'film-details__favorite-btn--active': isFavorite }]"
              >
                {{ isFavorite ? 'В избранном' : 'В избранное' }}
              </button>
            </div>
          </div>
        </div>
        
        <div class="film-details__description">
          <h2 class="film-details__description-title">Описание</h2>
          <p class="film-details__description-text">
            {{ filmsStore.currentFilm.plot }}
          </p>
        </div>
      </div>
    </div>
    
    <!-- Модальное окно трейлера -->
    <div v-if="isTrailerModalOpen" class="modal">
      <div class="modal__overlay" @click="closeTrailer"></div>
      <div class="modal__content">
        <button class="modal__close" @click="closeTrailer">×</button>
        <div class="modal__trailer">
          <iframe
            v-if="filmsStore.currentFilm?.trailerUrl"
            :src="filmsStore.currentFilm.trailerUrl"
            width="800"
            height="450"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
      </div>
    </div>
  </main>
</template>

