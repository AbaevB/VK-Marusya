<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
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
  <main class="genre-page">
    <div class="container">
      <h1 class="genre-page__title">Фильмы в жанре: {{ genreName }}</h1>
      
      <div v-if="filmsStore.isLoading && filmsStore.films.length === 0" class="loading">
        Загрузка фильмов...
      </div>
      
      <div v-else-if="filmsStore.error" class="error">
        {{ filmsStore.error }}
      </div>
      
      <div v-else>
        <div class="films-grid">
          <FilmCard
            v-for="film in filmsStore.films"
            :key="film.id"
            :film="film"
          />
        </div>
        
        <div v-if="filmsStore.films.length > 0" class="load-more">
          <button
            v-if="filmsStore.currentPage < filmsStore.totalPages"
            @click="loadMore"
            :disabled="filmsStore.isLoading"
            class="load-more__btn"
          >
            {{ filmsStore.isLoading ? 'Загрузка...' : 'Показать ещё' }}
          </button>
          <div v-else class="no-more">
            Все фильмы загружены
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.genre-page {
  padding: 40px 0;
}

.genre-page__title {
  font-size: 32px;
  margin-bottom: 30px;
  text-align: center;
}

.films-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.load-more {
  text-align: center;
  padding: 20px 0;
}

.load-more__btn {
  padding: 12px 24px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.load-more__btn:hover:not(:disabled) {
  background-color: #0056b3;
}

.load-more__btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading, .error, .no-more {
  text-align: center;
  padding: 40px;
  font-size: 18px;
}

.error {
  color: #ff0000;
}
</style>