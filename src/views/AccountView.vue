<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useFavoritesStore } from '@/stores/favorites'
import FilmCard from '@/components/blocks/FilmCard.vue'

const router = useRouter()
const userStore = useUserStore()
const favoritesStore = useFavoritesStore()

const user = computed(() => userStore.user)

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
</script>

<template>
  <main class="account-page">
    <div class="container">
      <div v-if="!userStore.isAuthenticated" class="not-authorized">
        <h1>Доступ запрещён</h1>
        <p>Для просмотра этой страницы необходимо авторизоваться.</p>
        <button @click="router.push({ name: 'home' })" class="account-page__home-btn">
          На главную
        </button>
      </div>
      
      <div v-else class="account-content">
        <div class="account-header">
          <h1 class="account-header__title">Личный кабинет</h1>
          <button @click="handleLogout" class="account-header__logout-btn">
            Выйти
          </button>
        </div>
        
        <div class="account-info">
          <h2 class="account-info__title">Информация о пользователе</h2>
          <div class="account-info__grid">
            <div class="account-info__item">
              <span class="account-info__label">Имя:</span>
              <span class="account-info__value">{{ user?.firstName }}</span>
            </div>
            <div class="account-info__item">
              <span class="account-info__label">Фамилия:</span>
              <span class="account-info__value">{{ user?.lastName }}</span>
            </div>
            <div class="account-info__item">
              <span class="account-info__label">Email:</span>
              <span class="account-info__value">{{ user?.email }}</span>
            </div>
          </div>
        </div>
        
        <div class="account-favorites">
          <h2 class="account-favorites__title">Избранные фильмы</h2>
          
          <div v-if="favoritesStore.isLoading && favoritesStore.favorites.length === 0" class="loading">
            Загрузка избранных фильмов...
          </div>
          
          <div v-else-if="favoritesStore.error" class="error">
            {{ favoritesStore.error }}
          </div>
          
          <div v-else-if="favoritesStore.favorites.length === 0" class="empty-favorites">
            <p>У вас пока нет избранных фильмов.</p>
          </div>
          
          <div v-else class="favorites-grid">
            <FilmCard
              v-for="film in favoritesStore.favorites"
              :key="film.id"
              :film="film"
            />
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

