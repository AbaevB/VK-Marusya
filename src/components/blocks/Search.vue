<!-- src/components/blocks/Search.vue -->
<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { filmsApi, type Film } from '@/api/films'
import { getPosterUrl, handleImageError } from '@/utils/images'
import { getRatingClass } from '@/utils/rating'

const router = useRouter()

// Состояние компонента
const searchQuery = ref('')
const searchResults = ref<Film[]>([])
const isLoading = ref(false)
const isModalOpen = ref(false)
const searchInputRef = ref<HTMLInputElement | null>(null)

// Минимальное количество символов для поиска
const MIN_SEARCH_LENGTH = 3
// Количество результатов для отображения
const MAX_RESULTS = 5

// Вычисляемые свойства
const showResults = computed(() => {
  return searchQuery.value.length >= MIN_SEARCH_LENGTH && searchResults.value.length > 0
})

const showNoResults = computed(() => {
  return searchQuery.value.length >= MIN_SEARCH_LENGTH && 
         searchResults.value.length === 0 && 
         !isLoading.value
})

// Debounce таймер
let searchTimeout: ReturnType<typeof setTimeout> | null = null

// Функция поиска фильмов
const searchFilms = async () => {
  const query = searchQuery.value.trim()
  
  // Не выполняем поиск, если меньше MIN_SEARCH_LENGTH символов
  if (query.length < MIN_SEARCH_LENGTH) {
    searchResults.value = []
    return
  }
  
  isLoading.value = true
  
  try {
    const response = await filmsApi.searchFilms(query, 1, MAX_RESULTS)
    searchResults.value = response.films || []
  } catch (error) {
    console.error('Ошибка поиска фильмов:', error)
    searchResults.value = []
  } finally {
    isLoading.value = false
  }
}

// Наблюдатель за изменением поискового запроса с debounce
watch(searchQuery, () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  
  searchTimeout = setTimeout(() => {
    searchFilms()
  }, 300)
})

// Открытие модального окна (для мобильных)
const openModal = () => {
  isModalOpen.value = true
  document.body.classList.add('no-scroll')
  
  // Фокус на поле ввода после открытия модального окна
  setTimeout(() => {
    searchInputRef.value?.focus()
  }, 100)
}

// Закрытие модального окна
const closeModal = () => {
  isModalOpen.value = false
  document.body.classList.remove('no-scroll')
  searchQuery.value = ''
  searchResults.value = []
}

// Переход на страницу фильма
const navigateToFilm = (filmId: number) => {
  closeModal()
  router.push({ name: 'film', params: { id: filmId } })
}

// Обработчик ошибки загрузки изображения
const onImageError = (event: Event) => {
  handleImageError(event, 'poster')
}
</script>

