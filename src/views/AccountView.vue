<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useFavoritesStore } from '@/stores/favorites'
import FilmCard from '@/components/blocks/FilmCard.vue'
import { getPosterUrl, handleImageError } from '@/utils/images'

const router = useRouter()
const userStore = useUserStore()
const favoritesStore = useFavoritesStore()

const user = computed(() => userStore.user)
const activeTab = ref(0)

onMounted(async () => {
  if (!userStore.isAuthenticated) {
    router.push({ name: 'home' })
    return
  }
  
  await favoritesStore.fetchFavorites()
})

const handleLogout = async () => {
  try {
    await userStore.logout()
    router.push({ name: 'home' })
  } catch (error) {
    console.error('Ошибка при выходе:', error)
  }
}

const handleDeleteFromFavorites = async (filmId: number) => {
  try {
    await favoritesStore.removeFromFavorites(filmId)
  } catch (error) {
    console.error('Ошибка удаления из избранного:', error)
  }
}

const showTab = (tabIndex: number) => {
  activeTab.value = tabIndex
}

const getInitials = () => {
  if (user.value?.firstName && user.value?.lastName) {
    return `${user.value.firstName[0]}${user.value.lastName[0]}`.toUpperCase()
  }
  // Fallback: первые 2 буквы email
  if (user.value?.email) {
    const emailPart = user.value.email.split('@')[0] || ''
    return emailPart.substring(0, 2).toUpperCase()
  }
  return '??'
}

const getUserFullName = () => {
  if (user.value?.firstName || user.value?.lastName) {
    return `${user.value.firstName || ''} ${user.value.lastName || ''}`.trim()
  }
  return '—'
}

// Состояние наведения для карточек фильмов
const hoveredFilmId = ref<number | null>(null)

const handleFilmHover = (filmId: number) => {
  hoveredFilmId.value = filmId
}

const handleFilmLeave = () => {
  hoveredFilmId.value = null
}

const onImageError = (event: Event) => {
  handleImageError(event, 'poster')
}
</script>

<template>
  <section class="account" v-if="userStore.isAuthenticated">
    <div class="container">
      <div class="account__wrapper">
        <h1 class="account__title">
          Мой аккаунт
        </h1>
        <div class="account__tab" id="accountTab">
          <div class="account__tab-nav">
            <button 
              class="account__tab-btn" 
              :class="{ 'account__tab-btn--active': activeTab === 0 }"
              data-target-id="0"
              @click="showTab(0)"
            >
              <svg class="account__tab-icon" aria-hidden="true" width="24" height="24">
                <use xlink:href="/images/sprite.svg#icon-heart-solid"></use>
              </svg> 
              <span class="account__tab-btn-text">
                Избранные фильмы
              </span>
            </button>
            <button 
              class="account__tab-btn" 
              :class="{ 'account__tab-btn--active': activeTab === 1 }"
              data-target-id="1"
              @click="showTab(1)"
            >
              <svg class="account__tab-icon" aria-hidden="true" width="24" height="24">
                <use xlink:href="/images/sprite.svg#icon-user-solid"></use>
              </svg> 
              <span class="account__tab-btn-text">
                Настройка аккаунта
              </span>
            </button>
          </div>
          <div class="account__tab-content">
            <div class="account__tab-pane" :class="{ 'account__tab-pane--active': activeTab === 0 }" data-id="0">
              <div v-if="favoritesStore.isLoading && favoritesStore.favorites.length === 0" class="loading">
                Загрузка избранных фильмов...
              </div>
              <div v-else-if="favoritesStore.error" class="error">
                {{ favoritesStore.error }}
              </div>
              <ul v-else class="account__film-list">
                <li v-for="film in favoritesStore.favorites" :key="film.id" class="account__film-item">
                  <a 
                    class="film-card account__film-card" 
                    :href="`/film/${film.id}`"
                    @mouseenter="handleFilmHover(film.id)"
                    @mouseleave="handleFilmLeave"
                  >
                    <button 
                      type="button" 
                      class="account__film-delete" 
                      :class="{ 'account__film-delete--active': hoveredFilmId === film.id }"
                      aria-label="Удалить из избранного" 
                      @click.prevent="handleDeleteFromFavorites(film.id)"
                    >
                      <svg width="13" height="13" class="account__film-delete-icon" aria-hidden="true">
                        <use xlink:href="/images/sprite.svg#icon-close-black"></use>
                      </svg>
                    </button>
                    <h3 class="visually-hidden">
                      {{ film.title }}
                    </h3>
                    <img 
                      class="film-card__image" 
                      :src="getPosterUrl(film.posterUrl)" 
                      :alt="`Постер фильма ${film.title}`"
                      @error="onImageError"
                    >
                  </a> 
                </li>
              </ul>
            </div>
            <div class="account__tab-pane" :class="{ 'account__tab-pane--active': activeTab === 1 }" data-id="1">
              <h2 class="visually-hidden">
                Настройки аккаунта
              </h2>
              <ul class="account__user-list">
                <li class="account__user-item">
                  <div class="account__user-list-marker" id="userMarker">
                    {{ getInitials() }}
                  </div>
                  <div class="account__user-list-content">
                    <span class="account__user-list-title">
                      Имя Фамилия
                    </span>
                    <span class="account__user-list-data" id="userName">
                      {{ getUserFullName() }}
                    </span> 
                  </div>
                </li>
                <li class="account__user-item">
                  <div class="account__user-list-marker">
                    <svg class="account__user-list-icon" aria-hidden="true" width="24" height="24">
                      <use xlink:href="/images/sprite.svg#icon-email"></use>
                    </svg>
                  </div>
                  <div class="account__user-list-content">
                    <span class="account__user-list-title">
                      Электронная почта
                    </span>
                    <span class="account__user-list-data" id="userEmail">
                      {{ user?.email }}
                    </span> 
                  </div>
                </li>
              </ul>
              <button class="btn btn-primary account__logout" id="logout" type="button" @click="handleLogout">
                Выйти из аккаунта 
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

