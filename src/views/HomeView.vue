<script setup lang="ts">
import { onMounted } from 'vue'
import { useFilmsStore } from '@/stores/films'
import RandomFilm from '@/components/sections/RandomFilm.vue'
import Top10 from '@/components/sections/Top-10.vue'

const filmsStore = useFilmsStore()

onMounted(() => {
  document.title = 'Главная | VK-Маруся'
})
</script>

<template>
  <main>
    <RandomFilm />
    <Top10 />
  </main>
</template>
