<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterView } from 'vue-router'
import Header from '@/components/blocks/Header.vue'
import Footer from '@/components/blocks/Footer.vue'
import AuthModal from '@/components/modals/AuthModal.vue'
import { useUserStore } from '@/stores/user'
import { useFavoritesStore } from '@/stores/favorites'

const userStore = useUserStore()
const favoritesStore = useFavoritesStore()
const isAuthModalOpen = ref(false)

const openAuthModal = () => {
  isAuthModalOpen.value = true
}

const closeAuthModal = () => {
  isAuthModalOpen.value = false
}

const handleAuthSuccess = async () => {
  closeAuthModal()
  await userStore.fetchCurrentUser()
  // Загружаем избранные фильмы после авторизации
  await favoritesStore.fetchFavorites()
}

// При загрузке приложения проверяем авторизацию и загружаем избранное
onMounted(async () => {
  try {
    await userStore.fetchCurrentUser()
    if (userStore.isAuthenticated) {
      await favoritesStore.fetchFavorites()
    }
  } catch (error) {
    console.error('Ошибка при проверке авторизации:', error)
  }
})

// Делаем функцию доступной глобально
window.openAuthModal = openAuthModal
</script>

<template>
  <Header />
  <main class="main">
    <RouterView />
  </main>
  <Footer />
  <AuthModal
    :is-open="isAuthModalOpen"
    @close="closeAuthModal"
    @success="handleAuthSuccess"
  />
</template>


