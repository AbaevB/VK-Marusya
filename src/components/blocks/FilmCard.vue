<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useFavoritesStore } from '@/stores/favorites'
import type { Film } from '@/api/films'

interface Props {
  film: Film
}

const props = defineProps<Props>()
const router = useRouter()
const userStore = useUserStore()
const favoritesStore = useFavoritesStore()

const isFavorite = computed(() => {
  return favoritesStore.isFavorite(props.film.id)
})

const handleFavoriteClick = async () => {
  if (!userStore.isAuthenticated) {
    // Если пользователь не авторизован, открываем модальное окно логина
    // TODO: Реализовать открытие модального окна
    console.log('Пользователь не авторизован, нужно открыть модальное окно логина')
    return
  }
  
  try {
    await favoritesStore.toggleFavorite(props.film.id)
  } catch (error) {
    console.error('Ошибка при работе с избранным:', error)
  }
}

const handleFilmClick = () => {
  router.push({ name: 'film', params: { id: props.film.id } })
}

const formatRating = (rating: number) => {
  return rating?.toFixed(1) || '—'
}
</script>

<template>
  <article class="film-card">
    <div class="film-card__inner">
      <div class="film-card__image-wrapper" @click="handleFilmClick">
        <img 
          :src="film.posterUrl" 
          :alt="film.title" 
          class="film-card__image"
        />
        <div class="film-card__rating">
          <span class="film-card__rating-value">{{ formatRating(film.tmdbRating) }}</span>
        </div>
      </div>
      
      <div class="film-card__content">
        <h3 class="film-card__title" @click="handleFilmClick">
          {{ film.title }}
        </h3>
        
        <div class="film-card__meta">
          <span class="film-card__year">{{ film.releaseYear }}</span>
          <span class="film-card__genres">{{ film.genres?.join(', ') }}</span>
        </div>
        
        <div class="film-card__actions">
          <button
            @click="handleFavoriteClick"
            :class="['film-card__favorite-btn', { 'film-card__favorite-btn--active': isFavorite }]"
            :title="isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'"
          >
            <svg class="film-card__favorite-icon" width="20" height="20" viewBox="0 0 24 24">
              <path 
                :fill="isFavorite ? '#ff0000' : 'currentColor'" 
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              />
            </svg>
          </button>
          
          <button
            @click="handleFilmClick"
            class="film-card__details-btn"
          >
            Подробнее
          </button>
        </div>
      </div>
    </div>
  </article>
</template>

<style scoped>
.film-card {
  border-radius: 8px;
  overflow: hidden;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 100%;
}

.film-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.film-card__inner {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.film-card__image-wrapper {
  position: relative;
  cursor: pointer;
  overflow: hidden;
  aspect-ratio: 2/3;
}

.film-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.film-card:hover .film-card__image {
  transform: scale(1.05);
}

.film-card__rating {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(0, 0, 0, 0.8);
  color: #fff;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: bold;
  font-size: 14px;
}

.film-card__content {
  padding: 15px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.film-card__title {
  margin: 0 0 10px 0;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.3;
  cursor: pointer;
  transition: color 0.2s ease;
}

.film-card__title:hover {
  color: #007bff;
}

.film-card__meta {
  margin-bottom: 15px;
  font-size: 14px;
  color: #666;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.film-card__year {
  font-weight: 500;
}

.film-card__genres {
  font-size: 13px;
}

.film-card__actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.film-card__favorite-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
  color: #666;
  transition: color 0.2s ease;
}

.film-card__favorite-btn:hover {
  color: #ff0000;
}

.film-card__favorite-btn--active {
  color: #ff0000;
}

.film-card__favorite-icon {
  display: block;
}

.film-card__details-btn {
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.film-card__details-btn:hover {
  background-color: #0056b3;
}
</style>