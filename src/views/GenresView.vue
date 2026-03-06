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

