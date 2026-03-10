<script setup lang="ts">
import { computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { useFavoritesStore } from '@/stores/favorites'

interface Props {
  filmId: number
}

const props = defineProps<Props>()

const userStore = useUserStore()
const favoritesStore = useFavoritesStore()

// Вычисляем, добавлен ли фильм в избранное
const isFavorite = computed(() => favoritesStore.isFavorite(props.filmId))

// Обработка клика
const handleClick = async () => {
  if (!userStore.isInitialized) {
    return
  }

  if (!userStore.isAuthenticated) {
    // Открываем модальное окно авторизации
    if (window.openAuthModal) {
      window.openAuthModal()
    }
    return
  }

  try {
    await favoritesStore.toggleFavorite(props.filmId)
  } catch (error) {
    console.error('Ошибка при изменении избранного:', error)
  }
}
</script>

<template>
  <button 
    class="btn btn-primary btn-primary--icon favorite-btn" 
    :class="{ 'favorite-btn--checked': isFavorite }"
    type="button"
    @click="handleClick"
    :aria-label="isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'"
  >
    <svg class="btn-primary__icon favorite-btn__icon" aria-hidden="true" width="16" height="16" viewBox="0 0 24 24">
      <use xlink:href="/images/sprite.svg#icon-heart"></use>
    </svg>
    <svg class="btn-primary__icon favorite-btn__icon favorite-btn__icon--active" aria-hidden="true" width="16" height="16" viewBox="0 0 24 24">
      <use xlink:href="/images/sprite.svg#icon-heart-solid"></use>
    </svg>
  </button>
</template>