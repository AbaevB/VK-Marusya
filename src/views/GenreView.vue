<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useFilmsStore } from '@/stores/films'
import FilmCard from '@/components/blocks/FilmCard.vue'

const route = useRoute()
const filmsStore = useFilmsStore()

const genreName = computed(() => route.params.genre as string)

onMounted(() => {
  if (genreName.value) {
    filmsStore.fetchFilmsByGenre(genreName.value)
  }
})

const loadMore = () => {
  filmsStore.loadMoreFilms(genreName.value)
}
</script>

<template>
  <section class="genre">
    <div class="container">
      <div class="genre__wrapper">
        <h2 class="genre__title">
          {{ genreName }}
        </h2>
        
        <div v-if="filmsStore.isLoading && filmsStore.films.length === 0" class="loading">
          Загрузка фильмов...
        </div>
        
        <div v-else-if="filmsStore.error" class="error">
          {{ filmsStore.error }}
        </div>
        
        <ul v-else class="genre__list">
          <li v-for="film in filmsStore.films" :key="film.id" class="genre__item">
            <FilmCard :film="film" />
          </li>
        </ul>
        
        <button 
          v-if="filmsStore.currentPage < filmsStore.totalPages"
          type="button" 
          class="btn btn-primary genre__btn" 
          id="GenreMore"
          @click="loadMore"
          :disabled="filmsStore.isLoading"
        >
          {{ filmsStore.isLoading ? 'Загрузка...' : 'Показать ещё' }}
        </button>   
      </div>
    </div>
  </section>
</template>
