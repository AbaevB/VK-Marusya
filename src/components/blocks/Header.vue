<!-- src/components/blocks/Header.vue -->
<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useFavoritesStore } from '@/stores/favorites'
import AuthModal from '@/components/modals/AuthModal.vue'

const router = useRouter()
const userStore = useUserStore()
const favoritesStore = useFavoritesStore()

const isAuthModalOpen = ref(false)

const isAuthenticated = computed(() => userStore.isAuthenticated)
const userName = computed(() => {
  if (userStore.user) {
    return `${userStore.user.firstName} ${userStore.user.lastName}`
  }
  return ''
})

const navigateToHome = () => {
  router.push({ name: 'home' })
}

const navigateToGenres = () => {
  router.push({ name: 'genres' })
}

const handleAccountClick = () => {
  if (isAuthenticated.value) {
    router.push({ name: 'account' })
  } else {
    openAuthModal()
  }
}

const handleSearch = (event: Event) => {
  event.preventDefault()
  // TODO: Реализовать поиск
  console.log('Поиск фильмов')
}

const openAuthModal = () => {
  isAuthModalOpen.value = true
}

const closeAuthModal = () => {
  isAuthModalOpen.value = false
}

const handleAuthSuccess = async () => {
  closeAuthModal()
  // Обновляем данные пользователя и загружаем избранное
  await userStore.fetchCurrentUser()
  if (userStore.isAuthenticated) {
    await favoritesStore.fetchFavorites()
  }
}
</script>

<template>
  <header class="header">
    <div class="container">
      <div class="header__wrapper">
        <router-link :to="{ name: 'home' }" class="header__logo">
          <img class="header__logo-img" src="/images/logo.png" alt="Логотип ВК Маруся">
        </router-link>
      
        <ul class="header__list">
          <li class="header__item">
            <router-link 
              :to="{ name: 'home' }" 
              class="header__link"
              active-class="header__link--active"
            >
              <span class="header__link-text">
                Главная
              </span>
            </router-link>
          </li>
          <li class="header__item">
            <router-link 
              :to="{ name: 'genres' }" 
              class="header__link"
              active-class="header__link--active"
            >
              <svg class="header__link-icon" width="24" height="24">
                <use xlink:href="/images/sprite.svg#icon-genres"></use>
              </svg>
              <span class="header__link-text">
                Жанры
              </span>
            </router-link>
          </li>
          <li class="header__item">
            <form @submit.prevent="handleSearch" class="header__search">
              <label for="search" class="header__search-label">
                <svg class="header__search-icon" width="24" height="24">
                  <use xlink:href="/images/sprite.svg#icon-search"></use>
                </svg>
                <input 
                  class="header__search-field"  
                  type="search" 
                  name="search" 
                  id="search"
                  placeholder="Поиск фильмов"
                >
              </label>
              <button type="submit" class="btn header__search-btn" aria-label="Найти">
                <svg width="24" height="24" class="header__form-icon" aria-hidden="true">
                  <use xlink:href="/images/sprite.svg#icon-search"></use>
                </svg>
              </button>
            </form>
          </li>
        </ul>
      
        <button class="header__bth" type="button" @click="handleAccountClick">
          <svg width="24" height="24" class="header__bth-icon" aria-hidden="true">
            <use xlink:href="/images/sprite.svg#icon-user"></use>
          </svg>
          <span class="header__bth-text">
            {{ isAuthenticated ? 'Аккаунт' : 'Войти' }}
          </span>
        </button>
      </div>
    </div>
  </header>
  <AuthModal
    :is-open="isAuthModalOpen"
    @close="closeAuthModal"
    @success="handleAuthSuccess"
  />
</template>

