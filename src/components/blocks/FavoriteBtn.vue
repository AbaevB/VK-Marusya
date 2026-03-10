<!-- src/components/blocks/FavoriteBtn.vue -->
<template>
  <button
    class="favorite-btn"
    :class="{ 'favorite-btn--checked': isFavorite }"
    @click="handleClick"
    aria-label="Добавить в избранное"
  >
    <!-- Пустое сердце -->
    <svg class="favorite-btn__icon" width="24" height="24">
      <use href="/img/icons/sprite.svg#heart-outline"></use>
    </svg>

    <!-- Заполненное сердце -->
    <svg class="favorite-btn__icon favorite-btn__icon--hidden" width="24" height="24">
      <use href="/img/icons/sprite.svg#heart-filled"></use>
    </svg>
  </button>
</template>

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
  if (!userStore.isInitialized) return

  if (!userStore.isAuthenticated) {
    emit('auth-required')
    return
  }

  try {
    await favoritesStore.toggleFavorite(props.filmId)
  } catch (error) {
    console.error('Ошибка при изменении избранного:', error)
  }
}

// Эмит события для родителя (например, открыть модалку входа)
const emit = defineEmits<{
  (e: 'auth-required'): void
}>()
</script>