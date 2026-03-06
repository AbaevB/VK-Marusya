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

<style scoped>
.random-film {
  padding: 40px 0;
  background-color: #f8f9fa;
}

.random-film__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.random-film__title {
  font-size: 28px;
  margin: 0;
  color: #333;
}

.random-film__refresh-btn {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.random-film__refresh-btn:hover:not(:disabled) {
  background-color: #0056b3;
}

.random-film__refresh-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.random-film__loading,
.random-film__error {
  text-align: center;
  padding: 60px 0;
  font-size: 18px;
}

.random-film__error {
  color: #ff0000;
}

.random-film__content {
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.random-film__card {
  display: flex;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.random-film__card:hover {
  transform: translateY(-5px);
}

.random-film__poster {
  position: relative;
  flex: 0 0 300px;
}

.random-film__poster-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.random-film__rating {
  position: absolute;
  top: 15px;
  right: 15px;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  font-weight: bold;
  font-size: 18px;
}

.random-film__info {
  flex: 1;
  padding: 30px;
}

.random-film__film-title {
  font-size: 24px;
  margin: 0 0 15px 0;
  color: #333;
}

.random-film__meta {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  color: #666;
  font-size: 16px;
}

.random-film__description {
  font-size: 16px;
  line-height: 1.6;
  color: #666;
  margin: 0 0 25px 0;
}

.random-film__actions {
  display: flex;
  gap: 15px;
}

.random-film__details-btn {
  padding: 12px 24px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.random-film__details-btn:hover {
  background-color: #218838;
}
</style>