<template>
  <div class="search">
    <!-- Десктопная версия - всегда видимая форма поиска -->
    <form class="search__form" action method="GET" @submit.prevent>
      <label class="search__label" for="search">
        <svg class="search__icon" width="24" height="24">
          <use xlink:href="/images/sprite.svg#icon-search"></use>
        </svg>
        <input 
          ref="searchInputRef"
          class="search__field" 
          id="search" 
          type="search" 
          name="search" 
          placeholder="Поиск"
          v-model="searchQuery"
        >
        <!-- Кнопка закрытия (крестик) - видна когда есть текст -->
        <button 
          v-if="searchQuery" 
          type="button" 
          class="btn search__close search__close--active"
          aria-label="Очистить"
          @click="searchQuery = ''"
        >
          <svg class="search__close-icon" width="24" height="24">
            <use xlink:href="/images/sprite.svg#icon-close"></use>
          </svg>
        </button>
      </label>
    </form>
    
    <!-- Мобильная кнопка поиска -->
    <button 
      class="btn search__btn search__btn--active" 
      aria-label="Открыть поиск" 
      type="button"
      @click="openModal"
    >
      <svg class="search__btn-icon" aria-hidden="true" width="24" height="24">
        <use xlink:href="/images/sprite.svg#icon-search"></use>
      </svg>
    </button>
    
    <!-- Выпадающий список результатов (десктоп) -->
    <ul v-if="showResults" class="search__list">
      <li v-for="film in searchResults" :key="film.id" class="search__item">
        <a 
          class="search__card" 
          href="#"
          @click.prevent="navigateToFilm(film.id)"
        >
          <img 
            class="search__card-img" 
            :src="getPosterUrl(film.posterUrl)" 
            :alt="`Постер фильма ${film.title}`"
            @error="onImageError"
          >
          <div class="search__card-content">
            <ul class="search__card-top">
              <li class="search__card-top-item">
                <div :class="['search__card-rating', getRatingClass(film.tmdbRating)]">
                  <svg class="search__card-icon" width="10" height="10">
                    <use xlink:href="/images/sprite.svg#icon-star"></use>
                  </svg>
                  <span class="search__card-rating-text">
                    {{ film.tmdbRating?.toFixed(1) || '—' }}
                  </span>
                </div>
              </li>
              <li class="search__card-top-item">
                <span class="search__card-year">
                  {{ film.releaseYear }}
                </span>
              </li>
              <li class="search__card-top-item">
                <span class="search__card-genre">
                  {{ film.genres.join(', ') }}
                </span>
              </li>
              <li class="search__card-top-item">
                <span class="search__card-duration">
                  {{ film.runtime }} мин
                </span>
              </li>
            </ul>
            <h2 class="search__card-title">
              {{ film.title }}
            </h2>  
          </div>
        </a>
      </li>
    </ul>
    
    <!-- Индикатор загрузки -->
    <div v-if="isLoading" class="search__loading">
      Загрузка...
    </div>
    
    <!-- Сообщение "Ничего не найдено" -->
    <div v-if="showNoResults" class="search__no-results">
      Ничего не найдено
    </div>
    
    <!-- Модальное окно поиска (мобильная версия) -->
    <div v-if="isModalOpen" class="modal modal--active" @click.self="closeModal">
      <div class="search__modal">
        <form class="search__form search__form--modal" action method="GET" @submit.prevent>
          <label class="search__label search__label--modal" for="search-mobile">
            <svg class="search__icon" width="24" height="24">
              <use xlink:href="/images/sprite.svg#icon-search"></use>
            </svg>
            <input 
              ref="searchInputRef"
              class="search__field search__field--modal" 
              id="search-mobile" 
              type="search" 
              name="search" 
              placeholder="Поиск фильмов"
              v-model="searchQuery"
            >
            <!-- Кнопка очистки -->
            <button 
              v-if="searchQuery" 
              type="button" 
              class="btn search__clear"
              aria-label="Очистить"
              @click="searchQuery = ''"
            >
              <svg class="search__clear-icon" width="24" height="24">
                <use xlink:href="/images/sprite.svg#icon-close"></use>
              </svg>
            </button>
          </label>
          <button 
            type="button" 
            class="btn search__modal-close"
            aria-label="Закрыть"
            @click="closeModal"
          >
            <svg class="search__close-icon" width="24" height="24">
              <use xlink:href="/images/sprite.svg#icon-close"></use>
            </svg>
          </button>
        </form>
        
        <!-- Результаты поиска в модальном окне -->
        <ul v-if="showResults" class="search__list search__list--modal">
          <li v-for="film in searchResults" :key="film.id" class="search__item">
            <a 
              class="search__card" 
              href="#"
              @click.prevent="navigateToFilm(film.id)"
            >
              <img 
                class="search__card-img" 
                :src="getPosterUrl(film.posterUrl)" 
                :alt="`Постер фильма ${film.title}`"
                @error="onImageError"
              >
              <div class="search__card-content">
                <ul class="search__card-top">
                  <li class="search__card-top-item">
                    <div :class="['search__card-rating', getRatingClass(film.tmdbRating)]">
                      <svg class="search__card-icon" width="10" height="10">
                        <use xlink:href="/images/sprite.svg#icon-star"></use>
                      </svg>
                      <span class="search__card-rating-text">
                        {{ film.tmdbRating?.toFixed(1) || '—' }}
                      </span>
                    </div>
                  </li>
                  <li class="search__card-top-item">
                    <span class="search__card-year">
                      {{ film.releaseYear }}
                    </span>
                  </li>
                  <li class="search__card-top-item">
                    <span class="search__card-genre">
                      {{ film.genres.join(', ') }}
                    </span>
                  </li>
                  <li class="search__card-top-item">
                    <span class="search__card-duration">
                      {{ film.runtime }} мин
                    </span>
                  </li>
                </ul>
                <h2 class="search__card-title">
                  {{ film.title }}
                </h2>  
              </div>
            </a>
          </li>
        </ul>
        
        <!-- Индикатор загрузки в модальном окне -->
        <div v-if="isLoading" class="search__loading search__loading--modal">
          Загрузка...
        </div>
        
        <!-- Сообщение "Ничего не найдено" в модальном окне -->
        <div v-if="showNoResults" class="search__no-results search__no-results--modal">
          Ничего не найдено
        </div>
      </div>
    </div>
  </div>
</template>