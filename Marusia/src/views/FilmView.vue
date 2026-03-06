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

<style scoped>
.film-page {
  padding: 40px 0;
}

.loading, .error {
  text-align: center;
  padding: 100px 0;
  font-size: 18px;
}

.error {
  color: #ff0000;
}

.film-details__header {
  display: flex;
  gap: 40px;
  margin-bottom: 40px;
}

.film-details__poster {
  flex: 0 0 300px;
}

.film-details__poster-image {
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.film-details__info {
  flex: 1;
}

.film-details__title {
  font-size: 36px;
  margin: 0 0 20px 0;
  color: #333;
}

.film-details__rating {
  margin-bottom: 25px;
}

.film-details__rating-value {
  font-size: 24px;
  font-weight: 600;
  color: #007bff;
}

.film-details__meta {
  margin-bottom: 30px;
}

.film-details__meta-item {
  margin-bottom: 12px;
  display: flex;
}

.film-details__meta-label {
  font-weight: 600;
  color: #333;
  min-width: 120px;
}

.film-details__meta-value {
  color: #666;
}

.film-details__actions {
  display: flex;
  gap: 15px;
  margin-top: 30px;
}

.film-details__trailer-btn,
.film-details__favorite-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.film-details__trailer-btn {
  background-color: #007bff;
  color: white;
}

.film-details__trailer-btn:hover {
  background-color: #0056b3;
}

.film-details__favorite-btn {
  background-color: #f8f9fa;
  color: #333;
  border: 1px solid #dee2e6;
}

.film-details__favorite-btn:hover {
  background-color: #e9ecef;
}

.film-details__favorite-btn--active {
  background-color: #ff0000;
  color: white;
  border-color: #ff0000;
}

.film-details__favorite-btn--active:hover {
  background-color: #cc0000;
}

.film-details__description {
  background-color: #f8f9fa;
  padding: 30px;
  border-radius: 8px;
}

.film-details__description-title {
  font-size: 24px;
  margin: 0 0 20px 0;
  color: #333;
}

.film-details__description-text {
  font-size: 16px;
  line-height: 1.6;
  color: #666;
  margin: 0;
}

/* Модальное окно */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal__overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
}

.modal__content {
  position: relative;
  background-color: white;
  border-radius: 8px;
  padding: 30px;
  max-width: 900px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal__close {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 30px;
  height: 30px;
  border: none;
  background: none;
  font-size: 24px;
  cursor: pointer;
  color: #333;
}

.modal__close:hover {
  color: #007bff;
}

.modal__trailer {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 */
  height: 0;
}

.modal__trailer iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>