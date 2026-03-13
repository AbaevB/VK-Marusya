<!-- src/components/sections/RandomFilm.vue -->
<script setup lang="ts">
import { onMounted, onUnmounted, ref, nextTick, computed } from 'vue'
import { useFilmsStore } from '@/stores/films'
import { useRouter } from 'vue-router'
import { getBackdropUrl, handleImageError } from '@/utils/images'
import { getRatingClass } from '@/utils/rating'
import FavoriteBtn from '@/components/blocks/FavoriteBtn.vue'
import Plyr from 'plyr'
import 'plyr/dist/plyr.css'

const filmsStore = useFilmsStore()
const router = useRouter()
const isLoading = ref(false)
let player: Plyr | null = null

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

const videoElement = ref<HTMLVideoElement | null>(null)

const openTrailer = async () => {
  const trailerUrl = filmsStore.randomFilm?.trailerUrl
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
  // Очищаем плеер
  if (player) {
    player.destroy()
    player = null
  }
}

const isTrailerModalOpen = ref(false)

// Вычисляемое свойство для класса рейтинга
const ratingClass = computed(() => {
  if (!filmsStore.randomFilm) return 'random-film__rating--outline'
  return getRatingClass(filmsStore.randomFilm.tmdbRating, 'random-film__rating')
})

onUnmounted(() => {
  if (player) {
    player.destroy()
  }
})

// Открытие модального окна - добавляем класс no-scroll
const openTrailerWithScrollLock = async () => {
  document.body.classList.add('no-scroll')
  await openTrailer()
}

// Закрытие модального окна - убираем класс no-scroll
const closeTrailerWithScrollLock = () => {
  closeTrailer()
  document.body.classList.remove('no-scroll')
}

const onImageError = (event: Event) => {
  handleImageError(event, 'backdrop')
}
</script>
<template>
  <section class="random-film">
    <div class="container">
      <div class="random-film__wrapper">
        <h2 class="visually-hidden">
          Случайный фильм
        </h2>
        
        <div v-if="isLoading && !filmsStore.randomFilm" class="random-film__loading">
          Загрузка случайного фильма...
        </div>
        
        <div v-else-if="filmsStore.error" class="random-film__error">
          {{ filmsStore.error }}
        </div>
        
        <template v-else-if="filmsStore.randomFilm">
          <div class="random-film__content">
            <ul class="random-film__content-top">
              <li class="random-film__content-top-item">
                <div :class="['random-film__rating', ratingClass]">
                  <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                    <use xlink:href="/images/sprite.svg#icon-star"></use>
                  </svg>
                  <span class="random-film__rating-text">
                    {{ filmsStore.randomFilm.tmdbRating?.toFixed(1) || '—' }}
                  </span>
                </div>
              </li>
              <li class="random-film__content-top-item">
                <span class="random-film__year">
                  {{ filmsStore.randomFilm.releaseYear }}
                </span>
              </li>
              <li class="random-film__content-top-item">
                <span class="random-film__genre">
                  {{ filmsStore.randomFilm.genres.join(', ') }}
                </span>
              </li>
              <li class="random-film__content-top-item">
                <span class="random-film__duration">
                  {{ filmsStore.randomFilm.runtime }} мин
                </span>
              </li> 
            </ul>
            <div class="random-film__content-body">
              <h3 class="random-film__subtitle">
                {{ filmsStore.randomFilm.title }}
              </h3>
              <p class="random-film__description">
                {{ filmsStore.randomFilm.plot }}
              </p>
            </div>
            <div class="random-film__content-bottom">
              <button class="btn btn-primary random-film__btn random-film__btn--trailer" type="button" @click="openTrailerWithScrollLock">
                Трейлер
              </button>
              <a class="btn btn-primary random-film__btn" :href="`/film/${filmsStore.randomFilm.id}`">
                О фильме
              </a>
              <FavoriteBtn v-if="filmsStore.randomFilm" :film-id="filmsStore.randomFilm.id" />
              <button class="btn btn-primary btn-primary--icon random-film__btn" type="button" @click="getNewRandomFilm">
                <svg class="btn-primary__icon" width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                  <use xlink:href="/images/sprite.svg#icon-reset"></use>
                </svg>
              </button>
            </div>
          </div> 
          <div class="random-film__image-wrapper">
            <img 
              class="random-film__image" 
              :src="getBackdropUrl(filmsStore.randomFilm.backdropUrl)" 
              :alt="`Кадр из фильма ${filmsStore.randomFilm.title}`"
              @error="onImageError"
            >
          </div>
        </template>
      </div>
    </div>
    
    <!-- Модальное окно трейлера с Plyr -->
    <div v-if="isTrailerModalOpen" class="modal modal--active" @click.self="closeTrailerWithScrollLock">
      <div class="preview">
        <button type="button" class="modal__close" @click="closeTrailerWithScrollLock">
          <svg class="modal__close-icon" aria-hidden="true" width="13" height="13">
            <use xlink:href="/images/sprite.svg#icon-close-black"></use>
          </svg>
        </button>
        <div class="plyr__video-embed plyr-player">
          <video ref="videoElement" class="plyr-video" playsinline controls crossorigin="anonymous">
            <source :src="filmsStore.randomFilm?.trailerUrl" type="video/youtube">
          </video>
        </div>
      </div>
    </div>
  </section>  
</template>

дка 