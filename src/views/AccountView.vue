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

<style scoped>
.account-page {
  padding: 40px 0;
}

.not-authorized {
  text-align: center;
  padding: 100px 0;
}

.not-authorized h1 {
  font-size: 32px;
  margin-bottom: 20px;
  color: #ff0000;
}

.not-authorized p {
  font-size: 18px;
  margin-bottom: 30px;
  color: #666;
}

.account-page__home-btn {
  padding: 12px 24px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
}

.account-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
}

.account-header__title {
  font-size: 32px;
  margin: 0;
}

.account-header__logout-btn {
  padding: 10px 20px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.account-header__logout-btn:hover {
  background-color: #c82333;
}

.account-info {
  background-color: #f8f9fa;
  padding: 30px;
  border-radius: 8px;
  margin-bottom: 40px;
}

.account-info__title {
  font-size: 24px;
  margin: 0 0 20px 0;
  color: #333;
}

.account-info__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.account-info__item {
  display: flex;
  flex-direction: column;
}

.account-info__label {
  font-weight: 600;
  color: #333;
  margin-bottom: 5px;
}

.account-info__value {
  color: #666;
  font-size: 16px;
}

.account-favorites {
  background-color: #f8f9fa;
  padding: 30px;
  border-radius: 8px;
}

.account-favorites__title {
  font-size: 24px;
  margin: 0 0 20px 0;
  color: #333;
}

.favorites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.loading, .error, .empty-favorites {
  text-align: center;
  padding: 40px;
  font-size: 18px;
}

.error {
  color: #ff0000;
}

.empty-favorites {
  color: #666;
}
</style>