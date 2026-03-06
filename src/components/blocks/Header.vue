<!-- src/components/blocks/Header.vue -->
<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import AuthModal from '@/components/modals/AuthModal.vue'

const router = useRouter()
const userStore = useUserStore()

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

const handleAuthSuccess = () => {
  closeAuthModal()
  // Можно обновить данные пользователя
  userStore.fetchCurrentUser()
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
      
        <button class="header__btn" type="button" @click="handleAccountClick">
          <svg width="24" height="24" class="header__btn-icon" aria-hidden="true">
            <use xlink:href="/images/sprite.svg#icon-user"></use>
          </svg>
          <span class="header__btn-text">
            {{ isAuthenticated ? userName : 'Войти' }}
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

<style scoped>
.header {
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 15px 0;
}

.header__wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header__logo {
  display: block;
  text-decoration: none;
}

.header__logo-img {
  height: 40px;
  width: auto;
}

.header__list {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 30px;
  align-items: center;
}

.header__item {
  display: flex;
  align-items: center;
}

.header__link {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  color: #333;
  padding: 8px 12px;
  border-radius: 4px;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.header__link:hover {
  background-color: #f5f5f5;
  color: #007bff;
}

.header__link--active {
  color: #007bff;
  background-color: #e6f2ff;
}

.header__link-text {
  font-size: 16px;
  font-weight: 500;
}

.header__link-icon {
  fill: currentColor;
}

.header__search {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header__search-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: text;
}

.header__search-icon {
  fill: #666;
}

.header__search-field {
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 8px 12px;
  font-size: 14px;
  min-width: 200px;
}

.header__search-field:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.header__search-btn {
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  color: #666;
  transition: color 0.2s ease;
}

.header__search-btn:hover {
  color: #007bff;
}

.header__form-icon {
  fill: currentColor;
}

.header__btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  color: #333;
  font-size: 16px;
  font-weight: 500;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.header__btn:hover {
  background-color: #f5f5f5;
  color: #007bff;
}

.header__btn-icon {
  fill: currentColor;
}
</style>