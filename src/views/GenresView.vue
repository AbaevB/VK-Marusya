<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { genresApi } from '@/api/genres'
import type { Genre } from '@/api/genres'

const genres = ref<Genre[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)

const fetchGenres = async () => {
  isLoading.value = true
  error.value = null
  try {
    genres.value = await genresApi.getGenresWithImages()
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Ошибка загрузки жанров'
    console.error('Ошибка загрузки жанров:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchGenres()
})
</script>

<template>
  <main class="genres-page">
    <div class="container">
      <h1 class="genres-page__title">Жанры</h1>
      
      <div v-if="isLoading" class="loading">
        Загрузка жанров...
      </div>
      
      <div v-else-if="error" class="error">
        {{ error }}
      </div>
      
      <div v-else class="genres-grid">
        <div 
          v-for="genre in genres" 
          :key="genre.id"
          class="genre-card"
        >
          <router-link 
            :to="{ name: 'genre', params: { genre: genre.name } }"
            class="genre-card__link"
          >
            <div class="genre-card__image-wrapper">
              <img 
                :src="genre.image" 
                :alt="genre.name" 
                class="genre-card__image"
              />
            </div>
            <h3 class="genre-card__title">{{ genre.name }}</h3>
          </router-link>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.genres-page {
  padding: 40px 0;
}

.genres-page__title {
  font-size: 32px;
  margin-bottom: 30px;
  text-align: center;
}

.genres-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.genre-card {
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s ease;
}

.genre-card:hover {
  transform: translateY(-5px);
}

.genre-card__link {
  display: block;
  text-decoration: none;
  color: inherit;
}

.genre-card__image-wrapper {
  width: 100%;
  height: 150px;
  overflow: hidden;
}

.genre-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.genre-card__title {
  padding: 15px;
  text-align: center;
  font-size: 18px;
  margin: 0;
}

.loading, .error {
  text-align: center;
  padding: 40px;
  font-size: 18px;
}

.error {
  color: #ff0000;
}
</style>