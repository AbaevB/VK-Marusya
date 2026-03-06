<!-- src/components/sections/RandomFilm.vue -->
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useFilmsStore } from '@/stores/films'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useFavoritesStore } from '@/stores/favorites'

const filmsStore = useFilmsStore()
const router = useRouter()
const userStore = useUserStore()
const favoritesStore = useFavoritesStore()
const isLoading = ref(false)

onMounted(() => {
  loadRandomFilm()
})

const loadRandomFilm = async () => {
  isLoading.value = true
  try {
    await filmsStore.fetchRandomFilm()
  } catch (error) {
    console.error('Ошибка загрузки случайного фильма:', error)
  } finally {
    isLoading.value = false
  }
}

const navigateToFilm = () => {
  if (filmsStore.randomFilm) {
    router.push({ name: 'film', params: { id: filmsStore.randomFilm.id } })
  }
}

const getNewRandomFilm = () => {
  loadRandomFilm()
}

const handleFavoriteClick = async () => {
  if (!userStore.isAuthenticated) {
    if (window.openAuthModal) {
      window.openAuthModal()
    }
    return
  }
  
  if (!filmsStore.randomFilm) return
  
  try {
    await favoritesStore.toggleFavorite(filmsStore.randomFilm.id)
  } catch (error) {
    console.error('Ошибка при работе с избранным:', error)
  }
}
</script>
<template>
  <section class="random-film">
    <div class="container">
      <div class="random-film__wrapper">
        <h2 class="visually-hidden">
          Случайный фильм
        </h2>
        
        <div v-if="isLoading && !filmsStore.randomFilm" class="random-film__loading">
          Загрузка случайного фильма...
        </div>
        
        <div v-else-if="filmsStore.error" class="random-film__error">
          {{ filmsStore.error }}
        </div>
        
        <template v-else-if="filmsStore.randomFilm">
          <div class="random-film__content">
            <ul class="random-film__content-top">
              <li class="random-film__content-top-item">
                <div class="random-film__rating random-film__rating--green">
                  <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                    <use xlink:href="/images/sprite.svg#icon-star"></use>
                  </svg>
                  <span class="random-film__rating-text">
                    {{ filmsStore.randomFilm.tmdbRating?.toFixed(1) || '—' }}
                  </span>
                </div>
              </li>
              <li class="random-film__content-top-item">
                <span class="random-film__year">
                  {{ filmsStore.randomFilm.releaseYear }}
                </span>
              </li>
              <li class="random-film__content-top-item">
                <span class="random-film__genre">
                  {{ filmsStore.randomFilm.genres.join(', ') }}
                </span>
              </li>
              <li class="random-film__content-top-item">
                <span class="random-film__duration">
                  {{ filmsStore.randomFilm.runtime }} мин
                </span>
              </li> 
            </ul>
            <div class="random-film__content-body">
              <h3 class="random-film__subtitle">
                {{ filmsStore.randomFilm.title }}
              </h3>
              <p class="random-film__description">
                {{ filmsStore.randomFilm.plot }}
              </p>
            </div>
            <div class="random-film__content-bottom">
              <button class="btn btn-primary random-film__btn random-film__btn--trailer" type="button">
                Трейлер
              </button>
              <a class="btn btn-primary random-film__btn" :href="`/film/${filmsStore.randomFilm.id}`">
                О фильме
              </a>
              <button class="btn btn-primary btn-primary--icon random-film__btn" type="button" @click="handleFavoriteClick">
                <svg class="btn-primary__icon" width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                  <use xlink:href="/images/sprite.svg#icon-heart"></use>
                </svg>
              </button>
              <button class="btn btn-primary btn-primary--icon random-film__btn" type="button" @click="getNewRandomFilm">
                <svg class="btn-primary__icon" width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                  <use xlink:href="/images/sprite.svg#icon-reset"></use>
                </svg>
              </button>
            </div>
          </div> 
          <div class="random-film__image-wrapper">
            <img class="random-film__image" :src="filmsStore.randomFilm.posterUrl" :alt="`Кадр из фильма ${filmsStore.randomFilm.title}`">
          </div>
        </template>
      </div>
    </div>
  </section>  
</template>

