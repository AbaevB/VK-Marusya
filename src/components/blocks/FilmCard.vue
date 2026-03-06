<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { Film } from '@/api/films'

interface Props {
  film: Film
}

const props = defineProps<Props>()
const router = useRouter()

const handleFilmClick = () => {
  router.push({ name: 'film', params: { id: props.film.id } })
}
</script>

<template>
  <a class="card film-card" :href="`/film/${film.id}`" @click.prevent="handleFilmClick">
    <h3 class="visually-hidden">
      {{ film.title }}
    </h3>
    <img class="film-card__image" :src="film.posterUrl" :alt="`Постер фильма ${film.title}`">
  </a>
</template>
