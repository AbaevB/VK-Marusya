<script setup lang="ts">
import { RouterView } from 'vue-router'
import Header from '@/components/blocks/Header.vue'
</script>

<template>
  <Header />
  <main class="main">
    <RouterView />
  </main>
</template>

<style scoped>
.main {
  min-height: 100vh;
}
</style>
