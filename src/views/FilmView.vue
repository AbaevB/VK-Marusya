<script setup lang="ts">
import { onMounted, ref, computed, nextTick, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useFilmsStore } from '@/stores/films'
import { getBackdropUrl, handleImageError } from '@/utils/images'
import FavoriteBtn from '@/components/blocks/FavoriteBtn.vue'
import Plyr from 'plyr'
import 'plyr/dist/plyr.css'

const route = useRoute()
const filmsStore = useFilmsStore()

const filmId = computed(() => parseInt(route.params.id as string))
const isTrailerModalOpen = ref(false)
let player: Plyr | null = null

onMounted(() => {
  filmsStore.fetchFilmById(filmId.value)
})

const videoElement = ref<HTMLVideoElement | null>(null)

const openTrailer = async () => {
  const trailerUrl = filmsStore.currentFilm?.trailerUrl
  if (!trailerUrl) return
  
  isTrailerModalOpen.value = true
  
  // Небольшая задержка для рендера DOM
  await new Promise(resolve => setTimeout(resolve, 100))
  await nextTick()
  
  // Извлекаем video ID
  let videoId = ''
  if (trailerUrl.includes('youtube.com/embed/')) {
    videoId = trailerUrl.split('youtube.com/embed/')[1]?.split('?')[0] || ''
  } else if (trailerUrl.includes('youtube.com/watch')) {
    const url = new URL(trailerUrl)
    videoId = url.searchParams.get('v') || ''
  } else if (trailerUrl.includes('youtu.be/')) {
    videoId = trailerUrl.split('youtu.be/')[1]?.split('?')[0] || ''
  }
  
  if (videoId && videoElement.value) {
    player = new Plyr(videoElement.value, {
      autoplay: true,
      controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'fullscreen', 'pip']
    })
    
    player.source = {
      type: 'video',
      sources: [
        {
          src: videoId,
          provider: 'youtube'
        }
      ]
    }
  }
}

const closeTrailer = () => {
  isTrailerModalOpen.value = false
}

const onImageError = (event: Event) => {
  handleImageError(event, 'backdrop')
}

// Обновление title при загрузке фильма
watch(
  () => filmsStore.currentFilm,
  (film) => {
    if (film?.title) {
      document.title = `${film.title} | VK-Маруся`
    }
  }
)
</script>

<template>
  <section class="film">
    <div class="container">
      <div v-if="filmsStore.isLoading && !filmsStore.currentFilm" class="loading">
        Загрузка информации о фильме...
      </div>
      
      <div v-else-if="filmsStore.error" class="error">
        {{ filmsStore.error }}
      </div>
      
      <div v-else-if="filmsStore.currentFilm" class="film__inner">
        <div class="film__content">
          <ul class="film__content-top">
            <li class="film__content-top-item">
              <div class="film__rating film__rating--green">
                <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                  <use xlink:href="/images/sprite.svg#icon-star"></use>
                </svg>
                <span class="film__rating-text">
                  {{ filmsStore.currentFilm.tmdbRating?.toFixed(1) || '—' }}
                </span>
              </div>
            </li>
            <li class="film__content-top-item">
              <span class="film__year">
                {{ filmsStore.currentFilm.releaseYear }}
              </span>
            </li>
            <li class="film__content-top-item">
              <span class="film__genre">
                {{ filmsStore.currentFilm.genres?.join(', ') || '—' }}
              </span>
            </li>
            <li class="film__content-top-item">
              <span class="random__film__duration">
                {{ filmsStore.currentFilm.runtime }} мин
              </span>
            </li> 
          </ul>
          <div class="film__content-body">
            <h1 class="film__title">
              {{ filmsStore.currentFilm.title }}
            </h1>
            <p class="film__description">
              {{ filmsStore.currentFilm.plot }}
            </p>
          </div>
          <div class="film__content-bottom">
            <button class="btn btn-primary" type="button" @click="openTrailer">
              Трейлер
            </button>
            <FavoriteBtn :film-id="filmId" />
          </div>
        </div>
  <div class="film__image-wrapper">
    <img 
      class="film__image" 
      :src="getBackdropUrl(filmsStore.currentFilm.backdropUrl)" 
      :alt="`Кадр из фильма ${filmsStore.currentFilm.title}`"
      @error="onImageError"
    >
  </div>
        <div class="film__info">
          <h2 class="film__info-title">
            О фильме 
          </h2>
          <ul class="film__info-list">
            <li class="film__info-item">
              <div class="film__info-item-left">
                Язык оригинала
              </div>
              <div class="film__info-item-right">
                {{ filmsStore.currentFilm.language || '—' }}
              </div>
            </li>
            <li class="film__info-item">
              <div class="film__info-item-left">
                Бюджет
              </div>
              <div class="film__info-item-right">
                {{ filmsStore.currentFilm.budget || '—' }}
              </div>
            </li>
            <li class="film__info-item">
              <div class="film__info-item-left">
                Выручка
              </div>
              <div class="film__info-item-right">
                {{ filmsStore.currentFilm.revenue || '—' }}
              </div>
            </li>
            <li class="film__info-item">
              <div class="film__info-item-left">
                Режиссёр
              </div>
              <div class="film__info-item-right">
                {{ filmsStore.currentFilm.director || '—' }}
              </div>
            </li>
            <li class="film__info-item">
              <div class="film__info-item-left">
                Продакшен 
              </div>
              <div class="film__info-item-right">
                {{ filmsStore.currentFilm.production || '—' }}
              </div>
            </li>
            <li class="film__info-item">
              <div class="film__info-item-left">
                Награды
              </div>
              <div class="film__info-item-right">
                {{ filmsStore.currentFilm.awardsSummary || '—' }}
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    
    <!-- Модальное окно трейлера с Plyr -->
    <div v-if="isTrailerModalOpen" class="modal modal--active" @click.self="closeTrailer">
      <div class="preview">
        <button type="button" class="modal__close" @click="closeTrailer">
          <svg class="modal__close-icon" aria-hidden="true" width="13" height="13">
            <use xlink:href="/images/sprite.svg#icon-close-black"></use>
          </svg>
        </button>
        <div class="plyr__video-embed plyr-player">
          <video ref="videoElement" class="plyr-video" playsinline controls crossorigin="anonymous">
            <source :src="filmsStore.currentFilm?.trailerUrl" type="video/youtube">
          </video>
        </div>
      </div>
    </div>
  </section>
</template>

