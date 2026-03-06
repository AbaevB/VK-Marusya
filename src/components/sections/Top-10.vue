<!-- src/components/sections/Top-10.vue -->
<script setup lang="ts">
import { onMounted } from 'vue'
import { useFilmsStore } from '@/stores/films'
import { useRouter } from 'vue-router'

const filmsStore = useFilmsStore()
const router = useRouter()

onMounted(() => {
  filmsStore.fetchTopFilms(10)
})

const navigateToFilm = (filmId: number) => {
  router.push({ name: 'film', params: { id: filmId } })
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
        <li 
          v-for="(film, index) in filmsStore.topFilms" 
          :key="film.id"
          class="top-10__item"
          @click="navigateToFilm(film.id)"
        >
          <div class="card top-10__card">
            
            <div class="top-10__item-poster">
              <img 
                :src="film.posterUrl" 
                :alt="film.title"
                class="card__image"
              />
            </div>
            
            <div class="top-10__item-info">
              <h3 class="visually-hidden">
                {{ film.title }}
              </h3>
              
             
              
              
            </div>
          </div>
        </li>
      </ol>
    </div>
  </section>
</template>

