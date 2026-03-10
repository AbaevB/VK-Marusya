<!-- src/components/sections/Top-10.vue -->
<script setup lang="ts">
import { onMounted } from 'vue'
import { useFilmsStore } from '@/stores/films'
import { getPosterUrl, handleImageError } from '@/utils/images'

const filmsStore = useFilmsStore()

onMounted(() => {
  filmsStore.fetchTopFilms(10)
})

const onImageError = (event: Event) => {
  handleImageError(event, 'poster')
}
</script>
<template>
  <section class="top-10">
    <div class="container">
      <h2 class="top-10__title">
        Топ 10 фильмов
      </h2>
      
      <div v-if="filmsStore.isLoading && filmsStore.topFilms.length === 0" class="top-10__loading">
        Загрузка топ фильмов...
      </div>
      
      <div v-else-if="filmsStore.error" class="top-10__error">
        {{ filmsStore.error }}
      </div>
      
      <ol v-else class="top-10__list">
        <li v-for="film in filmsStore.topFilms" :key="film.id" class="top-10__item">
          <a :href="`/film/${film.id}`" class="card top-10__card">
            <h3 class="visually-hidden">
              {{ film.title }}
            </h3>
            <img 
              :src="getPosterUrl(film.posterUrl)" 
              :alt="`Постер фильма ${film.title}`" 
              class="card__image"
              @error="onImageError"
            >
          </a>
        </li>
      </ol>
    </div>
  </section>
</template>

