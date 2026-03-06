<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useFavoritesStore } from '@/stores/favorites'
import type { Film } from '@/api/films'

interface Props {
  film: Film
}

const props = defineProps<Props>()
const router = useRouter()
const userStore = useUserStore()
const favoritesStore = useFavoritesStore()

const isFavorite = computed(() => {
  return favoritesStore.isFavorite(props.film.id)
})

const handleFavoriteClick = async () => {
  if (!userStore.isAuthenticated) {
    // Если пользователь не авторизован, открываем модальное окно логина
    // TODO: Реализовать открытие модального окна
    console.log('Пользователь не авторизован, нужно открыть модальное окно логина')
    return
  }

  try {
    await favoritesStore.toggleFavorite(props.film.id)
  } catch (error) {
    console.error('Ошибка при работе с избранным:', error)
  }
}

const handleFilmClick = () => {
  router.push({ name: 'film', params: { id: props.film.id } })
}

const formatRating = (rating: number) => {
  return rating?.toFixed(1) || '—'
}
</script>

<template>
  <a href="film.html" class="card top-10__card">

    <h3 class="visually-hidden">
      {{ film.title }}
    </h3>

    <img :src="film.posterUrl" :alt="film.title" class="film-card__image" />
  </a>


  
</template>
