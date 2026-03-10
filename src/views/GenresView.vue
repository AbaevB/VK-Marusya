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
  document.title = 'Жанры | VK-Маруся'
  fetchGenres()
})
</script>

<template>
  <section class="all-genres">
    <div class="container">
      <div class="all-genres__wrapper">
        <h2 class="all-genres__title">
          Жанры фильмов
        </h2>
        
        <div v-if="isLoading" class="loading">
          Загрузка жанров...
        </div>
        
        <div v-else-if="error" class="error">
          {{ error }}
        </div>
        
        <ul v-else class="all-genres__list">
          <li v-for="genre in genres" :key="genre.id" class="all-genres__item">
            <a :href="`/genre/${genre.name}`" class="card genre-card">
              <div class="genre-card__top">
                <img :src="genre.image" :alt="genre.name" class="genre-card__img">
              </div>
              <div class="genre-card__bottom">
                <span class="genre-card__text">
                  {{ genre.name }}
                </span>
              </div>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

