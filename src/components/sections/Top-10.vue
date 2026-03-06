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
          <div class="top-10__item-content">
            <span class="top-10__item-number">{{ index + 1 }}</span>
            
            <div class="top-10__item-poster">
              <img 
                :src="film.posterUrl" 
                :alt="film.title"
                class="top-10__item-image"
              />
            </div>
            
            <div class="top-10__item-info">
              <h3 class="top-10__item-title">
                {{ film.title }}
              </h3>
              
              <div class="top-10__item-meta">
                <span class="top-10__item-year">
                  {{ film.releaseYear }}
                </span>
                <span class="top-10__item-rating">
                  ★ {{ film.tmdbRating?.toFixed(1) || '—' }}
                </span>
                <span class="top-10__item-genres">
                  {{ film.genres?.join(', ') }}
                </span>
              </div>
              
              <p class="top-10__item-description">
                {{ film.plot }}
              </p>
            </div>
          </div>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
.top-10 {
  padding: 40px 0;
}

.top-10__title {
  font-size: 28px;
  margin-bottom: 30px;
  text-align: center;
  color: #333;
}

.top-10__loading,
.top-10__error {
  text-align: center;
  padding: 40px;
  font-size: 18px;
}

.top-10__error {
  color: #ff0000;
}

.top-10__list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.top-10__item {
  margin-bottom: 20px;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}

.top-10__item:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.top-10__item-content {
  display: flex;
  padding: 20px;
  gap: 20px;
}

.top-10__item-number {
  flex: 0 0 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #007bff;
  color: white;
  border-radius: 50%;
  font-size: 20px;
  font-weight: bold;
}

.top-10__item:nth-child(1) .top-10__item-number {
  background-color: #ffd700;
  color: #333;
}

.top-10__item:nth-child(2) .top-10__item-number {
  background-color: #c0c0c0;
}

.top-10__item:nth-child(3) .top-10__item-number {
  background-color: #cd7f32;
}

.top-10__item-poster {
  flex: 0 0 100px;
}

.top-10__item-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 4px;
}

.top-10__item-info {
  flex: 1;
}

.top-10__item-title {
  font-size: 20px;
  margin: 0 0 10px 0;
  color: #333;
}

.top-10__item-meta {
  display: flex;
  gap: 15px;
  margin-bottom: 10px;
  color: #666;
  font-size: 14px;
}

.top-10__item-year {
  font-weight: 500;
}

.top-10__item-rating {
  color: #ffd700;
  font-weight: bold;
}

.top-10__item-description {
  font-size: 14px;
  line-height: 1.5;
  color: #666;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>