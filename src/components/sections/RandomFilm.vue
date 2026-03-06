<!-- src/components/sections/RandomFilm.vue -->
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useFilmsStore } from '@/stores/films'
import { useRouter } from 'vue-router'

const filmsStore = useFilmsStore()
const router = useRouter()
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
</script>
<template>
  <section class="random-film">
    <div class="container">
      <h1 class="visually-hidden">
        ВК Маруся
      </h1>
      <div class="random-film__header">
        <h2 class="random-film__title">
          Случайный фильм
        </h2>
        <button 
          @click="getNewRandomFilm" 
          class="random-film__refresh-btn"
          :disabled="isLoading"
        >
          {{ isLoading ? 'Загрузка...' : 'Новый фильм' }}
        </button>
      </div>
      
      <div v-if="isLoading && !filmsStore.randomFilm" class="random-film__loading">
        Загрузка случайного фильма...
      </div>
      
      <div v-else-if="filmsStore.error" class="random-film__error">
        {{ filmsStore.error }}
      </div>
      
      <div v-else-if="filmsStore.randomFilm" class="random-film__content">
        <div class="random-film__card" @click="navigateToFilm">
          <div class="random-film__poster">
            <img 
              :src="filmsStore.randomFilm.posterUrl" 
              :alt="filmsStore.randomFilm.title"
              class="random-film__poster-image"
            />
            <div class="random-film__rating">
              {{ filmsStore.randomFilm.tmdbRating?.toFixed(1) || '—' }}
            </div>
          </div>
          
          <div class="random-film__info">
            <h3 class="random-film__film-title">
              {{ filmsStore.randomFilm.title }}
            </h3>
            
            <div class="random-film__meta">
              <span class="random-film__year">
                {{ filmsStore.randomFilm.releaseYear }}
              </span>
              <span class="random-film__genres">
                {{ filmsStore.randomFilm.genres.join(', ') }}
              </span>
              <span class="random-film__duration">
                {{ filmsStore.randomFilm.runtime }} мин.
              </span>
            </div>
            
            <p class="random-film__description">
              {{ filmsStore.randomFilm.plot }}
            </p>
            
            <div class="random-film__actions">
              <button @click="navigateToFilm" class="random-film__details-btn">
                Подробнее о фильме
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>  
</template>

